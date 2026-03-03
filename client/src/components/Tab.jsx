import { useSnapshot } from "valtio";

import state from "../store";

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  return (
    <button
      type="button"
      className={`w-14 h-14 flex justify-center items-center cursor-pointer select-none ${isFilterTab ? "rounded-full bg-white/25 shadow-[0_2px_30px_0_rgba(31,38,135,0.07)] backdrop-blur-xs border-white/18" : "rounded-4"}`}
      onClick={handleClick}
      style={activeStyles}
      aria-pressed={isFilterTab ? Boolean(isActiveTab) : undefined}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12 object-contain"}`}
      />
    </button>
  );
};

export default Tab;
