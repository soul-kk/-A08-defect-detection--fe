import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Detection from './component/detection';
import Statistics from './component/statistics';

export default function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Detection />} />
        <Route path='/statistics' element={<Statistics />} />
      </Routes>
    </Router>
  );
}