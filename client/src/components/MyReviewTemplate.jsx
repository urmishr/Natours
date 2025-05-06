import { Rating } from 'react-simple-star-rating';
import { TbEdit } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useReview } from '../context/ ReviewProvider';
import Loader from './Loader';
export default function MyReviewTemplate({ myReview, i }) {
  const [editMode, setEditMode] = useState(false);
  const [ratingStar, setRatingStar] = useState(0);
  const [reviewText, setReviewText] = useState(myReview.review);
  const { updateMyReview, loadingUpdate, loadingDelete, deleteMyReview } =
    useReview();

  function validateFields(review, rating) {
    let value = true;

    if (review.length === 0 && rating === 0) {
      toast.error('Please provide review and ratings');
      return (value = false);
    }
    if (review.length < 7) {
      toast.error('Please write atleast two words for review! ');
      return (value = false);
    }

    if (rating < 1) {
      toast.error('Minimum 1 star is required!');
      return (value = false);
    }

    return value;
  }

  async function handleDeleteReview() {
    await deleteMyReview(myReview._id);
  }

  async function handleSaveReview() {
    if (!validateFields(reviewText, ratingStar)) return;
    const data = {
      rating: ratingStar,
      review: reviewText,
    };
    await updateMyReview(myReview._id, data);
  }

  function handleChangeRatings(rate) {
    setRatingStar(rate);
  }
  return (
    <div className='mx-auto my-4 flex flex-col rounded bg-white p-5 shadow-md md:w-2/3 lg:w-1/2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex size-6 justify-center rounded-full bg-stone-400/30'>
            <p className='font-semibold'>{i + 1}</p>
          </div>
          <div className='flex size-12 items-center overflow-hidden rounded'>
            <img
              src={`/img/tours/${myReview.tour.imageCover}`}
              alt={'image'}
              className='h-8 rounded object-cover'
            />
          </div>
          <div>
            <p className='font-bold text-stone-800'>{myReview.tour.name}</p>
          </div>
        </div>
        <div>
          {!editMode ? (
            <TbEdit
              className='text-natours size-6'
              onClick={() => setEditMode(true)}
            />
          ) : (
            <MdDeleteForever
              onClick={handleDeleteReview}
              className='size-6 text-red-500'
            />
          )}
        </div>
      </div>
      <div className='px-5 py-2 text-stone-500'>
        {!editMode ? (
          <p>{myReview.review}</p>
        ) : (
          <textarea
            className='focus:ring-natours w-full resize-none rounded p-1 text-stone-700 outline-none focus:ring-2'
            value={reviewText}
            draggable='false'
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
        )}
      </div>
      <div className='mx-auto my-3'>
        <Rating
          initialValue={!editMode && Math.floor(myReview.rating)}
          size={24}
          onClick={handleChangeRatings}
          readonly={!editMode}
          fillColor={'#55c57a'}
        />
      </div>
      {editMode && (
        <div className='my-2 flex justify-evenly'>
          <button
            onClick={handleSaveReview}
            className='btn-primary mx-3 w-1/2 cursor-pointer py-2 text-lg'
          >
            {loadingUpdate ? <Loader /> : 'Save'}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setReviewText(myReview.review);
            }}
            className='border-natours mx-3 w-1/2 cursor-pointer rounded-full border-2 text-lg font-semibold text-stone-800'
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
}
