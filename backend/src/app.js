import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import SignupPage from './pages/Auth/SignupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
