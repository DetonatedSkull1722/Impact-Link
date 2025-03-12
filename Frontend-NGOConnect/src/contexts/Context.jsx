import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [drives, setDrives] = useState([]); // Store fetched events
  const [userRankings, setUserRankings] = useState([]); // Store user rankings
  const [rankingsLoading, setRankingsLoading] = useState(true); // Loading state for rankings

  useEffect(() => {
    // Decode user token from localStorage
    const token = localStorage.getItem('token');
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

  // Fetch user rankings from API
  useEffect(() => {
    const fetchUserRankings = async () => {
      setRankingsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/users/rankings');
        const data = await res.json();
        if (res.ok) {
          setUserRankings(data); // Store fetched rankings in state
        } else {
          console.error('Failed to fetch user rankings:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user rankings:', error);
      } finally {
        setRankingsLoading(false);
      }
    };

    fetchUserRankings();
    
    // Set up a refresh interval for rankings (every 5 minutes)
    const rankingsInterval = setInterval(fetchUserRankings, 300000);
    
    // Clean up interval on component unmount
    return () => clearInterval(rankingsInterval);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        userInfo, 
        setUserInfo, 
        drives, 
        userRankings, 
        rankingsLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};