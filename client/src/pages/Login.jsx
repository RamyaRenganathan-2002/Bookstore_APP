import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import useStore from '../store/useStore'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const login = useStore(state => state.login)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Login | The Serene Scriptorium"
    }, [])

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields.')
            return
        }
        try {
            setError('')
            setLoading(true)
            const res = await api.post('/auth/login', { email, password })
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to the server. Please try again later.')
            } else {
                setError(err.response?.data?.message || 'Invalid email or password.')
            }
        } finally {
            setLoading(false)
        }
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
                    }}>Welcome Back</h1>
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>Sign in to your sanctuary</p>
                    <div style={{
                        width: '40px',
                        height: '2px',
                        backgroundColor: '#C9A84C',
                        margin: '1rem auto 0'
                    }} />
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {/* Email */}
                    <div>
                        <label style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '0.9rem',
                            letterSpacing: '1.5px',
                            color: '#0F1F3D',
                            display: 'block',
                            marginBottom: '0.4rem',
                            textTransform: 'uppercase'
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
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
                                boxSizing: 'border-box',
                                transition: 'border 0.2s ease'
                            }}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '0.9rem',
                            letterSpacing: '1.5px',
                            color: '#0F1F3D',
                            display: 'block',
                            marginBottom: '0.4rem',
                            textTransform: 'uppercase'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                                boxSizing: 'border-box',
                                transition: 'border 0.2s ease'
                            }}
                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                        />
                    </div>

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
                        onClick={handleLogin}
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
                            <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                        ) : 'Sign In'}
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

                    {/* Register Link */}
                    <p style={{
                        textAlign: 'center',
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '1rem',
                        color: '#6b7280'
                    }}>
                        New to our sanctuary?{' '}
                        <Link to="/register" style={{
                            color: '#C9A84C',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Join Us
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login