import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', 
    () => {
        const inventory = [
            {"n": "Classic Pomodoro", "f" : [{"t": 1500, "b": 300}, {"t": 1500, "b": 300}, {"t": 1500, "b": 300}, {"r":1, "t": 1500, "b": 1200}]},
            {"n": "Mini Pomodoro", "f" : [{"t": 900, "b": 300}, {"t": 900, "b": 300}, {"t": 900, "b": 300}, {"r":1, "t": 900, "b": 900}]},
            {"n": "Maxi Pomodoro", "f" : [{"t": 3000, "b": 600}, {"t": 3000, "b": 600}, {"t": 3000, "b": 600}, {"r":1, "t": 3000, "b": 1800}]},
            {"n": "Progressive", "f" : [{"t": 900, "b":150}, {"t": 1200, "b":225}, {"t": 1500, "b":300}, {"t": 1800, "b":375}]},
            {"n": "Unmotivated", "f" : [{"t": 300, "b":120}, {"t": 900, "b":225}, {"t": 1500, "b":300}, {"t": 1800, "b":375}]}
        ]
        const inventoryDescriptions = [
            {"n": "Classic Pomodoro", "d": "3 x 25min timers with 5 minutes breaks"},
            {"n": "Mini Pomodoro", "d": "4x 15 min timers with 5 minutes breaks"},
            {"n": "Maxi Pomodoro", "d": "4x 50 min timers with 10 minutes breaks"},
            {"n": "Progressive", "d": "15, 20, 25, 30 min timers with breaks between 2 minutes 30 and 6 minutess"},
            {"n": "Unmotivated", "d": "5, 15, 25, 30 min timers with breaks between 2 minutes 30 and 6 minutes"}
        ]
        return { inventory, inventoryDescriptions }
    }
)
    