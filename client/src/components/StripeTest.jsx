import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51RGC81EDUE7FyaOzVQA0GjPNpiAihbVqW82AGrsxvNfNlweKRobsfx9yme635KBhoFNyqkrYY8E34tcQ5gUrjd1C00AH5ZWBCT',
);

export default function StripeTest() {
  const handleClick = async () => {
    const stripe = await stripePromise;
    // Use a dummy session id or test redirect
    alert('Stripe loaded successfully');
  };

  return <button onClick={handleClick}>Test Stripe Load</button>;
}
