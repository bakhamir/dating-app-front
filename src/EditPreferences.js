import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditPreferences() {
  const [preferences, setPreferences] = useState({
    preference1: '',
    preference2: '',
    preference3: '',
  });
  const [error, setError] = useState('');
  const preferencesId = window.localStorage.getItem('preference_id');
  const authToken = window.localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`http://dating-app:81/api/preferences/${preferencesId}`, {
          headers: { token: authToken }
        });
        setPreferences(response.data);
      } catch (err) {
        setError('Failed to load preferences.');
      }
    };

    fetchPreferences();
  }, [preferencesId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prevPreferences => ({ ...prevPreferences, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://dating-app:81/api/preferences/update/${preferencesId}`, preferences, {
        headers: { token: authToken }
      });
      alert('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <header className="bg-white shadow-md dark:bg-gray-800 p-4 mb-6">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Edit Preferences</h1>
      </header>
      <main className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-gray-300">
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Preference 1:</label>
            <input
              type="text"
              name="preference1"
              value={preferences.preference1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Preference 2:</label>
            <input
              type="text"
              name="preference2"
              value={preferences.preference2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400">Preference 3:</label>
            <input
              type="text"
              name="preference3"
              value={preferences.preference3}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Update Preferences
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditPreferences;
