import React from 'react'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
import DonorD from './pages/DonorD'
import AppointmentD from './pages/AppointmentD'
import HospitalD from './pages/HospitalD'

import DonorLogin from './pages/DonorLogin';
import DonorSign from "./pages/DonorSign";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";


import Hospital_signup from'./pages/Hospital_signup'
import Hospital_login from'./pages/Hospital_login'
import EmergencyBloodRequest from'./pages/EBR'
import DonorAppointment from'./pages/DonorAppointment'
import ContactUs from './ContactUs'
import Terms from './Terms'
import Home from './Home'
import FAQ from './FAQ'

import HospitalAdminSignup from'./pages/HospitalAdminSignup'
import HospitalAdminLogin from'./pages/HospitalAdminLogin'

import DonorProfile from './pages/DonorProfile'





export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/dashboard" element={<Dashboard />}/>
    <Route path="/donord" element={<DonorD />}/>
    <Route path="/hospitald" element={<HospitalD />}/>
    <Route path="/appointmentd" element={<AppointmentD />}/>

    <Route path="/donor-login" element={<DonorLogin />} />
    <Route path="/register" element={<DonorSign />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/admin-register" element={<AdminSignup />} />


    <Route path="/hospital_signup" element={<Hospital_signup />} />
    <Route path="/Hospital_login" element={<Hospital_login />} />
    <Route path="/EBR" element={<EmergencyBloodRequest />} />
    <Route path="/DonorAppointment" element={<DonorAppointment />} />
      
    <Route path="/ContactUs" element={<ContactUs />} />
    <Route path="/Terms" element={<Terms />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/FAQ" element={<FAQ />} />




    <Route path="/HospitalAdminSignup" element={<HospitalAdminSignup />} />
    <Route path="/HospitalAdminLogin" element={<HospitalAdminLogin />} />

    <Route path="/Profile" element={<DonorProfile/>}/>

    

    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}


