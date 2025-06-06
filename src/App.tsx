import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes';
import Login from './pages/Login';
import api, { setupAxiosInterceptors } from './api';
import DispatcherDashBoard from './pages/dashboards/DispatcherDashboard';
import DriverDashBoard from './pages/dashboards/DriverDashboard';
import { useEffect } from 'react';
import { useAuth } from './context/authContext/authContext';
import { useUser } from './context/userContext/userContext';
import NotFound from './pages/NotFound/NotFound';
import AdminDashBoardUsers from './pages/dashboards/AdminDashboardUsers';
import DispatcherDashBoardTrucks from './pages/dashboards/DispatcherDashboardTrucks';
import DispatcherDashBoardOrders from './pages/dashboards/DispatcherDashboardOrders';
import Modal from 'react-modal'

function App() {
  Modal.setAppElement('#root');

  setupAxiosInterceptors();

  const nav = useNavigate();
  const { cookies } = useAuth();
  const { user, setUser } = useUser();

  useEffect(() => {
    async function getUser() {
      try {
        let res = await api.get(`/users/user`, {
          headers: { 'token': cookies.token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (cookies.token && !user)
      getUser();
  }, [cookies.token])

  useEffect(() => {
    switch (user?.role) {
      case "admin":
        nav('/admindashboardusers')
        break;
      case "dispatcher":
        nav('/dispatcherdashboard')
        break;
      case "driver":
        nav('/admindashboard')
        break;
      default:
        //nav('/');
    }

  }, [user])

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<ProtectedRoutes role='admin' />}>
          <Route path='/admindashboardusers' element={<AdminDashBoardUsers />} />
        </Route>
        <Route element={<ProtectedRoutes role='dispatcher' />}>
          <Route path='/dispatcherdashboard' element={<DispatcherDashBoard />} />
          <Route path='/dispatcherdashboard/trucks' element={<DispatcherDashBoardTrucks />} />
          <Route path='/dispatcherdashboard/orders' element={<DispatcherDashBoardOrders />} />
        </Route>
        <Route element={<ProtectedRoutes role='driver' />}>
          <Route path='/driverdashboard' element={<DriverDashBoard />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes >
    </>
  )
}

export default App
