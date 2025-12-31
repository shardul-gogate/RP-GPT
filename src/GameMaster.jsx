import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import Canvas from "./components/Canvas";
import { useGameProgress } from "./hooks/useGameProgress";
import { useGameState } from "./hooks/useGameState";
import { useQuests } from "./hooks/useQuests";
import { usePlotPoints } from "./hooks/usePlotPoints";
import { useFullSave } from "./hooks/useFullSave";
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
import { buildAIPrompt } from "./utils/buildPrompt";
import { ApiPaths } from "./utils/constants";
import api from "./utils/api";

export default function GameMaster() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => { api.get(ApiPaths.Api_Progress).then((data) => setMessages(data)); }, []);

  const { gameState } = useGameState();  
  const { plotPoints, addPlotPoint, updatePlotPoint, deletePlotPoint } = usePlotPoints();
  const { quests, addNewQuest, updateQuest, deleteQuest } = useQuests();
  const { saveFullGame, loadGame } = useFullSave();
  const { saveHistory } = useGameProgress();
  const { models, generate, loading } = useOllama();
  const { settings, saveSettings } = useSettings(models);

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

  const handleOnCompletion = (data) => { setMessages((prev) => [...prev, data]); }
  
  const handleSend = () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;
    setMessages((prev) => [...prev, trimmedPrompt]);
    setPrompt("");
    const builtPrompt = buildAIPrompt([...messages, trimmedPrompt], quests, plotPoints, gameState);
    generate(builtPrompt, settings, handleOnCompletion);
  }

  const handleRetry = () => {
    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);
    const builtPrompt = buildAIPrompt(newMessages, quests, plotPoints, gameState);
    generate(builtPrompt, settings, handleOnCompletion);
  };

  const handleContinue = () => {
    const builtPrompt = buildAIPrompt(messages, quests, plotPoints, gameState)
    generate(builtPrompt, settings, handleOnCompletion);
  };

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
        <UserInput
          value={prompt}
          onChange={setPrompt}
          placeholder="Describe your action or dialogue . . ."
          onSend={handleSend}
          loading={loading}
          eraseLastMessage={eraseLastMessage}
          retry={handleRetry}
          continueChat={handleContinue}
        />
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
    </>
  );
}