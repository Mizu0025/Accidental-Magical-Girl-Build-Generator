import { data, originRules, originFields } from './js/data.js';
import { rollD20, getResult, getPerkResult, pRange, checkOverlap } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsTableBody = document.querySelector('#results-table tbody');

    // Data from accidentalMahou.md


    const exportBtn = document.getElementById('export-btn');
    const goldCountEl = document.getElementById('gold-count');
    const silverCountEl = document.getElementById('silver-count');
    const bronzeCountEl = document.getElementById('bronze-count');
    // ageSelect removed, select dynamically
    const manualSelectionsGrid = document.getElementById('manual-selections');
    const originTypeSelect = document.getElementById('origin-type');

    const unlockOptionsBtn = document.getElementById('unlock-options-btn');

    let currentBuild = { rolls: [], items: [], perk5Showing: 'combat', purchasedStats: {}, wallet: { gold: 1, silver: 3, bronze: 4 }, origin: 'Contract' };
    let manualMode = false;
    let upgradesPurchased = { power2: false, extras: false };

    // --- Origin Rules ---


    function setFieldVisibility(origin) {
        // Get all selector containers (parent of select)
        const allSelectors = [
            'age-select', 'body-select', 'spec-select', 'weapon-select', 'outfit-select', 'power-select',
            'e-perk1-select', 'e-perk2-select', 'e-perk3-select', 'e-perk4-select', 'perk5-select', 'extra-perk1-select', 'extra-perk2-select', 'artifact-select', 'power2-select'
        ];

        const allowed = originFields[origin] || [];

        allSelectors.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const container = el.parentElement; // .manual-field
                let shouldShow = false;

                if (manualMode || allowed.includes(id)) {
                    shouldShow = true;
                }

                // Hide Artifact unless Origin is Artifact (requested specific behavior)
                if (id === 'artifact-select' && origin !== 'Artifact') {
                    shouldShow = false;
                }

                // Hide Upgrades unless purchased
                if (id === 'power2-select' && !upgradesPurchased.power2) shouldShow = false;
                if ((id === 'extra-perk1-select' || id === 'extra-perk2-select') && !upgradesPurchased.extras) shouldShow = false;

                container.style.display = shouldShow ? 'flex' : 'none';
                if (!shouldShow && !manualMode && !id.includes('power2') && !id.includes('extra')) el.value = "";
                // Don't reset purchased upgrades on toggle, or do we? Probably safe to not reset if they are just hidden.
            }
        });
    }

    // --- Populate Manual Selections ---
    function populateSelections() {
        const createSelect = (id, label, options, costId, categoryKey, dataList, valueKey = 'type') => {
            const div = document.createElement('div');
            div.className = 'manual-field';
            div.innerHTML = `
                <label for="${id}">${label} <span class="cost-badge" id="${costId}">1S</span></label>
                <select id="${id}" data-category="${categoryKey}">
                    <option value="">Random</option>
                    ${options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                </select>
            `;
            manualSelectionsGrid.appendChild(div);

            const select = document.getElementById(id);
            select.addEventListener('change', (e) => handleManualChange(e, categoryKey, dataList, valueKey));
            return select;
        };

        createSelect('age-select', 'Age', Array.from({ length: 15 }, (_, i) => ({ value: 6 + i, text: `${6 + i} years old` })), 'cost-age', 'age', null);
        createSelect('body-select', 'Body Type', data.body.map(b => ({ value: b.type, text: b.type })), 'cost-body', 'body', data.body);
        createSelect('spec-select', 'Specialisation', data.specialization.map(s => ({ value: s.type, text: s.type })), 'cost-spec', 'specialization', data.specialization);
        createSelect('weapon-select', 'Weapon', data.weapon.map(w => ({ value: w.type, text: w.type })), 'cost-weapon', 'weapon', data.weapon);
        createSelect('outfit-select', 'Outfit', data.outfit.map(o => ({ value: o.type, text: o.type })), 'cost-outfit', 'outfit', data.outfit);
        createSelect('power-select', 'Power', data.power.map(p => ({ value: p.type, text: p.type })), 'cost-power', 'power', data.power);
        createSelect('power2-select', 'Second Power', data.power.map(p => ({ value: p.type, text: p.type })), 'cost-power2', 'power2', data.power);

        const allPerkOpts = [
            ...data.perks.combat.map(p => ({ value: `C-${p.roll}`, text: `(C) ${p.name}` })),
            ...data.perks.support.map(p => ({ value: `S-${p.roll}`, text: `(S) ${p.name}` }))
        ];
        createSelect('perk5-select', 'Perk 5', allPerkOpts, 'cost-perk5', 'perk5', null, null);

        // Combat Perks (Default filter for initial, but now we allow all)
        // actually for manual modification we want all options available.
        createSelect('e-perk1-select', 'Perk 1 (Combat)', allPerkOpts, 'cost-perk1', 'perk1', null);
        createSelect('e-perk2-select', 'Perk 2 (Combat)', allPerkOpts, 'cost-perk2', 'perk2', null);

        createSelect('e-perk3-select', 'Perk 3 (Support)', allPerkOpts, 'cost-perk3', 'perk3', null);
        createSelect('e-perk4-select', 'Perk 4 (Support)', allPerkOpts, 'cost-perk4', 'perk4', null);

        createSelect('extra-perk1-select', 'Extra Perk 1', allPerkOpts, 'cost-extra1', 'extra-perk1', null);
        createSelect('extra-perk2-select', 'Extra Perk 2', allPerkOpts, 'cost-extra2', 'extra-perk2', null);

        const artifactPerks = data.perks.combat.filter(p => p.name.includes('Artifact'));
        const artifactOpts = artifactPerks.map(p => ({ value: `C-${p.roll}`, text: p.name }));
        createSelect('artifact-select', 'Bonus Artifact', artifactOpts, 'cost-artifact', 'artifact', null);
    }

    populateSelections();



    // Handle Manual Changes Post-Generation
    function handleManualChange(event, categoryKey, dataList, valueKey = 'type') {
        if (!currentBuild || currentBuild.items.length === 0) {
            alert("Please generate a character first!");
            event.target.value = ""; // Reset selection
            return;
        }

        const val = event.target.value;
        const origin = currentBuild.origin;
        const rules = originRules[origin];

        let isFree = rules.allFree || (rules.simple && rules.simple[categoryKey] !== undefined);
        if (categoryKey === 'perk5' && rules.simple && (rules.simple['perk5'] !== undefined || rules.simple['perk5-combat'] !== undefined || rules.simple['perk5-support'] !== undefined)) isFree = true;
        if (categoryKey === 'artifact' && origin === 'Artifact') isFree = true;

        // Find existing item index
        let lookupLabel = "";
        let isPerk = false;
        if (categoryKey === 'age') lookupLabel = "Age";
        else if (categoryKey === 'body') lookupLabel = "Body";
        else if (categoryKey === 'specialization') lookupLabel = "Specialization";
        else if (categoryKey === 'weapon') lookupLabel = "Weapon";
        else if (categoryKey === 'outfit') lookupLabel = "Outfit";
        else if (categoryKey === 'power') lookupLabel = "Power";
        else if (categoryKey === 'power2') lookupLabel = "Second Power";
        else if (categoryKey === 'perk5') { lookupLabel = "Perk 5"; isPerk = true; }
        else if (categoryKey === 'perk1') { lookupLabel = "Perk 1 (Combat)"; isPerk = true; }
        else if (categoryKey === 'perk2') { lookupLabel = "Perk 2 (Combat)"; isPerk = true; }
        else if (categoryKey === 'perk3') { lookupLabel = "Perk 3 (Support)"; isPerk = true; }
        else if (categoryKey === 'perk4') { lookupLabel = "Perk 4 (Support)"; isPerk = true; }
        else if (categoryKey === 'extra-perk1') { lookupLabel = "Extra Perk 1"; isPerk = true; }
        else if (categoryKey === 'extra-perk2') { lookupLabel = "Extra Perk 2"; isPerk = true; }
        else if (categoryKey === 'artifact') { lookupLabel = "Bonus Artifact"; isPerk = true; }

        let itemIndex = currentBuild.items.findIndex(i => i.category.startsWith(lookupLabel));

        if (itemIndex === -1) {
            alert("Cannot find item to modify. Please generate a character first, or purchase the slot.");
            event.target.value = ""; // Reset selection
            return;
        }

        const existingItem = currentBuild.items[itemIndex];
        const previousCost = existingItem.manualCost || { amount: 0, type: 'silver' }; // Default format

        let newItem = null;
        let costAmount = 0;
        let costCurrency = 'silver';

        if (val === "") {
            // Revert to Random (Refund previous)
            if (previousCost.amount > 0) {
                currentBuild.wallet[previousCost.type] += previousCost.amount;
            }

            // Re-roll
            const roll = rollD20();
            let res;
            if (categoryKey === 'perk5') {
                res = getPerkResult(roll, 'combat');
            } else if (categoryKey === 'perk3' || categoryKey === 'perk4') {
                res = getPerkResult(roll, 'support');
            } else if (categoryKey.startsWith('perk') || categoryKey.startsWith('extra-perk') || categoryKey === 'artifact') {
                res = getPerkResult(roll, 'combat');
            } else if (categoryKey === 'age') {
                res = getResult('age', roll);
            } else if (categoryKey === 'power' || categoryKey === 'power2') {
                res = getResult('power', roll);
            } else {
                res = getResult(categoryKey, roll);
            }

            newItem = {
                category: existingItem.category,
                roll: roll,
                result: res.result,
                stats: res.stats || "",
                details: res.details || "",
                rawName: res.result,
                manualCost: undefined
            };

        } else {
            // Valid Selection -> Calculate Cost

            if (isFree) {
                costAmount = 0;
                costCurrency = 'silver';
            } else {
                // Determine Cost based on Rules
                let originalRoll = parseInt(existingItem.roll);

                // Try to get precise original data
                let baseRoll = originalRoll;
                let baseTable = null;
                if (existingItem.originalData) {
                    baseRoll = existingItem.originalData.roll;
                    baseTable = existingItem.originalData.table;
                }

                if (isNaN(originalRoll) && existingItem.originalData === undefined) {
                    // Edited without history
                    costCurrency = 'silver';
                    costAmount = 1;

                    // Exception: Age Gold cost
                    if (categoryKey === 'age') {
                        const ageVal = parseInt(val);
                        if (ageVal < 7 || ageVal > 16) {
                            costCurrency = 'gold';
                            costAmount = 1;
                        }
                    }
                } else {
                    // Logic based on Category
                    costCurrency = 'silver'; // Default to silver
                    costAmount = 1;

                    if (categoryKey === 'age') {
                        const ageVal = parseInt(val);
                        // Age logic... uses baseRoll (raw roll)
                        // If we have originalData roll, use it. if not verify if originalRoll is valid
                        // For age, originalRoll is usually the D20 roll not the age
                        // Wait, existingItem.roll stores the D20 roll?
                        // In getResult('age'), we return result string. We store `roll` in currentBuild as the random number.
                        // So checkOverlap uses `originalRoll` correctly.

                        const currentAgeRollAdjusted = baseRoll > 10 ? baseRoll - 10 : baseRoll;
                        const currentAge = 6 + currentAgeRollAdjusted;

                        if (Math.abs(ageVal - currentAge) <= 1) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        } else if (ageVal >= 7 && ageVal <= 16) {
                            costCurrency = 'silver';
                            costAmount = 1;
                        } else {
                            costCurrency = 'gold';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey === 'body' || categoryKey === 'specialization' || categoryKey === 'weapon' || categoryKey === 'outfit' || categoryKey.includes('power')) {
                        // Standard Range overlap logic
                        let tolerance = 1;
                        if (categoryKey === 'body' || categoryKey.includes('power')) tolerance = 2;
                        if (categoryKey === 'weapon' || categoryKey === 'outfit') tolerance = 4;

                        const targetItem = dataList.find(i => i.type === val);
                        if (targetItem && checkOverlap(baseRoll, targetItem.roll, tolerance)) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey.startsWith('perk') || categoryKey.startsWith('extra-perk') || categoryKey === 'artifact') {
                        // Perk Logic
                        // Val format: "C-5" or "S-10"
                        const [tableCode, rStr] = val.split('-');
                        const targetRoll = parseInt(rStr);
                        const targetTable = tableCode === 'C' ? 'combat' : 'support';

                        // Infer baseTable if missing (legacy/fallback)
                        if (!baseTable) {
                            if (categoryKey.includes('Support')) baseTable = 'support';
                            else if (categoryKey.includes('Combat')) baseTable = 'combat';
                            else baseTable = 'combat'; // Default
                        }

                        if (targetTable === baseTable) {
                            // Any on Same Table: 1 Silver
                            costCurrency = 'silver';
                            costAmount = 1;
                        } else {
                            // Opposite Table
                            if (targetRoll === baseRoll) {
                                // Same Num Opposite Table: 1 Bronze
                                costCurrency = 'bronze';
                                costAmount = 1;
                            } else {
                                // Any on Opposite Table: 1 Silver + 1 Bronze
                                costCurrency = 'mixed-sb'; // Special flag
                                costAmount = 1; // Logic handled below
                            }
                        }
                    }
                }
            }

            // Pay
            if (previousCost.amount > 0) {
                // Refund previous
                if (previousCost.type === 'mixed-sb') {
                    currentBuild.wallet.silver += 1;
                    currentBuild.wallet.bronze += 1;
                } else {
                    currentBuild.wallet[previousCost.type] += previousCost.amount;
                }
            }

            // Check Affordability
            let affordable = false;
            if (costCurrency === 'mixed-sb') {
                if (currentBuild.wallet.silver >= 1 && currentBuild.wallet.bronze >= 1) affordable = true;
            } else {
                if (currentBuild.wallet[costCurrency] >= costAmount) affordable = true;
            }

            if (!affordable) {
                // Revert Refund if failed
                if (previousCost.amount > 0) {
                    if (previousCost.type === 'mixed-sb') {
                        currentBuild.wallet.silver -= 1;
                        currentBuild.wallet.bronze -= 1;
                    } else {
                        currentBuild.wallet[previousCost.type] -= previousCost.amount;
                    }
                }

                let costMsg = costCurrency === 'mixed-sb' ? "1 Silver and 1 Bronze" : `${costAmount} ${costCurrency}`;
                alert(`Not enough currency! Cost: ${costMsg}`);
                event.target.value = existingItem.rawName.includes('(Selected)') ? existingItem.rawName.replace(' (Selected)', '') : ""; // Rough reset attempt or keep current?
                // Actually if we fail, we should probably set the select back to what the item currently is.
                // But matching value to current item is hard without store. 
                // Just clear is safest or ignore.
                // event.target.value = ""; 
                return;
            }

            // Deduct
            if (costCurrency === 'mixed-sb') {
                currentBuild.wallet.silver -= 1;
                currentBuild.wallet.bronze -= 1;
            } else {
                currentBuild.wallet[costCurrency] -= costAmount;
            }

            // Generate Manual Item Data
            let res = { result: "", stats: "", details: "" };

            if (categoryKey === 'age') {
                res = {
                    result: `${val} years old (Selected)`,
                    stats: "",
                    details: "Immortal, no longer ages."
                };
            } else if (categoryKey.startsWith('perk') || categoryKey.startsWith('extra-perk') || categoryKey === 'artifact') {
                const [table, r] = val.split('-');
                const rollVal = parseInt(r);
                const tableType = table === 'C' ? 'combat' : 'support';
                const pData = getPerkResult(rollVal, tableType);
                res = { ...pData, result: pData.result };

            } else {
                const d = dataList.find(i => i[valueKey] == val);
                res = {
                    result: d[valueKey] + " (Selected)",
                    stats: d.bonus || d.notes || "",
                    details: d.description || d.examples || ""
                };
            }

            newItem = {
                category: existingItem.category,
                roll: "-",
                result: res.result,
                stats: res.stats || "",
                details: res.details || "",
                rawName: res.result,
                manualCost: { amount: costAmount, type: costCurrency },
                originalData: existingItem.originalData // Preserve original data
            };
        }

        // Apply Update
        currentBuild.items[itemIndex] = newItem;

        const rows = document.querySelectorAll('#results-body tr');
        for (let row of rows) {
            const catCell = row.firstElementChild;
            if (catCell && catCell.textContent === existingItem.category) {
                row.innerHTML = `
                    <td title="${newItem.category}">${newItem.category}</td>
                    <td title="${newItem.roll}">${newItem.roll}</td>
                    <td title="${newItem.result}">${newItem.result}</td>
                    <td title="${newItem.stats}">${newItem.stats}</td>
                    <td title="${newItem.details}">${newItem.details}</td>
                 `;
                break;
            }
        }

        updateWalletUI();
        const { stats, flexible } = parseBonuses(currentBuild.items);
        updateStatsDisplay(stats, flexible);
    }

    function updateCosts() {
        const origin = originTypeSelect.value;
        const rules = originRules[origin];

        currentBuild.origin = origin;
        currentBuild.wallet = { gold: rules.gold, silver: rules.silver, bronze: rules.bronze };

        setFieldVisibility(origin);

        const isFree = (key) => rules.allFree || (rules.simple && rules.simple[key] !== undefined);

        const setBadge = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                if (isFree(key)) {
                    el.innerText = "Free";
                    el.className = "cost-badge cost-free";
                } else {
                    el.innerText = "1S";
                    el.className = "cost-badge";
                }
            }
        };

        setBadge('cost-age', 'age');
        setBadge('cost-body', 'body');
        setBadge('cost-spec', 'specialization');
        setBadge('cost-weapon', 'weapon');
        setBadge('cost-outfit', 'outfit');
        setBadge('cost-power', 'power');
        setBadge('cost-power2', 'power2');

        setBadge('cost-perk3', 'perk3');
        setBadge('cost-perk4', 'perk4');
        setBadge('cost-extra1', 'extra-perk1');
        setBadge('cost-extra2', 'extra-perk2');

        const perk5Free = isFree('perk5') || isFree('perk5-combat') || isFree('perk5-support');
        const p5Badge = document.getElementById('cost-perk5');
        if (p5Badge) {
            p5Badge.innerText = perk5Free ? "Free" : "1S";
            p5Badge.className = perk5Free ? "cost-badge cost-free" : "cost-badge";
        }

        const p1Free = isFree('perk1');
        const p1Badge = document.getElementById('cost-perk1');
        if (p1Badge) {
            p1Badge.innerText = p1Free ? "Free" : "1S";
            p1Badge.className = p1Free ? "cost-badge cost-free" : "cost-badge";
        }

        const p2Free = isFree('perk2');
        const p2Badge = document.getElementById('cost-perk2');
        if (p2Badge) {
            p2Badge.innerText = p2Free ? "Free" : "1S";
            p2Badge.className = p2Free ? "cost-badge cost-free" : "cost-badge";
        }

        const artBadge = document.getElementById('cost-artifact');
        if (artBadge) { // Ensure element exists
            if (origin === 'Artifact') {
                artBadge.innerText = "Free";
                artBadge.className = "cost-badge cost-free";
            } else {
                artBadge.innerText = "1S";
                artBadge.className = "cost-badge";
            }
        }

        updateWalletUI();

        if (unlockOptionsBtn) {
            unlockOptionsBtn.textContent = manualMode ? "Hide Options" : "Unlock All Options";
            if (manualMode) {
                unlockOptionsBtn.classList.remove('btn-secondary');
                unlockOptionsBtn.classList.add('btn-primary');
            } else {
                unlockOptionsBtn.classList.add('btn-secondary');
                unlockOptionsBtn.classList.remove('btn-primary');
            }
        }
    }

    if (unlockOptionsBtn) {
        unlockOptionsBtn.addEventListener('click', () => {
            manualMode = !manualMode;
            updateCosts();
        });
    }

    originTypeSelect.addEventListener('change', updateCosts);
    updateCosts();

    function updateWalletUI() {
        if (goldCountEl) goldCountEl.textContent = currentBuild.wallet.gold;
        if (silverCountEl) silverCountEl.textContent = currentBuild.wallet.silver;
        if (bronzeCountEl) bronzeCountEl.textContent = currentBuild.wallet.bronze;

        const bronzeBtns = document.querySelectorAll('.btn-stat.bronze');
        const silverBtns = document.querySelectorAll('.btn-stat.silver');
        const goldBtns = document.querySelectorAll('.btn-stat.gold');

        bronzeBtns.forEach(btn => btn.disabled = currentBuild.wallet.bronze <= 0);
        silverBtns.forEach(btn => btn.disabled = currentBuild.wallet.silver <= 0);
        goldBtns.forEach(btn => btn.disabled = currentBuild.wallet.gold <= 0);

        renderUpgradesUI();
    }

    function renderUpgradesUI() {
        const container = document.getElementById('upgrades-container');
        if (!container) return;

        if (!currentBuild || currentBuild.rolls.length === 0) {
            container.innerHTML = "";
            // container.classList.add('hidden'); // Optional: hide if empty
            return;
        }
        // container.classList.remove('hidden');

        container.innerHTML = "";

        // Button: Buy Second Power (1 Gold)
        const btnPower = document.createElement('button');
        btnPower.className = `btn-upgrade ${upgradesPurchased.power2 ? 'purchased' : ''}`;
        btnPower.innerHTML = upgradesPurchased.power2 ? "✅ Power 2 Unlocked" : "Buy Second Power (1 🟡)";
        btnPower.onclick = () => handleUpgradePurchase('power2');
        if (!upgradesPurchased.power2 && currentBuild.wallet.gold < 1) btnPower.disabled = true;

        // Button: Buy 2 Extra Perks (1 Gold)
        const btnPerks = document.createElement('button');
        btnPerks.className = `btn-upgrade ${upgradesPurchased.extras ? 'purchased' : ''}`;
        btnPerks.innerHTML = upgradesPurchased.extras ? "✅ Extra Perks Unlocked" : "Buy 2 Extra Perks (1 🟡)";
        btnPerks.onclick = () => handleUpgradePurchase('extras');
        if (!upgradesPurchased.extras && currentBuild.wallet.gold < 1) btnPerks.disabled = true;

        container.appendChild(btnPower);
        container.appendChild(btnPerks);
    }

    function handleUpgradePurchase(type) {
        if (currentBuild.wallet.gold < 1) return;

        if (type === 'power2' && !upgradesPurchased.power2) {
            currentBuild.wallet.gold--;
            upgradesPurchased.power2 = true;

            const powMsg = handleSelection('power2-select', 'power2', data.power);
            process('power', 'Second Power', null, powMsg);

        } else if (type === 'extras' && !upgradesPurchased.extras) {
            currentBuild.wallet.gold--;
            upgradesPurchased.extras = true;

            // Generate 2 Extra Perks
            // Re-use logic: reconstruct seenPerks
            const seenPerks = new Set(currentBuild.items.map(i => i.result));

            const genPerk = (label, manualId, manualKey) => {
                const mVal = document.getElementById(manualId) ? document.getElementById(manualId).value : null;
                if (mVal) {
                    const pMsg = handleSelection(manualId, manualKey, null, null, true);
                    process(null, label, null, pMsg);
                    if (pMsg) seenPerks.add(pMsg.result);
                } else {
                    const roll = rollD20();
                    currentBuild.rolls.push(roll);
                    // Default to Combat for extras
                    let res = getPerkResult(roll, 'combat');
                    let note = "";

                    if (seenPerks.has(res.result)) {
                        res = getPerkResult(roll, 'support');
                        if (seenPerks.has(res.result)) {
                            res = { result: "Free Perk Choice", stats: "User Choice", details: "Select any perk manually.", isWildcard: true };
                        }
                    }
                    seenPerks.add(res.result);

                    currentBuild.items.push({
                        category: label,
                        roll: roll + note,
                        result: res.result,
                        stats: res.stats || "",
                        details: res.details || "",
                        rawName: res.result,
                        originalData: { roll: roll, table: 'combat' }
                    });
                    addResultRow(label, roll + note, res.result, res.stats || "", res.details || "");
                }
            };

            genPerk('Extra Perk 1', 'extra-perk1-select', 'extra-perk1');
            genPerk('Extra Perk 2', 'extra-perk2-select', 'extra-perk2');
        }

        updateWalletUI();
        updateCosts();
        const { stats, flexible } = parseBonuses(currentBuild.items);
        updateStatsDisplay(stats, flexible);
    }

    const process = (category, label, typeOverride = null, manualResult = null) => {
        if (manualResult) {
            currentBuild.items.push({
                category: label,
                roll: "-",
                result: manualResult.result,
                stats: manualResult.stats || "",
                details: manualResult.details || "",
                rawName: manualResult.result,
                manualCost: manualResult.manualCost
            });
            addResultRow(label, "-", manualResult.result, manualResult.stats || "", manualResult.details || "");
            return manualResult;
        }

        const roll = rollD20();
        const res = typeOverride ? getPerkResult(roll, typeOverride) : getResult(category, roll);

        currentBuild.rolls.push(roll);
        currentBuild.items.push({
            category: label,
            roll: roll,
            result: res.result,
            stats: res.stats || "",
            details: res.details || "",
            rawName: res.result,
            originalData: { roll: roll, table: undefined } // table defined by typeOverride usually
        });

        addResultRow(label, roll, res.result, res.stats || "", res.details || "");
        return res;
    };

    // Helper: handlePerkGen logic reused? 
    // It's cleaner to keep the main generation logic separate as it runs once.

    // ... handleSelection is above ...



    function handleSelection(elementId, categoryKey, dataList, valueKey = 'type', isPerk = false) {
        const el = document.getElementById(elementId);
        if (!el || !el.value) return null;

        const val = el.value;
        const origin = currentBuild.origin;
        const rules = originRules[origin];

        let isFree = rules.allFree || (rules.simple && rules.simple[categoryKey] !== undefined);
        if (categoryKey === 'perk5' && rules.simple && (rules.simple['perk5'] !== undefined || rules.simple['perk5-combat'] !== undefined || rules.simple['perk5-support'] !== undefined)) isFree = true;
        if (categoryKey === 'artifact' && origin === 'Artifact') isFree = true;

        let costAmount = 0;
        let costCurrency = 'silver';

        if (!isFree) {
            costAmount = 1;
            costCurrency = 'silver';

            // Special Age Logic
            if (categoryKey === 'age') {
                const ageVal = parseInt(val);
                if (ageVal < 7 || ageVal > 16) {
                    costCurrency = 'gold';
                }
            }
        }

        if (currentBuild.wallet[costCurrency] < costAmount) {
            alert(`Not enough ${costCurrency} for ${categoryKey} selection! Resetting to random.`);
            el.value = "";
            return null;
        }

        currentBuild.wallet[costCurrency] -= costAmount;

        // Construct Item Data
        let itemData = null;
        if (isPerk) {
            if (categoryKey === 'perk5') {
                const [table, r] = val.split('-');
                const rollVal = parseInt(r);
                const tableType = table === 'C' ? 'combat' : 'support';
                const pData = getPerkResult(rollVal, tableType);
                itemData = { ...pData, roll: rollVal + " (Manual)", manualCost: { amount: costAmount, type: costCurrency } };
            } else {
                const rollVal = parseInt(val);
                const pData = getPerkResult(rollVal, 'combat');
                itemData = { ...pData, roll: rollVal + " (Manual)", manualCost: { amount: costAmount, type: costCurrency } };
            }
        } else if (categoryKey === 'age') {
            const ageVal = parseInt(val);
            itemData = {
                result: `${ageVal} years old (Selected)`,
                stats: "",
                details: "Immortal, no longer ages.",
                manualCost: { amount: costAmount, type: costCurrency }
            };
        } else {
            const item = dataList.find(d => d[valueKey] === val);
            itemData = item ? {
                result: item[valueKey] + " (Selected)",
                stats: item.bonus || item.notes || "",
                details: item.description || item.examples || ""
            } : null;
            if (itemData) itemData.manualCost = { amount: costAmount, type: costCurrency };
        }

        return itemData;
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            currentBuild = {
                rolls: [],
                items: [],
                perk5Showing: 'combat',
                purchasedStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
                wallet: { gold: 0, silver: 0, bronze: 0 },
                origin: originTypeSelect.value
            };

            // Note: Not clearing manual fields so they act as "locks" if populated

            document.getElementById('results-body').innerHTML = "";
            document.getElementById('stats-content').innerHTML = "";
            document.getElementById('toggle-perk5-btn').classList.remove('hidden');
            resultsContainer.classList.remove('hidden');
            exportBtn.classList.remove('hidden');

            updateCosts();

            // Process Standard Fields
            const ageMsg = handleSelection('age-select', 'age', null);
            const bodyMsg = handleSelection('body-select', 'body', data.body);
            const specMsg = handleSelection('spec-select', 'specialization', data.specialization);
            const weapMsg = handleSelection('weapon-select', 'weapon', data.weapon);
            const outMsg = handleSelection('outfit-select', 'outfit', data.outfit);
            const powMsg = handleSelection('power-select', 'power', data.power);

            updateWalletUI();

            process('age', 'Age', null, ageMsg);
            process('body', 'Body', null, bodyMsg);
            process('specialization', 'Specialization', null, specMsg);
            process('weapon', 'Weapon', null, weapMsg);
            process('outfit', 'Outfit', null, outMsg);
            process('power', 'Power', null, powMsg);

            // Perk Logic with Duplicates
            const seenPerks = new Set();

            const handlePerkGen = (label, type, manualId, manualKey) => {
                const mVal = document.getElementById(manualId) ? document.getElementById(manualId).value : null;
                if (mVal) {
                    // Manual Selection
                    const pMsg = handleSelection(manualId, manualKey, null, null, manualKey === 'perk5');
                    if (pMsg) seenPerks.add(pMsg.result);
                    return process(null, label, null, pMsg);
                }

                // Random Roll
                const roll = rollD20();
                currentBuild.rolls.push(roll);

                let res = getPerkResult(roll, type);
                let note = "";

                if (seenPerks.has(res.result)) {
                    // Duplicate! Flip table.
                    const newType = type === 'combat' ? 'support' : 'combat';
                    res = getPerkResult(roll, newType);

                    if (seenPerks.has(res.result)) {
                        // Double Duplicate! Free Choice.
                        res = {
                            result: "Free Perk Choice",
                            stats: "User Choice",
                            details: "You rolled a duplicate twice! Select any perk manually.",
                            isWildcard: true
                        };
                    }
                }

                seenPerks.add(res.result);

                currentBuild.items.push({
                    category: label,
                    roll: roll + note,
                    result: res.result,
                    stats: res.stats || "",
                    details: res.details || "",
                    rawName: res.result,
                    originalData: { roll: roll, table: type }
                });

                addResultRow(label, roll + note, res.result, res.stats || "", res.details || "");
                return res;
            };

            handlePerkGen('Perk 1 (Combat)', 'combat', 'e-perk1-select', 'perk1');
            handlePerkGen('Perk 2 (Combat)', 'combat', 'e-perk2-select', 'perk2');
            handlePerkGen('Perk 3 (Support)', 'support', 'null-id', 'perk3');
            handlePerkGen('Perk 4 (Support)', 'support', 'null-id', 'perk4');

            // Perk 5
            const p5Val = document.getElementById('perk5-select').value;
            if (p5Val) {
                const p5Msg = handleSelection('perk5-select', 'perk5', null, null, true);
                process(null, 'Perk 5 (Choice)', null, p5Msg);
                document.getElementById('toggle-perk5-btn').classList.add('hidden'); // Hide toggle if manual
                if (p5Msg) seenPerks.add(p5Msg.result);
            } else {
                // Random Perk 5
                const roll = rollD20();
                currentBuild.rolls.push(roll);

                let resC = getPerkResult(roll, 'combat');
                let resS = getPerkResult(roll, 'support');

                let finalRes = resC;
                let type = 'combat';

                // Prefer non-duplicate
                if (seenPerks.has(resC.result) && !seenPerks.has(resS.result)) {
                    finalRes = resS;
                    type = 'support';
                }
                else if (seenPerks.has(resC.result) && seenPerks.has(resS.result)) {
                    finalRes = {
                        result: "Free Perk Choice",
                        stats: "User Choice",
                        details: "You rolled a duplicate twice! Select any perk manually.",
                        isWildcard: true
                    };
                }

                currentBuild.items.push({
                    category: 'Perk 5 (Choice)',
                    roll: roll,
                    result: finalRes.result,
                    stats: finalRes.stats || "",
                    details: finalRes.details || "",
                    rawName: finalRes.result
                });
                addResultRow('Perk 5 (Choice)', roll, finalRes.result, finalRes.stats || "", finalRes.details || "");

                currentBuild.perk5Showing = type;

                // Populate alternates for toggle
                currentBuild.perk5Combat = { category: 'Perk 5 (Combat)', roll: roll, result: resC.result, stats: resC.stats, details: resC.details, rawName: resC.result };
                currentBuild.perk5Support = { category: 'Perk 5 (Support)', roll: roll, result: resS.result, stats: resS.stats, details: resS.details, rawName: resS.result };
            }

            // Artifact check
            const rules = originRules[currentBuild.origin];
            if (rules.extraArtifact) {
                const artMsg = handleSelection('artifact-select', 'artifact', null);
                if (artMsg) {
                    process(null, 'Bonus Artifact', null, artMsg);
                } else {
                    const artPerks = data.perks.combat.filter(p => p.name.includes("Artifact"));
                    const randArt = artPerks[Math.floor(Math.random() * artPerks.length)];

                    currentBuild.items.push({
                        category: 'Bonus Artifact',
                        roll: randArt.roll, // Fake roll number from index?
                        result: randArt.name,
                        stats: randArt.bonus,
                        details: randArt.description,
                        rawName: randArt.name
                    });
                    addResultRow('Bonus Artifact', randArt.roll, randArt.name, randArt.bonus, randArt.description);
                }
            }

            const { stats, flexible } = parseBonuses(currentBuild.items);
            updateStatsDisplay(stats, flexible);
            updateWalletUI();

            document.querySelector('.container').classList.add('expanded');
        });
    }

    // Toggle Perk 5 button functionality
    const togglePerk5Btn = document.getElementById('toggle-perk5-btn');
    togglePerk5Btn.addEventListener('click', () => {
        if (!currentBuild.perk5Combat || !currentBuild.perk5Support) return;

        // Find the Perk 5 row
        const rows = Array.from(resultsTableBody.querySelectorAll('tr'));
        const perk5RowIndex = rows.findIndex(row => {
            const categoryCell = row.querySelector('td:first-child');
            return categoryCell && categoryCell.textContent.startsWith('Perk 5');
        });

        if (perk5RowIndex === -1) return;

        // Toggle between combat and support
        if (currentBuild.perk5Showing === 'combat') {
            // Switch to support
            currentBuild.perk5Showing = 'support';
            const p = currentBuild.perk5Support;
            rows[perk5RowIndex].innerHTML = `
                <td title="${p.category}">${p.category}</td>
                <td title="${p.roll}">${p.roll}</td>
                <td title="${p.result}">${p.result}</td>
                <td title="${p.stats}">${p.stats}</td>
                <td title="${p.details}">${p.details}</td>
            `;
            // Update items array
            const itemIndex = currentBuild.items.findIndex(i => i.category.startsWith('Perk 5'));
            if (itemIndex !== -1) {
                currentBuild.items[itemIndex] = currentBuild.perk5Support;
            }
        } else {
            // Switch to combat
            currentBuild.perk5Showing = 'combat';
            const p = currentBuild.perk5Combat;
            rows[perk5RowIndex].innerHTML = `
                <td title="${p.category}">${p.category}</td>
                <td title="${p.roll}">${p.roll}</td>
                <td title="${p.result}">${p.result}</td>
                <td title="${p.stats}">${p.stats}</td>
                <td title="${p.details}">${p.details}</td>
            `;
            // Update items array
            const itemIndex = currentBuild.items.findIndex(i => i.category.startsWith('Perk 5'));
            if (itemIndex !== -1) {
                currentBuild.items[itemIndex] = currentBuild.perk5Combat;
            }
        }

        const { stats, flexible } = parseBonuses(currentBuild.items);
        updateStatsDisplay(stats, flexible);
    });

    // Handle Stat Purchase
    window.purchaseStat = (stat, type) => {
        if (!currentBuild || !currentBuild.wallet) return;

        if (type === 'bronze') {
            if (currentBuild.wallet.bronze > 0) {
                currentBuild.wallet.bronze--;
                currentBuild.purchasedStats[stat] += 1;
            }
        } else if (type === 'silver') {
            if (currentBuild.wallet.silver > 0) {
                currentBuild.wallet.silver--;
                currentBuild.purchasedStats[stat] += 2;
            }
        } else if (type === 'gold') {
            if (currentBuild.wallet.gold > 0) {
                currentBuild.wallet.gold--;
                currentBuild.purchasedStats[stat] += 4;
            }
        }

        updateWalletUI();
        const { stats, flexible } = parseBonuses(currentBuild.items);
        updateStatsDisplay(stats, flexible);
    };

    function parseBonuses(items) {
        const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
        const flexible = [];

        items.forEach(item => {
            if (!item.stats) return;

            const parts = item.stats.split(',').map(s => s.trim());

            parts.forEach(part => {
                if (!part) return;

                const isFlexible = /or|Any|one stat|Weapon Stat|Spec Stat|Outfit Stat/i.test(part);

                if (isFlexible) {
                    flexible.push(`${part} (${item.category})`);
                } else {
                    if (part.toLowerCase().includes("all stats")) {
                        const match = part.match(/([+-]?\d+)/);
                        if (match) {
                            const val = parseInt(match[1], 10);
                            ['STR', 'AGI', 'VIT', 'MAG', 'LCK'].forEach(s => stats[s] += val);
                        }
                    } else {
                        const match = part.match(/([+-]?\d+)\s+(STR|AGI|VIT|MAG|LCK)/);
                        if (match) {
                            const val = parseInt(match[1], 10);
                            const stat = match[2];
                            if (stats[stat] !== undefined) {
                                stats[stat] += val;
                            }
                        }
                    }
                }
            });
        });


        // Add purchased stats
        if (currentBuild.purchasedStats) {
            for (const [key, val] of Object.entries(currentBuild.purchasedStats)) {
                if (stats[key] !== undefined) {
                    stats[key] += val;
                }
            }
        }

        // Add Origin Bonus Stats
        const origin = currentBuild.origin;
        if (origin === 'Weapon') {
            flexible.push('+1 Weapon Stat (Origin Bonus)');
        } else if (origin === 'Bloodline') {
            flexible.push('+1 Specialisation Stat (Origin Bonus)');
        }

        return { stats, flexible };
    }

    function updateStatsDisplay(stats, flexible) {
        const statsDisplay = document.getElementById('stats-display');
        const statsContent = document.getElementById('stats-content');
        if (!statsDisplay || !statsContent) return;

        let html = '';
        for (const [key, value] of Object.entries(stats)) {
            html += `
                <div class="stats-row">
                    <span class="stat-name">${key}</span>
                    <div class="stat-controls">
                        <span class="stat-value">${value}</span>
                        <button class="btn-stat bronze" onclick="purchaseStat('${key}', 'bronze')" title="Spend 1 Bronze (+1)">+B</button>
                        <button class="btn-stat silver" onclick="purchaseStat('${key}', 'silver')" title="Spend 1 Silver (+2)">+S</button>
                        <button class="btn-stat gold" onclick="purchaseStat('${key}', 'gold')" title="Spend 1 Gold (+4)">+4</button>
                    </div>
                </div>
            `;
        }

        if (flexible.length > 0) {
            html += `<div class="flexible-bonus"><strong>Flexible Bonuses:</strong><ul>`;
            flexible.forEach(f => html += `<li>${f}</li>`);
            html += `</ul></div>`;
        }

        statsContent.innerHTML = html;
        statsDisplay.classList.remove('hidden');
    }

    exportBtn.addEventListener('click', () => {
        if (!currentBuild || currentBuild.items.length === 0) return;

        let text = "";

        // Metadata
        text += `Origin: ${currentBuild.origin}\n`;
        text += `Dice rolls: ${currentBuild.rolls.join(' ')}\n\n`;

        // Gender Logic
        const hasMasculinity = currentBuild.items.some(i => i.rawName.includes('Masculinity'));
        const gender = hasMasculinity ? "Male (Masculinity Perk)" : "Female";

        const formatLine = (label, catLookup) => {
            const item = currentBuild.items.find(i => i.category.startsWith(catLookup || label));
            if (!item) return "";
            let line = `${label}: ${item.result}`;
            if (item.stats) line += ` (${item.stats})`;
            return line + "\n";
        };

        text += formatLine('Age');
        text += `Gender: ${gender}\n`;
        text += formatLine('Body');
        text += formatLine('Specialisation', 'Specialization');
        text += formatLine('Weapon');
        text += formatLine('Outfit');
        text += formatLine('Power');

        // Perks
        const perks = currentBuild.items.filter(i => i.category.startsWith('Perk') || i.category.startsWith('Extra') || i.category.startsWith('Bonus'));
        perks.forEach(p => {
            let label = p.category;
            text += `${label}: ${p.result}`;
            if (p.stats) text += ` (${p.stats})`;
            text += `\n`;
        });

        // Stat Block
        const { stats, flexible } = parseBonuses(currentBuild.items);

        text += `\n[Stat Block]\n`;
        text += `STR: ${stats.STR}\n`;
        text += `AGI: ${stats.AGI}\n`;
        text += `VIT: ${stats.VIT}\n`;
        text += `MAG: ${stats.MAG}\n`;
        text += `LCK: ${stats.LCK}\n`;

        if (flexible.length > 0) {
            text += `\nFlexible Bonuses:\n`;
            flexible.forEach(f => text += `- ${f}\n`);
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = exportBtn.innerText;
            exportBtn.innerText = "Copied!";
            exportBtn.classList.add('btn-success');
            setTimeout(() => {
                exportBtn.innerText = originalText;
                exportBtn.classList.remove('btn-success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    function addResultRow(category, roll, result, stats, details) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td title="${category}">${category}</td>
            <td title="${roll}">${roll}</td>
            <td title="${result}">${result}</td>
            <td title="${stats}">${stats}</td>
            <td title="${details}">${details}</td>
        `;
        resultsTableBody.appendChild(row);
    }

    // Text Import System
    const importFile = document.getElementById('import-file');

    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                try {
                    processImportText(text);
                    alert("Build text data loaded (approximated)!");
                    e.target.value = ""; // Reset
                } catch (err) {
                    console.error(err);
                    alert("Error parsing text file: " + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    function processImportText(text) {
        // 1. Extract Origin
        const originMatch = text.match(/Origin:\s*(\w+)/);
        const origin = originMatch ? originMatch[1] : 'Contract'; // Default

        // 2. Extract Rolls
        const rollsMatch = text.match(/Dice rolls:\s*([\d\s]+)/);
        const rolls = rollsMatch ? rollsMatch[1].trim().split(/\s+/).map(Number) : [];

        // 3. Init Build
        currentBuild = {
            rolls: rolls,
            items: [],
            perk5Showing: 'combat',
            purchasedStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
            wallet: { gold: 0, silver: 0, bronze: 0 },
            origin: origin
        };
        upgradesPurchased = { power2: false, extras: false };
        manualMode = false;

        // Reset Wallet to Max for Origin
        updateCosts(); // Sets wallet based on Origin

        // 4. Parse Items from Text
        const lines = text.split('\n');
        const parseItem = (labelRegex, categoryKey, dataList, valueKey = 'type', rollIndex = -1) => {
            const line = lines.find(l => labelRegex.test(l));
            if (!line) return null;

            // Extract Result
            // Format: "Category: Result (Stats)"
            // match: Category:\s*(ResultString)(\s*\(.*\))?
            const match = line.match(/:\s*([^\(]+?)(?:\s*\(.*\))?$/);
            if (!match) return null;

            let val = match[1].trim();
            // Clean up "(Selected)" if user manually pasted it or if we add it in future
            val = val.replace(" (Selected)", "");

            const catLabel = line.split(':')[0].trim();

            const roll = (rollIndex >= 0 && rollIndex < rolls.length) ? rolls[rollIndex] : "-";

            // Reconstruct Item Object
            let newItem = {
                category: catLabel,
                roll: roll,
                result: val,
                stats: "", // We could parse from text, or fetch from data
                details: "",
                rawName: val
            };

            // Fetch metadata from Data to fill stats/details
            if (dataList) {
                const d = dataList.find(i => i[valueKey] == val || i.name == val); // name for perks
                if (d) {
                    newItem.stats = d.bonus || d.notes || "";
                    newItem.details = d.description || d.examples || "";
                }
            } else if (categoryKey === 'age') {
                // Age special
            } else if (categoryKey.includes('perk') || categoryKey === 'artifact') {
                // Try find in perks
                let p = data.perks.combat.find(i => i.name === val);
                if (!p) p = data.perks.support.find(i => i.name === val);
                if (p) {
                    newItem.stats = p.bonus || "";
                    newItem.details = p.description || "";
                }
            }

            currentBuild.items.push(newItem);

            // Calculate Cost / Deduct from Wallet
            if (rollIndex !== -1) {
                // Check if Manual
                // We need to compare Val with "Result of Roll"
                let naturalRes = null;

                if (categoryKey === 'age') {
                    // Age Formula
                    if (rolls[rollIndex] > 10) naturalRes = (6 + (rolls[rollIndex] - 10)) + " years old";
                    else naturalRes = (6 + rolls[rollIndex]) + " years old";
                }
                else if (categoryKey === 'perk5') {
                    // P5 is special, can be combat or support. 
                    // Natural is Combat or Choice.
                    // Assume Natural = Combat result of that roll.
                    const rC = getPerkResult(rolls[rollIndex], 'combat');
                    const rS = getPerkResult(rolls[rollIndex], 'support');
                    if (val === rC.result || val === rS.result) naturalRes = val;
                    else naturalRes = "___Mismatch___";
                }
                else if (categoryKey.includes('perk') || categoryKey === 'artifact') {
                    // Determine table type
                    let table = 'combat';
                    if (catLabel.includes('Support')) table = 'support';
                    // Natural
                    const r = getPerkResult(rolls[rollIndex], table);
                    naturalRes = r.result;
                }
                else {
                    const nat = getResult(categoryKey, rolls[rollIndex]);
                    if (nat) naturalRes = nat.result;
                }

                if (naturalRes && val !== naturalRes) {
                    // Mismatch! Must calculate cost.
                    // Simulate handleManualChange logic... simplified.
                    // We call handleSelection logic logic?? No, that works on DOM elements.
                    // We need basically the cost logic.

                    // Assume Silver cost (1S) for generic swap
                    // Check for bronze optimizations:

                    let cost = { amount: 1, type: 'silver' };
                    let baseRoll = rolls[rollIndex];

                    if (categoryKey === 'age') {
                        // ... simplified age cost check ...
                        // For now just assume 1 Silver if diff, or Gold if crazy.
                        const ageNum = parseInt(val);
                        if (ageNum < 7 || ageNum > 16) cost = { amount: 1, type: 'gold' };
                    }
                    else if (categoryKey.includes('perk')) {
                        // Check if same roll opposite table
                        const pC = getPerkResult(baseRoll, 'combat');
                        const pS = getPerkResult(baseRoll, 'support');
                        if (val === pC.result || val === pS.result) {
                            // It is one of the natural results for this number
                            cost = { amount: 1, type: 'bronze' };
                        } else {
                            // Check if ANY same table -> 1S
                            // Check if ANY opposite table -> 1S + 1B (Mixed)
                            // This is hard without knowing the base table for sure.
                            // Simplified: Just deduct 1 Silver.
                        }
                    }

                    // Deduct
                    if (currentBuild.wallet[cost.type] >= cost.amount) {
                        currentBuild.wallet[cost.type] -= cost.amount;
                        newItem.manualCost = cost;
                    } else if (cost.type === 'gold' && currentBuild.wallet.gold < 1) {
                        // Failed to pay? Just ignore or log error.
                        console.warn("Could not pay for restored item", val);
                    }
                }
            } else {
                // No roll index (e.g. Extra Perks, Power 2)
                // These are likely Upgrades (Gold cost) or free.
                if (catLabel.includes('Extra Perk')) {
                    upgradesPurchased.extras = true;
                    // Cost was 1 Gold for the SET of 2 extra perks.
                    // Only deduct once.
                    // We can check `upgradesPurchased` flag logic?
                    // Actually, we reset wallet at start. 
                    // If we see Extra Perk 1, we assume bought.
                }
                if (catLabel.includes('Second Power') || (catLabel === 'Power' && currentBuild.items.filter(i => i.category === 'Power').length > 1)) {
                    // This is vague. Usually Power 2 has label "Second Power".
                    upgradesPurchased.power2 = true;
                }
            }
        };

        // Execution Order (matches Roll Indexes)
        // 0: Age
        parseItem(/Age:/, 'age', null, 'type', 0);
        // 1: Body
        parseItem(/Body:/, 'body', data.body, 'type', 1);
        // 2: Spec
        parseItem(/Speciali[sz]ation:/, 'specialization', data.specialization, 'type', 2);
        // 3: Weapon
        parseItem(/Weapon:/, 'weapon', data.weapon, 'type', 3);
        // 4: Outfit
        parseItem(/Outfit:/, 'outfit', data.outfit, 'type', 4);
        // 5: Power
        parseItem(/^Power:/, 'power', data.power, 'type', 5); // Start anchor to avoid Second Power

        // Perks are tricky because manual selection might have changed names/orders?
        // But usually labels are consistent: "Perk 1 (Combat)", etc.
        parseItem(/Perk 1/, 'perk1', null, 'name', 6);
        parseItem(/Perk 2/, 'perk2', null, 'name', 7);
        parseItem(/Perk 3/, 'perk3', null, 'name', 8);
        parseItem(/Perk 4/, 'perk4', null, 'name', 9);
        parseItem(/Perk 5/, 'perk5', null, 'name', 10); // Choice

        // Upgrades checks
        // We scan parsed items for Upgrades
        const textHasExtra = text.includes('Extra Perk');
        if (textHasExtra) {
            if (currentBuild.wallet.gold >= 1) {
                currentBuild.wallet.gold -= 1;
                upgradesPurchased.extras = true;
            }
            parseItem(/Extra Perk 1/, 'extra-perk1', null, 'name');
            parseItem(/Extra Perk 2/, 'extra-perk2', null, 'name');
        }

        const hasPower2 = lines.some(l => l.startsWith('Second Power') || (l.startsWith('Power') && lines.indexOf(l) !== lines.findIndex(l2 => l2.startsWith('Power'))));
        if (hasPower2) {
            // Try to find the line
            let p2Line = lines.find(l => l.startsWith('Second Power'));
            if (p2Line) {
                if (currentBuild.wallet.gold >= 1) {
                    currentBuild.wallet.gold -= 1;
                    upgradesPurchased.power2 = true;
                }
                parseItem(/Second Power:/, 'power2', data.power, 'type');
            }
        }

        // Artifact
        parseItem(/Bonus Artifact:/, 'artifact', null, 'name'); // Free if Origin Artifact

        restoreBuildUI();
    }

    function restoreBuildUI() {
        // Restore Origin Select
        if (originTypeSelect) originTypeSelect.value = currentBuild.origin;

        // Restore Unlock Button State
        if (unlockOptionsBtn) {
            unlockOptionsBtn.textContent = manualMode ? "Hide Options" : "Unlock All Options";
            if (manualMode) {
                unlockOptionsBtn.classList.remove('btn-secondary');
                unlockOptionsBtn.classList.add('btn-primary');
            } else {
                unlockOptionsBtn.classList.add('btn-secondary');
                unlockOptionsBtn.classList.remove('btn-primary');
            }
        }

        // Restore Results Table
        document.getElementById('results-body').innerHTML = "";
        currentBuild.items.forEach(item => {
            addResultRow(item.category, item.roll, item.result, item.stats, item.details);
        });
        resultsContainer.classList.remove('hidden');
        exportBtn.classList.remove('hidden');

        // Restore Stats
        updateWalletUI(); // Including Upgrades UI
        const { stats, flexible } = parseBonuses(currentBuild.items);
        updateStatsDisplay(stats, flexible);

        // Update Costs (Visibility and badges)
        updateCosts();
    }
});
