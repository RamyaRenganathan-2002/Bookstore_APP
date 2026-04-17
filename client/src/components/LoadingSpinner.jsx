function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
    if (fullPage) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                backgroundColor: '#F5F0E8',
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    border: '4px solid rgba(201,168,76,0.2)',
                    borderTop: '4px solid #C9A84C',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.2rem',
                    color: '#0F1F3D',
                    letterSpacing: '2px',
                }}>{message}</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '3rem',
            width: '100%',
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(201,168,76,0.2)',
                borderTop: '3px solid #C9A84C',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                color: '#0F1F3D',
                letterSpacing: '1.5px',
            }}>{message}</p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default LoadingSpinner
