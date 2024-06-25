import { decode } from "html-entities";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import sampleArray from "./assets/sampleArray";
import MultiChoice from "./components/MultiChoice";
import unmuteImage from "/mute-off.svg";
import muteImage from "/mute-on.svg";

function App() {
  const [isNewGame, setIsNewGame] = useState(true);
  const [questionArray, setQuestionArray] = useState([]);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isEndGame, setIsEndGame] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const url =
    "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple";

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    newGameSound.current.muted = isMuted;
    selectSound.current.muted = isMuted;
  }, [isMuted]);

  const newGameSound = useRef(new Audio("/new_game_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data.results);

      setQuestionArray(shuffleArray(data.results));
      setTotalScore(data.results.length);
      setIsReady(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timeoutId;

    fetchData(url);

    if (!isReady && isNewGame) {
      timeoutId = setTimeout(() => {
        location.reload();
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isReady, isNewGame]);

  const shuffleArray = (originalArray) => {
    const newArray = [];
    let newObj = {};

    originalArray.map((obj) => {
      const randomIndex = Math.floor(
        Math.random() * (obj.incorrect_answers.length + 1)
      );

      // create new object with all new key
      // deep copy will not affect the original object
      newObj = {
        id: nanoid(),
        quiz: decode(JSON.parse(JSON.stringify(obj.question))),
        answer: decode(JSON.parse(JSON.stringify(obj.correct_answer))),
        choices: decode(JSON.parse(JSON.stringify(obj.incorrect_answers))),
      };

      // insert correct answer at random index in choices array
      newObj.choices.splice(
        randomIndex,
        0,
        JSON.parse(JSON.stringify(obj.correct_answer))
      );

      // map to each choice in the choices array and create new object with isSelected key
      newObj.choices = newObj.choices.map((choice) => {
        return { text: choice, isSelected: false, isDisable: false };
      });

      // console.log(newObj);
      newArray.push(newObj);
    });

    // console.log(newArray);
    return newArray;
  };

  const playNewGameSound = () => {
    newGameSound.current.volume = 0.5;
    newGameSound.current.play();
  };

  const playSelectSound = () => {
    selectSound.current.volume = 0.25;
    selectSound.current.play();
  };

  const handleChoiceClick = (id, choiceText) => {
    // console.log(choiceText);
    // console.log(id);
    setQuestionArray((prevQuestionArray) => {
      // loop through each object in the prevQuestionArray
      return prevQuestionArray.map((prevObj) => {
        return prevObj.id === id
          ? {
              ...prevObj,
              choices: checkSelectedChoice(
                prevObj.choices,
                choiceText,
                prevObj.answer
              ),
            }
          : prevObj;
      });
    });
  };

  const resetAnswer = (obj) => {
    playSelectSound();
    setQuestionArray((prevQuestionArray) => {
      // loop through each object in the prevQuestionArray
      return prevQuestionArray.map((prevObj) => {
        return prevObj.id === obj.id
          ? {
              ...prevObj,
              choices: resetSelectedChoice(prevObj),
            }
          : prevObj;
      });
    });
  };

  const checkSelectedChoice = (choiceArray, choiceText, answer) => {
    let newChoiceArray = [];
    // console.log(choiceArray);
    for (let i = 0; i < choiceArray.length; i++) {
      if (choiceArray[i].text === choiceText) {
        choiceArray[i].isSelected = !choiceArray[i].isSelected;

        // if (choiceText === answer) {
        //   setScore((prevScore) => prevScore + 1);
        // }
      }

      choiceArray[i].isDisable = true;
      newChoiceArray.push(choiceArray[i]);
    }
    return newChoiceArray;
  };

  const resetSelectedChoice = (prevObj) => {
    let newChoiceArray = [];

    if (prevObj.choices[0].isDisable == true) {
      setScore(0);
    }

    let choiceArray = prevObj.choices;

    for (let i = 0; i < choiceArray.length; i++) {
      choiceArray[i].isSelected = false;
      choiceArray[i].isDisable = false;
      newChoiceArray.push(choiceArray[i]);
    }

    return newChoiceArray;
  };

  useEffect(() => {
    console.log(questionArray);
    const updatedScore = questionArray.map((obj) => {
      return obj.choices.reduce((acc, choice) => {
        if (choice.isSelected && choice.text === obj.answer) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    });

    setScore(updatedScore.reduce((acc, curr) => acc + curr, 0));

    console.log("score: ", score);
  }, [questionArray]);

  const startGame = () => {
    playNewGameSound();
    setScore(0);
    setIsNewGame(false);
  };

  const endGame = () => {
    playNewGameSound();
    setIsEndGame(true);
  };

  const restartGame = () => {
    playNewGameSound();
    setScore(0);
    setIsEndGame(false);
    setIsNewGame(true);
    setIsReady(false);
  };

  return isNewGame ? (
    <main className="new-game">
      <button
        onClick={toggleMute}
        style={{
          background: `url(${
            isMuted ? muteImage : unmuteImage
          }) no-repeat center/cover`,
          width: "50px",
          height: "50px",
          border: "none",
          outline: "none",
        }}
        className="button-mute"
      ></button>
      <h1>Quiz game</h1>
      <p>
        This is a quiz game with 4 multiple choices. Choose one correct answer.
      </p>
      {isReady ? (
        <button className="button-new-game" onClick={startGame}>
          Start Quiz
        </button>
      ) : (
        <>
          <p className="error-fetch">
            Can not fetch question, please refresh the page until start button
            shows up
          </p>
          <button className="button-refresh" onClick={() => location.reload()}>
            Refresh
          </button>
        </>
      )}
    </main>
  ) : (
    <main className="start-game">
      <button
        onClick={toggleMute}
        style={{
          background: `url(${
            isMuted ? muteImage : unmuteImage
          }) no-repeat center/cover`,
          width: "50px",
          height: "50px",
          border: "none",
          outline: "none",
        }}
        className="button-mute"
      ></button>
      <MultiChoice
        questionArray={questionArray}
        handleChoiceClick={handleChoiceClick}
        resetAnswer={resetAnswer}
        isMuted={isMuted}
      />
      <button className="button-calculate" onClick={endGame}>
        Calculate Score
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button className="button-restart" onClick={restartGame}>
        Restart Quiz
      </button>
      {isEndGame ? <p>Total Score: {`${score}/${totalScore}`}</p> : <></>}
    </main>
  );
}

export default App;
