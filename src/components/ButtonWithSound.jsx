import React, { useRef } from "react";

const ButtonWithSound = ({ onClick, children, className, ...props }) => {
  const hoverSound = useRef(new Audio("/hover_sound.wav"));
  const selectSound = useRef(new Audio("/select_sound.wav"));

  const playHoverSound = () => {
    hoverSound.current.volume = 0.05;
    hoverSound.current.play();
  };

  const playClickSound = () => {
    selectSound.current.volume = 0.25;
    selectSound.current.play();
  };

  return (
    <button
      onMouseEnter={playHoverSound}
      onClick={playClickSound}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonWithSound;
