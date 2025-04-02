

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UpdatePost from './pages/UpdatePost';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/update/:id" element={<UpdatePost />} />
                <Route path="/" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
}

export default App;
