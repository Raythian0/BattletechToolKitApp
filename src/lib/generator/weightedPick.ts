export type WeightedItem = {
  weight: number;
};

export function weightedPick<T extends WeightedItem>(items: T[]): T {
  if (!items.length) {
    throw new Error("Cannot pick from an empty list.");
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of items) {
    roll -= item.weight;

    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}