import { useTour } from '../context/TourProvider';
import { useAuth } from '../context/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from './Loader';

const stripePromise = loadStripe(
  'pk_test_51RGC81EDUE7FyaOzVQA0GjPNpiAihbVqW82AGrsxvNfNlweKRobsfx9yme635KBhoFNyqkrYY8E34tcQ5gUrjd1C00AH5ZWBCT',
); // Replace with your Stripe publishable key

export default function BookTour() {
  const { currentTour } = useTour();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBookTour = async () => {
    if (!isAuthenticated) {
      return toast.error('You need to log in to book this tour!');
    }

    try {
      setLoading(true);

      // Fetch the checkout session from the backend
      const stripe = await stripePromise;
      const session = await axios.get(
        `/api/v1/bookings/checkout-session/${currentTour._id}`,
        { headers: { 'X-Forwarded-Host': window.location.origin } },
      );

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
      toast.success('Purchase Completed');
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='px-5 py-7 md:px-10 lg:px-20'>
      <div className='relative flex flex-col justify-center overflow-hidden rounded-3xl bg-stone-300/20 py-10 shadow-lg'>
        <div className='flex flex-col items-center justify-evenly space-y-5 md:flex-row'>
          <div className='flex flex-col items-center justify-baseline space-y-5 px-5 md:px-10'>
            <h1 className='natours-gradient-text font-italic text-center text-2xl font-bold md:text-2xl lg:text-4xl'>
              What are you waiting for?
            </h1>
            <p className='text-center text-stone-800/50 italic'>
              <span className='font-semibold text-stone-600'>
                {currentTour.duration} days. 1 adventure
              </span>
              .
              <br />
              Infinite memories. Make it yours today! <br />
              {!isAuthenticated && (
                <span className='text-red-400'>Login to book this tour</span>
              )}
            </p>
          </div>
          <button
            className='btn-primary min-w-[200px] px-4 py-2 lg:py-4'
            onClick={handleBookTour}
            disabled={loading}
          >
            {loading ? <Loader /> : 'Book Yours Now!'}
          </button>
        </div>
      </div>
    </section>
  );
}
