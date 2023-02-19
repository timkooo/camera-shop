import React, { useState } from 'react';

export const useKeyPress = (targetKey : string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const handleKeyDown = (evt : KeyboardEvent) => {
    if (evt.key === targetKey) {
      evt.preventDefault();
      setKeyPressed(true);
    }
  };

  const handleKeyUp = (evt : KeyboardEvent) => {
    if (evt.key === targetKey) {
      evt.preventDefault();
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  return keyPressed;
};
