import contractTerms from "../data/contractTerms.json";
import missionTypes from "../data/mission_types.json"

import { weightedPick } from "./weightedPick";
import { termsPick } from "./termsPick";

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export function generateContractTerms(missionType : string = "Objective Raid") {

  let missionTypeItem;
  let transportTimeWeeks = Math.round((randomIntFromInterval(2,12) * 1.1) + 2) * 2;
  let transportTimeMonths = Math.round(transportTimeWeeks/4)
  let baseLength = 3;
  let tempoMultiplier = 1;
  
  for (const item of missionTypes) {

    if (item["Mission Type"] == missionType) {
      missionTypeItem = item;
    }
  }

  if(missionTypeItem?.["Base Length"])
  {
    baseLength = missionTypeItem?.["Base Length"];
  }

  if(missionTypeItem?.["Op. Tempo Multiplier"])
  {
    tempoMultiplier = missionTypeItem?.["Op. Tempo Multiplier"]
  }

  return {
    basePay: termsPick(contractTerms.basePay, 0),
    commandRights: termsPick(contractTerms.commandRights, missionTypeItem?.["Command Modifier"]),
    salvageRights: termsPick(contractTerms.salvageRights, missionTypeItem?.["Salvage Modifier"]),
    supportRights: termsPick(contractTerms.supportRights, missionTypeItem?.["Support Modifier"]),
    transportationRights: termsPick(contractTerms.transportationRights, missionTypeItem?.["Transport Modifier"]),
    baseLength: baseLength,
    tempoMultiplier: tempoMultiplier,
    transportTime: transportTimeMonths
  };
}