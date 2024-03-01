import axios from "../utils/apiRequester";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStatStore = defineStore("stats", () => {
    const updated = ref(true)
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

    async function getWeekStatsForYear(year = null) {
        try {
            const res = await axios.get('/stats/weeks', {
                params: {"years" : [year]}
            })
            weekBarChart.value = res.data
        }
        catch(e) {
            return 400, "An error occured while fetching the stats."
        }
    }

    /**
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
                // Splitting the formatted time for display ?
                for (let i=0; i < data[period].length; i++) {

                data[period][i]["formatted"] = data[period][i]["formatted"].split(":")
                console.log(data[period][i])
                }
                sessionStorage.setItem('stats', JSON.stringify(data))
                return;
            }

            data = JSON.parse(stats)
            data[period] = res.data
            // Splitting the formatted time for display ?
            for (let i=0; i < data[period].length; i++) {

                data[period][i]["formatted"] = data[period][i]["formatted"].split(":")
                console.log(data[period][i])
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
            return e
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
     */
    async function getGenericWeekStats () {
        try {
            const res = await axios.get('stats/generic/week')
             return res.data
        } catch(e) {
            throw new Error(e);
        }
    }
    
    async function getGenericMonthStats () {
        try {
            const res = await axios.get('stats/generic/month')
            return res.data
        } catch(e) {
            throw new Error(e);
        }
    }
    
    async function getGenericYearStats () {
        try {
            const res = await axios.get('stats/generic/year')
            return res.data
        } catch(e) {
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
        getWeekStatsForYear, 
        getTaskTimeRatio, 
        handleUpdated, 
        getGenericWeekStats, 
        getGenericMonthStats, 
        getGenericYearStats
    }
})