import userOne from './../assets/users/user-3.jpg';
import UserReview from './UserReview';
export default function TourReviews() {
  return (
    <section className='overflow-hidden'>
      <div className='natours-gradient flex gap-10 overflow-auto px-10 py-20'>
        <UserReview
          userName={'jenna Fischer'}
          photo={userOne}
          review={
            'Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eroscondimentum scelerisque taciti mattis praesent feugiat eu nascetur atincidunts'
          }
        />
        <UserReview
          userName={'jenna Fischer'}
          photo={userOne}
          review={
            'Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eroscondimentum scelerisque taciti mattis praesent feugiat eu nascetur atincidunts '
          }
        />
        <UserReview
          userName={'jenna Fischer'}
          photo={userOne}
          review={
            'Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eroscondimentum scelerisque taciti mattis praesent feugiat eu nascetur atincidunts'
          }
        />
      </div>
    </section>
  );
}
