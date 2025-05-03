mod main_sidecar;
mod worker;
use main_sidecar::toggle_fullscreen;
use std::fmt;
use worker::{start_clock, stop_clock};

#[cfg(feature = "launch_binary")]
use main_sidecar::*;
use tauri::RunEvent;

#[derive(Default)]
struct AppState {
    timer_runs: bool,
}

impl AppState {
    fn new() -> Self {
        AppState { timer_runs: false }
    }
}
impl fmt::Display for AppState {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.timer_runs)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init());

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

        app.manage(Mutex::new(AppState::new()));

        // Clone the app handle for use elsewhere
        let app_handle = app.handle().clone();
        // Spawn the Python sidecar on startup

        let state = app.state::<Arc<Mutex<Option<CommandChild>>>>();
        // Check if a process is already running before starting a new one
        if state.lock().unwrap().is_none() {
            println!("[tauri] Creating sidecar...");
            if spawn_and_monitor_sidecar(app_handle).is_ok() {
                log::info!("[tauri] Sidecar spawned successfully.");
            } else {
                log::error!("[tauri] Failed to spawn sidecar.");
            }
        } else {
            log::info!("[tauri] Sidecar already running.");
        }
        Ok(())
    });
    #[cfg(feature = "launch_binary")]
    let app = {
        app.invoke_handler(tauri::generate_handler![
            start_sidecar,
            kill_sidecar,
            toggle_fullscreen,
            start_clock,
            stop_clock
        ])
        .build(tauri::generate_context!())
        .expect("Error while running tauri application")
    };
    #[cfg(feature = "launch_binary")]
    app.run(|app_handle, event| match event {
        RunEvent::ExitRequested { .. } => {
            log::info!("User wants to exit app: killing sidecar.");
            kill_sidecar(app_handle.clone()); 
        }
        _ => {}
    });

    #[cfg(not(feature = "launch_binary"))]
    let app = {
        use std::sync::Mutex;

        app.manage(Mutex::new(AppState::new()))
            .invoke_handler(tauri::generate_handler![
                toggle_fullscreen,
                start_clock,
                stop_clock,
            ])
            .build(tauri::generate_context!())
            .expect("Error while running tauri application")
    };

    #[cfg(not(feature = "launch_binary"))]
    app.run(|app_handle, event| match event {
        RunEvent::ExitRequested { .. } => {
            log::info!("Exiting app.");
        }
        _ => {}
    });
}
