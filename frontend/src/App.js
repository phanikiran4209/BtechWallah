import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Clients from "./components/Clients";
import Projects from "./components/Projects";
import Invoices from "./components/Invoices";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;