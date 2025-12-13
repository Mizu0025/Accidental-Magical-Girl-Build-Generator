document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsTableBody = document.querySelector('#results-table tbody');

    // Data from accidentalMahou.md
    const data = {
        body: [
            { range: [1, 6], type: "Underdeveloped", description: "Smaller, sickly, thin, or much younger looking.", bonus: "+1 LCK or MAG" },
            { range: [7, 14], type: "Average", description: "Average for your age. No standout features.", bonus: "+1 AGI or VIT" },
            { range: [15, 20], type: "Overdeveloped", description: "Taller, bigger, wider, more muscular, appears older or has precocious puberty.", bonus: "+1 STR or VIT" }
        ],
        specialization: [
            { roll: 1, type: "Fire", description: "Can magically create fire.", bonus: "+3 STR or MAG" },
            { roll: 2, type: "Ice", description: "Can magically create ice.", bonus: "+2 STR or MAG, +1 VIT" },
            { roll: 3, type: "Air", description: "Can magically control air.", bonus: "+4 AGI" },
            { roll: 4, type: "Spirit", description: "Can magically create spirit.", bonus: "+2 MAG, +1 MAG or LCK, +2 LCK" },
            { roll: 5, type: "Reinforcement", description: "Can magically reinforce yourself and others, alongside healing injuries.", bonus: "+1 STR, +1 AGI, +1 MAG, +1 LCK" },
            { roll: 6, type: "Psychic", description: "Can magically read minds and mentally manipulate people.", bonus: "+2 MAG, +2 LCK" },
            { roll: 7, type: "Time", description: "Can magically control time.", bonus: "+1 AGI or VIT, +2 LCK" },
            { roll: 8, type: "Lightning", description: "Can magically create lightning.", bonus: "+1 STR or MAG, +2 AGI" },
            { roll: 9, type: "Sound", description: "Can magically create sound.", bonus: "+1 AGI, +2 MAG, +1 LCK" },
            { roll: 10, type: "Darkness", description: "Can magically create darkness.", bonus: "+2 STR or MAG, +1 VIT" },
            { roll: 11, type: "Illusion", description: "Can magically create illusions.", bonus: "+2 STR, +1 VIT, +1 LCK" },
            { roll: 12, type: "Light", description: "Can magically control and generate light.", bonus: "+1 AGI, +2 VIT, +1 MAG" },
            { roll: 13, type: "Wood", description: "Can magically create wood.", bonus: "+1 STR, +1 VIT, +2 MAG" },
            { roll: 14, type: "Empathic", description: "Empowered by emotions of those around you, can store it for later use. Emotion type determines which specialisation you mimic while reserves last.", bonus: "+1 STR or MAG, +2 LCK" },
            { roll: 15, type: "Water", description: "Can magically control and generate water.", bonus: "+1 STR, +2 AGI, +1 MAG" },
            { roll: 16, type: "Gravity", description: "Can magically control gravity.", bonus: "+4 MAG" },
            { roll: 17, type: "Stone", description: "Can magically create and control stone.", bonus: "+3 STR or VIT" },
            { roll: 18, type: "Beast", description: "Can magically summon and enhance animals; can also enhance yourself.", bonus: "+1 STR, +1 AGI, +1 VIT or LCK" },
            { roll: 19, type: "Metal", description: "Can magically control and generate metal.", bonus: "+3 STR or LCK" },
            { roll: 20, type: "Oddball", description: "Narrowly focused, but useful command of some element or concept (eg; candy, bone, paper, fairy tales).", bonus: "+2 to one stat, +1 to one other stat" }
        ],
        weapon: [
            { range: [1, 5], type: "Melee", examples: "Blades, hammers, axes, polearms...", bonus: "+1 STR, +1 VIT" },
            { range: [6, 10], type: "Ranged", examples: "Bows, rifles, slingshots...", bonus: "+1 AGI" },
            { range: [11, 15], type: "Mystic", examples: "Rods, staves, orbs, wands...", bonus: "+1 MAG" },
            { range: [16, 20], type: "Fist", examples: "Gauntlets, boots, fists...", bonus: "+2 STR" }
        ],
        outfit: [
            { range: [1, 5], type: "Skimpy", description: "Skintight, leotards, bikinis...", bonus: "+1 AGI" },
            { range: [6, 10], type: "Flowing", description: "Coats, robes, capes, togas...", bonus: "+1 STR" },
            { range: [11, 15], type: "Elaborate", description: "Dresses, fancy cosplay, gowns...", bonus: "+1 MAG" },
            { range: [16, 20], type: "Uniform", description: "School/military uniforms, business...", bonus: "+1 VIT" }
        ],
        power: [
            { range: [1, 2], type: "Killing Blow", description: "Overwhelming single attack.", notes: "+1 STR or MAG" },
            { range: [3, 4], type: "Hammerspace", description: "Extra-dimensional storage.", notes: "Stores non-living material." },
            { range: [5, 6], type: "Twinned Soul", description: "Splits soul into two bodies.", bonus: "-1 all stats", notes: "Share stats/perks. -1 all stats." },
            { range: [7, 8], type: "Focused Assault", description: "Punishing blows on single enemy.", notes: "Melee or Ranged form." },
            { range: [9, 10], type: "Barrage", description: "Rapid succession attacks.", notes: "Good vs hordes." },
            { range: [11, 12], type: "Power of Friendship", description: "Instinctive social skills.", notes: "Allies easily." },
            { range: [13, 14], type: "Duplication", description: "Create solid duplicates.", notes: "Can merge to relay XP." },
            { range: [15, 16], type: "Third Eye", description: "See magic flows.", notes: "Predict spells." },
            { range: [17, 18], type: "Regeneration", description: "Heal & recover fast.", notes: "Reattach limbs." },
            { range: [19, 20], type: "Tentacles", description: "Command tentacle-like appendages.", notes: "Simple minds." }
        ],
        perks: {
            combat: [
                { roll: 1, name: "Dual Weapon", description: 'Your weapon gains an additional type', bonus: "+1 Weapon Stat" },
                { roll: 2, name: "Martial Training †", description: 'Gain training in tactics, logistics and the intricacies of a large number of weapons.', bonus: "+1 STR" },
                { roll: 3, name: "Enhanced Weapon", description: 'Your weapon hits harder, is sharper or casts faster.', bonus: "+1 Weapon Stat" },
                { roll: 4, name: "Mystic Artifact", description: 'You gain an artifact which can sometimes show past/present/future scenes relevant to your query.', bonus: "" },
                { roll: 5, name: "Gifted †", description: 'You are naturally talented in your specialisation in a way other magical girls cannot replicate.', bonus: "+1 Spec Stat" },
                { roll: 6, name: "Flexibility †", description: 'You are far more flexible than should be possible.', bonus: "+1 AGI" },
                { roll: 7, name: "Enhanced Transformation", description: 'You can transform in just 3 seconds.', bonus: "" },
                { roll: 8, name: "Disguise Artifact", description: 'You gain an artifact which lets you transform into others temporarily, including their clothes and equipment.', bonus: "" },
                { roll: 9, name: "Blood Magic", description: "You can fuel spells with vitality, not just mana", bonus: "+1 VIT" },
                { roll: 10, name: "Hammerspace Handbag", description: "Can store objects in a extradimensional space the size of a handbag", bonus: "" },
                { roll: 11, name: "Enhanced Sustenance †", description: "You need only 4 hours sleep, have no nutritional requirements and no longer need to breathe", bonus: "+1 VIT" },
                { roll: 12, name: "Enhanced Outfit", description: "Outfit is much tougher and channels magic better.", bonus: "+1 Outfit Stat" },
                { roll: 13, name: "Healing Artifact", description: "You gain a handheld artifact powered by your mana which can heal almost any wound; it's slow and inefficient", bonus: "" },
                { roll: 14, name: "Ally", description: "Encounter a fellow magical girl/monstergirl who decides to fight by your side.", bonus: "+1 Any" },
                { roll: 15, name: "Monstrous Metamorphosis", description: "When sufficiently angry or upset, You can transform into a monstrous form which is much tougher and channels magic better. Lose rational thought til you've escaped/defeated the threat.", bonus: "" },
                { roll: 16, name: "Sorcery †", description: "Learn a style of magic even regular folk can use (runecarving, ofuda, divination, etc).", bonus: "+1 MAG" },
                { roll: 17, name: "Wings", description: "Your outfit has wings, allowing gliding and (with effort) flight.", bonus: "" },
                { roll: 18, name: "Purification Artifact", description: "You gain an artifact which repels monsters from an area surrounding it.", bonus: "" },
                { roll: 19, name: "Awareness", description: "You're much more aware of anything your mundane senses can detect.", bonus: "" },
                { roll: 20, name: "Power Artifact", description: "You gain an artifact which can be used to channel a single ability from another specialisation.", bonus: "" }
            ],
            support: [
                { roll: 1, name: "Interdimensional Tourist", description: "Encounter an interdimensional traveler who helps you out.", bonus: "" },
                { roll: 2, name: "Closure †", description: "Your family believe you died some time ago, with your possessions redistributed accordingly.", bonus: "+1 LCK" },
                { roll: 3, name: "Fated †", description: "You're fated for some task, and until it's complete you find events conspiring to help you out.", bonus: "+1 LCK" },
                { roll: 4, name: "Training", description: "Complete mastery of a single subject, martial art, trade skill or philosophy known by 21st century humanity.", bonus: "" },
                { roll: 5, name: "Interdimensional Home", description: "You gain access to a pocket dimension apartment", bonus: "" },
                { roll: 6, name: "Incognito", description: "People often overlook you or forget your identity.", bonus: "" },
                { roll: 7, name: "Environmental Sealing", description: "Immune to environmental hazards of pressure and temperature, generate air in a thin layer around your body. Shared to anyone touching you.", bonus: "" },
                { roll: 8, name: "Get out of Jail", description: "Can teleport to a random safe location if imprisoned or trapped", bonus: "" },
                { roll: 9, name: "Big Damn Hero", description: "Can give someone/a location a token then instinctively know when danger approaches.", bonus: "" },
                { roll: 10, name: "Absolute Direction", description: "Always know which direction to travel in order to reach a destination or object.", bonus: "" },
                { roll: 11, name: "Big Backpack", description: "Big backpack full of useful items (food, identification documents, clothes, local currency).", bonus: "" },
                { roll: 12, name: "Natural Aging", description: "You can age naturally.", bonus: "" },
                { roll: 13, name: "Masculinity †", description: "Your gender is male.", bonus: "+1 LCK" },
                { roll: 14, name: "Overcity Shift", description: "Can shift yourself and a small area surrounding you into/out of the Overcity", bonus: "" },
                { roll: 15, name: "Money", description: "Gain a small amount of local currency each month, equiv. to a low income job (eg; 3000 USD)", bonus: "" },
                { roll: 16, name: "Familiar", description: "You have a small animal companion with knowledge about magic and monsters. Can transform into a human form temporarily, needing rest afterwards.", bonus: "" },
                { roll: 17, name: "Soul Jar", description: "Your body is a puppet controlled by your soul, now residing in a small breakable container; if destroyed you instantly die.", bonus: "" },
                { roll: 18, name: "Eternal Style", description: "Body and clothing always kept pristine. Can summon new clothing at will, but it vanishes 2 hours afterwards when not worn by you.", bonus: "" },
                { roll: 19, name: "A Way Out †", description: "Can willingly make your next death permanent, instead of regenerating your body from mana.", bonus: "+1 LCK" },
                { roll: 20, name: "Fake Parents", description: "You have a pair of adults who are convinced they're your parents, with documentation proving it, and have just moved into town.", bonus: "" }
            ]
        }
    };

    function rollD20() {
        return Math.floor(Math.random() * 20) + 1;
    }

    function getResult(category, roll) {
        if (category === 'age') {
            // Age Formula: 6 + roll. 1-10 as is, 11-20 subtract 10.
            let ageVal = roll;
            if (roll > 10) ageVal -= 10;
            return {
                result: `${6 + ageVal} years old`,
                stats: "",
                details: "Immortal, no longer ages."
            };
        }

        if (category === 'perk') {
            return null;
        }

        const table = data[category];
        if (!table) return null;

        // Check if table is range-based or direct map
        const item = table.find(entry => {
            if (entry.range) {
                return roll >= entry.range[0] && roll <= entry.range[1];
            }
            return entry.roll === roll;
        });

        if (!item) return { result: "Unknown", stats: "", details: "" };

        let result = item.type || item.name;
        let stats = item.bonus || "";
        let details = item.description || item.examples || item.notes || "";

        return { result, stats, details };
    }

    function getPerkResult(roll, tableType) {
        const table = data.perks[tableType];
        const item = table.find(entry => entry.roll === roll);
        return item ? { result: item.name, stats: item.bonus, details: item.description || "" } : { result: "Unknown", stats: "", details: "" };
    }

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
    const originRules = {
        'Contract': { gold: 1, silver: 3, bronze: 4, simple: { 'outfit': 0, 'perk5-combat': 0, 'perk5-support': 0 } },
        'Smug': { gold: 0, silver: 2, bronze: 3, allFree: true },
        'Weapon': { gold: 1, silver: 3, bronze: 4, simple: { 'weapon': 0 }, bonusStat: 'Weapon' },
        'Bloodline': { gold: 1, silver: 3, bronze: 4, simple: { 'specialization': 0 }, bonusStat: 'Specialisation' },
        'Emergency': { gold: 1, silver: 3, bronze: 4, simple: { 'perk1': 0, 'perk2': 0 }, combatShiftFree: true },
        'Artifact': { gold: 1, silver: 3, bronze: 4, extraArtifact: true },
        'Death': { gold: 1, silver: 4, bronze: 4 }
    };

    // Fields visible for each origin
    const originFields = {
        'Contract': ['outfit-select', 'perk5-select'],
        'Smug': ['age-select', 'body-select', 'spec-select', 'weapon-select', 'outfit-select', 'power-select', 'perk5-select'],
        'Weapon': ['weapon-select'],
        'Bloodline': ['spec-select'],
        'Emergency': ['e-perk1-select', 'e-perk2-select'],
        'Artifact': ['artifact-select'],
        'Death': [] // Death just gets coins
    };

    function setFieldVisibility(origin) {
        // Get all selector containers (parent of select)
        const allSelectors = [
            'age-select', 'body-select', 'spec-select', 'weapon-select', 'outfit-select', 'power-select',
            'perk5-select', 'e-perk1-select', 'e-perk2-select', 'e-perk3-select', 'e-perk4-select',
            'artifact-select', 'power2-select', 'extra-perk1-select', 'extra-perk2-select'
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

        const p5Opts = [
            ...data.perks.combat.map(p => ({ value: `C-${p.roll}`, text: `(C) ${p.name}` })),
            ...data.perks.support.map(p => ({ value: `S-${p.roll}`, text: `(S) ${p.name}` }))
        ];
        createSelect('perk5-select', 'Perk 5', p5Opts, 'cost-perk5', 'perk5', null, null); // Special handling in handler

        const combatPerks = data.perks.combat.filter(p => !p.name.includes('Artifact'));
        const combatOpts = combatPerks.map(p => ({ value: p.roll, text: p.name }));
        createSelect('e-perk1-select', 'Perk 1 (Combat)', combatOpts, 'cost-perk1', 'perk1', null);
        createSelect('e-perk2-select', 'Perk 2 (Combat)', combatOpts, 'cost-perk2', 'perk2', null);

        const supportPerks = data.perks.support;
        const supportOpts = supportPerks.map(p => ({ value: p.roll, text: p.name }));
        createSelect('e-perk3-select', 'Perk 3 (Support)', supportOpts, 'cost-perk3', 'perk3', null);
        createSelect('e-perk4-select', 'Perk 4 (Support)', supportOpts, 'cost-perk4', 'perk4', null);

        createSelect('extra-perk1-select', 'Extra Perk 1', combatOpts, 'cost-extra1', 'extra-perk1', null);
        createSelect('extra-perk2-select', 'Extra Perk 2', combatOpts, 'cost-extra2', 'extra-perk2', null);

        const artifactPerks = data.perks.combat.filter(p => p.name.includes('Artifact'));
        const artifactOpts = artifactPerks.map(p => ({ value: p.roll, text: p.name }));
        createSelect('artifact-select', 'Bonus Artifact', artifactOpts, 'cost-artifact', 'artifact', null);
    }

    populateSelections();

    function pRange(str) {
        if (typeof str === 'number') return [str, str];
        if (!str) return [0, 0];
        if (str.includes('-')) {
            const [min, max] = str.split('-').map(Number);
            return [min, max];
        }
        return [Number(str), Number(str)];
    }

    function checkOverlap(roll, rangeStr, tolerance) {
        const [min, max] = pRange(rangeStr);
        // Range Check: [min, max] vs [roll-tol, roll+tol]
        const rMin = roll - tolerance;
        const rMax = roll + tolerance;
        return Math.max(min, rMin) <= Math.min(max, rMax);
    }

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

                if (isNaN(originalRoll)) {
                    // We are editing a previously edited choice. Treat as Swap.
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
                        const currentAgeRollAdjusted = originalRoll > 10 ? originalRoll - 10 : originalRoll;
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
                    else if (categoryKey === 'body') {
                        const targetItem = dataList.find(i => i.type === val);
                        if (targetItem && checkOverlap(originalRoll, targetItem.roll, 2)) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey === 'specialization') {
                        const targetItem = dataList.find(i => i.type === val);
                        if (targetItem && checkOverlap(originalRoll, targetItem.roll, 1)) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey === 'weapon' || categoryKey === 'outfit') {
                        const targetItem = dataList.find(i => i.type === val);
                        if (targetItem && checkOverlap(originalRoll, targetItem.roll, 4)) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey === 'power' || categoryKey === 'power2') {
                        const targetItem = dataList.find(i => i.type === val);
                        if (targetItem && checkOverlap(originalRoll, targetItem.roll, 2)) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey === 'perk5') {
                        const [table, rStr] = val.split('-');
                        const r = parseInt(rStr);
                        const currentCat = existingItem.category;
                        const isCombat = currentCat.includes('Combat');
                        const targetIsCombat = table === 'C';

                        if (originalRoll === r && isCombat !== targetIsCombat) {
                            costCurrency = 'bronze';
                            costAmount = 1;
                        } else {
                            costCurrency = 'silver';
                            costAmount = 1;
                        }
                    }
                    else if (categoryKey.startsWith('perk') || categoryKey.startsWith('extra-perk') || categoryKey === 'artifact') {
                        costCurrency = 'silver';
                        costAmount = 1;
                    }
                }
            }

            // Pay
            if (previousCost.amount > 0) {
                currentBuild.wallet[previousCost.type] += previousCost.amount;
            }

            if (currentBuild.wallet[costCurrency] < costAmount) {
                if (previousCost.amount > 0) {
                    currentBuild.wallet[previousCost.type] -= previousCost.amount;
                }
                alert(`Not enough ${costCurrency}! Cost: ${costAmount} ${costCurrency}`);
                event.target.value = existingItem.rawName.includes('(Selected)') ? existingItem.rawName.replace(' (Selected)', '') : "";
                return;
            }

            currentBuild.wallet[costCurrency] -= costAmount;

            // Generate Manual Item Data
            let res = { result: "", stats: "", details: "" };

            if (categoryKey === 'age') {
                res = {
                    result: `${val} years old (Selected)`,
                    stats: "",
                    details: "Immortal, no longer ages."
                };
            } else if (categoryKey === 'perk5') {
                const [table, r] = val.split('-');
                const rollVal = parseInt(r);
                const tableType = table === 'C' ? 'combat' : 'support';
                const pData = getPerkResult(rollVal, tableType);
                res = { ...pData, result: pData.result };

            } else if (categoryKey === 'perk3' || categoryKey === 'perk4') {
                const rollVal = parseInt(val);
                const pData = getPerkResult(rollVal, 'support');
                res = { ...pData, result: pData.result };

            } else if (categoryKey.startsWith('perk') || categoryKey.startsWith('extra-perk') || categoryKey === 'artifact') {
                const rollVal = parseInt(val);
                const pData = getPerkResult(rollVal, 'combat');
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
                manualCost: { amount: costAmount, type: costCurrency }
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
                        res = getPerkResult(roll, 'support'); // Flip
                        note = " (Duplicate -> Swapped)";
                        if (seenPerks.has(res.result)) {
                            res = { result: "Free Perk Choice", stats: "User Choice", details: "Select any perk manually.", isWildcard: true };
                            note = " (Double Duplicate -> Free Choice)";
                        }
                    }
                    seenPerks.add(res.result);

                    currentBuild.items.push({ category: label, roll: roll + note, result: res.result, stats: res.stats || "", details: res.details || "", rawName: res.result });
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
            rawName: res.result
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
                    note = " (Duplicate -> Swapped)";

                    if (seenPerks.has(res.result)) {
                        // Double Duplicate! Free Choice.
                        res = {
                            result: "Free Perk Choice",
                            stats: "User Choice",
                            details: "You rolled a duplicate twice! Select any perk manually.",
                            isWildcard: true
                        };
                        note = " (Double Duplicate -> Free Choice)";
                    }
                }

                seenPerks.add(res.result);

                currentBuild.items.push({
                    category: label,
                    roll: roll + note,
                    result: res.result,
                    stats: res.stats || "",
                    details: res.details || "",
                    rawName: res.result
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
                    // Random Artifact logic (Perk roll but name includes Artifact)
                    // No, accidentalMahou.md says artifacts are specific entries.
                    // Let's assume we filter for them.
                    // ... Actually just assume regular handling or simplify.
                    // "Artifact (+Free Artifact Perk)" from origin.
                    // Let's roll until we get an artifact? Or just pick from list?
                    // Quick hack: filter duplicate list logic for artifacts?
                    // data.perks.combat has artifacts.
                    // Simple random selection from ONLY artifacts to ensure we get one.
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

        // Dice rolls
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
        const perks = currentBuild.items.filter(i => i.category.startsWith('Perk'));
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
});
