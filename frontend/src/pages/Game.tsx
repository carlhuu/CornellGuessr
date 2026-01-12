import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../auth/AuthUserProvider";
import { signIn } from "../auth/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const images = [
  {
    url: "/game_images/low-rise-7.png",
    location: { lat: 42.456237, lng: -76.475352 },
  },
  {
    url: "/game_images/botanical-gardens.png",
    location: { lat: 42.449551, lng: -76.472359 },
  },
  {
    url: "/game_images/trillium.png",
    location: { lat: 42.448071, lng: -76.479248 },
  },
  {
    url: "/game_images/noyes-gym.png",
    location: { lat: 42.446518, lng: -76.488033 },
  },
  {
    url: "/game_images/cocktail-lounge.png",
    location: { lat: 42.447868, lng: -76.485291 },
  },
  {
    url: "/game_images/baker.png",
    location: { lat: 42.450414, lng: -76.481873 },
  },
  {
    url: "/game_images/bartels.png",
    location: { lat: 42.445329, lng: -76.485291 },
  },
  {
    url: "/game_images/barton.png",
    location: { lat: 42.445803, lng: -76.480988 },
  },
  {
    url: "/game_images/duffield.png",
    location: { lat: 42.444457, lng: -76.482602 },
  },
  {
    url: "/game_images/gates.png",
    location: { lat: 42.445034, lng: -76.481229 },
  },
  {
    url: "/game_images/hollister.png",
    location: { lat: 42.444211, lng: -76.484388 },
  },
  {
    url: "/game_images/klarman.png",
    location: { lat: 42.449154, lng: -76.483116 },
  },
  {
    url: "/game_images/morrison.png",
    location: { lat: 42.455644, lng: -76.47927 },
  },
  {
    url: "/game_images/newman.png",
    location: { lat: 42.452892, lng: -76.477716 },
  },
  {
    url: "/game_images/olin.png",
    location: { lat: 42.447906, lng: -76.484661 },
  },
  {
    url: "/game_images/psb.png",
    location: { lat: 42.449799, lng: -76.481368 },
  },
  {
    url: "/game_images/rhodes.png",
    location: { lat: 42.443749, lng: -76.481773 },
  },
  {
    url: "/game_images/rpcc.png",
    location: { lat: 42.456045, lng: -76.477399 },
  },
  {
    url: "/game_images/statler.png",
    location: { lat: 42.445465, lng: -76.481906 },
  },
  {
    url: "/game_images/tang.png",
    location: { lat: 42.444052, lng: -76.483804 },
  },
];


const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
  overflow: "hidden",
};

const shuffleArray = (array: typeof images) =>
  [...array].sort(() => Math.random() - 0.5);

const saveGameState = (state: object) => {
  localStorage.setItem("cornellguessrGame", JSON.stringify(state));
};

const loadGameState = () => {
  const state = localStorage.getItem("cornellguessrGame");
  return state ? JSON.parse(state) : null;
};

const clearGameState = () => {
  localStorage.removeItem("cornellguessrGame");
};

