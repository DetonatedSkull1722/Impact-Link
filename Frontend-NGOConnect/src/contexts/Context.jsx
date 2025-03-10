import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [drives, setDrives] = useState([]); // Store fetched events

  useEffect(() => {
    // Decode user token from sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserInfo(null);
      }
    }
  }, []);

  // Fetch drives from API
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/drives/get');
        const data = await res.json();
        if (res.ok) {
          setDrives(data); // Store fetched events in state
        } else {
          console.error('Failed to fetch drives:', data.error);
        }
      } catch (error) {
        console.error('Error fetching drives:', error);
      }
    };

    fetchDrives();
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, drives }}>
      {children}
    </AuthContext.Provider>
  );
};
