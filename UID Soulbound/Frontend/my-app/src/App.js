import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Uid from './pages/uid';

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Uid></Uid>} />
        </Routes>
    </BrowserRouter>
  );
};



export default App;
