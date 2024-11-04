// // src/App.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css'; // Import the CSS file

// const App = () => {
//   const [location, setLocation] = useState(null);
//   const [placeName, setPlaceName] = useState('');
//   const [error, setError] = useState(null);

//   const fetchPlaceName = async (latitude, longitude) => {
//     const apiKey = '6d4c8c421d514d9cb6e4a98523a07dc0';
//     try {
//       const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
//       if (response.data.results.length > 0) {
//         const { formatted } = response.data.results[0];
//         setPlaceName(formatted);
//       } else {
//         setPlaceName('Place not found');
//       }
//     } catch (error) {
//       console.error('Error fetching place name:', error);
//       setPlaceName('Error fetching place name');
//     }
//   };

//   useEffect(() => {
//     const watchPosition = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude, accuracy } = position.coords;
//         const currentLocation = { latitude, longitude, accuracy, timestamp: new Date() };

//         localStorage.setItem('lastKnownLocation', JSON.stringify(currentLocation));
//         setLocation(currentLocation);

//         fetchPlaceName(latitude, longitude);
//       },
//       (error) => {
//         setError(error.message);
//       },
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//     );

//     return () => navigator.geolocation.clearWatch(watchPosition);
//   }, []);

//   const sendLocationToServer = async () => {
//     const storedLocation = JSON.parse(localStorage.getItem('lastKnownLocation'));

//     try {
//       await axios.post('https://example.com/api/location', storedLocation);
//       alert('Location sent successfully');
//     } catch (err) {
//       console.error('Error sending location:', err);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Location Tracking</h1>
//       {location ? (
//         <div className="location-info">
//           <p><strong>Latitude:</strong> {location.latitude}</p>
//           <p><strong>Longitude:</strong> {location.longitude}</p>
//           <p><strong>Accuracy:</strong> {location.accuracy} meters</p>
//           <p><strong>Place:</strong> {placeName}</p>
//           <button className="send-button" onClick={sendLocationToServer}>
//             Send Location to Server
//           </button>
//         </div>
//       ) : (
//         <p className="loading">Getting location...</p>
//       )}
//       {error && <p className="error">Error: {error}</p>}
//     </div>
//   );
// };

// export default App;
// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [error, setError] = useState(null);

  const fetchPlaceName = async (latitude, longitude) => {
    const apiKey = '6d4c8c421d514d9cb6e4a98523a07dc0';
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
      if (response.data.results.length > 0) {
        const { formatted } = response.data.results[0];
        setPlaceName(formatted);
      } else {
        setPlaceName('Place not found');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setPlaceName('Error fetching place name');
    }
  };

  const getRealLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const currentLocation = { latitude, longitude, accuracy, timestamp: new Date() };

        setLocation(currentLocation);
        fetchPlaceName(latitude, longitude);
      },
      (error) => {
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 30000 } // Adjust timeout as needed
    );
  };

  useEffect(() => {
    // Automatically get the location when the component mounts
    getRealLocation();
  }, []);

  const sendLocationToServer = async () => {
    const storedLocation = JSON.parse(localStorage.getItem('lastKnownLocation'));

    try {
      await axios.post('https://example.com/api/location', storedLocation);
      alert('Location sent successfully');
    } catch (err) {
      console.error('Error sending location:', err);
    }
  };

  const resetLocation = () => {
    // Clear the current location state
    setLocation(null);
    setPlaceName('');
    setError(null);

    // Request the real location again
    getRealLocation();
  };

  return (
    <div className="container">
      <h1>Location Tracking</h1>
      {location ? (
        <div className="location-info">
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
          <p><strong>Accuracy:</strong> {location.accuracy} meters</p>
          <p><strong>Place:</strong> {placeName}</p>
          <button className="send-button" onClick={sendLocationToServer}>
            Send Location to Server
          </button>
        </div>
      ) : (
        <p className="loading">Getting location...</p>
      )}
      {error && <p className="error">Error: {error}</p>}
      <button className="reset-button" onClick={resetLocation}>
        Reset Location
      </button>
    </div>
  );
};

export default App;
