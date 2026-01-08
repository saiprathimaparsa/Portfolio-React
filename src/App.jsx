import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import RentVsBuyCalculator from './projects/RentVsBuyCalculator';
import CommuteCostCalculator from './projects/CommuteCostCalculator';
import LifestyleInflationCalculator from './projects/LifestyleInflationCalculator';
import QuizApp from './Chatbot';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
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