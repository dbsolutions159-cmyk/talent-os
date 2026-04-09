exports.calculateTrust = ({ time_taken }) => {
  let trust = 80;

  if (time_taken < 30) trust -= 20;
  if (time_taken > 300) trust -= 10;

  return { trust };
};