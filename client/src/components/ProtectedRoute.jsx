import { Navigate } from 'react-router-dom'
import useStore from '../store/useStore'

function ProtectedRoute({ children, adminOnly = false }) {
    const user = useStore(state => state.user)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute