/**
 * GameSummary Component
 * Displays comprehensive performance summary after game completion
 */

import React from "react";
import { StarRating } from "./StarRating";
import { formatTime } from "../../utils/timeFormatting";

export const GameSummary = ({ gameData, onPlayAgain, onClose, className }) => {
  const { finalScore, timeElapsed, mistakes, stars, difficulty, scoreBreakdown, isNewBest = false } = gameData;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#2b2532",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          color: "#fff",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          padding: "24px",
          animation: "fadeInZoom 0.3s ease-out",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Game Complete!</h2>
          {isNewBest && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                backgroundColor: "#fbbf24",
                color: "#1b1523",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              🎉 New Personal Best!
            </div>
          )}
        </div>

        {/* Star Rating */}
        <div style={{ marginBottom: "20px" }}>
          <StarRating stars={stars} showLabel={true} />
        </div>

        {/* Main Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          {/* Final Score */}
          <div
            style={{
              textAlign: "center",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#3d3347",
              border: "2px solid #667eea",
            }}
          >
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>Final Score</p>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#667eea" }}>{finalScore}</p>
          </div>

          {/* Time and Mistakes row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {/* Time */}
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#3d3347",
              }}
            >
              <p style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px" }}>Time</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}>{formatTime(timeElapsed)}</p>
            </div>

            {/* Mistakes */}
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#3d3347",
              }}
            >
              <p style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px" }}>Mistakes</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}>{mistakes}</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        {scoreBreakdown && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#3d3347",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }}>
              Score Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#aaa" }}>Base Score</span>
                <span style={{ color: "#fff", fontWeight: "500" }}>+{scoreBreakdown.components.base.points}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#aaa" }}>Time Bonus</span>
                <span style={{ color: "#4ade80", fontWeight: "500" }}>
                  +{scoreBreakdown.components.timeBonus.points}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#aaa" }}>Mistakes</span>
                <span style={{ color: "#f87171", fontWeight: "500" }}>{scoreBreakdown.components.mistakes.points}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #555",
                  paddingTop: "6px",
                  marginTop: "2px",
                }}
              >
                <span style={{ color: "#aaa" }}>Subtotal</span>
                <span style={{ color: "#fff", fontWeight: "500" }}>{scoreBreakdown.rawScore}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#aaa" }}>Multiplier ({difficulty})</span>
                <span style={{ color: "#fff", fontWeight: "500" }}>
                  ×{scoreBreakdown.components.difficulty.multiplier}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #555",
                  paddingTop: "6px",
                  marginTop: "2px",
                }}
              >
                <span style={{ color: "#fff", fontWeight: "bold" }}>Final Score</span>
                <span style={{ color: "#667eea", fontWeight: "bold", fontSize: "14px" }}>
                  {scoreBreakdown.finalScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Percentage */}
        {scoreBreakdown && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: "#3d3347",
                fontSize: "11px",
                color: "#aaa",
              }}
            >
              {Math.round(scoreBreakdown.percentageOfMax)}% of max score
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#667eea",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5568d3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#667eea")}
          >
            Play Again
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: "12px 20px",
                backgroundColor: "transparent",
                border: "2px solid #555",
                borderRadius: "8px",
                color: "#aaa",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#777";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#555";
                e.target.style.color = "#aaa";
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSummary;
