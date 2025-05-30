import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useAuth } from "../auth/AuthUserProvider";

// images
const images = [
  {
    url: '/game_images/low-rise-7.png',
    location: { lat: 42.456237, lng: -76.475352 }
  },
  {
    url: '/game_images/botanical-gardens.png',
    location: { lat: 42.449551, lng: -76.472359 }
  },
  {
    url: '/game_images/trillium.png',
    location: { lat: 42.448071, lng: -76.479248 }
  },
  {
    url: '/game_images/noyes-gym.png',
    location: { lat: 42.446518, lng: -76.488033 }
  },
  {
    url: '/game_images/cocktail-lounge.png',
    location: { lat: 42.447868, lng: -76.485291 }
  },
  {
    url: '/game_images/baker.png',
    location: { lat: 42.450414, lng: -76.481873}
  },
  {
    url: '/game_images/bartels.png',
    location: { lat: 42.445329, lng: -76.485291 }
  },
  {
    url: '/game_images/barton.png',
    location: { lat: 42.445803, lng: -76.480988 }
  },
  {
    url: '/game_images/duffield.png',
    location: { lat: 42.444457, lng: -76.482602 }
  },
  {
    url: '/game_images/gates.png',
    location: { lat: 42.445034, lng: -76.481229 }
  },
  {
    url: '/game_images/hollister.png',
    location: { lat: 42.444211, lng: -76.484388 }
  },
  {
    url: '/game_images/klarman.png',
    location: { lat: 42.449154, lng: -76.483116 }
  },
  {
    url: '/game_images/morrison.png',
    location: { lat: 42.455644, lng: -76.479270 }
  },
  {
    url: '/game_images/newman.png',
    location: { lat: 42.452892, lng: -76.477716 }
  },
  {
    url: '/game_images/olin.png',
    location: { lat: 42.447906, lng: -76.484661 }
  },
  {
    url: '/game_images/psb.png',
    location: { lat: 42.449799, lng: -76.481368 }
  },
  {
    url: '/game_images/rhodes.png',
    location: { lat: 42.443749, lng: -76.481773 }
  },
  {
    url: '/game_images/rpcc.png',
    location: { lat: 42.456045, lng: -76.477399 }
  },
  {
    url: '/game_images/statler.png',
    location: { lat: 42.445465, lng: -76.481906 }
  },
  {
    url: '/game_images/tang.png',
    location: { lat: 42.444052 , lng: -76.483804 }
  },
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

  const [shuffledImages, setShuffledImages] = useState(shuffleArray(images));
  const [round, setRound] = useState(1);
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [curr, setCurr] = useState(false);

  const [currentImage, setCurrentImage] = useState((shuffledImages[round - 1]));

  const { user } = useAuth();
  const userId = user?.uid || "guest";
  
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
    const decayRate = 0.95; // change this for faster/slower decay
    return Math.round(1000 * Math.exp(-distance / decayRate));
  };

  const handleNextRound = () => {
    const nextRound = round + 1;
    setRound(nextRound);
    setShowResult(false);
    setGuess(null);
    setCurrentImage(shuffledImages[nextRound - 1]);
  };

  const startGame = () => {
    setCurr(true);
  };

  const reset = () => {
    setShuffledImages(shuffleArray(images));
    setRound(1);
    setCurrentImage(shuffledImages[0]);
    setGuess(null);
    setShowResult(false);
    setScore(0);
  }

  const submitGuessToBackend = () => {
    if (guess) {
      fetch("http://localhost:5001/api/guesses", {
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

  const submitStatsToBackend = () => {
    console.log("Submitting stats...");
    fetch("http://localhost:5001/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total_pts: score,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Stats submitted:", data);
      })
      .catch((err) => {
        console.error("Error submitting stats:", err);
      });
  }


  if (!isLoaded) return <div>Loading...</div>;
  
  console.log(user);
  if (user && curr) {
    return (
    <div>
        <center>
          <h1 style={{padding: "1%"}}>Round {round}</h1>
          <h4> Score: {score} </h4>
          <h2 >Where is this?</h2>
        </center>
        <img src={currentImage.url} style={imageStyle} />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: 42.447, lng: -76.484 }}
          zoom={16}
          onClick={onMapClick}
        >
          {guess && <Marker position={guess} />}
          {showResult && <Marker position={currentImage.location} />}
        </GoogleMap>

        
          {!showResult && (
            <center className='padded-vert'>
            <button
              className={`padded-vert submitBtn ${!guess || !user ? "disabled" : ""}`}
              onClick={submitGuessToBackend}
              disabled={!guess || !user}
            >
              {user ? "Submit Guess" : "Sign in to submit guess"}
            </button>
            </center>
          )}
        
          
        {showResult && (
          <center className='padded-vert'>
          <div>
            <p>Distance: {calculateDistance().toFixed(2)} km</p>
            <p>Round Score: {calculateScore(calculateDistance())} points</p>
            <p>Total Score: {score} points</p>
            {round + 1 < 6 ? (
              <button className = 'submitBtn' onClick={handleNextRound}>Next Round</button>
            ) : (
              submitStatsToBackend(),
              <div>
                <p>Game Over! Final Score: {score}</p>
                <button className = 'submitBtn' onClick={reset}>Play Again</button>
              </div>
            )}
            
          </div>
          </center>
        )} )
      </div>
  );
  }
  if (user) {
    return (<div style={{ width: "100vw", height: "100vh" }}>
      <center className = "padded-vert"><button className = "submitBtn" onClick = {startGame}>Start Game</button></center>
    </div>);
  }
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <center>
        <h1 className='padded-vert'>Sign in to start playing!</h1>
      </center>
    </div>
  );
}

export default Game;
