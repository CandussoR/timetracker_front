import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/apiRequester"

export const useTimeRecordStore = defineStore('timeRecord', () => {
    const timeRecords = ref([])

    /**
     * 
     * @param {*} timeRecord 
     * @param {string} type - can be "old" or "begin" 
     * @returns {timeRecord} - returns the timeRecord.
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
            let cache = []
            const res = await axios.get('/time_records', {"params" : params})
            timeRecords.value = res.data
            
            // Trying a little persistence of data
            const data = {"id" : crypto.randomUUID(), "params" : params, "data": res.data}
            const request = localStorage.getItem('requests')
            if (request) {
                cache = JSON.parse(request)
            }
            cache.push(data)
            localStorage.setItem('requests', JSON.stringify(cache))

            return res.status, data
        } catch(e) {
            throw new Error("An error occured." + e)
        }
    }

    return { timeRecords, createTimeRecord, updateTimeRecord, getTimeRecords }
})