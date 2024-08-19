import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    shortDesc: ''
  });
  const [error, setError] = useState('');
  const profileId = window.localStorage.getItem('profile_id');
  const authToken = window.localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://dating-app:81/api/profile/${profileId}`, {
          headers: { token: authToken }
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [profileId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://dating-app:81/api/profile/update/${profileId}`, profile, {
        headers: { token: authToken }
      });
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <header className="bg-white shadow-md dark:bg-gray-800 p-4 mb-6">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Edit Profile</h1>
      </header>
      <main className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-gray-300">
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Short Description:</label>
            <textarea
              name="shortDesc"
              value={profile.shortDesc}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Update Profile
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;
