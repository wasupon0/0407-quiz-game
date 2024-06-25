import React, { useRef } from "react";

const ButtonWithSound = ({
  isSelected,
  isDisable,
  handleClick,
  children,
  className,
  ...props
}) => {
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
      className={
        isSelected
          ? "button-selected"
          : isDisable
          ? "button-disabled"
          : className
      }
      disabled={isDisable}
      onMouseEnter={playHoverSound}
      onClick={() => {
        playClickSound();
        handleClick();
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonWithSound;
