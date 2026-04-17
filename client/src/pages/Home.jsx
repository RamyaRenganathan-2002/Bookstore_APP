import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import api from '../lib/api'
import useStore from '../store/useStore'

function Home() {
    const genreTrackRef = useRef(null)
    const [featuredBooks, setFeaturedBooks] = useState([])
    const addToCart = useStore(state => state.addToCart)
    const [addedBookId, setAddedBookId] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "The Serene Scriptorium | Home"
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/books')
                setFeaturedBooks(res.data.slice(0, 4))
            } catch (err) {
                console.error('Failed to fetch featured books', err)
            }
        }
        fetchFeatured()
    }, [])

    useEffect(() => {
        let offset = 0
        let genreFullyVisible = false
        const track = genreTrackRef.current
        const genreSection = track?.closest('section')

        // Watch when genre section enters/leaves viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                genreFullyVisible = entry.isIntersecting
            },
            { threshold: 0.99 }
        )

        if (genreSection) observer.observe(genreSection)

        const handleWheel = (e) => {
            if (!track || !genreFullyVisible) return

            const fullScroll = track.scrollWidth / 2

            if (offset <= 0 && e.deltaY < 0) return
            if (offset >= fullScroll && e.deltaY > 0) return

            e.preventDefault()
            e.stopPropagation()

            offset += e.deltaY * 0.3
            offset = Math.max(0, Math.min(fullScroll, offset))
            track.style.transform = `translateX(-${offset}px)`

            if (window.__lenis) {
                window.__lenis.stop()
                clearTimeout(window.__lenisTimeout)
                window.__lenisTimeout = setTimeout(() => {
                    window.__lenis.start()
                }, 50)
            }
        }

        window.addEventListener('wheel', handleWheel, { passive: false })
        return () => {
            window.removeEventListener('wheel', handleWheel)
            observer.disconnect()
        }
    }, [])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div>
            {/* Hero Section */}
            <section style={{
                minHeight: '90vh',
                backgroundColor: '#F5F0E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                padding: '4rem 2rem',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(ellipse at top, rgba(15,31,61,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                {/* Golden line top */}
                <div style={{
                    width: '80px',
                    height: '2px',
                    backgroundColor: '#C9A84C',
                    marginBottom: '1.5rem'
                }} />

                {/* Subtitle */}
                <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1rem',
                    letterSpacing: '4px',
                    color: '#8B0000',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    Welcome to
                </p>

                {/* Main Title */}
                <h1 style={{
                    fontFamily: 'Pinyon Script, cursive',
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    color: '#0F1F3D',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.1)'
                }}>
                    The Serene Scriptorium
                </h1>

                {/* Golden line bottom */}
                <div style={{
                    width: '80px',
                    height: '2px',
                    backgroundColor: '#C9A84C',
                    marginBottom: '1.5rem'
                }} />

                {/* Tagline */}
                <p style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    color: '#4a4a4a',
                    maxWidth: '600px',
                    lineHeight: '1.8',
                    marginBottom: '2.5rem',
                    fontStyle: 'italic'
                }}>
                    A sanctuary for the discerning reader. Discover timeless works,
                    rare finds, and beloved classics curated with the utmost care.
                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <Link to="/browse" style={{
                        textDecoration: 'none',
                        backgroundColor: '#0F1F3D',
                        color: '#F5F0E8',
                        padding: '0.8rem 2.5rem',
                        borderRadius: '30px',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        border: '2px solid #0F1F3D',
                        transition: 'all 0.3s ease'
                    }}>
                        Browse Collection
                    </Link>

                    <Link to="/register" style={{
                        textDecoration: 'none',
                        backgroundColor: 'transparent',
                        color: '#0F1F3D',
                        padding: '0.8rem 2.5rem',
                        borderRadius: '30px',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        border: '2px solid #C9A84C',
                        transition: 'all 0.3s ease'
                    }}>
                        Join Us
                    </Link>
                </div>
            </section>

            {/* Featured Books Section */}
            <section style={{
                padding: '5rem 4rem',
                backgroundColor: '#1B4332',
            }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '0.9rem',
                        letterSpacing: '4px',
                        color: '#C9A84C',
                        textTransform: 'uppercase',
                        marginBottom: '0.8rem'
                    }}>Handpicked For You</p>
                    <h2 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#F5F0E8',
                    }}>Featured Books</h2>
                    <div style={{
                        width: '60px',
                        height: '2px',
                        backgroundColor: '#C9A84C',
                        margin: '1rem auto 0'
                    }} />
                </div>

                {/* Book Cards Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                    {featuredBooks.map((book, index) => (
                        <motion.div
                            key={book.title}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                            viewport={{ once: true, amount: 0.2 }}
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
                            {/* Book Cover */}
                            <div style={{ height: '260px', overflow: 'hidden' }}>
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>

                            {/* Book Info */}
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
                                    fontSize: '1.2rem',
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
                                    }}>{'₹'}{book.price}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            addToCart(book, 1)
                                            setAddedBookId(book.id)
                                            setTimeout(() => setAddedBookId(null), 1500)
                                        }}
                                        style={{
                                            backgroundColor: addedBookId === book.id ? '#1B4332' : '#0F1F3D',
                                            color: '#F5F0E8',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontFamily: 'Cormorant Garamond, serif',
                                            fontSize: '0.85rem',
                                            letterSpacing: '1px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                    >
                                        {addedBookId === book.id ? '✓ Added' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/browse" style={{
                        textDecoration: 'none',
                        border: '2px solid #0F1F3D',
                        color: '#F5F0E8',
                        padding: '0.8rem 2.5rem',
                        borderRadius: '30px',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        transition: 'all 0.3s ease'
                    }}>
                        View All Books
                    </Link>
                </div>
            </section>

            {/* Genre Section */}
            <section style={{
                padding: '8rem 5rem',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#4A0000',
            }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '0.9rem',
                        letterSpacing: '4px',
                        color: '#C9A84C',
                        textTransform: 'uppercase',
                        marginBottom: '0.8rem'
                    }}>Explore By</p>
                    <h2 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#F5F0E8',
                    }}>Genre</h2>
                    <div style={{
                        width: '60px',
                        height: '2px',
                        backgroundColor: '#C9A84C',
                        margin: '1rem auto 0'
                    }} />
                </div>

                {/* Genre Cards */}
                {/* Scrolling Track Wrapper */}
                <div style={{
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    whiteSpace: 'nowrap'
                }}>

                    {/* Scrolling Track */}
                    <div
                        ref={genreTrackRef}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            gap: '2rem',
                            width: 'max-content',
                            transition: 'transform 0.1s linear',
                            paddingBottom: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        {[...Array(2)].map((_, repeatIndex) => (
                            [
                                { name: 'Fiction', icon: '📖', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80' },
                                { name: 'Mystery', icon: '🔍', image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=300&q=80' },
                                { name: 'Romance', icon: '🌹', image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&q=80' },
                                { name: 'Fantasy', icon: '🧙', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80' },
                                { name: 'History', icon: '🏛️', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80' },
                                { name: 'Science', icon: '🔬', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=300&q=80' },
                                { name: 'Self Help', icon: '✨', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80' },
                                { name: 'Biography', icon: '👤', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80' },
                                { name: 'Classics', icon: '🏺', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80' },
                                { name: 'Travel', icon: '🌍', image: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=300&q=80' },
                                { name: 'Comedy', icon: '😄', image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=300&q=80' },
                                { name: 'Languages', icon: '🗣️', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80' },
                            ].map((genre) => (
                                <Link
                                    key={`${repeatIndex}-${genre.name}`}
                                    to={`/browse?genre=${genre.name}`}
                                    style={{ textDecoration: 'none', flexShrink: 0 }}
                                >
                                    <div style={{
                                        width: '160px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 0 0 2px #C9A84C, 0 0 15px rgba(201,168,76,0.4)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.boxShadow = '0 0 0 2px #E8C97A, 0 0 25px rgba(201,168,76,0.6)'
                                            e.currentTarget.style.transform = 'translateY(-6px)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.boxShadow = '0 0 0 2px #C9A84C, 0 0 15px rgba(201,168,76,0.4)'
                                            e.currentTarget.style.transform = 'translateY(0)'
                                        }}
                                    >
                                        <div style={{ height: '180px', overflow: 'hidden' }}>
                                            <img
                                                src={genre.image}
                                                alt={genre.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div style={{
                                            backgroundColor: '#F5F0E8',
                                            padding: '0.8rem',
                                            textAlign: 'center',
                                        }}>
                                            <span style={{ fontSize: '1rem', marginRight: '0.3rem' }}>{genre.icon}</span>
                                            <p style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '0.9rem',
                                                letterSpacing: '1px',
                                                color: '#0F1F3D',
                                                display: 'inline'
                                            }}>{genre.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home