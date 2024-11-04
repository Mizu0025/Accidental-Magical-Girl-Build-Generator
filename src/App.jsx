// App.jsx
import React, { useState } from "react";
import CharacterBuildTable from "./Character/CharacterBuildTable";
import GenerateButton from "./Character/GenerateButton";
import { generateBuild } from "./BuildLogic";
import "./App.css";

const App = () => {
  const [characterBuild, setCharacterBuild] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setCharacterBuild(generateBuild());
    setIsGenerated(true);
  };

  return (
    <div className="app">
      <h1>Character Build Generator</h1>
      <GenerateButton onGenerate={handleGenerate} />
      {isGenerated && characterBuild && (
        <CharacterBuildTable build={characterBuild} />
      )}
    </div>
  );
};

export default App;
