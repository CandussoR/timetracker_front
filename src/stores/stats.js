import axios from "../utils/apiRequester";
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * @typedef {Object} HomeStats
 * @property {Number} count - number of timers
 * @property {List[String]} time - a list of (day), hour, min, sec
 * @property {List[String]} mean - a list of (day), hour, min, sec
 */

export const useStatStore = defineStore("stats", () => {
    const updated = ref(true)
    /** @type {HomeStats} */
    const daily = ref(null)
    const weekly = ref(null)
    const monthly = ref(null)
    const yearly = ref(null)
    const weekBarChart = ref(null)
    const taskRatio = ref(null)

    async function getHomeStats() {
        try {
            const res = await (await axios.get('/stats/resume')).data
            daily.value = res["daily"]
            weekly.value = res["weekly"]
            monthly.value = res["monthly"]
            yearly.value = res["yearly"]
            return 200
        }
        catch(e) {
            return 400, "Couldn't load the stats."
        }
    }
    

    async function getPastTaskTimeRatio(period, aDate=null) {
        try {
            const res = await axios.get('/stats/task_ratio', {
            params: {"period" : period, "date" : aDate}
            })
            return res
        } catch(e) {
            return e.response
        }
    }

    /**
     * Makes an API call to get the task time and ratio if updated is true,
     * else go fetch the values in the local Storage.
     *  
     * @param {String|List[String]} period -- a date string or array of date strings for range
     */
    async function getTaskTimeRatio(period) {
        if (!updated.value) {
            const stats = JSON.parse(sessionStorage.getItem('stats'))
            taskRatio.value = stats[period]
            return;
        }

        try {
            const res = await axios.get('/stats/task_ratio', {
                params: {"period" : period}
            })
            taskRatio.value = res.data


            // This is to be recalculated frequently so I don't want it in the localStorage,
            // opposite to what I have done for the past requests.
            let data = {}
            const stats = sessionStorage.getItem('stats')

            if (!stats) {
                data[period] = res.data
                sessionStorage.setItem('stats', JSON.stringify(data))
                return;
            }

            data = JSON.parse(stats)
            data[period] = res.data
            // Splitting the formatted time for display ?
            for (let i=0; i < data[period].length; i++) {
                data[period][i]["formatted"] = data[period][i]["formatted"].split(":")
            }
            sessionStorage.setItem('stats', JSON.stringify(data))

            // No need to fetch anything is there has been no update every period is stored
            const periods = ['day', 'week', 'month', 'year']
            const stat_keys = Object.keys(JSON.parse(sessionStorage.getItem('stats')))
            if (periods.every(v => stat_keys.includes(v))) {
                updated.value = false
            }

            return 200
        }
        catch(e) {
            return e.response
        }
    }

    /**
     * Sets updated to true and clears the storage to fetch updated data
     */
    function handleUpdated() {
        updated.value = true;
        sessionStorage.removeItem('stats')
    }

    /**
     * 
     * @param {String} period 
     * @param {String|List[String]} [dates] - one date for the period or an array for a week
     */
    async function getGenericStats(period, dates = null) {
        try {
            let res = await axios.get('stats/generic', { params : {"period" : period, "date" : dates} })
            return res.data
        } catch(e) {
            throw new Error(e)
        }
    }

    // /**
    //  * 
    //  * @param {Object} cleanedForm - a dynamic JSON object
    //  */

    /**
     * 
     * @param {{day? : string, 
     *          month?: string, 
     *          week? : Array,
     *          rangeBeginning? : string,
     *          rangeEnding? : string,
     *          task? : string,
     *          subtask? : string,
     *          tag? : string,
     *          logs? : boolean}} cleanedForm 
     * @returns 
     */
    async function getQueriedStats(cleanedForm) {
        try {
            const res = await axios.post('stats/generic/custom', {
                params: cleanedForm
            })
            return res
        } catch (e) {
            throw new Error(e);
        }
    }

    return { updated, 
        daily, 
        weekly, 
        monthly, 
        yearly, 
        weekBarChart, 
        taskRatio, 
        getHomeStats, 
        getPastTaskTimeRatio,
        getTaskTimeRatio, 
        handleUpdated, 
        getQueriedStats,
        getGenericStats
    }
})