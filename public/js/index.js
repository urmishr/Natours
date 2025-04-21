/* eslint-disable */
import 'polyfill';
import { login } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './leaflet';
import { bookTour } from './stripe';
import { logout } from './logout';

const leaflet = document.getElementById('map');
const formLogin = document.querySelector('#login_form');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.querySelector('#book-tour');
const updateMeForm = document.querySelector('#form_update_me');
const updatePasswordForm = document.querySelector('.form-user-settings');
if (leaflet) {
    const locations = JSON.parse(leaflet.dataset.locations);
    const startLocation = JSON.parse(leaflet.dataset.startLocation);
    displayMap(locations, startLocation);
}
document.addEventListener('DOMContentLoaded', () => {
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email_login').value;
            const password = document.getElementById('password_login').value;
            login(email, password);
        });
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (updateMeForm) {
        updateMeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = new FormData();
            form.append('name', document.getElementById('name_account').value);
            form.append(
                'email',
                document.getElementById('email_account').value,
            );
            form.append('photo', document.getElementById('photo').files[0]);
            updateSettings(form);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            document.querySelector('.btn-save-password').innerHTML =
                'Updating...';
            const currentPassword =
                document.getElementById('password-current').value;
            const newPassword = document.getElementById('password-new').value;
            const confirmPassword =
                document.getElementById('password-confirm').value;

            const data = { currentPassword, newPassword, confirmPassword };
            await updateSettings(data, 'password');

            document.querySelector('.btn-save-password').innerHTML =
                'Save Password';
            document.getElementById('password-current').value = '';
            document.getElementById('password-new').value = '';

            document.getElementById('password-confirm').value = '';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (bookBtn) {
        bookBtn.addEventListener('click', (e) => {
            e.target.innerHTML = 'Processing...';
            const { tourId } = e.target.dataset;
            bookTour(tourId);
        });
    }
});
