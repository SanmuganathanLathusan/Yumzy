import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);

  const query = searchQuery ? searchQuery.trim().toLowerCase() : "";

  const filteredList = food_list.filter((item) => {
    const matchesCategory = query ? true : (category === 'All' || category === item.category);
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>
          {query
            ? <>Results for <span className="search-highlight">"{searchQuery}"</span></>
            : 'Top dishes near you'
          }
        </h2>
        {query && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
            ✕ Clear search
          </button>
        )}
      </div>

      {filteredList.length === 0 ? (
        <div className="food-display-empty">
          <div className="empty-icon">🍽️</div>
          <h3>No dishes found</h3>
          <p>We couldn't find any food matching <strong>"{searchQuery}"</strong>.<br/>Try a different name or category.</p>
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>Browse all dishes</button>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredList.map((item, index) => (
            <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
