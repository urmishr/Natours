import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div>
            <h1>Navbar will be here</h1>
            <Outlet />
        </div>
    );
}
