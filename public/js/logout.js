import axios from 'axios';
import { showAlert } from './alert.js';

export const logout = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: 'http://localhost:8080/api/v1/users/logout',
        });
        console.log(res);
        if (res.data.status === 'success') {
            location.assign('/');
        }
    } catch (error) {
        console.error(error.response);
        showAlert('error', 'Error logging out! Try Again');
    }
};
