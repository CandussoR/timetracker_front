import axios from './apiRequester.js'

async function getMinDate() {
    try {
        const res = await axios.get('/time_records/first_record_date')
        return new Date(res.data)
    } catch(e) {
        error(`Error while fetching first date : ${e}`);
    }
}

export default getMinDate;