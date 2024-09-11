import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import Sendbird from 'sendbird';
import SendbirdApp from '@sendbird/uikit-react/App';
import './custom.css';
import { useSwipeable } from 'react-swipeable';

function Dashboard() {
  const [avatar, setAvatar] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const profileRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [likeMessage, setLikeMessage] = useState('');
  const [isWidgetVisible, setIsWidgetVisible] = useState(false); // Новое состояние для видимости виджета
  const authToken = window.localStorage.getItem('authToken');
  
  // const targetUserId = currentProfile.profile.user_id;
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

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://dating-app:81/api/user', {
        headers: {
          token: authToken
        },
      });
      window.localStorage.setItem('profileId', response.data.profileId);
      window.localStorage.setItem('preference_id', response.data.preferenceId);
      window.localStorage.setItem('userId', response.data.userId);
      setUser(response.data.name);
    } catch (err) {
      setError('Failed to load user.');
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
  style.textContent = `
    .sendbird-ui-header__right.sendbird-ui-header--is-desktop {
      display: none !important;
    }
 .container {
  overflow: hidden;
  position: relative;
}

.card {
  transition: transform 0.5s ease;
  will-change: transform;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.card.swiped-left {
  transform: translateX(-120%);
}

.card.swiped-right {
  transform: translateX(120%);
}

  `;
    document.head.appendChild(style);

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
    fetchUser();
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

 const createChat = async () => {
  const sb = new Sendbird({ appId: '016BF0FC-BF3E-4AF8-A6E4-CD40BD408C88' });
  const currentUserId = localStorage.getItem('userId');
  const targetUserId = localStorage.getItem('matchId');

  sb.connect(currentUserId, (user, error) => {
    if (error) {
      console.error('Failed to connect:', error);
      return;
    }

    const params = new sb.GroupChannelParams();
    params.addUserIds([currentUserId, targetUserId]);
    params.isPublic = false;
    params.isDistinct = true;

    sb.GroupChannel.createChannel(params)
      .then(channel => {
        console.log('Channel created:', channel);

        // Отправка сообщения сразу после создания канала
        const messageParams = new sb.UserMessageParams();
        messageParams.message = "Its a match! lets talk now";

        channel.sendUserMessage(messageParams, (message, error) => {
          if (error) {
            console.error('Failed to send message:', error);
          } else {
            console.log('Message sent:', message);
          }
        });
      })
      .catch(error => {
        console.error('Failed to create channel:', error);
      });
  });
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
        localStorage.setItem('matchId',currentProfile.profile.user_id)
        // Создание чата при совпадении

          createChat(currentProfile.profile.user_id);
        
        

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

  // Функция для переключения видимости виджета
  const toggleWidgetVisibility = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
  
    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
      setSwipeDirection(null);
    }, 500); 
  };
  
  


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      handleSwipe('left'); 
    },
    onSwipedRight: () => {
      handleSwipe('right'); 
      likeProfile(); 
      checkMatch();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  return (
    
    <div className={`h-screen bg-gray-100 flex flex-col bg-gradient-to-r from-pink-500 to-purple-500 ${isDarkTheme ? 'dark' : ''}`}>

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
    <button
      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
      onClick={() => {
        localStorage.clear(); // Очищаем localStorage
        window.location.href = '/'; // Перенаправляем на главную страницу
      }}
    >
      Log Out
    </button>
  </div>
)}


        </div>
      </header>

      <div className=" h-screen flex-1 flex justify-center items-center p-6 dark:bg-gray-900">

        <div className={`card bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl dark:bg-gray-800 dark:text-gray-300 ${swipeDirection === 'right' ? 'swiped-right' : swipeDirection === 'left' ? 'swiped-left' : ''}`}
        {...swipeHandlers}>



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
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {profiles[currentIndex].profile.about}
              </p>
              <div className="flex mt-4 space-x-2">
                <button
                  className="w-12 h-12 flex justify-center items-center bg-gray-200 rounded-full dark:bg-gray-600"
                  onClick={handlePreviousProfile}
                >
                  <span className="text-xl text-gray-600 dark:text-gray-300">⟲</span>
                </button>
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

      <footer className="p-4 bg-gradient-to-r from-pink-500 to-purple-500  text-white text-center shadow-md dark:bg-gray-800 dark:text-gray-300">
        <p>© 2024 Cupid. All rights reserved.</p>
      </footer>

      {/* Иконка для управления видимостью виджета */}
      <div className="fixed bottom-5 right-5">
        <button
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
          onClick={toggleWidgetVisibility}
        >
          💬
        </button>
      </div>

     
      {/* Отображение виджета при его видимости */}
      {isWidgetVisible && (
        <div className="fixed bottom-20 right-5 w-200 h-96 bg-white shadow-lg rounded-lg">
          <SendbirdApp
            appId="016BF0FC-BF3E-4AF8-A6E4-CD40BD408C88" // Замените на ваш App ID
            userId={localStorage.getItem('userId')}
            nickname={user} // Замените на ваше значение
            profileUrl={avatar}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
