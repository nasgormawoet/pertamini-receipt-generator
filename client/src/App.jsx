import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import ReceiptGenerator from './pages/ReceiptGenerator.jsx'
import Footer from './components/layouts/Footer.jsx'

function App() {
  return (
      <div>
        <ReceiptGenerator />
          <Footer />
      </div>
  );
}
export default App
