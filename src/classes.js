export class StoryCard {
  constructor(description = "", triggers = []) {
    this.description = description;
    this.triggers = triggers; // array of strings
  }
}

export class QuestObjective {
  constructor(name = "", completed = false) {
    this.name = name;
    this.completed = completed;
  }
}

export const QuestStatusEnum = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  FINISHED: "Finished",
};

export class Quest {
  constructor(objectives = [], status = QuestStatusEnum.INACTIVE) {
    this.objectives = objectives; // array of QuestObjective
    this.status = status; // one of QuestStatusEnum
  }
}
