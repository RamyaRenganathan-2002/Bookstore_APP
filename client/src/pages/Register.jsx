import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import useStore from '../store/useStore'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const navigate = useNavigate()
    const login = useStore(state => state.login)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Join the Sanctuary | The Serene Scriptorium"
    }, [])

    const handleRegister = async () => {
        if (!name || !email || !password || !confirm) {
            setError('Please fill in all fields.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match!')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        try {
            setError('')
            setLoading(true)
            await api.post('/auth/register', { name, email, password })
            const res = await api.post('/auth/login', { email, password })
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to the server. Please try again later.')
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
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
        fontSize: '0.9rem',
        letterSpacing: '1.5px',
        color: '#0F1F3D',
        display: 'block',
        marginBottom: '0.4rem',
        textTransform: 'uppercase'
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F0E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    backgroundColor: '#FFFDF7',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '16px',
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <BookOpen size={32} color='#C9A84C' />
                    <h1 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: '2.5rem',
                        color: '#0F1F3D',
                        margin: '0.5rem 0 0.2rem'
                    }}>Join Us</h1>
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>Create your sanctuary account</p>
                    <div style={{
                        width: '40px',
                        height: '2px',
                        backgroundColor: '#C9A84C',
                        margin: '1rem auto 0'
                    }} />
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    {/* Name */}
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

                    {/* Register Button */}
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(139,0,0,0.08)',
                            border: '1px solid rgba(139,0,0,0.2)',
                            borderRadius: '8px',
                            padding: '0.7rem 1rem',
                        }}>
                            <p style={{
                                fontFamily: 'EB Garamond, serif',
                                fontSize: '0.95rem',
                                color: '#8B0000',
                            }}>{error}</p>
                        </div>
                    )}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#2a3d5c' : '#0F1F3D',
                            color: '#F5F0E8',
                            border: 'none',
                            padding: '0.85rem',
                            borderRadius: '30px',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '1.1rem',
                            letterSpacing: '2px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                        }}
                    >
                        {loading ? (
                            <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating Account...</>
                        ) : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        margin: '0.5rem 0'
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(201,168,76,0.3)' }} />
                        <span style={{
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '0.85rem',
                            color: '#9CA3AF',
                            fontStyle: 'italic'
                        }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(201,168,76,0.3)' }} />
                    </div>

                    {/* Login Link */}
                    <p style={{
                        textAlign: 'center',
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '1rem',
                        color: '#6b7280'
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{
                            color: '#C9A84C',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Register