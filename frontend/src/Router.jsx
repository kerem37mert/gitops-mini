import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Body from "./components/Body";
import Home from "./pages/Home";
import NewApp from "./pages/NewApp";
import Apps from "./pages/Apps";
import AppDetail from "./pages/AppDetail";
import Login from "./pages/Login";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            {user && <Header />}
            <Body>
                <ToastContainer />
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/newapp"
                        element={
                            <ProtectedRoute>
                                <NewApp />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/apps"
                        element={
                            <ProtectedRoute>
                                <Apps />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/apps/:id"
                        element={
                            <ProtectedRoute>
                                <AppDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute requireSuperuser={true}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Body>
        </BrowserRouter>
    );
};

const Router = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default Router;