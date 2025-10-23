import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";
import Timer from "./components/game/Timer";
import GameSummary from "./components/game/GameSummary";
import DifficultySelector from "./components/game/DifficultySelector";
import { useGameTimer } from "./hooks/useGameTimer";
import { useGameScore } from "./hooks/useGameScore";
import { getDifficultyConfig } from "./utils/difficultyConfig";
import "./App.css";

const cardImages = [
  { src: "/magic-memory/img/helmet-1.png", matched: false },
  { src: "/magic-memory/img/potion-1.png", matched: false },
  { src: "/magic-memory/img/ring-1.png", matched: false },
  { src: "/magic-memory/img/scroll-1.png", matched: false },
  { src: "/magic-memory/img/shield-1.png", matched: false },
  { src: "/magic-memory/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disable, setDisable] = useState();
  const [gameId, setGameId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);

  // Initialize timer and score tracking
  const timer = useGameTimer(gameId, gameStarted);
  const score = useGameScore(difficulty);

  const shuffleCards = (selectedDifficulty = difficulty) => {
    const diffConfig = getDifficultyConfig(selectedDifficulty);
    const pairsNeeded = diffConfig.totalPairs;

    // Select the required number of card pairs based on difficulty
    const selectedCards = cardImages.slice(0, pairsNeeded);
    const shuffledCard = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    // reset when new game
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCard);
    setTurn(0);
    setGameComplete(false);
    setGameSummaryData(null);
    setShowDifficultySelector(false);

    // Start new game session
    const newGameId = `game-${Date.now()}`;
    setGameId(newGameId);
    setGameStarted(true);

    // Reset score tracking
    score.reset();
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurn((prevTurn) => prevTurn + 1);
    setDisable(false);

    // Increment turn count in score tracker
    score.incrementTurns();
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    shuffleCards(selectedDifficulty);
  };

  const openDifficultySelector = () => {
    setShowDifficultySelector(true);
  };

  // check 2 card
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisable(true);
      if (choiceOne.src === choiceTwo.src) {
        // Match found
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
      } else {
        // Mistake made - increment mistake counter
        score.incrementMistakes();
      }
      setTimeout(() => {
        resetTurn();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceOne, choiceTwo]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && gameStarted) {
      const allMatched = cards.every((card) => card.matched);
      if (allMatched && !gameComplete) {
        // Game is complete!
        const elapsedTime = timer.stop();
        const finalScoreData = score.calculateFinalScore(elapsedTime);

        // Check if new personal best
        const bestComparison = score.checkPersonalBest(finalScoreData.finalScore);

        // Prepare summary data
        const summaryData = {
          finalScore: finalScoreData.finalScore,
          timeElapsed: elapsedTime,
          mistakes: finalScoreData.mistakes,
          stars: finalScoreData.stars,
          difficulty: difficulty,
          scoreBreakdown: finalScoreData.scoreBreakdown,
          isNewBest: bestComparison.isNewBest,
        };

        // Save to localStorage
        score.saveGameSession({ ...finalScoreData, timeElapsed: elapsedTime });

        setGameComplete(true);
        setGameSummaryData(summaryData);
        setGameStarted(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  // auto start game
  useEffect(() => {
    shuffleCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <h1>Magic Match</h1>

      {/* Game controls and stats */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "40px",
          alignItems: "center",
        }}
      >
        {/* Top row: Buttons */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button onClick={() => shuffleCards()}>New Game</button>
          <button onClick={openDifficultySelector}>Change Difficulty</button>
        </div>

        {/* Bottom row: Stats */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Difficulty Badge */}
          <div
            style={{
              padding: "8px 16px",
              backgroundColor: "#3d3347",
              borderRadius: "6px",
              color: "#fff",
              fontWeight: "600",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {difficulty}
          </div>

          {/* Timer display */}
          {gameStarted && (
            <Timer formattedTime={timer.formattedTime} isRunning={timer.isRunning} isPaused={timer.isPaused} />
          )}

          {/* Mistakes counter */}
          {gameStarted && (
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#3d3347",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "13px",
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              Mistakes: {score.mistakes}
            </div>
          )}

          {/* Turn counter */}
          {gameStarted && (
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#3d3347",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "13px",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              Turn: {turn}
            </div>
          )}
        </div>
      </div>

      <div className={`cards-grid ${difficulty}`}>
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disable={disable}
          />
        ))}
      </div>

      {/* Difficulty Selector Modal */}
      {showDifficultySelector && (
        <DifficultySelector currentDifficulty={difficulty} onSelectDifficulty={handleDifficultySelect} />
      )}

      {/* Game Summary Modal */}
      {gameSummaryData && (
        <GameSummary gameData={gameSummaryData} onPlayAgain={shuffleCards} onClose={() => setGameSummaryData(null)} />
      )}
    </div>
  );
}

export default App;
