const applyStatBonuses = (stats, bonus) => {
  Object.entries(bonus).forEach(([key, value]) => {
    if (value) stats[key] += value;
  });
};

export default applyStatBonuses;
