/**
 * DifficultySelector Component
 * Allows users to select game difficulty level
 */

import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { getAllDifficulties } from "../../utils/difficultyConfig";

export const DifficultySelector = ({ currentDifficulty, onSelectDifficulty, className }) => {
  const difficulties = getAllDifficulties();

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 p-6", className)}
      style={{
        position: "fixed",
        inset: "0",
        zIndex: "50",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "900px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#fff" }}>
          Select Difficulty
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6" style={{ justifyItems: "center" }}>
          {difficulties.map((diff) => {
            const isSelected = currentDifficulty === diff.id;

            return (
              <button
                key={diff.id}
                onClick={() => onSelectDifficulty(diff.id)}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all duration-200",
                  "hover:scale-105 hover:shadow-lg",
                  "flex flex-col items-center gap-3"
                )}
                style={{
                  backgroundColor: isSelected ? "#3d3347" : "#2b2532",
                  borderColor: isSelected ? "#4fc3f7" : "#555",
                  color: "#fff",
                }}
              >
                {/* Difficulty Icon/Badge */}
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold",
                    diff.color === "green" && "bg-green-100 text-green-700",
                    diff.color === "yellow" && "bg-yellow-100 text-yellow-700",
                    diff.color === "red" && "bg-red-100 text-red-700"
                  )}
                >
                  {diff.id === "easy" && "🎯"}
                  {diff.id === "medium" && "⚡"}
                  {diff.id === "hard" && "🔥"}
                </div>

                {/* Difficulty Name */}
                <h3 className="text-xl font-bold" style={{ color: isSelected ? "#4fc3f7" : "#fff" }}>
                  {diff.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-center" style={{ color: "#aaa" }}>
                  {diff.description}
                </p>

                {/* Stats */}
                <div className="text-xs space-y-1" style={{ color: "#aaa" }}>
                  <div>
                    Grid: {diff.gridSize.rows}×{diff.gridSize.cols}
                  </div>
                  <div>Pairs: {diff.totalPairs}</div>
                  <div>Multiplier: {diff.scoreMultiplier}x</div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="mt-2">
                    <span className="text-xs font-semibold uppercase" style={{ color: "#4fc3f7" }}>
                      Selected
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button onClick={() => onSelectDifficulty(currentDifficulty)} size="lg">
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
