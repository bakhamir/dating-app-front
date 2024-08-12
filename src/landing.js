import React from 'react';
import { Link } from 'react-router-dom';

function AffinityLandingPage() {
  return (
    <div   className="flex flex-row-reverse justify-center items-center h-screen bg-gray-100 text-gray-800 bg-gradient-to-r from-pink-500 to-purple-500 text-gray-800" >
      <div   className = "flex flex-col ">
      <header  className ="mb-12 text-center">
        <h1  className ="text-6xl font-bold text-white">Cupid</h1>
        <p  className ="text-xl mt-4 text-white">Get lovestruck, one match a time</p>
      </header>

      <div  className="flex space-x-6">
        <Link to="/login">
          <button  className="px-8 py-4 bg-pink-600 text-white rounded-lg text-lg hover:bg-pink-700 transition-colors duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button   className="px-8 py-4 bg-pink-600 text-white rounded-lg text-lg hover:bg-pink-700 transition-colors duration-300">
            Register
          </button>
        </Link>
      </div>
      </div>

    </div>
    
    
  );
}

function navigateTo(path) {
  window.location.href = path;
}

export default AffinityLandingPage;
