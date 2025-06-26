import React, { Suspense } from "react";
import { lazyImport } from "./utils/lazyImport";
import { useUserAccess } from "./hooks/useUserAccess";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/Dashboard/HomePage";
import { Layout } from "./components/Layout/Layout";
import ProfilePage from "./pages/Profile/ProfilePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingScreen from "./components/Common/LoadingScreen";

const AppRouter: React.FC = () => {
    const { user, menus, permissions, loading } = useAuth();

    const { canAccess } = useUserAccess();

    if (loading) return <LoadingScreen />;

    return (
        <Router basename="/exec/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

                <Route path="/" element={!user ? <Navigate to="/login" replace /> : <Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/dashboard" element={<HomePage />} />
                    {[...(menus ?? []).map(menu => menu.path), ...[...new Set((menus ?? []).map(menu => menu.group))].filter(group => !menus?.some(menu => menu.path === group))].map(routePath => {
                        const LazyComponent = lazyImport(routePath);

                        const menuKey = routePath.split("/").pop() || "";

                        const isProtected = permissions?.some(p => p.menu === menuKey);
                        const isAllowed = !isProtected || canAccess(menuKey, "view");

                        return (
                            <Route
                                key={routePath}
                                path={routePath}
                                element={
                                    !isAllowed ? (
                                        <Forbidden />
                                    ) : (
                                        <ErrorBoundary>
                                            <Suspense fallback={<LoadingScreen />}>
                                                <LazyComponent />
                                            </Suspense>
                                        </ErrorBoundary>
                                    )
                                }
                            />
                        );
                    })}

                    <Route path="/profile" element={<ProfilePage />} />

                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
