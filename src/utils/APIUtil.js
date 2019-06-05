import axios from 'axios'

export const get = (url, params, successHandler, errorHandler = () => { }, finallyHandler = () => { }) => {
    axios.get(url, { params })
        .then(response => successHandler(response))
        .catch(error => errorHandler(error))
        .finally(finallyHandler);
}

export const post = (url, data, successHandler, errorHandler = () => { }, finallyHandler = () => { }) => {
    axios.post(url, data)
        .then(response => successHandler(response))
        .catch(error => errorHandler(error))
        .finally(finallyHandler);
}

export const authGet = (url, params, successHandler, errorHandler = () => { }, finallyHandler = () => { }) => {
    axios.get(url, {
        params,
        headers: {
            "Authorization": createTokenHeader()
        }
    }).then(response => {
        refreshToken(response);
        successHandler(response);
    })
        .catch(error => errorHandler(error))
        .finally(finallyHandler);
}

export const authPost = (url, data, successHandler, errorHandler = () => { }, finallyHandler = () => { }) => {
    axios.post(url, data, {
        headers: {
            "Authorization": createTokenHeader()
        }
    }).then(response => {
        refreshToken(response);
        successHandler(response);
    })
        .catch(error => errorHandler(error))
        .finally(finallyHandler);
}


const getToken = () => {
    let token = localStorage.getItem("token");
    if (token == null || token == "") {
        throw "非法操作";
    }
    return token;
}

const createTokenHeader = () => {
    return "Bearer " + getToken();
}

const refreshToken = (response) => {
    if (response.headers["tokenRefreshed"] == "true") {
        localStorage.setItem("token", response.headers["token"])
        console.log("Token 已自动更新完成")
    }
}