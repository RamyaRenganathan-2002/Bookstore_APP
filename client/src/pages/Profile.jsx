import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, BookOpen, Heart, ShoppingBag, LogOut, AlertCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'





const TABS = ['Overview', 'Orders', 'Wishlist', 'Settings']

function Profile() {
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [ordersError, setOrdersError] = useState('')
    const [wishlist, setWishlist] = useState([])
    const [wishlistLoading, setWishlistLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true)
            setOrdersError('')
            const res = await api.get('/orders/my-orders')
            setOrders(res.data)
        } catch (err) {
            console.error('Failed to fetch orders', err)
            if (err.code === 'ERR_NETWORK') {
                setOrdersError('Cannot connect to the server.')
            } else {
                setOrdersError(err.response?.data?.message || 'Failed to load orders.')
            }
        } finally {
            setOrdersLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "My Account | The Serene Scriptorium"
        fetchOrders()
        // Fetch real wishlist
        const fetchWishlist = async () => {
            try {
                setWishlistLoading(true)
                const res = await api.get('/wishlist')
                setWishlist(res.data)
            } catch (err) {
                console.error('Failed to fetch wishlist', err)
            } finally {
                setWishlistLoading(false)
            }
        }
        fetchWishlist()
    }, [])

    const user = useStore(state => state.user)
    const logout = useStore(state => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }
    const [activeTab, setActiveTab] = useState('Overview')

    return (
        <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '3rem 4rem',
                borderBottom: '2px solid #C9A84C'
            }}>
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(201,168,76,0.2)',
                        border: '2px solid #C9A84C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={36} color='#C9A84C' />
                    </div>

                    {/* User Info */}
                    <div>
                        <h1 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            color: '#F5F0E8',
                            marginBottom: '0.2rem'
                        }}>{user?.name}</h1>
                        <p style={{
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '1rem',
                            color: '#9CA3AF',
                            fontStyle: 'italic'
                        }}>{user?.email}</p>
                        <span style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '0.75rem',
                            letterSpacing: '2px',
                            color: '#C9A84C',
                            textTransform: 'uppercase'
                        }}>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    maxWidth: '1100px',
                    margin: '2rem auto 0',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                backgroundColor: activeTab === tab ? '#C9A84C' : 'transparent',
                                color: activeTab === tab ? '#0F1F3D' : '#D4C9B0',
                                border: '1.5px solid rgba(201,168,76,0.4)',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '25px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '0.95rem',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: activeTab === tab ? '700' : '400'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>

                {/* Overview Tab */}
                {activeTab === 'Overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            {[
                                { icon: <ShoppingBag size={24} color='#C9A84C' />, label: 'Total Orders', value: ordersLoading ? '—' : orders.length },
                                { icon: <BookOpen size={24} color='#C9A84C' />, label: 'Books Purchased', value: ordersLoading ? '—' : orders.reduce((sum, o) => sum + o.items.length, 0) },
                                { icon: <Heart size={24} color='#C9A84C' />, label: 'Wishlist Items', value: wishlistLoading ? '—' : wishlist.length },
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    backgroundColor: '#FFFDF7',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(201,168,76,0.2)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    {stat.icon}
                                    <div>
                                        <p style={{
                                            fontFamily: 'EB Garamond, serif',
                                            fontSize: '0.9rem',
                                            color: '#6b7280'
                                        }}>{stat.label}</p>
                                        <p style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1.8rem',
                                            fontWeight: '700',
                                            color: '#0F1F3D'
                                        }}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Order */}
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2.5rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>Recent Order</h2>
                        <div style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid rgba(201,168,76,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
                        }}>
                        {ordersLoading ? (
                            <LoadingSpinner message="Loading orders..." />
                        ) : ordersError ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                backgroundColor: 'rgba(139,0,0,0.08)',
                                border: '1px solid rgba(139,0,0,0.2)',
                                borderRadius: '8px',
                                padding: '1rem',
                            }}>
                                <AlertCircle size={18} color='#8B0000' />
                                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#8B0000' }}>
                                    {ordersError}
                                </p>
                                <button
                                    onClick={fetchOrders}
                                    style={{
                                        marginLeft: 'auto',
                                        backgroundColor: '#8B0000',
                                        color: '#F5F0E8',
                                        border: 'none',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '16px',
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                    }}
                                >Retry</button>
                            </div>
                        ) : orders.length > 0 ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D' }}>Order #{orders[0].id}</span>
                                        <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.9rem', color: '#9CA3AF' }}>{new Date(orders[0].createdAt).toLocaleDateString()}</span>
                                        <span style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '0.8rem',
                                            letterSpacing: '1px',
                                            color: '#1B4332',
                                            backgroundColor: 'rgba(27,67,50,0.1)',
                                            padding: '0.2rem 0.8rem',
                                            borderRadius: '20px'
                                        }}>{orders[0].status}</span>
                                    </div>
                                    {orders[0].items.map(item => (
                                        <div key={item.book?.title || item.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0',
                                            borderTop: '1px solid rgba(201,168,76,0.1)'
                                        }}>
                                            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#4a4a4a' }}>
                                                {item.book?.title || 'Unknown Book'} × {item.quantity}
                                            </span>
                                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#C9A84C', fontWeight: '700' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p style={{ fontFamily: 'EB Garamond, serif', color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>No recent orders found.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Orders Tab */}
                {activeTab === 'Orders' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2.5rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>Order History</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {ordersLoading ? (
                                <LoadingSpinner message="Loading order history..." />
                            ) : ordersError ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    backgroundColor: 'rgba(139,0,0,0.08)',
                                    border: '1px solid rgba(139,0,0,0.2)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                }}>
                                    <AlertCircle size={18} color='#8B0000' />
                                    <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#8B0000' }}>{ordersError}</p>
                                    <button onClick={fetchOrders} style={{
                                        marginLeft: 'auto', backgroundColor: '#8B0000', color: '#F5F0E8',
                                        border: 'none', padding: '0.3rem 0.8rem', borderRadius: '16px',
                                        fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', cursor: 'pointer'
                                    }}>Retry</button>
                                </div>
                            ) : orders.length > 0 ? orders.map(order => (
                                <div key={order.id} style={{
                                    backgroundColor: '#FFFDF7',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(201,168,76,0.2)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#0F1F3D', fontWeight: '600' }}>Order #{order.id}</span>
                                        <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.9rem', color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '0.8rem',
                                            letterSpacing: '1px',
                                            color: '#1B4332',
                                            backgroundColor: 'rgba(27,67,50,0.1)',
                                            padding: '0.2rem 0.8rem',
                                            borderRadius: '20px'
                                        }}>{order.status}</span>
                                    </div>
                                    {order.items.map(item => (
                                        <div key={item.book?.title || item.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0',
                                            borderTop: '1px solid rgba(201,168,76,0.1)'
                                        }}>
                                            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: '#4a4a4a' }}>
                                                {item.book?.title || 'Unknown Book'} × {item.quantity}
                                            </span>
                                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#C9A84C', fontWeight: '700' }}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: '1rem',
                                        paddingTop: '0.8rem',
                                        borderTop: '1px solid rgba(201,168,76,0.2)'
                                    }}>
                                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#0F1F3D', fontWeight: '600' }}>
                                            Total: <span style={{ color: '#C9A84C' }}>₹{order.total.toFixed(2)}</span>
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ fontFamily: 'EB Garamond, serif', color: '#6b7280', fontSize: '1.1rem' }}>You haven't placed any orders yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'Wishlist' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2.5rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>My Wishlist</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {wishlistLoading ? (
                                <div style={{ gridColumn: '1 / -1' }}><LoadingSpinner message="Loading your wishlist..." /></div>
                            ) : wishlist.length > 0 ? wishlist.map((item, index) => {
                                const book = item.book
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        style={{
                                            backgroundColor: '#FFFDF7',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(201,168,76,0.2)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-4px)'
                                            e.currentTarget.style.borderColor = '#C9A84C'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                                        }}
                                    >
                                        <img src={book.cover} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                        <div style={{ padding: '1rem' }}>
                                            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#0F1F3D', marginBottom: '0.2rem' }}>{book.title}</h3>
                                            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.8rem' }}>{book.author}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#C9A84C', fontWeight: '700' }}>₹{book.price}</span>
                                                <button
                                                    onClick={() => navigate(`/books/${book.id}`)}
                                                    style={{
                                                        backgroundColor: '#0F1F3D',
                                                        color: '#F5F0E8',
                                                        border: 'none',
                                                        padding: '0.4rem 0.9rem',
                                                        borderRadius: '20px',
                                                        fontFamily: 'Cormorant Garamond, serif',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer'
                                                    }}>View Details</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }) : (
                                <p style={{ gridColumn: '1 / -1', fontFamily: 'EB Garamond, serif', color: '#6b7280', fontSize: '1.1rem' }}>Your wishlist is empty.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'Settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ maxWidth: '500px' }}
                    >
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2.5rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>Account Settings</h2>

                        <div style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            padding: '2rem',
                            border: '1px solid rgba(201,168,76,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem'
                        }}>
                            {[
                                { label: 'Full Name', value: user?.name || '', type: 'text' },
                                { label: 'Email', value: user?.email || '', type: 'email' },
                                { label: 'New Password', value: '', type: 'password', placeholder: 'Leave blank to keep current' },
                            ].map(field => (
                                <div key={field.label}>
                                    <label style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.85rem',
                                        letterSpacing: '1.5px',
                                        color: '#0F1F3D',
                                        display: 'block',
                                        marginBottom: '0.4rem',
                                        textTransform: 'uppercase'
                                    }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        defaultValue={field.value}
                                        placeholder={field.placeholder}
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid rgba(201,168,76,0.3)',
                                            backgroundColor: '#F5F0E8',
                                            fontFamily: 'EB Garamond, serif',
                                            fontSize: '1rem',
                                            color: '#1a1a1a',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                                    />
                                </div>
                            ))}

                            <button style={{
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
                            }}>
                                Save Changes
                            </button>

                            <button style={{
                                backgroundColor: 'transparent',
                                border: '1.5px solid #8B0000',
                                color: '#8B0000',
                                padding: '0.7rem',
                                borderRadius: '30px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <LogOut size={16} onClick={handleLogout} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Profile