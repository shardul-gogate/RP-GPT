import { QuestStatusEnum } from "./enums";

const getContextMessages = (messages, numOfWords) => {
  const contextMessagesList = [];
  let wordCount = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i].trim();
    if (!message) continue;

    const words = message.split(/\s+/);
    const messageWordCount = words.length;

    if (wordCount < numOfWords) {
      contextMessagesList.unshift(message);
      wordCount += messageWordCount;
    } else {
      break;
    }
  }
  return contextMessagesList;
}

const getActiveQuestsText = (quests) => {
  return quests
  .filter(quest => quest.status === QuestStatusEnum.ACTIVE && (quest.sample === undefined || !quest.sample))
  .map(quest => {
    const objectives = quest.objectives
      .map(objective => `${objective.name} - [${objective.completed ? "done" : "pending"}]`)
      .join(", ");
    return `Quest: ${quest.name} (Status: ${quest.status})
    Description: ${quest.description}
    Objectives: ${objectives}`;
  })
  .join("\n");
}

const getTriggeredPlotPoints = (plotPoints, textToScan) => {
  return plotPoints
    .filter(plotPoint => (plotPoint.sample === undefined || !plotPoint.sample))
    .filter(plotPoint => {
      let matchedTriggerCount = 0;
      for (const trigger of plotPoint.triggers) {
        const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(escapedTrigger, "ig"); // case-insensitive substring match
        const matches = textToScan.match(pattern);
        if (matches && matches.length >= 2) {
          return true;
        }
        if (matches && matches.length === 1) {
          matchedTriggerCount += 1;
        }
      }
      return matchedTriggerCount >= 2;
    });
}

const buildSummary = (summary) => {
  return summary.map((element, index) => `Chapter ${index + 1} - ${element.text}`).join('\n\n');
};

const buildSummaryPrompt = (summary, messages) => {
  if (summary.length === 0) {
    return messages.join(" ");
  } else {
    return messages.slice(summary[summary.length - 1].lastIndex + 1).join(" ");
  }
};

const buildGamePrompt = (summary, messages, quests, plotPoints, gameState) => {
  let summaryText = "";
  if (summary.length > 0) {
    summaryText = buildSummary(summary);
  }
  const contextMessages = summaryText
    ? getContextMessages(messages.slice(summary[summary.length - 1].lastIndex - 4, -1), 1500).join(" ")
    : getContextMessages(messages.slice(0, -1), 2500).join(" ");
  const latestInput = messages.slice(-1)[0].trim();
  const activeQuestsText = getActiveQuestsText(quests);

  const textToScan = contextMessages + "\n" + latestInput + "\n" + activeQuestsText;
  const triggeredPlotPoints = getTriggeredPlotPoints(plotPoints, textToScan);
  console.log("# of Triggered Plot Points:", triggeredPlotPoints.length);
  const plotPointText = triggeredPlotPoints.map(plotPoint => `- ${plotPoint.description}`).join("\n");

  const prompt = `
${summaryText ? `Previous story summary: ${summaryText}` : ''}

Story: ${contextMessages}
${activeQuestsText ? `\nActive Quests:
${activeQuestsText}` : ''}
${plotPointText ? `\nRelevant Context:
${plotPointText}` : ''}

Day and Time: ${gameState.dayAndDate} - ${gameState.timeOfDay}

Prompt: ${latestInput}
`;
  console.log(prompt);
  return prompt;
}

export { buildGamePrompt, buildSummary, buildSummaryPrompt };
