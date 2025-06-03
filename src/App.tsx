import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import AdminRoutes from './components/protectedRoutes/AdminRoutes';
import Login from './pages/Login';
import api, { setupAxiosInterceptors } from './api';
import AdminDashBoard from './pages/dashboards/AdminDashboard';
import DispatcherDashBoard from './pages/dashboards/DispatcherDashboard';
import DriverDashBoard from './pages/dashboards/DriverDashboard';
import { use, useEffect } from 'react';
import { useAuth } from './context/authContext/authContext';
import { useUser } from './context/user/userContext';

function App() {

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
        nav('/admindashboard')
        break;
      case "dispatcher":
        nav('/dispatcherdashboard')
        break;
      case "driver":
        nav('/admindashboard')
        break;
      default:
        nav('/');
    }

  }, [user])



  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<AdminRoutes />}>
          <Route path='/admindashboard' element={<AdminDashBoard />} />
          <Route path='/dispatcherdashboard' element={<DispatcherDashBoard />} />
          <Route path='/admindashboard' element={<DriverDashBoard />} />
        </Route>

      </Routes>

    </>
  )
}

export default App
