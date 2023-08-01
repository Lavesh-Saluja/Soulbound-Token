import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import Uid from './pages/uid';

const App = () => {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Uid></Uid>} />
        </Routes>
    </BrowserRouter>
  );
};



export default App;
