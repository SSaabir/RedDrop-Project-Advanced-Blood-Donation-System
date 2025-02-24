import React from 'react'
import Logo from '../assets/logo.svg'
import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiReceiptTax, HiUser, HiHeart, HiShoppingBag, HiArrowSmRight, HiTable } from 'react-icons/hi';

export const DashboardSidebar = () => {
  return (
         <Sidebar aria-label="Sidebar">
           <Sidebar.Logo href="#" img={Logo} imgAlt="Flowbite logo">
             Red Drop
           </Sidebar.Logo>
           <Sidebar.Items>
             <Sidebar.ItemGroup>
               <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                 Dashboard
               </Sidebar.Item>
               
               <Sidebar.Item href="/hospitald" icon={HiHeart}>
                 Hospitals
               </Sidebar.Item>
               
               <Sidebar.Item href="/appointmentd" icon={HiReceiptTax}>
                 Appointments
               </Sidebar.Item>
               <Sidebar.Item href="/donord" icon={HiUser}>
                 Donors
               </Sidebar.Item>
               <Sidebar.Item href="productd" icon={HiShoppingBag}>
                 Products
               </Sidebar.Item>
               <Sidebar.Item href="employeed" icon={HiArrowSmRight}>
                 Employees
               </Sidebar.Item>
               <Sidebar.Item href="#" icon={HiTable}>
                 Sign Up
               </Sidebar.Item>
             </Sidebar.ItemGroup>
           </Sidebar.Items>
         </Sidebar>
  )
}
