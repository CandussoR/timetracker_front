// Modifies axios baseURL for all the app.

import axios from "axios";

axios.defaults.baseURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_IP_DEV
    : import.meta.env.VITE_APP_IP_PROD

export default axios
