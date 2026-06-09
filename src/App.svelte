<script lang="ts">
  let currentPage = $state("cover");

  function goToContracts() {
    currentPage = "contracts";
  }

  function goToCover() {
    currentPage = "cover";
  }

  import { generateContracts } from "./lib/generator/generateContracts";
  import { campaignFocus } from "./lib/stores/contractStore";

  let scale = $state(1);
  let companyName = $state("Unknown Company");
  let maxContracts = $state(6);
  let hiringHall = $state("standard_Hall");
  let campaignFocusList =  $state("general_Operations");
  let employerType = $state("Major Power");
  
  let contracts = $state(generateContracts());

  let activeContractId = $state<string | null>(null);

  function regenerate() {
    campaignFocus.set(campaignFocusList);
    
    contracts = generateContracts(scale, companyName, employerType, maxContracts, hiringHall);
    activeContractId = contracts.length > 0 ? contracts[0].id : null;
    
  }

  function exportPDF() {
  window.print();
  }

</script>

{#if currentPage === "cover"}
  <main>

    <section class="hero">
    <h1>BattleTech Contract Generator</h1>

    <button onclick={goToContracts}>Open Contract Board</button>

    <p>
      Generate dynamic mercenary contracts, mission tracks and
      operational rights
    </p>

    <h3>What is this?</h3>
    <p>
      This Contract Generator is a GM support tool allowing for the quick creation of contracts, including suggested tracks and objectives.
      <br>
      Has been built based on the combination of Campaign Operation, Mercenaries and Hot Spot books.
      <br>
      As with all GM support tools discression is advised. This has been created for personal use.
    </p>

    <h3>How it works</h3>
    <p>
      User selects the following:
      <br>Company Name -> Has no effect on Generator
      <br>Campaign -> Focus the rules used in the Generator
      <br>Hiring Hall -> Effects number of offers/contracts, Employers and Missions Type
      <br>Scale -> Determines payout base before multiplier
      <br>With the above the contracts will generated the rest of the contracts information.
      <br>Track scenarios are high level version of the book versions, see track notes to where inspiration is taken from.
      <br>Track scenarios can be used as inspiration, GM discression advised.
    </p>

  </section>
    
  </main>
{:else if currentPage === "contracts"}
  <main>
    <button onclick={goToCover}>Homepage</button>
    <h1>Contract Board</h1>

    <!-- Your contract generator UI goes here -->
        <header>
        <h1>BattleTech Contract Generator</h1>

        <label>
            Company Name
            <input type="text" bind:value={companyName} />
        </label>

        <label>
          Campaign
          <select bind:value={campaignFocusList}>
            <option value="general_Operations">General Operations</option>
            <option value="mercenaries" >Mercenaries</option>
            <option value="hinterlands" disabled>Hinterlands</option>
            <option value="draconisReach" disabled>Draconis Reach</option>
          </select>
        </label>

        <label>
          Hiring Hall
          <select bind:value={hiringHall}>
            <option value="questionable_Hall">Questionable Hall</option>
            <option value="minor_Hall">Minor Hall</option>
            <option value="standard_Hall">Standard Hall</option>
            <option value="great_Hall">Great Hall</option>
            <option value="no_Hall">No Hall</option>
          </select>
        </label>


        <label>
            Scale
            <input
                type="number"
                min="0"
                max="3"
                step="1"
                bind:value={scale}
            />
        </label>

        <button class="interactButton" onclick={regenerate}>
          Generate Contracts
        </button>

        <button class="interactButton" onclick={exportPDF} disabled hidden>
          Export PDF
        </button>
      </header>

      {#if contracts.length === 0}
      <section class="empty-state">
        <h2>No Contracts Available</h2>
        <p>No suitable contracts are currently available.</p>
      </section>
    {:else}
      <section class="tabs">
        <div class="tab-buttons">
          {#each contracts as contract, index}
            <button
              class:active={activeContractId === contract.id}
              onclick={() => (activeContractId = contract.id)}
            >
              Contract {index + 1} {contract.missionType}
            </button>
          {/each}
        </div>

        {#each contracts as contract}
          {#if activeContractId === contract.id}
            <article class="contract-card">
              <h2>{contract.title} | {contract.specialMissionType} {contract.missionType} | {contract.employer}</h2>

              <!-- Put your Terms table here -->
              <table>
                <tbody>
                    <tr>

                        <th style="background-color: #e8e8e8;">Company</th>
                        <td>{companyName}</td>

                        <td style="background-color: #e8e8e8;"><strong>Scale</strong></td>
                        <td>{contract.scale}</td>
                        
                    </tr>

                    <tr>

                        <th style="background-color: #e8e8e8;">Contract Length</th>
                        <td>{contract.terms.baseLength} Months</td>

                        <td style="background-color: #e8e8e8;"><strong>Transport Time</strong></td>
                        <td>{contract.terms.transportTime} Month</td>

                    </tr>

                    <tr>

                      <th style="background-color: #e8e8e8;">Contract Pay</th>
                      <td>{contract.terms.basePay.label}<br /></td>

                      <td style="background-color: #e8e8e8;"><strong>Base Pay</strong></td>
                      <td>{(500 * scale)* contract.terms.basePay.value / 100} SP<br /></td>
                    
                    </tr>

                    <tr>
                      <th style="background-color: #e8e8e8;">Command Rights</th>
                    <td>
                        {contract.terms.commandRights.label}<br />
                    </td>

                    <td style="background-color: #e8e8e8;"><strong>Salvage Rights</strong></td>
                    <td>
                        {contract.terms.salvageRights.label}<br />
                        {contract.terms.salvageRights.description}
                    </td>
                    </tr>

                    <tr>
                      <th style="background-color: #e8e8e8;">Support Rights</th>
                    <td>
                        {contract.terms.supportRights.label}<br />
                    </td>

                    <td style="background-color: #e8e8e8;"><strong>Transportation Rights</strong></td>
                      <td>{contract.terms.transportationRights.label}<br />
                      Final Cost: {(300 *scale) - ((300 * scale) * contract.terms.transportationRights.scaledValue/100)} SP</td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #e8e8e8;"><strong>Mission Tempo</strong></td>
                        <td>{contract.terms.tempoMultiplier}</td>
                        <td style="background-color: #e8e8e8;"><strong>Combat Pay</strong></td>
                        <td>{((500 * scale) * contract.terms.basePay.scaledValue / 100) * contract.terms.tempoMultiplier} SP</td>
                    </tr>
                </tbody>
              </table>

              <p></p>

              <table>
                <tbody>
                  <tr>

                        <th style="background-color: #e8e8e8;">Scale OpFor BV</th>
                        <td>{3000 * scale}</td>

                        <td style="background-color: #e8e8e8;"><strong>Tempo OpFor</strong></td>
                        <td>{3000 * scale * contract.terms.tempoMultiplier}</td>
                        
                    </tr>
                </tbody>
              </table>

              {#if contract.tracks && contract.tracks.length > 0}
                <section class="tracks-section">
                <h3>Tracks</h3>

                {#each contract.tracks as track, trackIndex}
                  <table class="track-table">
                    <caption>
                      Track {trackIndex + 1}: {track.track}
                    </caption>

                    <tbody>
                      <tr>
                        <th>Setup</th>
                        <td>{track.setup}</td>
                      </tr>

                      <tr>
                        <th>Setup Attacker</th>
                        <td>{track.setupAtt}</td>
                      </tr>

                      <tr>
                        <th>Setup Defender</th>
                        <td>{track.setupDef}</td>
                      </tr>

                      <tr>
                        <th>Attacker Primary Objective</th>
                        <td>{track.primaryObjAttk}</td>
                      </tr>
                    {#if track.secondaryObjAttk != ""}
                      <tr>
                        <th>Attacker Secondary Objective</th>
                        <td>{track.secondaryObjAttk}</td>
                      </tr>
                    {/if}
                      <tr>
                        <th>Defender Primary Objective</th>
                        <td>{track.primaryObjDef}</td>
                      </tr>
                    {#if track.secondaryObjDef != ""}
                      <tr>
                        <th>Defender Secondary Objective</th>
                        <td>{track.secondaryObjDef}</td>
                      </tr>
                    {/if}
                      <tr>
                        <th>Notes</th>
                        <td>{track.Notes}</td>
                      </tr>
                    </tbody>
                  </table>
                {/each}
              </section>
            {:else}
              <section class="tracks-section">
                <h3>Tracks</h3>
                <p>No tracks generated for this contract.</p>
              </section>
            {/if}

            </article>
          {/if}
        {/each}
      </section>
    {/if}
  </main>
{/if}

{#if currentPage === "cover"}
  <style>
    .cover-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background:
        linear-gradient(
          to bottom,
          #111,
          #222
        );

      color: white;
      font-family: sans-serif;
      padding: 2rem;
    }

    .hero {
      max-width: 800px;
      text-align: center;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    button {
      padding: 1rem 2rem;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: 0.5rem;
      background: #c89b3c;
      color: black;
      font-weight: bold;
    }

    button:hover {
      background: #ddb85f;
    }
  </style>
{:else if currentPage === "contracts"}
  <style>
    :global(html)
    {
      background: #222;
      color: whitesmoke;
    }

    .navigateButtons{
      padding: 0.5rem 0.9rem;
      border: 1px solid #ccc;
      background: #c89b3c;
      cursor: pointer;
      border: none;
      border-radius: 0.5rem;
    }

    .interactButton{
      padding: 0.5rem 0.9rem;
      border: 1px solid #ccc;
      background: #c89b3c;
      cursor: pointer;
      border: none;
      border-radius: 0.5rem;
    }

    .tabs {
      margin-top: 1rem;
      color: whitesmoke;
    }

    .tab-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      border: none;
      border-radius: 0.5rem;
    }

    .tab-buttons button {
      padding: 0.5rem 0.9rem;
      border: 1px solid #ccc;
      background: #c89c3c;
      cursor: pointer;
      border: none;
      border-radius: 0.5rem;
    }

    button:hover {
      background: #ddb85f;
      border: none;
    }

    .tab-buttons button.active {
      background: #222;
      color: white;
      font-weight: bold;
      border: 1px solid white;
      border-radius: 0.5rem;
    }

    .contract-card {
      border: 1px solid #ccc;
      border-radius: 0.75rem;
      padding: 1rem;
      background: #222;
      color: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    th,
    td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
      vertical-align: top;
      background: #c89b3c;
    }

    th {
      width: 220px;
      background: #c89b3c;
      color: black;
    }

    td {
      background: white;
      color: black;
    }

    .tracks-section {
    margin-top: 1.5rem;
    color: white;
    }

    .track-table {
    margin-top: 1rem;
    color: black;
    }

    caption {
    text-align: left;
    font-weight: bold;
    padding: 0.5rem 0;
    color: white;
    }
  </style>
{/if}