export type employerItem = {
  step: number[];
};

  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
  }

export function employerPick<T extends employerItem>( items: T[], offerMod: number = 0): T {
  if (!items.length) {
    throw new Error("Cannot pick from an empty list.");
  }

  let employerRoll = randomIntFromInterval(2, 12) + offerMod;
  employerRoll = clamp(employerRoll, 0, 13)

  for (const item of items) {
    if (item.step.includes(employerRoll)) {
      return item;
    }
  }

  return items[items.length - 1];
}