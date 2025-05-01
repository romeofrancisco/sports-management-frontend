import { useEffect, useRef, useState } from 'react';

export const useChartInteractions = (chartRef, periodEvents, labels, scores) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const hoverInfoRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const chart = chartRef.current;
      if (!chart?.canvas) return;

      const handleHover = (e) => {
        const points = chart.getElementsAtEventForMode(
          e,
          "index",
          { intersect: false },
          false
        );
        if (points?.length) {
          const index = points[0].index;
          const event = periodEvents[index];

          if (!hoverInfoRef.current || hoverInfoRef.current.event?.id !== event?.id) {
            const newHover = {
              point: labels[index],
              homeScore: scores.homeScores[index],
              awayScore: scores.awayScores[index],
              event,
            };
            setHoverInfo(newHover);
            hoverInfoRef.current = newHover;
          }
        } else {
          setHoverInfo(null);
          hoverInfoRef.current = null;
        }
      };

      const canvas = chart.canvas;
      canvas.addEventListener("mousemove", handleHover);
      canvas.addEventListener("touchmove", handleHover, { passive: true });
      canvas.addEventListener("mouseleave", () => {
        setHoverInfo(null);
        hoverInfoRef.current = null;
      });

      return () => {
        canvas.removeEventListener("mousemove", handleHover);
        canvas.removeEventListener("touchmove", handleHover);
        canvas.removeEventListener("mouseleave", () => {});
      };
    }, 0);

    return () => clearTimeout(timeout);
  }, [periodEvents, labels, scores]);

  return { hoverInfo };
};