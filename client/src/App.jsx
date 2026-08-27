import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import ReceiptGenerator from './ReceiptGenerator.jsx'
import Footer from './Footer.jsx'

function App() {
  return (
      <div>
        <ReceiptGenerator />
          <Footer />
      </div>
  );
}
export default App
