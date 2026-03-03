import React from "react";

import state from "../store";
import { useSnapshot } from "valtio";

import { getContrastingColor } from "../config/helpers";

const CustomButton = ({ type, title, customStyles, handleClick }) => {
  const snap = useSnapshot(state);
  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      };
    } else if (type === "outline") {
      return {
        backgroundColor: "#fff",
        color: "#000",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      };
    }
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md cursor-pointer ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
