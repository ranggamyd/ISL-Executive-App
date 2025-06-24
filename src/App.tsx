import React from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/Auth/LoginPage";
import SalesPage from "./pages/Sales/SalesPage";
import HomePage from "./pages/Dashboard/HomePage";
import { Layout } from "./components/Layout/Layout";
import ProfilePage from "./pages/Profile/ProfilePage";
import EmployeePage from "./pages/Employee/EmployeePage";
import RecruitmentPage from "./pages/Recruitment/RecruitmentPage";
import { Detail as CandidateDetailPage } from "./pages/Recruitment/Detail";
import { Detail as EmployeeDetailPage } from "./pages/Employee/Employee/Detail";
import { ThemeProvider } from "./contexts/ThemeContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (user) return <Navigate to="/" replace />;

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <Router basename="/exec" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <LoginPage />
                                    </PublicRoute>
                                }
                            />

                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<HomePage />} />
                                <Route path="/dashboard" element={<HomePage />} />
                                <Route path="/recruitment" element={<RecruitmentPage />} />
                                <Route path="/recruitment/candidateDetail" element={<CandidateDetailPage />} />
                                <Route path="/sales" element={<SalesPage />} />
                                <Route path="/employee" element={<EmployeePage />} />
                                <Route path="/employee/employeeDetail" element={<EmployeeDetailPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
