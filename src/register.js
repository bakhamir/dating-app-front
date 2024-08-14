import React, { useState } from 'react';
import axios from 'axios';
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [profileId, setProfileId] = useState('');
  const [subPlanId, setSubPlanId] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [img, setImg] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Создаем объект FormData
    const formData = new FormData();
    formData.append('email', email);
    formData.append('userName', userName);
    formData.append('password', password);
    formData.append('phoneNum', phoneNum);
    formData.append('profileId', profileId);
    formData.append('subPlanId', subPlanId);
    formData.append('sex', sex);
    formData.append('age', age);
    if (img) {
      formData.append('img', img);
    }

    try {
      // Отправляем POST запрос на сервер
      const response = await axios.post('http://dating-app:81/public/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Обработка успешного ответа
   

      // console.log(response);
      window.localStorage.setItem("authToken",response.data.token);
      setSuccess('Registration successful!');
      
      
      navigate("/dashboard"); 

      

    } catch (err) {
      // Обработка ошибки
      
      if (err.response && err.response.status === 422) {
        setError(`Registration failed: ${err.response.data.error}`);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-800">
      <h2 className="text-3xl font-bold mb-6">Register</h2>
      <form className="bg-white p-8 rounded-lg shadow-lg" onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userName"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNum">
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNum"
            type="text"
            placeholder="Phone Number"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileId">
            Profile ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="profileId"
            type="text"
            placeholder="Profile ID"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subPlanId">
            Subscription Plan ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subPlanId"
            type="text"
            placeholder="Subscription Plan ID"
            value={subPlanId}
            onChange={(e) => setSubPlanId(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sex">
            Sex
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="sex"
            type="text"
            placeholder="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
            Age
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="age"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="img">
            Profile Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="img"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
