mod main_sidecar;
use std::sync::{Arc, Mutex};

#[cfg(feature = "launch_binary")]
use tauri::Manager;
use main_sidecar::*;
use tauri::RunEvent;
use tauri_plugin_shell::process::CommandChild;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default();

    #[cfg(feature = "launch_binary")]
    let app = app.plugin(tauri_plugin_shell::init());

    let app = app.plugin(
        tauri_plugin_log::Builder::new()
            .target(tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::LogDir {
                    file_name: Some("logs".to_string()),
                },
            ))
            .build(),
    );

    #[cfg(feature = "launch_binary")]
    let app = app.setup(move |_app| {
        use std::sync::Arc;
        use std::sync::Mutex;
        use tauri::Manager;
        use tauri_plugin_shell::process::CommandChild;

        let app = _app;
        // Store the initial sidecar process in the app state
        app.manage(Arc::new(Mutex::new(None::<CommandChild>)));
        // Clone the app handle for use elsewhere
        let app_handle = app.handle().clone();
        // Spawn the Python sidecar on startup
        println!("[tauri] Creating sidecar...");
        spawn_and_monitor_sidecar(app_handle).ok();
        println!("[tauri] Sidecar spawned and monitoring started.");

        Ok(())
    });
    #[cfg(feature = "launch_binary")]
    let app = {
        app.invoke_handler(tauri::generate_handler![
            start_sidecar,
            shutdown_sidecar,
            toggle_fullscreen
        ])
        .build(tauri::generate_context!())
        .expect("Error while running tauri application")
    };
    #[cfg(feature = "launch_binary")]
    let app = app.run(|app_handle, event| match event {
        // Ensure the Python sidecar is killed when the app is closed
        RunEvent::ExitRequested { .. } => {
            if let Some(child_process) = app_handle.try_state::<Arc<Mutex<Option<CommandChild>>>>()
            {
                if let Ok(mut child) = child_process.lock() {
                    if let Some(process) = child.as_mut() {
                        // Send msg via stdin to sidecar where it self terminates
                        let command = "sidecar shutdown\n";
                        let buf: &[u8] = command.as_bytes();
                        let _ = process.write(buf);

                        // *Important* `process.kill()` will only shutdown the parent sidecar (python process). Tauri doesnt know about the second process spawned by the "bootloader" script.
                        // This only applies if you compile a "one-file" exe using PyInstaller. Otherwise, just use the line below to kill the process normally.
                        // let _ = process.kill();

                        println!("[tauri] Sidecar closed.");
                    }
                }
            }
        }
        _ => {}
    });
    #[cfg(not(feature = "launch_binary"))]
    let app = app.run(tauri::generate_context!());
}