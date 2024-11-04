import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement); // Use createRoot with the root element
  root.render(<App />);
}
