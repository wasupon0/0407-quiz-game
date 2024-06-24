import { nanoid } from "nanoid";
import React from "react";

const MultiChoice = ({ questionArray, handleOptionClick }) => {
  return (
    <div className="position-up">
      {questionArray.map((obj) => (
        <div key={nanoid()}>
          <br />
          <h1 className="header-choice" key={obj.id}>
            {obj.question}
          </h1>

          {obj.options.map((option, index) => (
            <button
              className="button-choice space"
              key={`${obj.id}-${index}`}
              onClick={() => handleOptionClick(`${obj.id}-${index}`, option)}
            >
              {option}
            </button>
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
