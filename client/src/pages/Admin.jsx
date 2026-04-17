import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ShoppingBag, Users, TrendingUp, Plus, Trash2, Edit } from 'lucide-react'
import api from '../lib/api'
import useStore from '../store/useStore'


const TABS = ['Overview', 'Books', 'Orders']

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

function Admin() {
    const [activeTab, setActiveTab] = useState('Overview')
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddBook, setShowAddBook] = useState(false)
    const [newBook, setNewBook] = useState({
        title: '', author: '', price: '', stock: '', genre: '', cover: '', description: ''
    })
    const user = useStore(state => state.user)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Admin Dashboard | The Serene Scriptorium"
        fetchBooks()
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/my-orders')
            setOrders(res.data)
        } catch (err) {
            console.error('Failed to fetch orders', err)
        }
    }

    const fetchBooks = async () => {
        try {
            setLoading(true)
            const res = await api.get('/books')
            setBooks(res.data)
        } catch (err) {
            console.error('Failed to fetch books', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddBook = async () => {
        if (!newBook.title || !newBook.author || !newBook.price) return
        try {
            await api.post('/books', {
                title: newBook.title,
                author: newBook.author,
                price: parseFloat(newBook.price),
                stock: parseInt(newBook.stock) || 0,
                genre: newBook.genre,
                description: newBook.description || 'A wonderful book.',
                cover: newBook.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80'
            })
            setNewBook({ title: '', author: '', price: '', stock: '', genre: '', cover: '', description: '' })
            setShowAddBook(false)
            fetchBooks()
        } catch (err) {
            console.error('Failed to add book', err)
            alert('Failed to add book! Make sure you are logged in as admin.')
        }
    }

    const handleDeleteBook = async (id) => {
        try {
            await api.delete(`/books/${id}`)
            fetchBooks()
        } catch (err) {
            console.error('Failed to delete book', err)
        }
    }

    const getStatusColor = (status) => {
        if (status === 'Delivered') return { color: '#1B4332', bg: 'rgba(27,67,50,0.1)' }
        if (status === 'Processing') return { color: '#8B0000', bg: 'rgba(139,0,0,0.1)' }
        if (status === 'Shipped') return { color: '#0F1F3D', bg: 'rgba(15,31,61,0.1)' }
        return { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' }
    }

    return (
        <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '3rem 4rem',
                borderBottom: '2px solid #C9A84C'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '0.9rem',
                        letterSpacing: '4px',
                        color: '#C9A84C',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                    }}>Admin</p>
                    <h1 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#F5F0E8',
                        marginBottom: '0.3rem'
                    }}>Dashboard</h1>
                    <div style={{ width: '60px', height: '2px', backgroundColor: '#C9A84C', marginBottom: '2rem' }} />

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            {[
                                { icon: <BookOpen size={28} color='#C9A84C' />, label: 'Total Books', value: books.length, bg: '#0F1F3D' },
                                { icon: <ShoppingBag size={28} color='#C9A84C' />, label: 'Total Orders', value: orders.length, bg: '#1B4332' },
                                { icon: <Users size={28} color='#C9A84C' />, label: 'Total Users', value: '24', bg: '#4A0000' },
                                { icon: <TrendingUp size={28} color='#C9A84C' />, label: 'Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, bg: '#0F1F3D' },
                            ].map(stat => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    style={{
                                        backgroundColor: stat.bg,
                                        borderRadius: '12px',
                                        padding: '1.8rem',
                                        border: '1px solid rgba(201,168,76,0.3)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.2rem'
                                    }}
                                >
                                    {stat.icon}
                                    <div>
                                        <p style={{
                                            fontFamily: 'EB Garamond, serif',
                                            fontSize: '0.9rem',
                                            color: '#9CA3AF'
                                        }}>{stat.label}</p>
                                        <p style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '2rem',
                                            fontWeight: '700',
                                            color: '#F5F0E8'
                                        }}>{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <h2 style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '2.5rem',
                            color: '#0F1F3D',
                            marginBottom: '1.5rem'
                        }}>Recent Orders</h2>
                        <div style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            border: '1px solid rgba(201,168,76,0.2)',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                        }}>
                            {orders.length > 0 ? orders.slice(0, 5).map((order, index) => (
                                <div key={order.id} style={{
                                    padding: '1.2rem 1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    borderTop: index > 0 ? '1px solid rgba(201,168,76,0.1)' : 'none'
                                }}>
                                    <div>
                                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D', fontWeight: '600' }}>
                                            Order #{order.id}
                                        </p>
                                        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.85rem', color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '1rem',
                                            color: '#C9A84C',
                                            fontWeight: '700'
                                        }}>₹{order.total.toFixed(2)}</span>
                                        <span style={{
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '0.8rem',
                                            letterSpacing: '1px',
                                            color: getStatusColor(order.status).color,
                                            backgroundColor: getStatusColor(order.status).bg,
                                            padding: '0.2rem 0.8rem',
                                            borderRadius: '20px'
                                        }}>{order.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ padding: '1.5rem', fontFamily: 'EB Garamond, serif', color: '#6b7280', fontSize: '1rem', margin: 0 }}>No orders yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Books Tab */}
                {activeTab === 'Books' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{
                                fontFamily: 'Pinyon Script, cursive',
                                fontSize: '2.5rem',
                                color: '#0F1F3D',
                            }}>Manage Books</h2>
                            <button
                                onClick={() => setShowAddBook(!showAddBook)}
                                style={{
                                    backgroundColor: '#0F1F3D',
                                    color: '#F5F0E8',
                                    border: 'none',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '25px',
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '1rem',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Plus size={16} />
                                Add Book
                            </button>
                        </div>

                        {/* Add Book Form */}
                        {showAddBook && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: '#FFFDF7',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                    marginBottom: '2rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                                }}
                            >
                                <h3 style={{
                                    fontFamily: 'Pinyon Script, cursive',
                                    fontSize: '2rem',
                                    color: '#0F1F3D',
                                    marginBottom: '1.5rem'
                                }}>Add New Book</h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1.2rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {[
                                        { label: 'Title', key: 'title', placeholder: 'Book title' },
                                        { label: 'Author', key: 'author', placeholder: 'Author name' },
                                        { label: 'Price ($)', key: 'price', placeholder: '0.00' },
                                        { label: 'Stock', key: 'stock', placeholder: '0' },
                                        { label: 'Genre', key: 'genre', placeholder: 'Genre' },
                                        { label: 'Cover Image URL', key: 'cover', placeholder: 'https://...' },
                                        { label: 'Description', key: 'description', placeholder: 'Book description...' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={labelStyle}>{field.label}</label>
                                            <input
                                                type="text"
                                                value={newBook[field.key]}
                                                onChange={e => setNewBook({ ...newBook, [field.key]: e.target.value })}
                                                placeholder={field.placeholder}
                                                style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={handleAddBook} style={{
                                        backgroundColor: '#C9A84C',
                                        color: '#0F1F3D',
                                        border: 'none',
                                        padding: '0.7rem 2rem',
                                        borderRadius: '25px',
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '1rem',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        fontWeight: '700'
                                    }}>Save Book</button>
                                    <button onClick={() => setShowAddBook(false)} style={{
                                        backgroundColor: 'transparent',
                                        border: '1.5px solid rgba(201,168,76,0.4)',
                                        color: '#0F1F3D',
                                        padding: '0.7rem 2rem',
                                        borderRadius: '25px',
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                    }}>Cancel</button>
                                </div>
                            </motion.div>
                        )}

                        {/* Books Table */}
                        <div style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            border: '1px solid rgba(201,168,76,0.2)',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                        }}>
                            {/* Table Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
                                padding: '1rem 1.5rem',
                                backgroundColor: '#0F1F3D',
                                gap: '1rem'
                            }}>
                                {['Title', 'Author', 'Price', 'Stock', 'Genre', ''].map(col => (
                                    <span key={col} style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.8rem',
                                        letterSpacing: '2px',
                                        color: '#C9A84C',
                                        textTransform: 'uppercase'
                                    }}>{col}</span>
                                ))}
                            </div>

                            {/* Table Rows */}
                            {books.map((book, index) => (
                                <div key={book.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
                                    padding: '1rem 1.5rem',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    borderTop: index > 0 ? '1px solid rgba(201,168,76,0.1)' : 'none',
                                    transition: 'background 0.2s ease'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D', fontWeight: '600' }}>{book.title}</span>
                                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.95rem', color: '#6b7280', fontStyle: 'italic' }}>{book.author}</span>
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#C9A84C', fontWeight: '700' }}>${book.price}</span>
                                    <span style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.95rem',
                                        color: book.stock < 5 ? '#8B0000' : '#1B4332',
                                        fontWeight: '600'
                                    }}>{book.stock}</span>
                                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.9rem', color: '#6b7280' }}>{book.genre}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleDeleteBook(book.id)} style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#8B0000',
                                            padding: '0.3rem'
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                        }}>All Orders</h2>

                        <div style={{
                            backgroundColor: '#FFFDF7',
                            borderRadius: '12px',
                            border: '1px solid rgba(201,168,76,0.2)',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                        }}>
                            {/* Table Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '0.5fr 2fr 1fr 1fr 1fr',
                                padding: '1rem 1.5rem',
                                backgroundColor: '#0F1F3D',
                                gap: '1rem'
                            }}>
                                {['#', 'Customer', 'Date', 'Total', 'Status'].map(col => (
                                    <span key={col} style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.8rem',
                                        letterSpacing: '2px',
                                        color: '#C9A84C',
                                        textTransform: 'uppercase'
                                    }}>{col}</span>
                                ))}
                            </div>

                            {/* Rows */}
                            {orders.length > 0 ? orders.map((order, index) => (
                                <div key={order.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.5fr 2fr 1fr 1fr 1fr',
                                    padding: '1rem 1.5rem',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    borderTop: index > 0 ? '1px solid rgba(201,168,76,0.1)' : 'none',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#9CA3AF' }}>#{order.id}</span>
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#0F1F3D', fontWeight: '600' }}>User #{order.userId}</span>
                                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.9rem', color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#C9A84C', fontWeight: '700' }}>${order.total.toFixed(2)}</span>
                                    <span style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '0.8rem',
                                        letterSpacing: '1px',
                                        color: getStatusColor(order.status).color,
                                        backgroundColor: getStatusColor(order.status).bg,
                                        padding: '0.2rem 0.8rem',
                                        borderRadius: '20px',
                                        display: 'inline-block'
                                    }}>{order.status}</span>
                                </div>
                            )) : (
                                <p style={{ padding: '1.5rem', fontFamily: 'EB Garamond, serif', color: '#6b7280', fontSize: '1rem', margin: 0 }}>No orders yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Admin