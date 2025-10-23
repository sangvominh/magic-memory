/**
 * StarRating Component
 * Displays visual star rating (1-3 stars)
 */

import React from "react";

export const StarRating = ({ stars, maxStars = 3, showLabel = true }) => {
  const getStarLabel = (starCount) => {
    if (starCount === 3) return "Excellent!";
    if (starCount === 2) return "Good Job!";
    return "Nice Try!";
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
      {/* Stars display - horizontal */}
      <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const filled = index < stars;
          return (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={filled ? "#fbbf24" : "none"}
              stroke={filled ? "#fbbf24" : "#666"}
              strokeWidth="2"
              style={{
                width: "32px",
                height: "32px",
                transition: "all 0.3s ease",
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          style={{
            fontWeight: "600",
            fontSize: "16px",
            color: stars === 3 ? "#fbbf24" : stars === 2 ? "#60a5fa" : "#999",
          }}
        >
          {getStarLabel(stars)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
