import React from "react";

interface DividerProps {
  thickness?: number;
}

export default function Divider({ thickness = 3 }: DividerProps) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: `${thickness}px solid #141210`,
      }}
    />
  );
}
