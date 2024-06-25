import { nanoid } from "nanoid";
import React from "react";
import ButtonWithSound from "./ButtonWithSound";

const MultiChoice = ({ questionArray, handleChoiceClick, resetAnswer }) => {
  return (
    <div className="position-up">
      {questionArray.map((obj) => (
        <div key={nanoid()}>
          <br />
          <h1 className="header-choice" key={obj.id}>
            {obj.quiz}{" "}
          </h1>

          {obj.choices.map((choice, index) => (
            <span key={nanoid()}>
              <ButtonWithSound
                className="button-choice "
                key={`${obj.id}-${choice.text}`}
                handleClick={() => handleChoiceClick(obj.id, choice.text)}
                isDisable={choice.isDisable}
                isSelected={choice.isSelected}
              >
                {choice.text}
              </ButtonWithSound>

              <>
                {
                  <button
                    className={
                      choice.isDisable
                        ? "button-reset"
                        : "button-reset-disabled"
                    }
                    onClick={() => resetAnswer(obj, choice.text)}
                    disabled={choice.isDisable ? false : true}
                  >
                    ↻
                  </button>
                }
                &nbsp;&nbsp;
              </>
            </span>
          ))}

          <br />
          <br />
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MultiChoice;
