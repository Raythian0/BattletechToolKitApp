import contractTerms from "../data/contractTerms.json";
import missionTypes from "../data/mission_types.json"

import { weightedPick } from "./weightedPick";
import { termsPick } from "./termsPick";
import { campaignFocus } from "../stores/contractStore";
import { get } from "svelte/store";

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export function generateContractTerms(missionType : string = "Objective Raid") {

  let missionTypeItem;
  let transportTimeWeeks = Math.round((randomIntFromInterval(2,12) * 1.1) + 2) * 2;
  let transportTimeMonths = Math.round(transportTimeWeeks/4)

  let commandRightsMod = 0;
  let salvageRightsMod = 0;
  let supportRightsMod = 0;
  let transportationRightsMod = 0;
  let baseLength =3;
  let tempoMultiplier = 1;
  
  for (const item of missionTypes) {

    if (item["Mission Type"] == missionType) {
      missionTypeItem = item;
    }
  }

  if(get(campaignFocus) == "mercenaries")
  {
    commandRightsMod = 0;
    salvageRightsMod = 0;
    supportRightsMod = 0;
    transportationRightsMod = 0;
    baseLength = 3;
    tempoMultiplier = 1;
    transportTimeMonths = 1;
  }
  else
  {
      commandRightsMod = missionTypeItem?.["Command Modifier"] ?? 0;
      salvageRightsMod = missionTypeItem?.["Salvage Modifier"] ?? 0;
      supportRightsMod = missionTypeItem?.["Support Modifier"] ?? 0;
      transportationRightsMod = missionTypeItem?.["Transport Modifier"] ?? 0;
      baseLength = missionTypeItem?.["Base Length"] ?? 3;
      tempoMultiplier = missionTypeItem?.["Op. Tempo Multiplier"] ?? 1;
  }

  return {
    basePay: termsPick(contractTerms.basePay, 0),
    commandRights: termsPick(contractTerms.commandRights, commandRightsMod),
    salvageRights: termsPick(contractTerms.salvageRights, salvageRightsMod),
    supportRights: termsPick(contractTerms.supportRights, supportRightsMod),
    transportationRights: termsPick(contractTerms.transportationRights, transportationRightsMod),
    baseLength: baseLength,
    tempoMultiplier: tempoMultiplier,
    transportTime: transportTimeMonths
  };
}