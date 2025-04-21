import axios from 'axios';
import { showAlert } from './alert.js';

export const logout = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: '/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            location.assign('/');
        }
    } catch (error) {
        console.error(error.response);
        showAlert('error', 'Error logging out! Try Again');
    }
};
