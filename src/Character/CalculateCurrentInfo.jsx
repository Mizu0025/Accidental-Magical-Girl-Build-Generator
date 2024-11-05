const CalculateCurrentInfo = (info, bonus) => {
  Object.entries(bonus).forEach(([key, value]) => {
    if (value) info[key] += value;
  });
};

export default CalculateCurrentInfo;
