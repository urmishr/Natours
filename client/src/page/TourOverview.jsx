import { useParams } from 'react-router-dom';

export default function TourOverview() {
    const params = useParams();
    return <div>current tour overview: {params.id}</div>;
}
