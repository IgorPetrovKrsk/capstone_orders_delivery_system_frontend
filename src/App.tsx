import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './pages/Login';

function App() {

  return (
    <>
      <Login />
      <Routes>

        <Route element={<ProtectedRoutes />}>

        </Route>

      </Routes>

    </>
  )
}

export default App
