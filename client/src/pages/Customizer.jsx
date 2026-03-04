import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { useToast } from "../hooks/useToast";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const editorPanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editorPanelRef.current &&
        !editorPanelRef.current.contains(event.target)
      ) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tabName) => {
    setActiveEditorTab((prev) => (prev === tabName ? "" : tabName));
  };

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    if (!decalType) {
      console.error("Invalid decal type:", type);
      showError("Invalid decal type");
      return;
    }

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = async (type) => {
    if (!file) {
      showError("Please select a file first");
      return;
    }

    try {
      const result = await reader(file);
      handleDecals(type, result);
      setActiveEditorTab("");
      showSuccess("Image uploaded successfully!");
    } catch (error) {
      console.error("Failed to read file", error);
      showError("Failed to read file");
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt.trim()) {
      showError("Please enter a prompt");
      return;
    }

    if (!type || !["logo", "full"].includes(type)) {
      console.error("Invalid type passed to handleSubmit:", type);
      showError("Invalid decal type");
      return;
    }

    const loadingToastId = showLoading("Generating image with AI...");

    try {
      setGeneratingImg(true);

      const response = await fetch("https://shirty-backend.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      dismiss(loadingToastId);

      if (!response.ok) {
        if (
          data.message?.includes("Billing") ||
          data.message?.includes("limit")
        ) {
          throw new Error(
            "This feature is not available now because of no economic support for this project and everything else is ready this alert is also to inform you about it the ai used in this project is DALL.E. platform.openai.com",
          );
        }
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (!data.photo) {
        throw new Error("No image data received from server");
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`);
      showSuccess("AI image generated successfully!");
    } catch (error) {
      dismiss(loadingToastId);
      console.error("Submit error:", error);
      showError(error.message || "Failed to generate image");
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleDownload = () => {
    try {
      downloadCanvasToImage();
      showSuccess("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      showError("Failed to download image");
    }
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div
                ref={editorPanelRef}
                className="bg-white/25 shadow-[0_2px_30px_0_rgba(31,38,135,0.07)] backdrop-blur-xs border-white/18 w-16 border-2 rounded-lg flex flex-col justify-center items-center ml-1 py-4 gap-4 tabs"
              >
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    isActiveTab={activeEditorTab === tab.name}
                    handleClick={() => handleTabClick(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className="backdrop-blur-xs border-white/18 absolute z-10 bottom-5 right-0 left-0 w-full flex justify-center items-center flex-wrap gap-4"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name] ? tab.name : ""}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}

            <button
              onClick={handleDownload}
              className="w-14 h-14 flex justify-center items-center rounded-full cursor-pointer outline-none p-3 hover:bg-white/50 transition-all duration-300 transform hover:scale-110 bg-white/25 shadow-[0_2px_30px_0_rgba(31,38,135,0.07)] backdrop-blur-xs border-white/18"
              title="Download Design"
            >
              <img
                src={download}
                alt="download"
                className="w-6 h-6 object-contain"
              />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
