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
            { range: [5, 6], type: "Twinned Soul", description: "Splits soul into two bodies.", notes: "Share stats/perks. -1 all stats." },
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

    let currentBuild = { rolls: [], items: [], perk5Showing: 'combat' };

    generateBtn.addEventListener('click', () => {
        resultsTableBody.innerHTML = '';
        currentBuild = { rolls: [], items: [], perk5Showing: 'combat' };

        const process = (category, label, typeOverride = null) => {
            const roll = rollD20();
            currentBuild.rolls.push(roll);

            const res = typeOverride ? getPerkResult(roll, typeOverride) : getResult(category, roll);

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

        // 1. Age
        process('age', 'Age');
        // 2. Body
        process('body', 'Body');
        // 3. Specialization
        process('specialization', 'Specialization');
        // 4. Weapon
        process('weapon', 'Weapon');
        // 5. Outfit
        process('outfit', 'Outfit');
        // 6. Power
        process('power', 'Power');

        // 7-11. Perks
        // 1 & 2: Combat
        process('perk', 'Perk 1 (Combat)', 'combat');
        process('perk', 'Perk 2 (Combat)', 'combat');

        // 3 & 4: Support
        process('perk', 'Perk 3 (Support)', 'support');
        process('perk', 'Perk 4 (Support)', 'support');

        // 5: Wildcard - Store both but only show combat initially
        const r5 = rollD20();
        currentBuild.rolls.push(r5);

        const res5Combat = getPerkResult(r5, 'combat');
        const res5Support = getPerkResult(r5, 'support');

        // Store both options
        currentBuild.perk5Combat = {
            category: 'Perk 5 (Combat)',
            roll: r5,
            result: res5Combat.result,
            stats: res5Combat.stats,
            details: res5Combat.details || "",
            rawName: res5Combat.result
        };
        currentBuild.perk5Support = {
            category: 'Perk 5 (Support)',
            roll: r5,
            result: res5Support.result,
            stats: res5Support.stats,
            details: res5Support.details || "",
            rawName: res5Support.result
        };

        // Add combat version to items and display
        currentBuild.items.push(currentBuild.perk5Combat);
        addResultRow('Perk 5 (Combat)', r5, res5Combat.result, res5Combat.stats, res5Combat.details || "");

        resultsContainer.classList.remove('hidden');
        exportBtn.classList.remove('hidden');
        document.querySelector('.container').classList.add('expanded');
        document.getElementById('toggle-perk5-btn').classList.remove('hidden');
    });

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
                <td>${p.category}</td>
                <td>${p.roll}</td>
                <td>${p.result}</td>
                <td>${p.stats}</td>
                <td>${p.details}</td>
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
                <td>${p.category}</td>
                <td>${p.roll}</td>
                <td>${p.result}</td>
                <td>${p.stats}</td>
                <td>${p.details}</td>
            `;
            // Update items array
            const itemIndex = currentBuild.items.findIndex(i => i.category.startsWith('Perk 5'));
            if (itemIndex !== -1) {
                currentBuild.items[itemIndex] = currentBuild.perk5Combat;
            }
        }
    });

    exportBtn.addEventListener('click', () => {
        if (!currentBuild || currentBuild.items.length === 0) return;

        let text = "";

        // Dice rolls
        text += `Dice rolls: ${currentBuild.rolls.join(' ')}\n\n`;

        // Gender Logic
        const hasMasculinity = currentBuild.items.some(i => i.rawName.includes('Masculinity'));
        const gender = hasMasculinity ? "Male (Masculinity Perk)" : "Female";

        const findItem = (catStart) => currentBuild.items.find(i => i.category.startsWith(catStart));

        text += `Age: ${findItem('Age').result}\n`;
        text += `Gender: ${gender}\n`;
        text += `Body: ${findItem('Body').result}\n`;
        text += `Specialisation: ${findItem('Specialization').result}\n`;
        text += `Weapon: ${findItem('Weapon').result}\n`;
        text += `Outfit: ${findItem('Outfit').result}\n`;
        text += `Power: ${findItem('Power').result}\n`;

        // Perks
        const perks = currentBuild.items.filter(i => i.category.startsWith('Perk'));
        perks.forEach(p => {
            let label = p.category;
            text += `${label}: ${p.result}`;
            if (p.stats) text += ` (${p.stats})`;
            text += `\n`;
        });

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
            <td>${category}</td>
            <td>${roll}</td>
            <td>${result}</td>
            <td>${stats}</td>
            <td>${details}</td>
        `;
        resultsTableBody.appendChild(row);
    }
});
