import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/apiRequester"

export const useTimeRecordStore = defineStore('timeRecord', () => {
    const timeRecords = ref([])

    /**
     * 
     * @param {*} timeRecord 
     * @param {string} type - can be "old" or "begin" 
     * @returns {timeRecord} 
     */
    async function createTimeRecord(timeRecord, type) {
        try {
            const tr = {"type" : type, "data" : timeRecord}
            const res = await axios.post('/time_records', tr)
            return res.data
        } catch(e) {
            throw new Error("An error occured.")
        }
    }

    /**
     * 
     * @param {*} timeRecord 
     * @param {string} type - can be "edit" or "ending"
     * @returns 
     */
    async function updateTimeRecord(timeRecord, type) {
        try {
            const tr = {"type" : type, "data" : timeRecord}
            const res = await axios.put('/time_records', tr)
            return res.data
        } catch(e) {
            throw new Error("An error occured")
        }
    }

/**
 * 
 * @param {Object} params - a dict of params
 * @returns {timeRecord[]} - an array of timeRecord
 */
    async function getTimeRecords(params) {
        try {
            const res = await axios.get('/time_records', {"params" : params})
            return res.data
        } catch(e) {
            return "An error occured."
        }
    }

    return { timeRecords, createTimeRecord, updateTimeRecord, getTimeRecords }
})