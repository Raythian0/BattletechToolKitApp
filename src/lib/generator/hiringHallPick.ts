/*
  This method takes the value of the selected Hiring hall and returns the intial Contract Modifiers .
  The returned modifiers are:
    - Offers -> Used as a modifier for the Contract Offers Table (Data found in hiringHall.json)
    - Employers -> Used as a Modifier for the Contract Employers Table (Data found in hiringHall.json)
    - Missions -> Used as a modifier for the Missions Table (Data found in mission_table.json)
*/


export type hallItem = {
  id: string;
};

export function hiringHallPick<T extends hallItem>(items: T[], hiringHall: string = "standard_Hall"): T {
  if (!items.length) {
    throw new Error("Cannot pick from an empty list.");
  }

  for (const item of items) {

    if (item.id == hiringHall) {
      return item;
    }
  }

  return items[items.length - 1];
}