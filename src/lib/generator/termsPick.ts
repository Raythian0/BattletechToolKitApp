export type termsItem = {
  step: number[];
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
  }

export function termsPick<T extends termsItem>(items: T[], rollMod: number = 0): T {
  if (!items.length) {
    throw new Error("Cannot pick from an empty list.");
  }

  let roll = randomInt(2,12) + rollMod;
  roll = clamp(roll, 1, 13)

  for (const item of items) {

    if (item.step.includes(roll)) {
      return item;
    }
  }

  return items[items.length - 1];
}