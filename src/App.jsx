import React, { useState } from "react";
import CharacterBuildTable from "./Character/CharacterBuildTable";
import GenerateButton from "./Character/GenerateButton";
import { generateBuild } from "./BuildLogic";
import StatDisplay from "@Stats/StatDisplay";
import CurrencyDisplay from "@Currency/CurrencyDisplay";
import "./App.css";
import Panel from "@Helpers/Panel";

const App = () => {
  const [characterBuild, setCharacterBuild] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setCharacterBuild(generateBuild());
    setIsGenerated(true);
  };

  const noInfoPanelMessage = <p>Nothing yet!</p>;

  const statsPanel = (
    <Panel
      position="bottom-left-panel"
      title="Stats"
      content={
        isGenerated ? (
          <StatDisplay stats={characterBuild.stats} />
        ) : (
          noInfoPanelMessage
        )
      }
    />
  );

  const currencyPanel = (
    <Panel
      position="bottom-right-panel"
      title="Currency"
      content={
        isGenerated ? (
          <CurrencyDisplay coins={characterBuild.coins} />
        ) : (
          noInfoPanelMessage
        )
      }
    />
  );

  const artifactsPanel = (
    <Panel
      position="top-left-panel"
      title="Artifacts"
      content={isGenerated ? characterBuild.ownedArtifacts : noInfoPanelMessage}
    />
  );

  return (
    <div className="app">
      <h1>Character Build Generator</h1>
      <GenerateButton onGenerate={handleGenerate} />
      {statsPanel}
      {currencyPanel}
      {artifactsPanel}
      {isGenerated && characterBuild && (
        <CharacterBuildTable build={characterBuild} />
      )}
    </div>
  );
};

export default App;
