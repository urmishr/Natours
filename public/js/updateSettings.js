import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type = 'accountSetting') => {
    const url =
        type === 'password'
            ? 'http://localhost:8080/api/v1/users/update-password'
            : 'http://localhost:8080/api/v1/users/update-me';

    const alertMsg =
        type === 'password'
            ? 'User password changed successfully'
            : 'User settings changed successfully';

    try {
        const res = await axios({
            method: 'patch',
            url,
            data,
        });
        if (res.data.status === 'success') showAlert('success', alertMsg);

        window.setTimeout(() => {
            location.reload();
        }, 2000);
    } catch (error) {
        showAlert('error', error.response.data.message);

        console.error(error);
    }
};
