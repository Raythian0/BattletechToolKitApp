import { get } from "svelte/store";
import { campaignFocus } from "../stores/contractStore";
import missionTableData from "../data/mission_table.json"


function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function getMissionTypePick(hHMissionsMod: number = 1, employer: string = "minor_Power"): [string, string, string]
{
    //data variables
    const employerList = missionTableData.employers;
    const innerSphereClanMissionList = missionTableData.inner_sphere_clan;
    const independentMissionList = missionTableData.independent;
    const corporationMissionList = missionTableData.corporation;
    const specialMissionList = missionTableData.Special;
    const covertMissionList = missionTableData.Covert;
    const pirateMissionList = missionTableData.Pirate;
    const mercenaryMissionList = missionTableData.Mercenary;

    //results variables
    let missionListId = "inner_sphere_clan";
    let missionListResultId = "";
    let missionListResultLabel = "";
    let extraMissionLists = ["covert","special","pirate"]

    let finalMissionResultId = "objective_Raid_M";
    let finalMissionResult = "Objective Raid";
    let finalSpecialResult = "";
    let specialListResultLabel = "";

    if(get(campaignFocus)=="mercenaries")
    {
        missionListId = "Mercenaries";
    }
    else{
        for (const employerListItem of employerList)
        {
            if(employerListItem.employerList.includes(employer))
            {
                missionListId = employerListItem.id;
            }
        }   
    }

    let missionListRoll = randomIntFromInterval(2, 12) + hHMissionsMod;
    missionListRoll = clamp(missionListRoll, 2, 12)

    switch (missionListId)
    {
        case "inner_sphere_clan":{
            for (const innerSphereClanMissionListItem of innerSphereClanMissionList)
            {
                if(innerSphereClanMissionListItem.step.includes(missionListRoll))
                {
                    missionListResultId = innerSphereClanMissionListItem.id;
                    missionListResultLabel = innerSphereClanMissionListItem.label;
                }
            }  
            break;
        }
        case "independent":{
            for (const independentMissionListItem of independentMissionList)
            {
                if(independentMissionListItem.step.includes(missionListRoll))
                {
                    missionListResultId = independentMissionListItem.id;
                    missionListResultLabel = independentMissionListItem.label
                }
            } 
            break;
        }
        case "corporation":{
            for (const corporationMissionListItem of corporationMissionList)
            {
                if(corporationMissionListItem.step.includes(missionListRoll))
                {
                    missionListResultId = corporationMissionListItem.id;
                    missionListResultLabel = corporationMissionListItem.label;
                }
            } 
            break;
        }
        case "Mercenaries":{
            for (const mercenaryMissionListItem of mercenaryMissionList)
            {
                if(mercenaryMissionListItem.step.includes(missionListRoll))
                {
                    missionListResultId = mercenaryMissionListItem.id;
                    missionListResultLabel = mercenaryMissionListItem.label;
                }
            } 
            break;
        }


    }

    if(!extraMissionLists.includes(missionListResultId))
    {
        finalMissionResultId = missionListResultId;
        finalMissionResult = missionListResultLabel;
        return [finalMissionResult,"", finalMissionResultId]
    }

    let specialMissionListRoll = randomIntFromInterval(2, 12) + hHMissionsMod;
    specialMissionListRoll = clamp(missionListRoll, 2, 12)

    let covertMissionListRoll = randomIntFromInterval(2, 12) + hHMissionsMod;
    covertMissionListRoll = clamp(missionListRoll, 2, 12)

    switch (missionListResultId)
    {
        case "covert":{
            for (const covertMissionListItem of covertMissionList)
            {
                if(covertMissionListItem.step.includes(specialMissionListRoll))
                {
                    missionListResultId = covertMissionListItem.id;
                    missionListResultLabel = covertMissionListItem.label;
                    specialListResultLabel = covertMissionListItem.type;
                }
            } 
            break;
        }
        
        case "special":{
            for (const specialMissionListItem of specialMissionList)
            {
                if(specialMissionListItem.step.includes(specialMissionListRoll))
                {
                    missionListResultId = specialMissionListItem.id;
                    missionListResultLabel = specialMissionListItem.label;
                    specialListResultLabel = specialMissionListItem.type;
                }
            } 

            if(missionListResultId = "covert")
            {
                for (const covertMissionListItem of covertMissionList)
                {
                    if(covertMissionListItem.step.includes(covertMissionListRoll))
                    {
                        missionListResultId = covertMissionListItem.id;
                        missionListResultLabel = covertMissionListItem.label
                        specialListResultLabel = covertMissionListItem.type;
                    }
                } 
            }
            break;
        }
        
        case "pirate":{
            for (const pirateMissionListItem of pirateMissionList)
            {
                if(pirateMissionListItem.step.includes(specialMissionListRoll))
                {
                    missionListResultId = pirateMissionListItem.id;
                    missionListResultLabel = pirateMissionListItem.label
                    specialListResultLabel = pirateMissionListItem.type;
                }
            } 
            break;
        }
    }

    finalMissionResultId = missionListResultId;
    finalMissionResult = missionListResultLabel;
    return [finalMissionResult,specialListResultLabel, finalMissionResultId]
}