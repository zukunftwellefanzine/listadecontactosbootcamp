import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContactProvider } from './context/ContactContext';
import { Contacts } from './pages/Contacts';
import { AddContact } from './pages/AddContact';

function App() {
  return (
    <ContactProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Contacts />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/add-contact/:id" element={<AddContact />} />
          </Routes>
        </div>
      </Router>
    </ContactProvider>
  );
}

export default App;