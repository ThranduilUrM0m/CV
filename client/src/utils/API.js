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
    confirmation: function(send) {
        return axios.post(`${burl}/user/confirmation`, send, { headers: headers });
    },
    update: function(send) {
        return axios.patch(`${burl}/user/update`, send, { headers: headers });
    },
    update_roles: function(send) {
        return axios.patch(`${burl}/user/update_roles`, send, { headers: headers });
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
    get_users: function() {
        return axios.post(
            `${burl}/user/get_users`,
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