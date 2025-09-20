import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Slide from '../components/Slide.jsx';
import Categories from '../components/Categories.jsx';
import Listings from '../components/Listings.jsx';

const HomePage = () => {
  return (
    <>
      <Navbar/>
      <Slide/>
      <Categories/>
      <Listings/>
    </>
  )
}

export default HomePage