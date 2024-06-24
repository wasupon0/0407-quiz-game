import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import "./App.css";
import MultiChoice from "./components/MultiChoice";

function App() {
  const [isNewGame, setIsNewGame] = useState(true);
  const [isSelected, setIsSelected] = useState(true);

  const newGameSound = useRef(new Audio("/new_game_sound.wav"));
  const playNewGameSound = () => {
    newGameSound.current.volume = 0.5;
    newGameSound.current.play();
  };

  const questionArray = [
    {
      id: nanoid(),
      question: "Question 1",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    {
      id: nanoid(),
      question: "Question 2",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    {
      id: nanoid(),
      question: "Question 3",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    {
      id: nanoid(),
      question: "Question 4",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
  ];

  const handleOptionClick = (id, option) => {
    // Handle option click logic here
    console.log(`optionID: ${id}`);
  };

  const startGame = () => {
    setIsNewGame(false);
    playNewGameSound();
  };

  const selectAnswer = () => {
    setIsSelected(true);
  };

  return isNewGame ? (
    <main className="new-game">
      <h1>Quiz game</h1>
      <p>Some description if needed</p>
      <button onClick={startGame}>Start Quiz</button>
    </main>
  ) : (
    <main className="start-game">
      <MultiChoice
        questionArray={questionArray}
        handleOptionClick={handleOptionClick}
      />
    </main>
  );
}

export default App;
