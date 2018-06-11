import axios from 'axios'
import Config from '@/common/config.js'


export default {
    name: 'Fetch',
    url: `${Config.baseUrl}/${Config.version}/`,

    setGenresList(category) {
        return axios
            .get(url + `dictionaries/contractors`)
            .then(data => data.data.genres)
            .catch(error => { console.error(error); return Promise.reject(error) })
    }
}