import { Routes, Route } from 'react-router-dom';
import './App.css'
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './pages/Login';
import { setupAxiosInterceptors } from './api';

function App() {

  setupAxiosInterceptors();

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<ProtectedRoutes />}>

        </Route>

      </Routes>

    </>
  )
}

export default App
