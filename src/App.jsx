import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';
import RentVsBuyCalculator from './projects/RentVsBuyCalculator';
import CommuteCostCalculator from './projects/CommuteCostCalculator';
import LifestyleInflationCalculator from './projects/LifestyleInflationCalculator';
import AIVisibilityTester from './projects/AIVisibilityTester';
import QuizApp from './Chatbot';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/ai-visibility" element={<AIVisibilityTester />} />
        <Route path="/projects/rent-vs-buy" element={<RentVsBuyCalculator />} />
        <Route path="/projects/commute-calculator" element={<CommuteCostCalculator />} />
        <Route path="/projects/lifestyle-inflation" element={<LifestyleInflationCalculator />} />
        <Route path="/chat" element={<QuizApp />} />
        {/* Redirect any unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;