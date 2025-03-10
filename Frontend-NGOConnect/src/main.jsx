import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import NGORegister from './pages/NGORegister.jsx'
import UserRegister from './pages/UserRegister.jsx'
import './index.css'

// Extend the theme to use a dark mode and customize colors
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      primary: "#3182CE", // blue shade
      secondary: "#E53E3E", // red shade
      accent: "#805AD5", // purple shade
    },
    bg: {
      primary: "#171923", // dark background
      secondary: "#1A202C", // slightly lighter
      card: "#2D3748", // for cards/elements
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
        }
      }
    }
  },
  styles: {
    global: {
      body: {
        bg: "#171923",
        color: "white",
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/dashboard" element={<App />} />
          <Route path="/ngoregister" element={<NGORegister />} />
          <Route path="/userregister" element={<UserRegister />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)
