import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import Canvas from "./components/Canvas";
import { useGameProgress } from "./hooks/useGameProgress";
import { useGameState } from "./hooks/useGameState";
import { useQuests } from "./hooks/useQuests";
import { usePlotPoints } from "./hooks/usePlotPoints";
import { useFullSave } from "./hooks/useFullSave";
import { useSummary } from "./hooks/useSummary";
import TopAppBar from "./components/TopAppBar";
import { useSmallModal } from "./hooks/useSmallModal";
import { useLargeModal } from "./hooks/useLargeModal";
import SmallModal from "./components/SmallModal";
import PlotPointsModal from "./components/PlotPointsModal";
import { LargeModalTypeEnum } from "./utils/enums";
import QuestsModal from "./components/QuestsModal";
import SettingsModal from "./components/SettingsModal";
import { useOllama } from "./hooks/useOllama";
import { useSettings } from "./hooks/useSettings";
import { buildGamePrompt, buildSummary, buildSummaryPrompt } from "./utils/prompt";
import { ApiPaths } from "./utils/constants";
import api from "./utils/api";
import LoadingIndicator from "./components/LoadingIndicator";
import SummaryModal from "./components/SummaryModal";

export default function GameMaster() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestSummary, setLatestSummary] = useState("");

  useEffect(() => { api.get(ApiPaths.Api_Progress).then((data) => setMessages(data)); }, []);

  const { gameState, updateGameState } = useGameState();  
  const { plotPoints, addPlotPoint, updatePlotPoint, deletePlotPoint } = usePlotPoints();
  const { quests, addNewQuest, updateQuest, deleteQuest } = useQuests();
  const { saveFullGame, loadGame } = useFullSave();
  const { saveHistory } = useGameProgress();
  const { models, generateStream, loading } = useOllama();
  const { settings, saveSettings } = useSettings(models);
  const { summary, saveSummary, generateSummary } = useSummary();

  const {
    isSmallModalOpen,
    smallModalTypeEnum,
    handleSave: handleSaveSmallModal,
    handleCancel: handleCancelSmallModal,
    openModal: openSmallModal
  } = useSmallModal(saveFullGame, loadGame);

  const {
    isLargeModalOpen,
    largeModalTypeEnum,
    openModal: openLargeModal,
    closeModal: closeLargeModal
  } = useLargeModal();

  const eraseLastMessage = () => setMessages(m => m.slice(0, -1));

  const handleStream = (data) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] += data;
      return newMessages;
    });
  }
  
  const handleSend = () => {
    if (!prompt) return;
    const newMessages = [...messages, prompt, ""];
    setMessages(newMessages);
    setPrompt("");
    const builtPrompt = buildGamePrompt(summary, [...messages, prompt], quests, plotPoints, gameState);
    generateStream(builtPrompt, settings, handleStream);
  }

  const handleRetry = () => {
    const newMessages = messages.slice(0, -1);
    setMessages([...newMessages, ""]);
    const builtPrompt = buildGamePrompt(summary, newMessages, quests, plotPoints, gameState);
    generateStream(builtPrompt, settings, handleStream);
  };

  const handleContinue = () => {
    const newMessages = [...messages, ""];
    setMessages(newMessages);
    const builtPrompt = buildGamePrompt(summary, messages, quests, plotPoints, gameState)
    generateStream(builtPrompt, settings, handleStream);
  };

  const handleSaveSummary = () => {
    const newSummary = [...summary, {lastIndex: messages.length - 1, text: latestSummary}]
    saveSummary(newSummary)
    setLatestSummary("")
  }

  const handleGenerateSummary = () => {
    generateSummary(buildSummaryPrompt(summary, messages), settings, (data) => {setLatestSummary(data)})
  }

  return (
    <>
      <div className="game-master">
        <TopAppBar
          saveHistory={() => saveHistory(messages)}
          openSmallModal={openSmallModal}
          openLargeModal={openLargeModal}
        />
        <Canvas
          messages={messages}
          onEditMessage={(index, newValue) => {
            setMessages((prev) =>
              prev.map((m, i) => (i === index ? newValue : m))
            );
          }}
        />
        {
          loading ?
          <LoadingIndicator />
          :
          <UserInput
            value={prompt}
            onChange={setPrompt}
            placeholder="Describe your action or dialogue . . ."
            onSend={handleSend}
            eraseLastMessage={eraseLastMessage}
            retry={handleRetry}
            continueChat={handleContinue}
            gameState={gameState}
            updateGameState={updateGameState}
          />
        }
      </div>
      {isSmallModalOpen && <SmallModal smallModalTypeEnum={smallModalTypeEnum} onConfirm={handleSaveSmallModal} onCancel={handleCancelSmallModal} />}
      {
        isLargeModalOpen && largeModalTypeEnum === LargeModalTypeEnum.PLOT_POINTS &&
        <PlotPointsModal
          closeModal={closeLargeModal}
          plotPoints={plotPoints}
          addPlotPoint={addPlotPoint}
          updatePlotPoint={updatePlotPoint}
          deletePlotPoint={deletePlotPoint}
        />
      }
      {
        isLargeModalOpen && largeModalTypeEnum === LargeModalTypeEnum.QUESTS &&
        <QuestsModal
          closeModal={closeLargeModal}
          quests={quests}
          addNewQuest={addNewQuest}
          updateQuest={updateQuest}
          deleteQuests={deleteQuest}
        />
      }
      {
        isLargeModalOpen && largeModalTypeEnum === LargeModalTypeEnum.SETTINGS &&
        <SettingsModal
          settings={settings}
          saveSettings={saveSettings}
          ollamaModels={models}
          closeModal={closeLargeModal}
        />
      }
      {
        isLargeModalOpen && largeModalTypeEnum === LargeModalTypeEnum.SUMMARIZE &&
        <SummaryModal
          summary={buildSummary(summary)}
          latestSummary={latestSummary}
          saveSummary={handleSaveSummary}
          generateNewSummary={handleGenerateSummary}
          closeModal={closeLargeModal}
        />
      }
    </>
  );
}