const Game: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const saved = loadGameState();

  const [shuffledImages, setShuffledImages] = useState(
    saved?.shuffledImages || shuffleArray(images)
  );
  const [round, setRound] = useState(saved?.round || 1);
  const [guess, setGuess] = useState(saved?.guess || null);
  const [showResult, setShowResult] = useState(saved?.showResult || false);
  const [score, setScore] = useState(saved?.score || 0);
  const [curr, setCurr] = useState(saved?.curr || false);
  const [currentImage, setCurrentImage] = useState(shuffledImages[round - 1]);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid || "Guest";

  useEffect(() => {
    if (curr) {
      saveGameState({ shuffledImages, round, guess, showResult, score, curr });
    }
  }, [shuffledImages, round, guess, showResult, score, curr]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setGuess({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const calculateDistance = () => {
    if (!guess) return 0;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(currentImage.location.lat - guess.lat);
    const dLon = toRad(currentImage.location.lng - guess.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(guess.lat)) *
        Math.cos(toRad(currentImage.location.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateScore = (distance: number) => {
    const decayRate = 0.95;
    return Math.round(1000 * Math.exp(-distance / decayRate));
  };

  const handleNextRound = () => {
    const nextRound = round + 1;
    setRound(nextRound);
    setShowResult(false);
    setGuess(null);
    setCurrentImage(shuffledImages[nextRound - 1]);
  };

  const reset = () => {
    const newImages = shuffleArray(images);
    setShuffledImages(newImages);
    setRound(1);
    setCurrentImage(newImages[0]);
    setGuess(null);
    setShowResult(false);
    setScore(0);
    clearGameState();
  };

  const submitGuessToBackend = async () => {
    if (!guess || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/api/guesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: guess.lat,
          lng: guess.lng,
          userId,
          displayName: user?.displayName || "Guest",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit guess");

      const distance = calculateDistance();
      const roundScore = calculateScore(distance);
      setScore((prev: number) => prev + roundScore);
      setShowResult(true);
    } catch (err) {
      console.error("Error submitting guess:", err);
      alert("Failed to submit guess. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitStatsToBackend = () => {
    fetch(`${backendUrl}/api/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total_pts: score,
        userId,
        displayName: user?.displayName || "Guest",
      }),
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  if (user && curr) {
    return (
      <div style={{
      minHeight: "calc(100vh - 70px)",
      width: "100vw",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Info */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px 30px",
          marginBottom: "30px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}>
          <div>
            <h2 style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#B31B1B",
              margin: 0,
            }}>
              Round {round} of 5
            </h2>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
            color: "white",
            padding: "12px 30px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.2rem",
          }}>
            Score: {score}
          </div>
        </div>

        {/* Map Note */}
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "12px",
          padding: "15px 20px",
          marginBottom: "30px",
          fontSize: "0.95rem",
          color: "#856404",
        }}>
          <strong>Note:</strong> Note: you may see a notice that says "This page can't load Google maps correctly," and the map may be watermarked.
              This is because we don't want to activate billing for Firebase. You should still be able to make guesses. Sorry 🤦‍♂️
        </div>

        {/* Main Content */}
        <div style={{
          display: "flex",
          gap: "30px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
        className="game-grid"
        >
          {/* Image Section */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            flex: "1 1 450px",  // Added
            minWidth: "300px",
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              Where is this?
            </h3>
            <img 
              src={currentImage.url} 
              alt="Location to guess"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Map Section */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            flex: "1 1 450px",  // Added
            minWidth: "300px",
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              Click on the map to guess
            </h3>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: 42.447, lng: -76.484 }}
              zoom={15}
              onClick={showResult ? undefined : onMapClick}
            >
              {guess && <Marker position={guess} label="Your Guess" />}
              {showResult && <Marker position={currentImage.location} label="Actual Location" />}
            </GoogleMap>
          </div>
        </div>

        {/* Actions and Results */}
        {!showResult && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={submitGuessToBackend}
              disabled={!guess || submitting}
              style={{
                background: !guess || submitting 
                  ? "#ccc" 
                  : "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
                color: "white",
                border: "none",
                padding: "1rem 3rem",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontWeight: "600",
                cursor: !guess || submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                opacity: !guess || submitting ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (guess && !submitting) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(179, 27, 27, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              {submitting ? "Submitting..." : "Submit Guess"}
            </button>
          </div>
        )}

        {showResult && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#B31B1B",
              marginBottom: "30px",
            }}>
              Round {round} Results
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}>
              <div style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
              }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>
                  Distance
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#333" }}>
                  {calculateDistance().toFixed(2)} km
                </div>
              </div>
              
              <div style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
              }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>
                  Round Score
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#B31B1B" }}>
                  {calculateScore(calculateDistance())} pts
                </div>
              </div>
              
              <div style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
              }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>
                  Total Score
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#333" }}>
                  {score} pts
                </div>
              </div>
            </div>

            {round < 5 ? (
              <button
                onClick={handleNextRound}
                style={{
                  background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
                  color: "white",
                  border: "none",
                  padding: "1rem 3rem",
                  borderRadius: "12px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(179, 27, 27, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(179, 27, 27, 0.3)";
                }}
              >
                Next Round →
              </button>
            ) : (
              <>
                {submitStatsToBackend()}
                <h3 style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#B31B1B",
                  marginBottom: "10px",
                }}>
                  🎉 Game Over!
                </h3>
                <p style={{
                  fontSize: "1.3rem",
                  color: "#666",
                  marginBottom: "30px",
                }}>
                  Final Score: <strong style={{ color: "#B31B1B" }}>{score} points</strong>
                </p>
                <button
                  onClick={reset}
                  style={{
                    background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
                    color: "white",
                    border: "none",
                    padding: "1rem 3rem",
                    borderRadius: "12px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(179, 27, 27, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(179, 27, 27, 0.3)";
                  }}
                >
                  Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    );
  }
  if (!user || !curr) {
    return (
      <div style={{
        minHeight: "calc(100vh - 70px)",
        width: "100vw",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "60px 40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#B31B1B",
            marginBottom: "20px",
          }}>
            Ready to Play?
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "40px",
            lineHeight: "1.6",
          }}>
            Test your knowledge of Cornell's campus by guessing locations from photos. 
            Can you get a perfect score?
          </p>
          <button
            onClick={() => {
              if (!user) {
                signIn();
              } else {
                setCurr(true);
              }
            }}
            style={{
              background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
              color: "white",
              border: "none",
              padding: "1rem 3rem",
              borderRadius: "12px",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(179, 27, 27, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(179, 27, 27, 0.3)";
            }}
          >
            {user ? "Start Game" : "Log in to Start Playing"}
          </button>
        </div>
      </div>
    );
  }
};

export default Game;
