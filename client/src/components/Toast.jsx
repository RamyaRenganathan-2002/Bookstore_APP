import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const toastListeners = []

export function showToast(message, type = 'success') {
    toastListeners.forEach(fn => fn({ message, type, id: Date.now() }))
}

function Toast() {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        const handler = (toast) => {
            setToasts(prev => [...prev, toast])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id))
            }, 4000)
        }
        toastListeners.push(handler)
        return () => {
            const idx = toastListeners.indexOf(handler)
            if (idx > -1) toastListeners.splice(idx, 1)
        }
    }, [])

    const icons = {
        success: <CheckCircle size={18} />,
        error: <XCircle size={18} />,
        info: <AlertCircle size={18} />,
    }

    const colors = {
        success: { bg: '#1B4332', border: 'rgba(27,67,50,0.4)', icon: '#4ade80' },
        error: { bg: '#4A0000', border: 'rgba(139,0,0,0.4)', icon: '#f87171' },
        info: { bg: '#0F1F3D', border: 'rgba(201,168,76,0.4)', icon: '#C9A84C' },
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            pointerEvents: 'none',
        }}>
            {toasts.map(toast => {
                const c = colors[toast.type] || colors.info
                return (
                    <div
                        key={toast.id}
                        style={{
                            backgroundColor: c.bg,
                            border: `1px solid ${c.border}`,
                            borderLeft: `4px solid ${c.icon}`,
                            borderRadius: '10px',
                            padding: '0.8rem 1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.7rem',
                            color: '#F5F0E8',
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '1rem',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                            animation: 'slideInToast 0.3s ease',
                            pointerEvents: 'all',
                            maxWidth: '340px',
                            minWidth: '220px',
                        }}
                    >
                        <span style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</span>
                        <span style={{ flex: 1, lineHeight: '1.4' }}>{toast.message}</span>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9CA3AF',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                )
            })}
            <style>{`
                @keyframes slideInToast {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

export default Toast
