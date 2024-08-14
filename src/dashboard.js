import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {

    
    try {
        const response = await axios.post('http://dating-app:81/public/api/getImage', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // Сохранение токена в localStorage
        window.localStorage.setItem("authToken", response.data.token);
        
        // Обновление состояний
        setSuccess('Login successful!');
        setError('');
        
        // Перенаправление
        navigate("/dashboard");
  
      } catch (err) {
        if (err.response && err.response.status === 422) {
          setError(`Login failed: ${err.response.data.error}`);
        } else {
          setError('Login failed. Please try again.');
        }
        

  return (
   


  <div class="mt-6  text-4xl max-w-screen-x3 text-white flex flex-wrap items-center justify-center mx-auto my-auto p-4 bg-gradient-to-r from-pink-500 to-purple-500">
  <div> Cupid</div>
  </div>


  );
}

function navigateTo(path) {
  window.location.href = path;
}

export default Dashboard;
