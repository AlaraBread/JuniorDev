import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import LoggedOutRoute from './routes/LoggedOutRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoggedOutRoute><Login /></LoggedOutRoute>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
