import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireSuperuser = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white'
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireSuperuser && user.role !== 'superuser') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
