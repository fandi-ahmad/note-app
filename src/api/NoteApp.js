import Api from './Main.js'

const baseURL = import.meta.env
const pathUrl = 'http://127.0.0.1:8000/api/note'

export default {
    get_list() {
        return Api(baseURL).get(pathUrl)
    },

    upsert(payload) {
        return Api(baseURL).post(pathUrl, payload)
    },

    update(id, payload) {
        return Api(baseURL).put(`${pathUrl}/${id}`, payload)
    }
}