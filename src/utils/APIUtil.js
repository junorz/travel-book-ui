import axios from 'axios'

export const get = (url, params, success, error = () => { }) => {
    axios.get(url, { params })
        .then(response => success(response))
        .catch(err => error(err));
}

export const post = (url, data, success, error = () => { }) => {
    axios.post(url, data)
        .then(response => success(response))
        .catch(err => error(err));
}
