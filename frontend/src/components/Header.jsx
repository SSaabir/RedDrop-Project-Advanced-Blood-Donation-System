import React, { useState, useEffect } from 'react';
import { Button, Navbar, TextInput, Dropdown, Avatar, Modal, Label, Select, Spinner } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../assets/logo.svg';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useHospital } from '../hooks/hospital';
import { useHealthEvaluation } from '../hooks/useHealthEvaluation';
import { useBloodDonationAppointment } from '../hooks/useBloodDonationAppointment';
import { useSecondAuth } from '../hooks/useSecondAuth';
import {useDonor} from '../hooks/donor';

export default function Header() {
  const path = useLocation().pathname;
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { secondUser } = useSecondAuth();
  const { hospitals, loading: hLoading, fetchHospitals } = useHospital();
  const { createEvaluation, loading: heLoading, findLastUpdatedEvaluationByDonor } = useHealthEvaluation();
  const { createAppointment, loading } = useBloodDonationAppointment();
  const {donors, fetchDonorById} = useDonor();
  
  // State for modals and form data
  const [openEvalModal, setOpenEvalModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const userId = user?.userObj?._id;
  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const HospitalAdmin = secondUser?.role === 'HospitalAdmin';
  const Manager = user?.role === 'Manager';

  
 
  const [evalFormData, setEvalFormData] = useState({
    hospitalId: "",
    evaluationDate: "",
    evaluationTime: "",
    donorId: userId || "",
  });

  const [lastEvaluation, setLastEvaluation] = useState(null);

  const selectedHospital = hospitals?.find(h => h._id === evalFormData.hospitalId) || {};

  const [appointmentFormData, setAppointmentFormData] = useState({
    hospitalId: "",
    appointmentDate: "",
    appointmentTime: "",
    donorId: userId || "",
  });

  const [evalErrors, setEvalErrors] = useState({});
  const [appointmentErrors, setAppointmentErrors] = useState({});

  useEffect(() => {
    fetchHospitals(); 
    fetchDonorById(userId);
    const fetchLastEvaluation = async () => {
      if (userId && Donor) {
        try {
          const res = await findLastUpdatedEvaluationByDonor(userId);
          setLastEvaluation(res);
        } catch (error) {
          console.error("Error fetching last evaluation", error);
        }
      }
    };

    fetchLastEvaluation();
  }, [fetchHospitals, hLoading, fetchDonorById, userId]);

  
  const loggedInDonor = donors?.find(d => d._id === userId) || {};

  // Today's date for validation
  const today = new Date().toISOString().split('T')[0];

  // Validate Evaluation Form
  const validateEvalForm = () => {
    const errors = {};
    if (!evalFormData.hospitalId) errors.hospitalId = 'Hospital is required';
    if (!evalFormData.evaluationDate) errors.evaluationDate = 'Date is required';
    else if (evalFormData.evaluationDate < today) errors.evaluationDate = 'Date must be today or in the future';
    if (!evalFormData.evaluationTime) errors.evaluationTime = 'Time is required';
    setEvalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Appointment Form
  const validateAppointmentForm = () => {
    const errors = {};
    if (!appointmentFormData.hospitalId) errors.hospitalId = 'Hospital is required';
    if (!appointmentFormData.appointmentDate) errors.appointmentDate = 'Date is required';
    else if (appointmentFormData.appointmentDate < today) errors.appointmentDate = 'Date must be today or in the future';
    if (!appointmentFormData.appointmentTime) errors.appointmentTime = 'Time is required';
    setAppointmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field change for evaluation
  const handleEvalChange = (e) => {
    const { id, value } = e.target;
    setEvalFormData((prev) => ({ ...prev, [id]: value }));
    setEvalErrors((prev) => ({ ...prev, [id]: '' }));
  };

  // Handle form field change for appointment
  const handleAppointmentChange = (e) => {
    const { id, value } = e.target;
    setAppointmentFormData((prev) => ({ ...prev, [id]: value }));
    setAppointmentErrors((prev) => ({ ...prev, [id]: '' }));
  };

  // Handle Logout
  const handleClick = () => {
    logout();
  };

  // Handle form submission for evaluation
  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    if (!validateEvalForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const evaluationData = { ...evalFormData, donorId: userId || "" };
    try {
      await createEvaluation(evaluationData);
      setOpenEvalModal(false);
    } catch (err) {
      toast.error('Error scheduling evaluation'); // No heError, so generic message
    }
  };

  // Handle form submission for appointment
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!validateAppointmentForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const appointmentData = { ...appointmentFormData, donorId: userId || "" };
    try {
      await createAppointment(appointmentData);
      setOpenAppointmentModal(false);
    } catch (err) {
      toast.error('Error scheduling appointment'); // No error, so generic message
    }
  };

  return (
    <Navbar className='border-b-2'>
      {/* Brand Logo */}
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <div className='flex flex-wrap self-center content-center justify-center gap-1'>
          <img src={Logo} alt="logo" className='w-8' />
          <span>Red Drop</span>
        </div>
      </Link>

      {/* Right Side: Buttons and User Dropdown */}
      <div className='flex gap-2 md:order-2'>
        {!user && (
          <Link to='/donor-login'>
            <Button className='bg-red-600 hover:bg-red-800 text-white font-bold'>Get Started</Button>
          </Link>
        )}
        {Donor && (
          <>
{!loggedInDonor.healthStatus && !loggedInDonor.appointmentStatus && (
  <Button
    className="bg-red-600 hover:bg-red-800 text-white font-bold"
    onClick={() => setOpenEvalModal(true)}
  >
    Evaluation
  </Button>
)}

{
  loggedInDonor?.healthStatus &&
  !loggedInDonor?.appointmentStatus &&
  lastEvaluation?.passStatus === 'Passed' && (
    <Button
      className='bg-red-600 hover:bg-red-800 text-white font-bold'
      onClick={() => setOpenAppointmentModal(true)}
    >
      Appointment
    </Button>
  )
}

          </>
        )}
        {Donor && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={user?.userObj?.image ? `http://localhost:3020/${user.userObj.image}` : 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{user.userObj.lastName + " " + user.userObj.firstName || 'User'}</span>
              <span className="block text-sm text-gray-500 truncate">{user.userObj.email}</span>
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
        {Hospital && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={user?.userObj?.image ? `http://localhost:3020/${user.userObj.image}` : 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{user.userObj.name || 'User'}</span>
              <span className="block text-sm text-gray-500 truncate">{user.userObj.email}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleClick}>Logout</Dropdown.Item>
          </Dropdown>
        )}
        {HospitalAdmin && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={secondUser?.userObj?.image ? `http://localhost:3020/${secondUser.userObj.image}` : 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{secondUser.userObj.firstName + " " + secondUser.userObj.lastName || 'User'}</span>
              <span className="block text-sm text-gray-500 truncate">{secondUser.userObj.email}</span>
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
        {Manager && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={user?.userObj?.image ? `http://localhost:3020/${user.userObj.image}` : 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{user.userObj.lastName + " " + user.userObj.firstName || 'User'}</span>
              <span className="block text-sm text-gray-500 truncate">{user.userObj.email}</span>
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
            <div className="mb-4">
              <Label htmlFor="hospitalId" value="Select Hospital" className="text-gray-700 font-medium" />
              <Select
                id="hospitalId"
                required
                value={evalFormData.hospitalId}
                onChange={handleEvalChange}
                color={evalErrors.hospitalId ? 'failure' : 'gray'}
              >
                <option value="" disabled>Select a hospital</option>
                {hospitals && hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </Select>
              {evalErrors.hospitalId && <p className="text-red-600 text-sm mt-1">{evalErrors.hospitalId}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="evaluationDate" value="Evaluation Date" className="text-gray-700 font-medium" />
              <TextInput
                id="evaluationDate"
                type="date"
                required
                value={evalFormData.evaluationDate}
                onChange={handleEvalChange}
                color={evalErrors.evaluationDate ? 'failure' : 'gray'}
              />
              {evalErrors.evaluationDate && <p className="text-red-600 text-sm mt-1">{evalErrors.evaluationDate}</p>}
            </div>

            {selectedHospital?.startTime && selectedHospital?.endTime && (
  <p className="text-sm text-gray-500 mt-1">
    Available between {selectedHospital.startTime} - {selectedHospital.endTime}
  </p>
)}

            <div className="mb-4">
              <Label htmlFor="evaluationTime" value="Evaluation Time" className="text-gray-700 font-medium" />
              <TextInput
                id="evaluationTime"
                type="time"
                min={selectedHospital.startTime}
                max={selectedHospital.endTime}
                required
                value={evalFormData.evaluationTime}
                onChange={handleEvalChange}
                color={evalErrors.evaluationTime ? 'failure' : 'gray'}
              />
              {evalErrors.evaluationTime && <p className="text-red-600 text-sm mt-1">{evalErrors.evaluationTime}</p>}
            </div>
            <Modal.Footer>
              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center"
                disabled={heLoading}
              >
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
            <div className="mb-4">
              <Label htmlFor="hospitalId" value="Select Hospital" className="text-gray-700 font-medium" />
              <Select
                id="hospitalId"
                required
                value={appointmentFormData.hospitalId}
                onChange={handleAppointmentChange}
                color={appointmentErrors.hospitalId ? 'failure' : 'gray'}
              >
                <option value="" disabled>Select a hospital</option>
                {hospitals && hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </Select>
              {appointmentErrors.hospitalId && <p className="text-red-600 text-sm mt-1">{appointmentErrors.hospitalId}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="appointmentDate" value="Appointment Date" className="text-gray-700 font-medium" />
              <TextInput
                id="appointmentDate"
                type="date"
                required
                min={today}
                value={appointmentFormData.appointmentDate}
                onChange={handleAppointmentChange}
                color={appointmentErrors.appointmentDate ? 'failure' : 'gray'}
              />
              {appointmentErrors.appointmentDate && <p className="text-red-600 text-sm mt-1">{appointmentErrors.appointmentDate}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="appointmentTime" value="Appointment Time" className="text-gray-700 font-medium" />
              <TextInput
                id="appointmentTime"
                type="time"
                required
                value={appointmentFormData.appointmentTime}
                onChange={handleAppointmentChange}
                color={appointmentErrors.appointmentTime ? 'failure' : 'gray'}
              />
              {appointmentErrors.appointmentTime && <p className="text-red-600 text-sm mt-1">{appointmentErrors.appointmentTime}</p>}
            </div>
            <Modal.Footer>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center"
                disabled={loading}
              >
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