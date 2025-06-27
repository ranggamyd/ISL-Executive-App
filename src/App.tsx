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
    const { user, menus, loading } = useAuth();

    const { canAccess } = useUserAccess();

    if (loading) return <LoadingScreen />;

    const routeConfigs: {
        key: number;
        path: string;
        component: React.LazyExoticComponent<React.ComponentType<any>>;
        protected: boolean;
        permissionName?: string; // optional, cuma dipake kalo protected
    }[] = [
        ...[...new Set((menus ?? []).map(m => m.group))].map((group, index) => ({
            key: index,
            path: `/${group}`,
            component: lazyImport(`/${group}`),
            protected: false,
        })),
        ...(menus ?? []).map((menu, index) => ({
            key: index,
            path: menu.path,
            component: lazyImport(menu.path),
            protected: true,
            permissionName: menu.name,
        })),
    ];

    return (
        <Router basename="/exec/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

                <Route path="/" element={!user ? <Navigate to="/login" replace /> : <Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/dashboard" element={<HomePage />} />

                    {routeConfigs.map(({ key, path, component: Component, protected: isProtected, permissionName }) => (
                        <Route
                            key={key}
                            path={path}
                            element={
                                isProtected && !canAccess(permissionName!, "view") ? (
                                    <Forbidden />
                                ) : (
                                    <ErrorBoundary>
                                        <Suspense fallback={<LoadingScreen />}>
                                            <Component />
                                        </Suspense>
                                    </ErrorBoundary>
                                )
                            }
                        />
                    ))}

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
