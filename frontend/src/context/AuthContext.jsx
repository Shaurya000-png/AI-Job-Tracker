import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        setUser(response.data.user);
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        setUser(response.data.user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updateUserProfile = async (profileData) => {
        const response = await authService.updateProfile(profileData);
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return response;
    };

    const updateUserPreferences = async (preferences) => {
        const response = await authService.updatePreferences(preferences);
        const updatedUser = { ...user, preferences: response.data.preferences };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return response;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        updateUserPreferences,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
