import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', 
    () => {
        const inventory = [
            {"n": "Classic Pomodoro", "f" : [{"t": 1500, "b": 300}, {"t": 1500, "b": 300}, {"t": 1500, "b": 300}, {"r":1, "t": 1500, "b": 1200}]},
            {"n": "Mini Pomodoro", "f" : [{"t": 900, "b": 300}, {"t": 900, "b": 300}, {"t": 900, "b": 300}, {"r":1, "t": 900, "b": 900}]},
            {"n": "Maxi Pomodoro", "f" : [{"t": 3000, "b": 600}, {"t": 3000, "b": 600}, {"t": 3000, "b": 600}, {"r":1, "t": 3000, "b": 3000}]},
            {"n": "Progressive", "f" : [{"t": 900, "b":150}, {"t": 1200, "b":225}, {"t": 1500, "b":300}, {"t": 1900, "b":375}]},
            {"n": "Unmotivated", "f" : [{"t": 300, "b":120}, {"t": 900, "b":225}, {"t": 1500, "b":300}, {"t": 1900, "b":375}]}
        ]
        
        return {inventory }
    }
)
    