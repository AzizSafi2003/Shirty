import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Preloader from "./components/Preloader";

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <React.StrictMode>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <App />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
