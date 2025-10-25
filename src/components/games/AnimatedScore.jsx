import React, { useEffect, useState } from 'react';

const RollingDigit = ({ digit }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timeout);
  }, [digit]);

  return (
    <div
      className="relative overflow-hidden inline-block align-baseline"
      style={{
        height: '1em', // scales with font size
        width: '0.65em', // adjusts to digit width
      }}
    >
      <div
        className="flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateY(-${digit * 10}%)`, // percent-based, scales automatically
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`text-center leading-none font-bold ${
              i === digit && isAnimating ? 'scale-110' : ''
            } transition-transform duration-300`}
            style={{
              height: '1em', // same as container
              lineHeight: '1em', // vertically align digits
            }}
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
    <div className={`flex items-center gap-[0.05em] ${className}`}>
      {digits.map((digit, idx) =>
        isNaN(digit) ? (
          <span key={idx} className="font-bold leading-none">
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
