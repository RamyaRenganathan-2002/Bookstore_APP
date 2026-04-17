import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | The Serene Scriptorium"
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '70vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
        Oops! This chapter hasn't been written yet.
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', maxWidth: '500px' }}>
        The book or page you are looking for seems to have been misplaced in our library. 
        Let's get you back to the main collection.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '0.8rem 2rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '600',
          transition: 'transform 0.2s ease',
          boxShadow: '0 4px 12px rgba(139, 0, 0, 0.2)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Return to Home
      </Link>
    </div>
  )
}

export default NotFound
