import React from 'react'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles


import Header from './components/Header'
import Dashboard from './pages/dashboard'
import Footer from './components/Footer'
import DonorD from './pages/DonorD'
import AppointmentD from './pages/AppointmentD'
import HospitalD from './pages/HospitalD'
import HosAdEdit from './pages/HospitalAdminProfile'
import DonorLogin from './pages/DonorLogin';
import DonorSign from "./pages/DonorSign";
import AdminLogin from "./pages/AdminLogin";

import Hospital_login from'./pages/Hospital_login'
import EmergencyBloodRequest from'./pages/EBR'

import ContactUs from './pages/ContactUs'
import Terms from './pages/Terms'
import Home from './pages/Home'
import FAQ from './pages/FAQ'
import HospitalAdminLogin from'./pages/HospitalAdminLogin'
import HealthEvaluationD from './pages/HealthEvaluationD'
import Profile from './pages/Profile'

import InquiryD from './pages/InquiryD'
import FeedbackD from './pages/FeedbackD'
import EmergencyBD from './pages/EmergencyBRD'
import BloodInventoryD from './pages/BloodInventoryD'
import HospitalAdminsD from './pages/HospitalAdminsD'
import SystemManagerD from './pages/SystemManagerD'



export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/dashboard" element={<Dashboard />}/>
    <Route path="/donord" element={<DonorD />}/>
    <Route path="/hospitald" element={<HospitalD />}/>
    <Route path="/appointmentd" element={<AppointmentD />}/>
    <Route path="/adminProfile" element={<HosAdEdit />}/>
    <Route path="/donor-login" element={<DonorLogin />} />
    <Route path="/register" element={<DonorSign />} />
    <Route path="/admin-login" element={<AdminLogin />} />


    <Route path="/Hospital_login" element={<Hospital_login />} />
    <Route path="/EBR" element={<EmergencyBloodRequest />} />
      
    <Route path="/ContactUs" element={<ContactUs />} />
    <Route path="/Terms" element={<Terms />} />
    <Route path="/" element={<Home />} />
    <Route path="/FAQ" element={<FAQ />} />

    <Route path="/feedd" element={<FeedbackD/>}/>
    <Route path="/inqd" element={<InquiryD/>}/>
    <Route path="/emerbd" element={<EmergencyBD/>}/>
    <Route path="/bloodid" element={<BloodInventoryD/>}/>

    <Route path="/healthEvaluationD" element={<HealthEvaluationD />} />
    <Route path="/HospitalAdminLogin" element={<HospitalAdminLogin />} />
    <Route path="/Profile" element={<Profile/>}/>

    <Route path="/hosadd" element={<HospitalAdminsD/>}/>
    <Route path="/sysmand" element={<SystemManagerD/>}/>
    </Routes>
    <Footer/>
    <ToastContainer />
    </BrowserRouter>
  )
}


