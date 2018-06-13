import axios from 'axios'
import Config from '@/common/config.js'


export default {
    name: 'Fetch',
    url: `${Config.baseUrl}/${Config.version}/`,

    getRegion() {
        return axios
            .get(this.url + `regions`, { headers: { accept: 'application/json' } })
            .then(response => response)
            .catch(error => { console.error('ERRRR', error); return Promise.reject(error) })
    }
}