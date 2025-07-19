import React from 'react';
import './App.css';
import Home from './Home'
import Header from './Header'
import Footer from './Footer'
import SearchPage from './SearchPage'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
        <div>
            <Router>
            {/* <div style={{
                padding: '20px',
                backgroundColor: '#f0f0f0',
                border: '2px solid red',
                textAlign: 'center'
            }}>
                <h1 style={{ color: 'red' }}>✅ App.jsx is working!</h1>
                <p>If you see this, App.jsx is running correctly.</p>
            </div> */}
            <Header />
            
            <Routes>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
            
            <Footer />
            </ Router>
        </div>
        </>
    );
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Header from './Header'
// import airbnbLogo from './assets/airbnb-logo.png';

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//             <Link to='/'>
//                 <img
//                     className="header__icon"
//                     src={airbnbLogo}
//                     alt=""
//                 />
//             </Link>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App