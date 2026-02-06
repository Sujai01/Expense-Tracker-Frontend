import { createContext, useState, useCallback, useMemo } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        // Force a hard reload to clear React's internal "lanes"
        window.location.href = "/login";
    }, []);

    // useMemo is CRITICAL here. It prevents the context from "jumping" 
    // during navigation.
    const value = useMemo(() => ({
        user,
        setUser,
        logout
    }), [user, logout]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}