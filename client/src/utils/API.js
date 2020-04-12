import axios from "axios";
const headers = {
    "Content-Type": "application/json"
};
const burl = "";

export default {
    login: function(email, password) {
        return axios.post(
            `${burl}/user/login`,
            {
                email,
                password
            },
            {
                headers: headers
            }
        );
    },
    signup: function(send) {
        return axios.post(`${burl}/user/signup`, send, { headers: headers });
    },
    send_mail: function(send) {
        return axios.post(`${burl}/user/send_mail`, send, { headers: headers });
    },
    update: function(send) {
        return axios.patch(
            `${burl}/user/update`, 
            send,
            { headers: headers }
        );
    },
    get_user: function(email) {
        return axios.post(
            `${burl}/user/get_user`,
            {
                email
            },
            {
                headers: headers
            }
        );
    },
    isAuth: function() {
        return localStorage.getItem("token") !== null;
    },
    logout: function() {
        localStorage.clear();
    }
};