import React, { Suspense } from "react";
import { lazyImport } from "./utils/lazyImport";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/Dashboard/HomePage";
import { Layout } from "./components/Layout/Layout";
import ProfilePage from "./pages/Profile/ProfilePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingScreen from "./components/Common/LoadingScreen";

const AppRouter: React.FC = () => {
    const { user, menus } = useAuth();

    return (
        <Router basename="/exec/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

                <Route path="/" element={!user ? <Navigate to="/login" replace /> : <Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/dashboard" element={<HomePage />} />
                    {menus?.map(menu => {
                        const LazyComponent = lazyImport(menu.path);
                        return (
                            <Route
                                key={menu.path}
                                path={menu.path}
                                element={
                                    <ErrorBoundary>
                                        <Suspense fallback={<LoadingScreen />}>
                                            <LazyComponent />
                                        </Suspense>
                                    </ErrorBoundary>
                                }
                            />
                        );
                    })}
                    <Route path="/profile" element={<ProfilePage />} />
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
