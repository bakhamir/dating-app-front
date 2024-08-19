import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [fullName, setFullName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [about, setAbout] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState(''); // Изначально пустая строка
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    const profileData = {
      fullName,
      shortDesc,
      about,
      age,
      sex,
      user_id: userId
    };

    try {
      const response = await axios.post('http://dating-app:81/api/profile', profileData);
      localStorage.setItem('profileId', response.data.id);
      setSuccess('Profile created successfully!');
      navigate("/preference"); 

      setError('');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 mt-10">
        <h2 className="text-2xl font-bold mb-4">Create Profile</h2>
        <input
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Short Description"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
        />
        <textarea
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          placeholder="About"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <input
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <div className="mb-2 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sex">
            Sex
          </label>
          <select
            id="sex"
            className="w-full p-2 border border-gray-300 rounded"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="">Select Sex</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={() => window.history.back()} // Go back to previous page
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
