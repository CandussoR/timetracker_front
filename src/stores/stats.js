import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStatStore = defineStore("stats", () => {
    const updated = ref(true)
    const daily = ref(null)
    const weekly = ref(null)
    const monthly = ref(null)
    const yearly = ref(null)

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

    return {updated, daily, weekly, monthly, yearly, getHomeStats}
})