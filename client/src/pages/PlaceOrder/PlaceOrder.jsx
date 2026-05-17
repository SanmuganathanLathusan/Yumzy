import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'

const PlaceOrder = () => {
    const {getTotalCartAmount, token, setCartItems, url} = useContext(StoreContext);
    const navigate = useNavigate();
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]: value}));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        if (!token) {
            alert("Please login to place an order");
            return;
        }

        const deliveryAddress = {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country
        };

        try {
            const response = await fetch(url + '/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentMethod: 'Cash on Delivery',
                    deliveryAddress
                })
            });

            const result = await response.json();
            if (result.success) {
                alert("Order placed successfully!");
                setCartItems({}); // Clear local cart
                navigate('/');
            } else {
                alert(result.error || "Failed to place order");
            }
        } catch (err) {
            console.error("Order error", err);
            alert("An error occurred while placing your order.");
        }
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name="zipCode" onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='Zip code' />
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>

                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Deleivery fee</p>
                            <p>${getTotalCartAmount()===0?0:2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Total</p>
                            <p>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</p>

                        </div>


                    </div>
                    <button type="submit">PROCEED TO CHECKOUT</button>
                </div>

            </div>
        </form>

    )
}

export default PlaceOrder