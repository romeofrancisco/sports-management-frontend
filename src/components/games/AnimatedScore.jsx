import React, { useEffect, useState } from 'react';

const RollingDigit = ({ digit }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 300); // match transition duration
    return () => clearTimeout(timeout);
  }, [digit]);

  return (
    <div className="h-6 w-3 overflow-hidden relative">
      <div
        className={`transition-transform duration-300 ease-in-out flex flex-col`}
        style={{ transform: `translateY(-${digit * 1.5}rem)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-6 text-center font-bold leading-6 transition-all duration-300 
              ${i === digit && isAnimating ? 'scale-110' : ''}`}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};


export const AnimatedScore = ({ value = 0, className = '' }) => {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    const stringDigits = String(value).split('');
    setDigits(stringDigits);
  }, [value]);

  return (
    <div className={`flex ${className}`}>
      {digits.map((digit, idx) =>
        isNaN(digit) ? (
          <span key={idx} className="font-bold">
            {digit}
          </span>
        ) : (
          <RollingDigit key={idx} digit={parseInt(digit)} />
        )
      )}
    </div>
  );
};

export default AnimatedScore;
