import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// images
const images = [
  {
    url: '/images/low-rise-7.jpg',
    location: { lat: 42.456237, lng: -76.475352 }
  },
  {
    url: '/images/botanical-gardens.jpg',
    location: { lat: 42.449551, lng: -76.472359 }
  },
  {
    url: '/images/trillium.jpg',
    location: { lat: 42.448071, lng: -76.479248 }
  },
  {
    url: '/images/noyes-gym.jpg',
    location: { lat: 42.446518, lng: -76.488033 }
  },
  {
    url: '/images/cocktail-lounge.jpg',
    location: { lat: 42.447868, lng: -76.485291 }
  },
  // add more locations here
];

// Styles for image and map
const imageStyle: React.CSSProperties = {
  maxWidth: "80%",  
  height: "auto",
  display: "block",
  margin: "20px auto",
};

const mapContainerStyle: React.CSSProperties = {
  width: "100vw",
  height: "60vh",
  marginTop: "20px",
};

const shuffleArray = (array: typeof images) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Game: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(images));
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentImage = shuffledImages[round];

  const userId = "user123"; // replace when auth implemented

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setGuess({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const calculateDistance = () => {
    if (!guess) return 0;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(currentImage.location.lat - guess.lat);
    const dLon = toRad(currentImage.location.lng - guess.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(guess.lat)) * Math.cos(toRad(currentImage.location.lat)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateScore = (distance: number) => {
    const decayRate = 0.9; // change this for faster/slower decay
    return Math.round(1000 * Math.exp(-distance / decayRate));
  };

  const handleNextRound = () => {
    setShowResult(false);
    setGuess(null);
    setRound(round + 1);
  };

  const submitGuessToBackend = () => {
    if (guess) {
      fetch("http://localhost:5000/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: guess.lat,
          lng: guess.lng,
          userId: userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Guess submitted:", data);
          const distance = calculateDistance();
          const roundScore = calculateScore(distance);
          setScore((prev) => prev + roundScore);
          setShowResult(true);
        })
        .catch((err) => {
          console.error("Error submitting guess:", err);
        });
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <img src={currentImage.url} alt="Cornell Location" style={imageStyle} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: 42.447, lng: -76.484 }}
        zoom={16}
        onClick={onMapClick}
      >
        {guess && <Marker position={guess} />}
        {showResult && <Marker position={currentImage.location} />}
      </GoogleMap>

      <center>{!showResult && guess && (
        <button className = "submitBtn" onClick={submitGuessToBackend}>
          Submit Guess
        </button>
      )} {!showResult && !guess && (<button className = "submitBtn disabled" onClick={submitGuessToBackend}>
        Submit Guess
      </button>)}</center>

      {showResult && (
        <div>
          <p>Distance: {calculateDistance().toFixed(2)} km</p>
          <p>Round Score: {calculateScore(calculateDistance())} points</p>
          <p>Total Score: {score} points</p>
          {round + 1 < images.length ? (
            <button onClick={handleNextRound}>Next Round</button>
          ) : (
            <p>Game Over! Final Score: {score}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
