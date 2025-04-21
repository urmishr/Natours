import axios from 'axios';
import { showAlert } from './alert';
/* eslint-disabel */
const stripe = Stripe(
    'pk_test_51RGC81EDUE7FyaOzVQA0GjPNpiAihbVqW82AGrsxvNfNlweKRobsfx9yme635KBhoFNyqkrYY8E34tcQ5gUrjd1C00AH5ZWBCT',
);

export const bookTour = async (tourId) => {
    try {
        const session = await axios(
            `http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`,
        );
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
        console.log(session);
    } catch (e) {
        console.error(e);
        showAlert('error', e);
    }
};
