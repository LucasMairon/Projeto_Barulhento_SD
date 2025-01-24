import React, { useState, useEffect } from "react";
import "./style.css"; // Tailwind importado no style.css

const sleepyMusic = new Audio("/sleepy-music.mp3");
const celebrationSound = new Audio("/celebration.mp3");

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const mazeSize = { width: 5, height: 5 };
  const bedPosition = { x: 4, y: 4 };

  // Gera obstáculos com validação para garantir que o caminho para a cama esteja livre
  const generateObstacles = () => {
    const obstaclesArray = [];
    while (obstaclesArray.length < 5) {
      const x = Math.floor(Math.random() * mazeSize.width);
      const y = Math.floor(Math.random() * mazeSize.height);

      // Evita colocar obstáculos na posição inicial, na cama ou no único caminho necessário
      if (
        (x !== 0 || y !== 0) &&
        (x !== bedPosition.x || y !== bedPosition.y) &&
        !(x === 3 && y === 3) // Caminho essencial na configuração atual
      ) {
        obstaclesArray.push({ x, y });
      }
    }
    return obstaclesArray;
  };

  const [obstacles] = useState(generateObstacles);

  useEffect(() => {
    if (musicStarted) {
      sleepyMusic.loop = true;
      sleepyMusic.volume = 0.5;
      sleepyMusic.play().catch((err) => console.log("Erro ao reproduzir música:", err));
    }

    return () => sleepyMusic.pause();
  }, [musicStarted]);

  const movePlayer = (direction) => {
    if (gameWon) return;

    setPlayerPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (direction === "up" && prev.y > 0) newY--;
      if (direction === "down" && prev.y < mazeSize.height - 1) newY++;
      if (direction === "left" && prev.x > 0) newX--;
      if (direction === "right" && prev.x < mazeSize.width - 1) newX++;

      const isObstacle = obstacles.some((obstacle) => obstacle.x === newX && obstacle.y === newY);
      if (isObstacle) return prev;

      if (newX === bedPosition.x && newY === bedPosition.y) {
        sleepyMusic.pause();
        celebrationSound.play().catch((err) =>
          console.log("Erro ao reproduzir som de vitória:", err)
        );
        setGameWon(true);
      }

      return { x: newX, y: newY };
    });
  };

  // Função para escutar as teclas do teclado
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        movePlayer("up");
        break;
      case "ArrowDown":
        movePlayer("down");
        break;
      case "ArrowLeft":
        movePlayer("left");
        break;
      case "ArrowRight":
        movePlayer("right");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Labirinto do Sextou</h1>

      {!musicStarted && (
        <button
          onClick={() => setMusicStarted(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mb-6 shadow-lg font-bold"
        >
          Começar o Jogo
        </button>
      )}

      <div
        className="grid gap-2 p-4 bg-gray-800 rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${mazeSize.width}, 60px)`,
          gridTemplateRows: `repeat(${mazeSize.height}, 60px)`,
        }}
      >
        {Array.from({ length: mazeSize.height * mazeSize.width }).map((_, index) => {
          const x = index % mazeSize.width;
          const y = Math.floor(index / mazeSize.width);

          const isPlayer = playerPosition.x === x && playerPosition.y === y;
          const isBed = bedPosition.x === x && bedPosition.y === y;
          const isObstacle = obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y);

          return (
            <div
              key={index}
              className={`w-15 h-15 flex items-center justify-center border-2 ${
                isPlayer
                  ? "bg-blue-400 border-blue-500"
                  : isBed
                  ? "bg-yellow-500 border-yellow-600"
                  : isObstacle
                  ? "bg-red-500 border-red-600"
                  : "bg-gray-700"
              }`}
            >
              {isPlayer && "😴"}
              {isBed && "🛏️"}
              {isObstacle && "❌"}
            </div>
          );
        })}
      </div>

      {!gameWon && (
        <div className="mt-6 flex flex-col items-center">
          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 m-2 rounded font-bold shadow-lg"
              onClick={() => movePlayer("up")}
            >
              ↑
            </button>
          </div>
          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 m-2 rounded font-bold shadow-lg"
              onClick={() => movePlayer("left")}
            >
              ←
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 m-2 rounded font-bold shadow-lg"
              onClick={() => movePlayer("down")}
            >
              ↓
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 m-2 rounded font-bold shadow-lg"
              onClick={() => movePlayer("right")}
            >
              →
            </button>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="mt-6 text-2xl font-bold text-green-400 text-center">
          🎉 Você conseguiu, agora pode aproveitar o seu sextou! 🎉
        </div>
      )}
    </div>
  );
}

export default App;
