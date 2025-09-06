import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchScreen from './components/SearchScreen';
import ResultsScreen from './components/ResultsScreen';
import BookingScreen from './components/BookingScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/booking" element={<BookingScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
          <Navigation />
        </div>
      </div>
    </Router>
  );
}

export default App
