import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, BookOpen, Menu, X } from 'lucide-react'
import useStore from '../store/useStore'

function Navbar() {
    const location = useLocation()
    const user = useStore(state => state.user)
    const logout = useStore(state => state.logout)
    const cart = useStore(state => state.cart)
    const [mobileOpen, setMobileOpen] = useState(false)

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Browse', path: '/browse' },
    ]

    const isActive = (path) => location.pathname === path

    const closeMobile = () => setMobileOpen(false)

    return (
        <nav>
            {/* Main bar */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '1.1rem 3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 3px 25px rgba(0,0,0,0.5)',
                borderBottom: '2px solid #C9A84C'
            }}>

                {/* Logo */}
                <Link to="/" onClick={closeMobile} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    textDecoration: 'none',
                    flexShrink: 0,
                }}>
                    <BookOpen size={28} color='#C9A84C' />
                    <span style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                        fontWeight: '400',
                        color: '#F5F0E8',
                        letterSpacing: '2px',
                    }}>
                        The Serene Scriptorium
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="navbar-links">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(link.path) ? '#C9A84C' : '#D4C9B0',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                letterSpacing: '2px',
                                borderBottom: isActive(link.path) ? '2px solid #C9A84C' : '2px solid transparent',
                                paddingBottom: '3px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem'
                }}>
                    {/* Cart */}
                    <Link to="/cart" onClick={closeMobile} style={{
                        position: 'relative',
                        textDecoration: 'none',
                        color: '#D4C9B0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <ShoppingCart size={22} />
                        {totalQuantity > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: '#C9A84C',
                                color: '#0F1F3D',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>{totalQuantity}</span>
                        )}
                    </Link>

                    {/* Desktop User Area */}
                    <div className="navbar-links">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/profile" style={{
                                    textDecoration: 'none',
                                    border: '1.5px solid #C9A84C',
                                    color: '#C9A84C',
                                    padding: '0.45rem 1.3rem',
                                    borderRadius: '25px',
                                    fontSize: '0.8rem',
                                    fontFamily: 'Cinzel, serif',
                                    letterSpacing: '1.5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}>
                                    <User size={15} />
                                    {user.name.split(' ')[0]}
                                </Link>
                                <button
                                    onClick={logout}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1.5px solid #8B0000',
                                        color: '#8B0000',
                                        padding: '0.45rem 1rem',
                                        borderRadius: '25px',
                                        fontSize: '0.8rem',
                                        fontFamily: 'Cinzel, serif',
                                        letterSpacing: '1px',
                                        cursor: 'pointer'
                                    }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                backgroundColor: 'transparent',
                                border: '1.5px solid #C9A84C',
                                color: '#C9A84C',
                                padding: '0.45rem 1.3rem',
                                borderRadius: '25px',
                                fontSize: '0.8rem',
                                fontFamily: 'Cinzel, serif',
                                letterSpacing: '1.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s ease'
                            }}>
                                <User size={15} />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Hamburger Button (mobile only) */}
                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="navbar-mobile-menu" style={{ position: 'sticky', top: '68px', zIndex: 99 }}>
                    {navLinks.map(link => (
                        <Link key={link.name} to={link.path} onClick={closeMobile}
                            style={{ color: isActive(link.path) ? '#C9A84C' : '#D4C9B0' }}>
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/profile" onClick={closeMobile} style={{ color: '#C9A84C' }}>
                                <User size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={() => { logout(); closeMobile() }} style={{ color: '#f87171' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMobile} style={{ color: '#C9A84C' }}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar