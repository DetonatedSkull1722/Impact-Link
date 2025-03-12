import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import NGORegister from './pages/NGORegister.jsx';
import UserRegister from './pages/UserRegister.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import ParticipateEvents from './pages/ParticipateEvents.jsx';
import EventDetails from './pages/EventDetails.jsx';
import './index.css';
import { AuthProvider } from './contexts/Context.jsx';
import RankingsPage from './pages/RankingsPage.jsx';
import NGOSummary from './pages/NGOSummary.jsx';


const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      primary: "#0EA5E9", // bright blue
      secondary: "#F43F5E", // vivid pink/red
      accent: "#8B5CF6", // rich purple
    },
    bg: {
      primary: "#0F172A", // very dark blue-gray
      secondary: "#1E293B", // slightly lighter blue-gray
      card: "#334155", // mid blue-gray for cards
    },
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '12px',
      },
    },
    Box: {
      baseStyle: {
        borderRadius: '16px',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '16px',
          overflow: 'hidden',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)", // Subtle gradient
        backgroundAttachment: "fixed", // Keeps the gradient fixed during scroll
        color: "white",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={<App />} />
            <Route path="/ngoregister" element={<NGORegister />} />
            <Route path="/userregister" element={<UserRegister />} />
            <Route path="/createevent" element={<CreateEvent />} />
            <Route path="/participate" element={<ParticipateEvents />} />
            <Route path="/participate/:id" element={<EventDetails />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/ngoSummary" element ={<NGOSummary/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
