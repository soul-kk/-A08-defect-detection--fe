import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/home';
import Statistics from './component/statistics';
import Detection from './component/detection';


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