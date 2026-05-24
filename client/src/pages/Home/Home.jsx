import React, { useState, useEffect, useContext } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import { StoreContext } from '../../Context/StoreContext'

const Home = () => {
  const [category, setCategory] = useState("All");
  const { searchQuery } = useContext(StoreContext);

  // When arriving from another page with an active search, scroll to food results
  useEffect(() => {
    if (searchQuery) {
      const el = document.getElementById('food-display');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []); // runs once on mount
  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
    </div>
  )
}

export default Home