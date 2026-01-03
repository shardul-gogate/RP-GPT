import { QuestStatusEnum } from "./enums";

export function buildAIPrompt(messages, quests, plotPoints, gameState) {
  const contextMessages = messages
    .slice(-20, -1) // take last 15 messages excluding the latest input
    .map(message => message.trim())
    .join(" ");

  const latestInput = messages
    .slice(-1)[0]
    .trim();

  const activeQuestsText = quests
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

  const otherQuestsText = quests
    .filter(quest => quest.status !== QuestStatusEnum.ACTIVE && (quest.sample === undefined || !quest.sample))
    .map(quest => {
      return `Quest: ${quest.name} (Status: ${quest.status})
      Description: ${quest.description}`;
    })
    .join("\n");
      

  const textToScan = contextMessages + "\n" + latestInput + "\n" + activeQuestsText;
  const triggeredPlotPoints = plotPoints
    .filter(plotPoint => (plotPoint.sample === undefined || !plotPoint.sample))
    .filter(plotPoint =>
      plotPoint.triggers.some(trigger => {
        const pattern = new RegExp(`\\b${trigger}\\b`, "i"); // word boundary, case-insensitive
        return pattern.test(textToScan);
      })
    );
  console.log("# of Triggered Plot Points:", triggeredPlotPoints.length);
  const plotPointText = triggeredPlotPoints.map(plotPoint => `- ${plotPoint.description}`).join("\n");

  // Build final prompt
  const prompt = `
  Story: ${contextMessages}
  Player Action: ${latestInput}
  
  Day and Date: ${gameState.dayAndDate}
  Time of Day: ${gameState.timeOfDay}

  ${activeQuestsText ? `\nActive Quests:
  ${activeQuestsText}` : ''}
  ${otherQuestsText ? `\nOther Quests:
  ${otherQuestsText}` : ''}
  ${plotPointText ? `\nRelevant Context:
  ${plotPointText}` : ''}
  `;
  return prompt;
}