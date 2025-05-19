// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};
use tauri::{Emitter, Manager};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub fn toggle_fullscreen(window: tauri::Window) {
    if let Ok(is_fullscreen) = window.is_fullscreen() {
        window.set_fullscreen(!is_fullscreen).unwrap();
    }
}

// Helper function to spawn the sidecar and monitor its stdout/stderr
pub fn spawn_and_monitor_sidecar(app_handle: tauri::AppHandle) -> Result<(), String> {
    log::info!("Entering spawn_and_monitor_sidecar");
    // Check if a sidecar process already exists
    if let Some(state) = app_handle.try_state::<Arc<Mutex<Option<CommandChild>>>>() {
        let child_process = state.lock().unwrap();
        if child_process.is_some() {
            // A sidecar is already running, do not spawn a new one
            log::info!("[tauri] Sidecar is already running. Skipping spawn.");
            return Ok(()); // Exit early since sidecar is already running
        }
    }

    log::info!("No sidecar running yet, spawning one.");
    // Spawn sidecar
    let sidecar_command = app_handle
        .shell()
        .sidecar(if tauri::is_dev() {"timetracker-backend-dev"} else { "timetracker-backend" })
        .map_err(|e| e.to_string())?;
    let (mut rx, child) = sidecar_command.spawn().map_err(|e| e.to_string())?;
    // Store the child process in the app state
    if let Some(state) = app_handle.try_state::<Arc<Mutex<Option<CommandChild>>>>() {
        *state.lock().unwrap() = Some(child);
    } else {
        return Err("Failed to access app state".to_string());
    }

    // Spawn an async task to handle sidecar communication
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    println!("Sidecar stdout: {}", line);
                    // Emit the line to the frontend
                    app_handle
                        .emit("sidecar-stdout", line.to_string())
                        .expect("Failed to emit sidecar stdout event");
                }
                CommandEvent::Stderr(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    eprintln!("Sidecar stderr: {}", line);
                    // Emit the error line to the frontend
                    app_handle
                        .emit("sidecar-stderr", line.to_string())
                        .expect("Failed to emit sidecar stderr event");
                }
                _ => {}
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub fn kill_sidecar(app_handle: tauri::AppHandle) {
    use std::process::Command;
    use std::sync::Mutex;
    log::info!("[tauri] Attempting to kill sidecar...");

    if let Some(state) = app_handle.try_state::<Arc<Mutex<Option<CommandChild>>>>() {
        let mut child_process = state.lock().unwrap();

        if child_process.is_some() {
            log::info!("[tauri] Killing sidecar...");
            let _ = child_process.take().unwrap().kill(); // Take ownership before killing
            log::info!("[tauri] Sidecar killed successfully.");
        } else {
            log::warn!("[tauri] No running sidecar to kill.");
        }
    } else {
        log::error!("[tauri] Could not access sidecar state.");
    }

    // Ensure all instances of backend.exe are killed
    #[cfg(target_os = "windows")]
    {
        // creation_flags : https://doc.rust-lang.org/std/os/windows/process/trait.CommandExt.html#tymethod.creation_flags
        // CREATE_NO_WINDOW : https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags
        const CREATE_NO_WINDOW : u32 = 0x08000000;
        let _ = Command::new("taskkill")
            .args(&["/F", "/IM", if tauri::is_dev() { "timetracker-backend-dev.exe" } else { "timetracker-backend.exe" }, "/T"])
            .creation_flags(CREATE_NO_WINDOW)
            .output();
        log::info!("[tauri] Forced all timetracker-backend.exe processes to close.");
    }

    #[cfg(target_os = "linux")]
    {
        let _ = Command::new("pkill")
            .arg("-f")
            .arg(if tauri::is_dev() {"timetracker-backend-dev"} else {"timetracker-backend"})
            .output();
        log::info!("[tauri] Forced all timetracker-backend processes to close.");
    }

    #[cfg(target_os = "macos")]
    {
        let _ = Command::new("pkill")
            .arg("-f")
            .arg(if tauri::is_dev() {"timetracker-backend-dev"} else {"timetracker-backend"})
            .output();
        log::info!("[tauri] Forced all timetracker-backend processes to close.");
    }
}

// Define a command to start sidecar process.
#[tauri::command]
pub fn start_sidecar(app_handle: tauri::AppHandle) -> Result<String, String> {
    log::info!("[tauri] Received command to start sidecar.");
    spawn_and_monitor_sidecar(app_handle)?;
    Ok("Sidecar spawned and monitoring started.".to_string())
}
