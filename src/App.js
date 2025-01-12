import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DeskScene from "./components/scene/DeskScene";
import NoteGame from "./NoteGame";
import FilterSwitcher from "./FilterSwitcher";
import { playBgm, playSequence, downloadSequence, stopBgm ,clearSavedNotes} from "./music";
import InputOverlay from "./components/Interface/InputOverlay";
import Paper from "./components/models/Paper";
import ResponseDisplay from "./components/Interface/ResponseDisplay";
import { generateContent } from "./components/services/api";

function App() {
  const [gameState, setGameState] = useState("idle"); // "idle", "notegame", "selectFilter", "sendEmail"
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [lastNote, setLastNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [htmlContents, setHtmlContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiver: "",
    relationship: "",
    holiday: "",
    additional_info: "",
    tone: "",
    sender: ""
  });

  const startGame = () => {
    setGameState("startgame"); 
    playBgm();
    setIsLoadingScreen(true); 
    setTimeout(() => {
      setIsLoadingScreen(false); // Hide loading screen after delay
      setGameState("startgame");
    }, 3000);
  };

  const handleComputerClick = () => {
    if (gameState === "startgame"){
      setGameState("notegame");
      setHitCount(0);
      setLastNote("");
      stopBgm();
    }
  }
  useEffect(() => {
    if (gameState === "notegame" && hitCount >= 10) {
      setGameState("playSequence");
      handlePlaySequence();
    }
  }, [hitCount, gameState]);

  const handlePlaySequence = () => {
    playSequence(); // another click trigger stop
    if (gameState === "playSequence") {
      setIsPlaying((prev) => {
        return !prev;
      });
    }
  };

  const handleBooksClick = () => {
    if (gameState === "playSequence") {
      setGameState("selectFilter");
    }
  };

  const handleFilterConfirmed = () => {
    setGameState("sendEmail");
  };

  const handlePaperClick = () => {
    if (gameState === "sendEmail") {
      setGameState("inputOverlay");
      setIsFloating(true);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsFloating(false); // Hide the InputOverlay immediately when submitting
    try {
      const data = await generateContent(formData);
      setHtmlContents(data);
      setFormData({
        receiver: '',
        relationship: '',
        holiday: '',
        additional_info: '',
        tone: '',
        sender: ''
      });
    } catch (error) {
      console.error("Error:", error);
      setIsFloating(true); // Show the form again if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSubmitted = () => {
    setHtmlContents([]); // Clear the responses
    setIsLoading(false); // Reset loading state
    setIsFloating(false); // Hide the input overlay
    // Optionally show a success message
    alert("Your card has been sent successfully!"); // You can replace this with a more elegant notification
  };

  const handleDownload = async () => {
      try {
          await downloadSequence();
      } catch (error) {
          console.error('Download failed:', error);
      }
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Start Game Screen */}
      {gameState === "idle" && !isLoadingScreen && (
  <div style={{
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    backgroundImage: "url('https://darksky.org/app/uploads/2020/03/hero-Night-Sky-Family-Activities.jpg')",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontFamily: "'Pacifico', cursive",
    fontSize: "50px",
    flexDirection: "column",
    textAlign: "center",
    zIndex: gameState === "idle" ? 2 : 1, 
  }}>
    <div>Welcome to the Game!</div>
    <button 
      onClick={startGame} 
      style={{
        backgroundColor: "transparent",
        border: "2px solid white",
        borderRadius: "5px",
        padding: "10px 20px",
        marginTop: "20px",
        color: "white",
        fontFamily: "'Pacifico', cursive",
        fontSize: "20px",
        cursor: "pointer"
      }}>
      Start Game
    </button>
    <div 
      style={{
        fontSize: "16px",
        marginTop: "20px",
        animation: "bounce 1s infinite",
      }}
    >
      🔊 Please turn up your volume for the best experience!
    </div>
  </div>
)}
  
  {/* Loading Screen */}
  {isLoadingScreen && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            backgroundImage: "url('https://darksky.org/app/uploads/2020/03/hero-Night-Sky-Family-Activities.jpg')",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontFamily: "'Pacifico', cursive",
            fontSize: "50px",
            flexDirection: "column",
            textAlign: "center",
            zIndex: 3,
          }}
        >
          <div>Loading...</div>
          <div
            style={{
              marginTop: "20px",
              border: "5px solid white",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              borderTop: "5px solid transparent",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}


      {/* Game Content */}
      {gameState !== "idle" && (
        <div style={{ height: "100vh", position: "relative" }}>
          <Canvas shadows>
            <DeskScene onComputerClick={handleComputerClick} onBooksClick={handleBooksClick} />
            {gameState === "notegame" && (
              <NoteGame hitCount={hitCount} setHitCount={setHitCount} setLastNote={setLastNote} />
            )}
            <Paper onPointerDown={handlePaperClick} />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              enableRotate={false} 
            />
            {gameState === "inputOverlay" && (
              <InputOverlay
                isFloating={isFloating}
                text={formData}
                setText={setFormData}
                handleSubmit={handleSubmit}
              />
            )}
          </Canvas>
  
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "white",
              fontSize: "20px",
              fontFamily: "'Pacifico', cursive",
              zIndex: 1, 
            }}
          >
            {gameState === "notegame" && (
              <>
                <div>You need to click {10-hitCount} more 🎵 to create your own music</div>
                <div>The ball you received is {lastNote} note</div>
              </>
            )}
          </div>

          {gameState === "selectFilter" && (
              <FilterSwitcher onConfirm={handleFilterConfirmed} />
          )}
  
          <ResponseDisplay 
            htmlContents={htmlContents}
            isLoading={isLoading}
            onChoiceSubmitted={handleChoiceSubmitted}
          />
        </div>
      )}
    </div>
  );  
}

export default App;