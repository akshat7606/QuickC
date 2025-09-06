import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchScreen from './components/SearchScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import MoreScreen from './components/MoreScreen';
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
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/more" element={<MoreScreen />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
