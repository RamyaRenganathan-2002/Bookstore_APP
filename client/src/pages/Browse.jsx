import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

const GENRES = ['All', 'Fiction', 'Mystery', 'Romance', 'Fantasy', 'History', 'Science', 'Self Help', 'Biography', 'Classical Literature', 'Philosophy', 'Travel', 'Comedy', 'Languages']

function Browse() {
    const [books, setBooks] = useState([])
    const [search, setSearch] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('All')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Browse Collection | The Serene Scriptorium"
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const genre = params.get('genre')
        if (genre) setSelectedGenre(genre)
    }, [location.search])

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const params = {}
            if (selectedGenre !== 'All') params.genre = selectedGenre
            if (search) params.search = search
            const res = await api.get('/books', { params })
            setBooks(res.data)
        } catch (err) {
            console.error('Failed to fetch books', err)
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
                setError('Unable to connect to the server. Please check your connection.')
            } else {
                setError(err.response?.data?.message || 'Failed to load books. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }, [search, selectedGenre])

    useEffect(() => {
        const delay = setTimeout(fetchBooks, 300)
        return () => clearTimeout(delay)
    }, [fetchBooks])

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
                }}>Explore Our</p>
                <h1 style={{
                    fontFamily: 'Pinyon Script, cursive',
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#F5F0E8',
                    marginBottom: '0.5rem'
                }}>Collection</h1>
                <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: '#C9A84C',
                    margin: '0 auto'
                }} />
            </div>

            <div className="browse-content" style={{ padding: '3rem 4rem' }}>

                {/* Search Bar */}
                <div style={{
                    position: 'relative',
                    maxWidth: '500px',
                    margin: '0 auto 2.5rem'
                }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#C9A84C'
                    }} />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            borderRadius: '30px',
                            border: '2px solid rgba(201,168,76,0.3)',
                            backgroundColor: '#FFFDF7',
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '1rem',
                            color: '#1a1a1a',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={e => e.target.style.borderColor = '#C9A84C'}
                        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                    />
                </div>

                {/* Genre Filter */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.7rem',
                    justifyContent: 'center',
                    marginBottom: '3rem'
                }}>
                    {GENRES.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            style={{
                                padding: '0.4rem 1.2rem',
                                borderRadius: '20px',
                                border: '1.5px solid #C9A84C',
                                backgroundColor: selectedGenre === genre ? '#C9A84C' : 'transparent',
                                color: '#0F1F3D',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '0.95rem',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: selectedGenre === genre ? '700' : '400'
                            }}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Error State */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        backgroundColor: 'rgba(139,0,0,0.08)',
                        border: '1px solid rgba(139,0,0,0.25)',
                        borderRadius: '12px',
                        padding: '1.2rem 1.5rem',
                        maxWidth: '600px',
                        margin: '0 auto 2rem',
                    }}>
                        <AlertCircle size={22} color='#8B0000' style={{ flexShrink: 0 }} />
                        <div>
                            <p style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                color: '#8B0000',
                                fontWeight: '600',
                                marginBottom: '0.2rem'
                            }}>Something went wrong</p>
                            <p style={{
                                fontFamily: 'EB Garamond, serif',
                                fontSize: '0.95rem',
                                color: '#8B0000',
                            }}>{error}</p>
                        </div>
                        <button
                            onClick={fetchBooks}
                            style={{
                                marginLeft: 'auto',
                                backgroundColor: '#8B0000',
                                color: '#F5F0E8',
                                border: 'none',
                                padding: '0.4rem 1rem',
                                borderRadius: '20px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                flexShrink: 0,
                                letterSpacing: '1px'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <LoadingSpinner message="Browsing collection..." />
                        </div>
                    ) : books.length > 0 ? books.map((book, index) => (
                        <motion.div
                            key={book.id || book._id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.5) }}
                            style={{
                                backgroundColor: '#FFFDF7',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(201,168,76,0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)'
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
                                e.currentTarget.style.borderColor = '#C9A84C'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                            }}
                        >
                            {/* Cover */}
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => { e.target.style.backgroundColor = '#D4C9B0' }}
                                />
                            </div>

                            {/* Info */}
                            <div style={{ padding: '1.2rem' }}>
                                <span style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '0.75rem',
                                    letterSpacing: '2px',
                                    color: '#8B0000',
                                    textTransform: 'uppercase'
                                }}>{book.genre}</span>

                                <h3 style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '1.1rem',
                                    color: '#0F1F3D',
                                    margin: '0.4rem 0 0.2rem',
                                    fontWeight: '600'
                                }}>{book.title}</h3>

                                <p style={{
                                    fontFamily: 'EB Garamond, serif',
                                    fontSize: '0.9rem',
                                    color: '#6b7280',
                                    marginBottom: '1rem'
                                }}>{book.author}</p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '1.2rem',
                                        fontWeight: '700',
                                        color: '#C9A84C'
                                    }}>₹{book.price}</span>

                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <Link to={`/books/${book.id}`} style={{
                                            textDecoration: 'none',
                                            backgroundColor: '#0F1F3D',
                                            color: '#F5F0E8',
                                            padding: '0.45rem 1.2rem',
                                            borderRadius: '25px',
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '0.85rem',
                                            letterSpacing: '1px',
                                        }}>
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : !error && (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '4rem',
                            color: '#6b7280',
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '1.2rem',
                            fontStyle: 'italic'
                        }}>
                            No books found for "{search || selectedGenre}"...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Browse