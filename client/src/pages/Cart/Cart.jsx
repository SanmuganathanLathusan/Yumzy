import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

// Valid promo codes
const PROMO_CODES = {
    'YUMZY10': 10,
    'SAVE20': 20,
    'WELCOME15': 15,
};

const Cart = () => {
    const { cartItems, food_list, removeFromeCart, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const handlePromoSubmit = () => {
        const code = promoCode.trim().toUpperCase();
        if (promoApplied) {
            setPromoMessage('A promo code is already applied!');
            return;
        }
        if (PROMO_CODES[code]) {
            setDiscount(PROMO_CODES[code]);
            setPromoApplied(true);
            setPromoMessage(`🎉 Promo code applied! You saved ${PROMO_CODES[code]}%`);
        } else {
            setPromoMessage('❌ Invalid promo code. Try: YUMZY10, SAVE20, or WELCOME15');
            setDiscount(0);
        }
    };

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const discountAmount = ((subtotal * discount) / 100).toFixed(2);
    const total = subtotal === 0 ? 0 : (subtotal + deliveryFee - parseFloat(discountAmount)).toFixed(2);

    return (
        <div className='cart'>
            <div className="cart-items-scroll">
                <div className="cart-items">
                    <div className="cart-items-title">
                        <p>Items</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>
                    <br />
                    <hr />
                    {food_list?.map((item) => {
                        if (cartItems[item._id] > 0) {
                            return (
                                <div key={item._id}>
                                    <div className='cart-items-title cart-items-item'>
                                        <img src={item.image} alt={item.name} />
                                        <p>{item.name}</p>
                                        <p>${item.price}</p>
                                        <p>{cartItems[item._id]}</p>
                                        <p>${item.price * cartItems[item._id]}</p>
                                        <p onClick={() => removeFromeCart(item._id)} className="crose">x</p>
                                    </div>
                                    <hr />
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            <div className="cart-buttom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${deliveryFee}</p>
                        </div>
                        {discount > 0 && (
                            <>
                                <hr />
                                <div className="cart-total-details cart-discount">
                                    <p>Discount ({discount}%)</p>
                                    <p>-${discountAmount}</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className="cart-total-details">
                            <p><strong>Total</strong></p>
                            <p><strong>${total}</strong></p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>

                <div className="cart-promocode">
                    <div>
                        <div className="promo-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="promo-icon">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                            <h3 className="promo-label">Have a promo code?</h3>
                        </div>
                        <p className="promo-desc">Apply your discount code below to claim special offers on your meal.</p>
                        <div className="cart-promocode-input">
                            <input
                                type="text"
                                placeholder='Enter promo code'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={promoApplied}
                                onKeyDown={(e) => e.key === 'Enter' && handlePromoSubmit()}
                            />
                            <button onClick={handlePromoSubmit} disabled={promoApplied}>
                                {promoApplied ? '✓ Applied' : 'Submit'}
                            </button>
                        </div>
                        {promoMessage && (
                            <p className={`promo-message ${promoApplied ? 'promo-success' : 'promo-error'}`}>
                                {promoMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
