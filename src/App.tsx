import { Routes, Route } from 'react-router-dom';
import './App.css'
import AdminRoutes from './components/protectedRoutes/AdminRoutes';
import Login from './pages/Login';
import api, { setupAxiosInterceptors } from './api';
import AdminDashBoard from './pages/dashboards/AdminDashboard';
import DispatcherDashBoard from './pages/dashboards/DispatcherDashboard';
import DriverDashBoard from './pages/dashboards/DriverDashboard';
import { useEffect } from 'react';
import { useAuth } from './context/authContext/authContext';
import { useUser } from './context/user/userContext';

function App() {

  setupAxiosInterceptors();

  const { cookies } = useAuth();
  const { user, setUser } = useUser();

  useEffect(() => {
    async function getUser() {
      try {
        let res = await api.get(`/user`, {
          headers: { 'x-auth-token': cookies.token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (cookies.token && !user)
      getUser();
  }, [cookies.token])



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
