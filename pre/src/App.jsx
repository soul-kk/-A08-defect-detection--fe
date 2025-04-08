import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Statistics from './pages/statistics';
import Detection from './pages/detection';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='detection' element={<Detection />} />
        <Route path='/statistics' element={<Statistics />} />
      </Routes>
    </Router>
  );
}