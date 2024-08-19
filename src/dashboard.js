import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SendbirdApp from '@sendbird/uikit-react/App';

function Dashboard() {
  const [avatar, setAvatar] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [likeMessage, setLikeMessage] = useState('');
  const authToken = window.localStorage.getItem('authToken');

  const fetchProfiles = async () => {
    try {
      const response = await axios.post('http://dating-app:81/api/profilesGet', {}, {
        headers: {
          token: authToken
        },
      });
      setProfiles(response.data);
    } catch (err) {
      setError('Failed to load profiles.');
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await axios.get('http://dating-app:81/api/getImage', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            token: authToken
          },
        });
        setAvatar(`${response.data.image}`);
      } catch (err) {
        setError('Failed to load avatar.');
      }
    };

    fetchAvatar();
    fetchProfiles(); // Подгружаем все профили сразу
  }, [authToken]);

  const handleNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousProfile = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const likeProfile = async () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    try {
      await axios.post('http://dating-app:81/api/LikeUser', {
        userGetId: currentProfile.profile.user_id,
        profileId: localStorage.getItem('profileId'),
        subscriptionId: 0,
        userSentId: localStorage.getItem('userId'),
      }, {
        headers: {
          token: authToken
        }
      });

      setLikeMessage('Profile liked!'); // Уведомление об успешном лайке

      // Сброс уведомления через 5 секунд
      setTimeout(() => {
        setLikeMessage('');
      }, 5000);

    } catch (err) {
      setError('Failed to like profile.');
    }
  };

  const checkMatch = async () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    try {
      const response = await axios.post('http://dating-app:81/api/checkMatch', {
        targetUserId: currentProfile.profile.user_id
      }, {
        headers: {
          token: authToken
        }
      });

      if (response.data.match) {
        setMatchMessage('It\'s a match!');
      } else {
        setMatchMessage('No match.');
      }

      // Сброс уведомления через 5 секунд
      setTimeout(() => {
        setMatchMessage('');
      }, 5000);

    } catch (err) {
      console.log(currentProfile.profile.user_id);
      setError('Failed to check match.');
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark', !isDarkTheme);
  };

  return (
    <div className={`h-screen bg-gray-100 flex flex-col ${isDarkTheme ? 'dark' : ''}`}>
     <header className="flex justify-between items-center p-4 bg-white shadow-md dark:bg-gray-800">
  <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Cupid</h1>
  <div className="relative">
    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden cursor-pointer" onClick={toggleDropdown}>
      {avatar ? (
        <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full w-full text-gray-500">
          {error ? error : 'Loading...'}
        </div>
      )}
    </div>
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1 dark:bg-gray-700">
        <button
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={toggleTheme}
        >
          {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
        </button>
        <a
          href="/edit-profile"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          View/Edit Profile
        </a>
        <a
          href="/edit-preferences"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Edit Preferences
        </a>
        <a
          href="/edit-user"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Edit User
        </a>
      </div>
    )}
  </div>
</header>


      <div className="flex-1 flex justify-center items-center p-6 dark:bg-gray-900">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl dark:bg-gray-800 dark:text-gray-300">
          {error && <p className="text-red-500">{error}</p>}
          {matchMessage && <p className="text-green-500">{matchMessage}</p>}
          {likeMessage && <p className="text-green-500">{likeMessage}</p>} {/* Уведомление об успешном лайке */}
          {profiles.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md h-96 bg-gray-300 rounded-lg overflow-hidden mb-4">
                {profiles[currentIndex].avatar ? (
                  <img
                    src={profiles[currentIndex].avatar}
                    alt="Profile Avatar"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-gray-500">
                    Loading...
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-4">
                {profiles[currentIndex].profile.fullName}, {profiles[currentIndex].profile.age}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {profiles[currentIndex].profile.shortDesc}
              </p>
              <div className="flex mt-4 space-x-2">
                <button
                  className="w-12 h-12 flex justify-center items-center bg-gray-200 rounded-full dark:bg-gray-600"
                  onClick={handlePreviousProfile}
                >
                  <span className="text-xl text-gray-600 dark:text-gray-300">⟲</span>
                </button>
                {/* <button
                  className="w-12 h-12 flex justify-center items-center bg-red-500 text-white rounded-full"
                  onClick={() => setCurrentIndex(prevIndex => Math.min(prevIndex + 1, profiles.length - 1))}
                >
                  ✖
                </button> */}
                <button
                  className="w-12 h-12 flex justify-center items-center bg-green-500 text-white rounded-full"
                  onClick={likeProfile} // Вызов метода при нажатии на кнопку с сердечком
                > 
                  ❤
                </button>
                <button
                  className="w-12 h-12 flex justify-center items-center bg-blue-500 text-white rounded-full"
                  onClick={checkMatch} // Проверка матча при нажатии на кнопку со звездочкой
                >
                  ⭐
                </button>
              </div>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={handleNextProfile}
                  disabled={currentIndex === profiles.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="p-4 bg-white text-center shadow-md dark:bg-gray-800 dark:text-gray-300">
        <p>© 2024 Cupid. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
