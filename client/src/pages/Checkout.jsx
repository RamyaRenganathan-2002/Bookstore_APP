import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import useStore from '../store/useStore'
import api from '../lib/api'

function Checkout() {
    const [step, setStep] = useState(1)
    const [orderError, setOrderError] = useState('')
    const [placingOrder, setPlacingOrder] = useState(false)
    const [shipping, setShipping] = useState({
        name: '', email: '', address: '', city: '', zip: '', country: ''
    })
    const [payment, setPayment] = useState({
        cardName: '', cardNumber: '', expiry: '', cvv: ''
    })

    const cart = useStore(state => state.cart)
    const clearCart = useStore(state => state.clearCart)
    const navigate = useNavigate()

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = cart.length > 0 ? 4.99 : 0
    const total = subtotal + shippingFee

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Complete Your Order | The Serene Scriptorium"
    }, [])

    const handlePlaceOrder = async () => {
        try {
            setPlacingOrder(true)
            setOrderError('')
            await api.post('/orders', {
                items: cart.map(item => ({
                    bookId: item.id,
                    quantity: item.quantity
                }))
            })
            clearCart()
            setStep(3)
        } catch (err) {
            if (err.response?.status === 404) {
                setOrderError(err.response.data.message + ' Your cart contains items that are no longer available.')
                setTimeout(() => { clearCart(); navigate('/browse') }, 3000)
            } else if (err.code === 'ERR_NETWORK') {
                setOrderError('Cannot reach the server. Please check your connection and try again.')
            } else {
                setOrderError(err.response?.data?.message || 'Order failed. Please try again.')
            }
        } finally {
            setPlacingOrder(false)
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '0.7rem 1rem',
        borderRadius: '8px',
        border: '1.5px solid rgba(201,168,76,0.3)',
        backgroundColor: '#F5F0E8',
        fontFamily: 'EB Garamond, serif',
        fontSize: '1rem',
        color: '#1a1a1a',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border 0.2s ease'
    }

    const labelStyle = {
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '0.85rem',
        letterSpacing: '1.5px',
        color: '#0F1F3D',
        display: 'block',
        marginBottom: '0.4rem',
        textTransform: 'uppercase'
    }

    return (
        <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '3rem 4rem',
                textAlign: 'center',
                borderBottom: '2px solid #C9A84C'
            }}>
                <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '0.9rem',
                    letterSpacing: '4px',
                    color: '#C9A84C',
                    textTransform: 'uppercase',
                    marginBottom: '0.8rem'
                }}>Complete Your</p>
                <h1 style={{
                    fontFamily: 'Pinyon Script, cursive',
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#F5F0E8',
                    marginBottom: '0.5rem'
                }}>Order</h1>
                <div style={{ width: '60px', height: '2px', backgroundColor: '#C9A84C', margin: '0 auto' }} />

                {/* Step Indicators */}
                {step < 3 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '2rem'
                    }}>
                        {['Shipping', 'Payment'].map((label, i) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        backgroundColor: step >= i + 1 ? '#C9A84C' : 'transparent',
                                        border: '2px solid #C9A84C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.9rem',
                                        color: step >= i + 1 ? '#0F1F3D' : '#C9A84C',
                                        fontWeight: '700'
                                    }}>{i + 1}</div>
                                    <span style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.9rem',
                                        letterSpacing: '1px',
                                        color: step >= i + 1 ? '#C9A84C' : '#9CA3AF'
                                    }}>{label}</span>
                                </div>
                                {i === 0 && (
                                    <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(201,168,76,0.4)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {step === 3 ? (
                // Order Confirmed
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6rem 2rem',
                        textAlign: 'center'
                    }}
                >
                    <CheckCircle size={70} color='#1B4332' style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#0F1F3D',
                        marginBottom: '1rem'
                    }}>Order Confirmed!</h2>
                    <div style={{ width: '60px', height: '2px', backgroundColor: '#C9A84C', margin: '0 auto 1.5rem' }} />
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        maxWidth: '400px',
                        lineHeight: '1.8',
                        marginBottom: '2.5rem'
                    }}>
                        Thank you for your order! Your books will be delivered with the utmost care and devotion.
                    </p>
                    <Link to="/browse" style={{
                        textDecoration: 'none',
                        backgroundColor: '#0F1F3D',
                        color: '#F5F0E8',
                        padding: '0.8rem 2.5rem',
                        borderRadius: '30px',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                    }}>
                        Continue Shopping
                    </Link>
                </motion.div>
            ) : (
                <div className="checkout-layout" style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '3rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr',
                    gap: '3rem',
                    alignItems: 'start'
                }}>

                    {/* Form */}
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            padding: '2.5rem',
                            border: '1px solid rgba(201,168,76,0.2)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                        }}
                    >
                        {step === 1 ? (
                            <>
                                <h2 style={{
                                    fontFamily: 'Pinyon Script, cursive',
                                    fontSize: '2rem',
                                    color: '#0F1F3D',
                                    marginBottom: '1.5rem'
                                }}>Shipping Details</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                                        { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                                        { label: 'Address', key: 'address', type: 'text', placeholder: 'Street address' },
                                        { label: 'City', key: 'city', type: 'text', placeholder: 'City' },
                                        { label: 'ZIP Code', key: 'zip', type: 'text', placeholder: 'ZIP / Postal code' },
                                        { label: 'Country', key: 'country', type: 'text', placeholder: 'Country' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={labelStyle}>{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={shipping[field.key]}
                                                onChange={e => setShipping({ ...shipping, [field.key]: e.target.value })}
                                                placeholder={field.placeholder}
                                                style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                                            />
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setStep(2)}
                                        style={{
                                            backgroundColor: '#0F1F3D',
                                            color: '#F5F0E8',
                                            border: 'none',
                                            padding: '0.85rem',
                                            borderRadius: '30px',
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1.1rem',
                                            letterSpacing: '2px',
                                            cursor: 'pointer',
                                            marginTop: '0.5rem'
                                        }}
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={{
                                    fontFamily: 'Pinyon Script, cursive',
                                    fontSize: '2rem',
                                    color: '#0F1F3D',
                                    marginBottom: '1.5rem'
                                }}>Payment Details</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {[
                                        { label: 'Name on Card', key: 'cardName', placeholder: 'As on card' },
                                        { label: 'Card Number', key: 'cardNumber', placeholder: '•••• •••• •••• ••••' },
                                        { label: 'Expiry Date', key: 'expiry', placeholder: 'MM / YY' },
                                        { label: 'CVV', key: 'cvv', placeholder: '•••' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={labelStyle}>{field.label}</label>
                                            <input
                                                type="text"
                                                value={payment[field.key]}
                                                onChange={e => setPayment({ ...payment, [field.key]: e.target.value })}
                                                placeholder={field.placeholder}
                                                style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                                            />
                                        </div>
                                    ))}

                                    <p style={{
                                        fontFamily: 'EB Garamond, serif',
                                        fontSize: '0.85rem',
                                        color: '#9CA3AF',
                                        fontStyle: 'italic',
                                        textAlign: 'center'
                                    }}>
                                        🔒 This is a mock payment — no real charges will be made
                                    </p>

                                    {/* Order Error Banner */}
                                    {orderError && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.8rem',
                                            backgroundColor: 'rgba(139,0,0,0.08)',
                                            border: '1px solid rgba(139,0,0,0.25)',
                                            borderLeft: '4px solid #8B0000',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                        }}>
                                            <AlertCircle size={18} color='#8B0000' style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <p style={{
                                                fontFamily: 'EB Garamond, serif',
                                                fontSize: '0.95rem',
                                                color: '#8B0000',
                                                lineHeight: '1.5',
                                            }}>{orderError}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={placingOrder}
                                        style={{
                                            backgroundColor: placingOrder ? '#a8884a' : '#C9A84C',
                                            color: '#0F1F3D',
                                            border: 'none',
                                            padding: '0.85rem',
                                            borderRadius: '30px',
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1.1rem',
                                            letterSpacing: '2px',
                                            cursor: placingOrder ? 'not-allowed' : 'pointer',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        {placingOrder ? (
                                            <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Placing Order...</>
                                        ) : 'Place Order'}
                                    </button>

                                    <button
                                        onClick={() => setStep(1)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1.5px solid rgba(201,168,76,0.4)',
                                            color: '#0F1F3D',
                                            padding: '0.7rem',
                                            borderRadius: '30px',
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1rem',
                                            letterSpacing: '1px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Back to Shipping
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            padding: '2rem',
                            border: '1px solid rgba(201,168,76,0.3)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            position: 'sticky',
                            top: '100px'
                        }}
                    >
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>Your Order</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <p style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1rem',
                                            color: '#0F1F3D',
                                            fontWeight: '600'
                                        }}>{item.title}</p>
                                        <p style={{
                                            fontFamily: 'EB Garamond, serif',
                                            fontSize: '0.85rem',
                                            color: '#9CA3AF'
                                        }}>Qty: {item.quantity}</p>
                                    </div>
                                    <span style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '1rem',
                                        color: '#C9A84C',
                                        fontWeight: '700'
                                    }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ height: '1px', backgroundColor: 'rgba(201,168,76,0.3)', margin: '1rem 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#6b7280' }}>Subtotal</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D' }}>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#6b7280' }}>Shipping</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D' }}>₹{shippingFee.toFixed(2)}</span>
                            </div>
                            <div style={{ height: '1px', backgroundColor: 'rgba(201,168,76,0.3)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#0F1F3D', fontWeight: '600' }}>Total</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#C9A84C', fontWeight: '700' }}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default Checkout