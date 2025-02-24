import { Button, Navbar, TextInput, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import React, { useState } from 'react';
import Logo from '../assets/logo.svg';
export default function Header() {
  const path = useLocation().pathname;

  return (
    <Navbar className='border-b-2'>
      {/* Brand Logo */}
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
     <div className='flex flex-wrap self-center content-center justify-center gap-1'>
      <img src={Logo} alt="logo" className= 'w-8 '/>
        <span className=''>Red Drop</span>
        </div>
      </Link>

      {/* Right Side: Search, Theme Toggle, and Cart */}
      <div className='flex gap-2 md:order-2'>
    <Button className=''>Get Started -</Button>
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/colours'} as={'div'}>
          <Link to='/colours'>Colours</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/product'} as={'div'}>
          <Link to='/product'>Product</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/instruction'} as={'div'}>
          <Link to='/instruction'>Instruction</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/contactus'} as={'div'}>
          <Link to='/contactus'>Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
