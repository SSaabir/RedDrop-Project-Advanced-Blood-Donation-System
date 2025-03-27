import React from 'react'
import Logo from '../assets/logo.svg'
import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiReceiptTax, HiUser, HiHeart, HiShoppingBag, HiArrowSmRight, HiTable } from 'react-icons/hi';
import { useAuthContext } from '../hooks/useAuthContext';

export const DashboardSidebar = () => {
  const { user } = useAuthContext();
  const userId = user?.userObj?._id;
  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = user?.role === 'HospitalAdmin';
  return (
         <Sidebar aria-label="Sidebar">
           <Sidebar.Logo href="#" img={Logo} imgAlt="Flowbite logo">
             Red Drop
           </Sidebar.Logo>
           <Sidebar.Items>
            {user && (
             <Sidebar.ItemGroup>
               <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                 Dashboard
               </Sidebar.Item>   
               {Donor && (
                <>
               <Sidebar.Item href="/appointmentd" icon={HiReceiptTax}>
                 Appointments
               </Sidebar.Item>
               <Sidebar.Item href="/healthEvaluationD" icon={HiArrowSmRight}>
                 Health Evaluation
               </Sidebar.Item>
               <Sidebar.Item href="/emerbd" icon={HiTable}>
                 Emergency Requests
               </Sidebar.Item>
               </>
               
               )}
               {Hospital &&/* HospitalAdmin &&*/(<>
                <Sidebar.Item href="/appointmentd" icon={HiReceiptTax}>
                 Appointments
               </Sidebar.Item>
                <Sidebar.Item href="/healthEvaluationD" icon={HiArrowSmRight}>
                 Health Evaluation
               </Sidebar.Item>
               <Sidebar.Item href="/emerbd" icon={HiTable}>
                 Emergency Requests
               </Sidebar.Item>
               <Sidebar.Item href="/bloodid" icon={HiTable}>
                 Blood Inventory
               </Sidebar.Item>
               <Sidebar.Item href="/hosadd" icon={HiArrowSmRight}>
                 Hospital Admins
               </Sidebar.Item>
               </>)}
               {Manager && (<>
               <Sidebar.Item href="/donord" icon={HiUser}>
                 Donors
               </Sidebar.Item>
               <Sidebar.Item href="/hospitald" icon={HiHeart}>
                 Hospitals
               </Sidebar.Item>
               <Sidebar.Item href="/feedd" icon={HiShoppingBag}>
                 Feedbacks
               </Sidebar.Item>
               <Sidebar.Item href="/inqd" icon={HiArrowSmRight}>
                 Inquiries
               </Sidebar.Item>
              <Sidebar.Item href="/sysmand" icon={HiArrowSmRight}>
                 System Managers
               </Sidebar.Item>
               <Sidebar.Item href="/bloodid" icon={HiTable}>
                 Blood Inventory
               </Sidebar.Item>
               <Sidebar.Item href="/emerbd" icon={HiTable}>
                 Emergency Requests
               </Sidebar.Item>
               </>)}
             </Sidebar.ItemGroup>
             )}
           </Sidebar.Items>
         </Sidebar>
  )
}
