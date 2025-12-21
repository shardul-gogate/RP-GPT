export function buildAIPrompt(messages, quests, plotPoints, gameState) {
  const contextMessages = messages
    .slice(-15, -1) // take last 15 messages excluding the latest input
    .map(message => message.trim())
    .join(" ");

  const latestInput = messages
    .slice(-1)[0]
    .trim();

  const questText = quests
    .filter(quest => quest.status === "Active")
    .map(quest => {
      const objectives = quest.objectives
        .map(objective => `${objective.name} - [${objective.completed ? "done" : "pending"}]`)
        .join(", ");
      return `Quest: ${quest.name} (Status: ${quest.status}) - Description: ${quest.description} - Objectives: ${objectives}`;
    })
    .join("\n");

  const textToScan = contextMessages + "\n" + latestInput + "\n" + questText;
  const triggeredPlotPoints = plotPoints.filter(plotPoint =>
    plotPoint.triggers.some(trigger => {
      const pattern = new RegExp(`\\b${trigger}\\b`, "i"); // word boundary, case-insensitive
      return pattern.test(textToScan);
    })
  );
  console.log("# of Triggered Plot Points:", triggeredPlotPoints.length);
  const plotPointText = triggeredPlotPoints.map(plotPoint => `- ${plotPoint.description}`).join("\n");

  // Build final prompt
  const prompt = `
  Story Context:
  ${contextMessages}

  Active Quests:
  ${questText || "None"}

  Relevant Plot Elements:
  ${plotPointText || "None"}

  In-game Date and Time:
  ${gameState.date || "<unknown>"}, ${gameState.day || "<unknown>"}, ${gameState.timeOfDay || "<unknown>"}

  Player Input:
  ${latestInput}
  `;
  console.log("Prompt : ", prompt)
  return prompt;
}