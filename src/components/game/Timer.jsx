/**
 * Timer Component
 * Displays real-time game timer with formatting
 */

import React from "react";

export const Timer = ({ formattedTime, isRunning, isPaused }) => {
  return (
    <div
      style={{
        padding: "8px 16px",
        backgroundColor: "#3d3347",
        borderRadius: "6px",
        color: "#fff",
        fontWeight: "600",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        minWidth: "100px",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "15px", fontWeight: "600", fontFamily: "monospace" }}>{formattedTime}</span>
    </div>
  );
};

export default Timer;
