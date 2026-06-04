import tracksListData from "../data/tracksList.json";
import missionData from "../data/mission_types.json"

type Track = {
  trackKey: string;
  track: string;
  setup: string;
  setupAtt: string;
  setupDef: string;
  primaryObjAttk: string;
  secondaryObjAttk: string;
  primaryObjDef: string;
  secondaryObjDef: string;
  Notes: string;
  stepMod: number;
  trackCategory: string[];
};


function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  //console.log({value,min,max});
let clampedValue = Math.max(min, Math.min(value, max));
  //console.log("Clamped value: "+clampedValue)
return clampedValue;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function hasSharedValue(
  array1: string[],
  array2: string[]
): boolean {
  return array1.some(value => array2.includes(value));
}

function getTrackCount(missionType: string): number {

  let trackRoll = 0;

  for (const missionListItem of missionData)
    {
        if(missionListItem["Mission Type"].includes(missionType))
        {
            const missionListResult = missionListItem;
            let trackCountMod = missionListResult["Track Modifier"][0];
            //console.log("Track Count Mod on Mission "+missionType+":"+trackCountMod);
            trackRoll = randomInt(1,6) + trackCountMod;
            //console.log("Track Count on Mission "+missionType+":"+trackRoll);
            let minTrack = missionListResult["Track Modifier"][1];
            //console.log("Track Count Min on Mission "+missionType+":"+minTrack);
            let maxTrack = missionListResult["Base Length"];
            //console.log("Track Count Max on Mission "+missionType+":"+maxTrack);
            trackRoll = clamp(trackRoll, minTrack, maxTrack);
        }
    }

    //console.log("Track Count on Mission "+missionType+":"+trackRoll);
    
  return trackRoll;

}

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateTracks(
  missionType: string
) {

  let missionCategories = [""];
  let trackCount = getTrackCount(missionType);

  for (const missionListItem of missionData)
    {
        if(missionListItem["Mission Type"].includes(missionType))
        {
            const missionListResult = missionListItem;
            missionCategories = missionListResult["Track Category"];
        }
    }

  const availableTracks = tracksListData.Tracks.filter((track) =>
    hasSharedValue(track.trackCategory, missionCategories)
  );

  if (availableTracks.length === 0) {
    return [];
  }

  return Array.from({ length: trackCount }, () =>
    randomPick(availableTracks)
  );
}