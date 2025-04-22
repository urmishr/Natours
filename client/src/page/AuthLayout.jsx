import { Outlet } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';

export default function AuthLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}
