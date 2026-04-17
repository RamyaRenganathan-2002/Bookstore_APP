import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

function Footer() {
    return (
        <footer style={{
            backgroundColor: '#0F1F3D',
            borderTop: '2px solid #C9A84C',
            padding: '4rem 4rem 2rem',
            color: '#F5F0E8',
        }}>

            {/* Top Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '3rem',
                marginBottom: '3rem'
            }}>

                {/* Brand */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '1rem'
                    }}>
                        <BookOpen size={24} color='#C9A84C' />
                        <span style={{
                            fontFamily: 'Pinyon Script, cursive',
                            fontSize: '1.8rem',
                            color: '#F5F0E8',
                        }}>
                            The Serene Scriptorium
                        </span>
                    </div>
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        color: '#9CA3AF',
                        lineHeight: '1.8',
                        fontStyle: 'italic',
                        maxWidth: '250px'
                    }}>
                        A sanctuary for the discerning reader. Curated with care, delivered with love.
                    </p>

                    {/* Social Icons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1.5rem'
                    }}>
                        {['ig', 'tw', 'yt'].map((social, i) => (
                            <a key={i} href='#' style={{
                                color: '#9CA3AF',
                                border: '1px solid rgba(201,168,76,0.3)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none',
                                fontFamily: 'EB Garamond, serif',
                                fontSize: '0.75rem',
                                letterSpacing: '0.5px'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#C9A84C'
                                    e.currentTarget.style.color = '#C9A84C'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                                    e.currentTarget.style.color = '#9CA3AF'
                                }}
                            >
                                {social}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        color: '#C9A84C',
                        marginBottom: '1.2rem',
                        textTransform: 'uppercase'
                    }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Browse', path: '/browse' },
                            { name: 'My Cart', path: '/cart' },
                            { name: 'My Profile', path: '/profile' },
                        ].map(link => (
                            <li key={link.name} style={{ marginBottom: '0.7rem' }}>
                                <Link to={link.path} style={{
                                    textDecoration: 'none',
                                    fontFamily: 'EB Garamond, serif',
                                    fontSize: '1rem',
                                    color: '#9CA3AF',
                                    transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Genres */}
                <div>
                    <h4 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        color: '#C9A84C',
                        marginBottom: '1.2rem',
                        textTransform: 'uppercase'
                    }}>Genres</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {['Fiction', 'Mystery', 'Romance', 'Fantasy', 'Biography', 'Self Help'].map(genre => (
                            <li key={genre} style={{ marginBottom: '0.7rem' }}>
                                <Link to={`/browse?genre=${genre}`} style={{
                                    textDecoration: 'none',
                                    fontFamily: 'EB Garamond, serif',
                                    fontSize: '1rem',
                                    color: '#9CA3AF',
                                    transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                                >
                                    {genre}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '2px',
                        color: '#C9A84C',
                        marginBottom: '1.2rem',
                        textTransform: 'uppercase'
                    }}>Newsletter</h4>
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        color: '#9CA3AF',
                        lineHeight: '1.7',
                        marginBottom: '1rem',
                        fontStyle: 'italic'
                    }}>
                        Subscribe for new arrivals and literary recommendations.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            placeholder="Your email..."
                            style={{
                                flex: 1,
                                padding: '0.6rem 1rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(201,168,76,0.3)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: '#F5F0E8',
                                fontFamily: 'EB Garamond, serif',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                        <button style={{
                            backgroundColor: '#C9A84C',
                            color: '#0F1F3D',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '20px',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            letterSpacing: '1px'
                        }}>
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{
                borderTop: '1px solid rgba(201,168,76,0.2)',
                paddingTop: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <p style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    fontStyle: 'italic'
                }}>
                    © 2025 The Serene Scriptorium. All rights reserved.
                </p>
                <p style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    fontStyle: 'italic'
                }}>
                    Crafted with ❤️ for book lovers
                </p>
            </div>

        </footer>
    )
}

export default Footer