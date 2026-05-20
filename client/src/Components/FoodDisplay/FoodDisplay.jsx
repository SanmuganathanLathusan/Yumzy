import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery } = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          const query = searchQuery ? searchQuery.trim().toLowerCase() : "";
          const matchesCategory = query ? true : (category === 'All' || category === item.category);

          const matchesSearch = !query ||
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);

          if (matchesCategory && matchesSearch) {
            return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
