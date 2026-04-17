import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, ShoppingBag } from 'lucide-react'
import useStore from '../store/useStore'

function Cart() {
    const cart = useStore(state => state.cart)
    const removeFromCart = useStore(state => state.removeFromCart)
    const updateQuantity = useStore(state => state.updateQuantity)
    const clearCart = useStore(state => state.clearCart)


    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Your Reading Cart | The Serene Scriptorium"
    }, [])





    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = cart.length > 0 ? 4.99 : 0
    const total = subtotal + shipping

    return (
        <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>

            {/* Header */}
            <div className="page-header" style={{
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
                }}>Your</p>
                <h1 style={{
                    fontFamily: 'Pinyon Script, cursive',
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#F5F0E8',
                    marginBottom: '0.5rem'
                }}>Reading Cart</h1>
                <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: '#C9A84C',
                    margin: '0 auto'
                }} />
            </div>

            {cart.length === 0 ? (
                // Empty Cart
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6rem 2rem',
                    textAlign: 'center'
                }}>
                    <ShoppingBag size={60} color='#C9A84C' style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: '3rem',
                        color: '#0F1F3D',
                        marginBottom: '1rem'
                    }}>Your cart is empty</h2>
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        marginBottom: '2rem'
                    }}>Discover our curated collection of books</p>
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
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="cart-layout" style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '3rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr',
                    gap: '3rem',
                    alignItems: 'start'
                }}>

                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                style={{
                                    backgroundColor: '#FFFDF7',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    border: '1px solid rgba(201,168,76,0.2)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
                                }}
                            >
                                {/* Cover */}
                                <img
                                    src={item.cover}
                                    alt={item.title}
                                    style={{
                                        width: '80px',
                                        height: '110px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        boxShadow: '0 0 0 2px #C9A84C'
                                    }}
                                />

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '1.2rem',
                                        color: '#0F1F3D',
                                        fontWeight: '600',
                                        marginBottom: '0.2rem'
                                    }}>{item.title}</h3>
                                    <p style={{
                                        fontFamily: 'EB Garamond, serif',
                                        fontSize: '0.9rem',
                                        color: '#6b7280',
                                        fontStyle: 'italic',
                                        marginBottom: '1rem'
                                    }}>{item.author}</p>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        {/* Quantity Controls */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1.5px solid #C9A84C',
                                            borderRadius: '25px',
                                            overflow: 'hidden'
                                        }}>
                                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                padding: '0.3rem 0.8rem',
                                                cursor: 'pointer',
                                                fontSize: '1.1rem',
                                                color: '#0F1F3D'
                                            }}>−</button>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '1rem',
                                                color: '#0F1F3D',
                                                borderLeft: '1px solid rgba(201,168,76,0.3)',
                                                borderRight: '1px solid rgba(201,168,76,0.3)'
                                            }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                padding: '0.3rem 0.8rem',
                                                cursor: 'pointer',
                                                fontSize: '1.1rem',
                                                color: '#0F1F3D'
                                            }}>+</button>
                                        </div>

                                        {/* Price */}
                                        <span style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1.3rem',
                                            fontWeight: '700',
                                            color: '#C9A84C'
                                        }}>₹{(item.price * item.quantity).toFixed(2)}</span>

                                        {/* Remove */}
                                        <button onClick={() => removeFromCart(item.id)} style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#8B0000',
                                            padding: '0.3rem'
                                        }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

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
                        }}>Order Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#6b7280' }}>Subtotal</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D' }}>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#6b7280' }}>Shipping</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D' }}>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div style={{
                                height: '1px',
                                backgroundColor: 'rgba(201,168,76,0.3)',
                                margin: '0.5rem 0'
                            }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#0F1F3D', fontWeight: '600' }}>Total</span>
                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#C9A84C', fontWeight: '700' }}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link to="/checkout" style={{
                            textDecoration: 'none',
                            display: 'block',
                            backgroundColor: '#0F1F3D',
                            color: '#F5F0E8',
                            padding: '0.9rem',
                            borderRadius: '30px',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '1.1rem',
                            letterSpacing: '2px',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1B2A4A'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0F1F3D'}
                        >
                            Proceed to Checkout
                        </Link>

                        <Link to="/browse" style={{
                            textDecoration: 'none',
                            display: 'block',
                            border: '1.5px solid #C9A84C',
                            color: '#0F1F3D',
                            padding: '0.9rem',
                            borderRadius: '30px',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '1rem',
                            letterSpacing: '1.5px',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                        }}>
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            )
            }
        </div >
    )
}

export default Cart