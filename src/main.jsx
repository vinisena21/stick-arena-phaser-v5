import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { createGame } from "./game.js";

function App() {
  const ref = useRef(null);

  useEffect(() => {
    const game = createGame(ref.current);
    return () => game.destroy(true);
  }, []);

  return <div ref={ref} id="game-root" style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#020617" }} />;
}

createRoot(document.getElementById("root")).render(<App />);
