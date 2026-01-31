import React, { useState, useEffect } from 'react'
import Navbar from './component/Navbar'
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBooking from './pages/MyBooking';
import Home from './pages/Home';
import Footer from './component/Footer';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from './pages/Login';



const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isOwnerPath = location.pathname.startsWith('/owner')

  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLogin(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  return (
    <>
{
  showLogin && <Login setShowLogin={setShowLogin}/>
}

    
      {!isOwnerPath && <Navbar  setShowLogin={setShowLogin}/>}
       

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/car-details/:id' element={<CarDetails setShowLogin={setShowLogin} />} />
        <Route path='/cars' element={<Cars/>} />
        <Route path='/my-bookings' element={<MyBooking setShowLogin={setShowLogin} />} />
       

       <Route path="/owner" element={<Layout setShowLogin={setShowLogin} />}>
  <Route index element={<Dashboard />} />
  <Route path="add-car" element={<AddCar />} />
  <Route path="manage-cars" element={<ManageCars />} />
  <Route path="manage-bookings" element={<ManageBookings />} />
</Route>

      </Routes>
     
      {!isOwnerPath && <Footer/>}
    </>
  )
}

export default App
