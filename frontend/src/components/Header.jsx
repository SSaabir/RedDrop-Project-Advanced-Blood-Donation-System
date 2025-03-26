import React, { useState, useEffect } from 'react';
import { Button, Navbar, TextInput, Dropdown, Avatar, Modal, Label, Select, Textarea, Spinner } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useHospital } from '../hooks/hospital';
import {useHealthEvaluation} from '../hooks/useHealthEvaluation';
import{useBloodDonationAppointment} from '../hooks/useBloodDonationAppointment';

export default function Header() {
  const path = useLocation().pathname;
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { hospitals, loading:hLoading, error: hError, fetchHospitals } = useHospital();
  const {createEvaluation, loading:heLoading , error:heError} = useHealthEvaluation();
  const {createAppointment, loading, error} = useBloodDonationAppointment();

  



  // State for modals and form data
  const [openEvalModal, setOpenEvalModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const userId = user?.userObj?._id;
  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = user?.role === 'HospitalAdmin';
  
  const [evalFormData, setEvalFormData] = useState({
    hospitalId: "",
    evaluationDate: "",
    evaluationTime: "",
    donorId: userId || "",
  });

  const [appointmentFormData, setAppointmentFormData] = useState({
    hospitalId: "",
    appointmentDate: "",
    appointmentTime: "",
    donorId: userId || "",
   
  });

  useEffect(() => {
    fetchHospitals();
}, []);

  

  // Handle form field change for evaluation
  const handleEvalChange = (e) => {
   
    const { id, value } = e.target;

    setEvalFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  

  // Handle form field change for appointment
  const handleAppointmentChange = (e) => {
    const { id, value} = e.target;

    setAppointmentFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle Logout
  const handleClick = () => {
    logout();
  };

  // Handle form submission for evaluation
  const handleEvalSubmit = (e) => {
    e.preventDefault();
    
    const evaluationData = { 
      ...evalFormData, 
      donorId: userId || "" // Ensure donorId is included before submitting
    };

    console.log("Submitting Evaluation:", evaluationData);
  createEvaluation(evaluationData);
    // Close modal after submission
    setOpenEvalModal(false);
  };

  // Handle form submission for appointment
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();

    const appointmentData = { 
      ...appointmentFormData, 
      donorId: userId || "" // Ensure donorId is included before submitting
    };
    // Handle the appointment scheduling logic here
    console.log("Scheduling appointment", appointmentFormData);
    createAppointment(appointmentData);

    // Close modal after submission
    setOpenAppointmentModal(false);
  };

  return (
    <Navbar className='border-b-2'>
      {/* Brand Logo */}
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <div className='flex flex-wrap self-center content-center justify-center gap-1'>
          <img src={Logo} alt="logo" className='w-8 '/>
          <span className=''>Red Drop</span>
        </div>
      </Link>

      {/* Right Side: Search, Theme Toggle, and Cart */}
      <div className='flex gap-2 md:order-2'>
        {!user && (
          <Link to='/donor-login'>
            <Button className='bg-red-600 hover:bg-red-800 text-white font-bold'>Get Started</Button>
          </Link>
        )}
        {Donor && (
          <>
        <Button className='bg-red-600 hover:bg-red-800 text-white font-bold' onClick={() => setOpenEvalModal(true)}>
          Evaluation
        </Button>
        <Button className='bg-red-600 hover:bg-red-800 text-white font-bold' onClick={() => setOpenAppointmentModal(true)}>
          Appointment
        </Button>
        </>
        )}
        {user && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={user?.image ? `http://localhost:3000/${user.image}` : 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{user.name || 'User'}</span>
              <span className="block text-sm text-gray-500 truncate">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item>
              <Link to="/profile">Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Dropdown.Item>
            
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleClick}>Logout</Dropdown.Item>
          </Dropdown>
        )}
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/EBR'} as={'div'}>
          <Link to='/EBR'>Emergency Blood Request</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/contactus'} as={'div'}>
          <Link to='/contactus'>Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>

      {/* Evaluation Modal */}
      <Modal show={openEvalModal} onClose={() => setOpenEvalModal(false)}>
        <Modal.Header>Schedule Health Evaluation</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEvalSubmit}>
            <div>
              <Label htmlFor="hospitalId" value="Select Hospital" className="text-gray-700 font-medium" />
              <Select id="hospitalId" required value={evalFormData.hospitalId} onChange={handleEvalChange}>
                <option value="" disabled>Select a hospital</option>
                {hospitals && hospitals.map(hospital => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="evaluationDate" value="Evaluation Date" className="text-gray-700 font-medium" />
              <TextInput id="evaluationDate" type="date" required value={evalFormData.evaluationDate} onChange={handleEvalChange} />
            </div>
            <div>
              <Label htmlFor="evaluationTime" value="Evaluation Time" className="text-gray-700 font-medium" />
              <TextInput id="evaluationTime" type="time" required value={evalFormData.evaluationTime} onChange={handleEvalChange} />
            </div>
            <Modal.Footer>
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center" disabled={heLoading}>
                {heLoading ? <Spinner color="white" size="sm" /> : "Schedule Evaluation"}
              </Button>
              <Button color="gray" onClick={() => setOpenEvalModal(false)}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>


      {/* Appointment Modal */}
      <Modal show={openAppointmentModal} onClose={() => setOpenAppointmentModal(false)}>
        <Modal.Header>Schedule an Appointment</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAppointmentSubmit}>
          <div>
              <Label htmlFor="hospitalId" value="Select Hospital" className="text-gray-700 font-medium" />
              <Select id="hospitalId" required value={appointmentFormData.hospitalId} onChange={handleAppointmentChange}>
                <option value="" disabled>Select a hospital</option>
                {hospitals && hospitals.map(hospital => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="appointmentDate" value="AppointmentDate" className="text-gray-700 font-medium" />
              <TextInput id="appointmentDate" type="date" required value={appointmentFormData.appointmentDate} onChange={handleAppointmentChange} />
            </div>
            <div>
              <Label htmlFor="appointmentTime" value="AppointmentTime " className="text-gray-700 font-medium" />
              <TextInput id="appointmentTime" type="time" required value={appointmentFormData.appointmentTime} onChange={handleAppointmentChange} />
            </div>
           
            <Modal.Footer>
              <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center">
                {loading ? <Spinner color="white" size="sm" /> : "Schedule Appointment"}
              </Button>
              <Button color="gray" onClick={() => setOpenAppointmentModal(false)}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
