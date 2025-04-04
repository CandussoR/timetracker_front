use crate::AppState;
use chrono::{prelude::*, Duration};
use core::time;
use std::{sync::Mutex, thread};
use tauri::{Emitter, Manager, State};

#[tauri::command]
pub fn start_clock(
    t: String,
    duration: u32,
    beginning: String,
    state: State<'_, Mutex<AppState>>,
    app_handle: tauri::AppHandle,
) {
    let beginning: DateTime<Utc> = beginning.parse().expect("Invalid DateTime format");

    {
        let mut s = state.lock().unwrap();
        s.timer_runs = true;
    }

    // Using state in thread with app_handle following tauri v2 doc
    // https://v2.tauri.app/develop/state-management/#access-state-with-the-manager-trait
    thread::spawn(move || {
        let ending: DateTime<Utc> = beginning
            .checked_add_signed(Duration::seconds(duration as i64))
            .expect("Something occured");

        if t == "timer" {
            loop {
                let now = chrono::offset::Utc::now();

                {
                    let app_handle_state = app_handle.state::<Mutex<AppState>>();
                    let s: std::sync::MutexGuard<'_, AppState> = app_handle_state.lock().unwrap();
                    if (now <= ending) && s.timer_runs {
                        let diff: chrono::TimeDelta = ending - now;
                        app_handle
                            .emit("duration", diff.num_seconds())
                            .expect("Couldn't send the duration.");
                    } else {
                        break;
                    }
                }
                thread::sleep(time::Duration::from_secs(1));
            }
        } else {
            loop {
                {
                    let app_handle_state = app_handle.state::<Mutex<AppState>>();
                    let s: std::sync::MutexGuard<'_, AppState> = app_handle_state.lock().unwrap();
                    if !s.timer_runs {
                        break;
                    }
                    let diff: chrono::TimeDelta = chrono::offset::Utc::now() - beginning;
                    app_handle
                        .emit("duration", diff.num_seconds())
                        .expect("Couldn't send the duration.");
                }
                thread::sleep(time::Duration::from_secs(1));
            }
        }
    });
}

#[tauri::command]
pub fn stop_clock(state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    state.timer_runs = false;
}
