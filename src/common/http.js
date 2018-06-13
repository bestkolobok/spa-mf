import axios from 'axios'
import Config from '@/common/config.js'

export const HTTP = axios.create({
    baseURL: `${Config.baseUrl}/${Config.version}/`,
    headers: {
        Accept: 'application/json'
    }
})
