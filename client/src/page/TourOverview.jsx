import BookTour from '../components/BookTour';
import TourImages from '../components/TourImages';
import TourImageSection from '../components/TourImageSection';
import TourInformation from '../components/TourInformation';
import TourMap from '../components/TourMap';
import TourReviews from '../components/TourReviews';

export default function TourOverview() {
  return (
    <>
      <TourImageSection />
      <TourInformation />
      <TourImages />
      <TourMap />
      <TourReviews />
      <BookTour />
    </>
  );
}
