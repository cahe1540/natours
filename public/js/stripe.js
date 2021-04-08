/*eslint-disable*/
import axios from 'axios'
import { showAlert } from './alert'

export const bookTour = async (tourId) => {
    const stripe = Stripe('pk_test_51Id7YoEYtcuQnJXjZ8BZPrpojutF9ajYLoYkBdeUzxtWDU6ZFSLhWiiWA90xPVaEQ4pDHuQNTDrzGvz46BgiQR96000PGslKR6');

    try {
        // 1. Get checkout session from the API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );
        // 2. Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
}