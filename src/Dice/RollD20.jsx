const roll11D20 = () => {
  const rolls = [];
  for (let i = 0; i < 11; i++) {
    rolls.push(Math.floor(Math.random() * 20));
  }
  return rolls;
};

export default roll11D20;
