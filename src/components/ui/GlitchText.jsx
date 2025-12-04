import React, { useRef, useState, useCallback } from "react";

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/";

export const GlitchText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const originalText = text;

  const onMouseOver = useCallback(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  }, [originalText]);

  return (
    <span
      className={`font-mono cursor-default ${className}`}
      onMouseEnter={onMouseOver}
      data-value={text}
    >
      {displayText}
    </span>
  );
};

