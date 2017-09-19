const slopeone = require('./slopeone');
const ichm = require('./ichm');
const saw = require('./saw');

module.exports = (
  rating,
  content,
  indexUser,
  indexJarak = 0,
  flag = [-1, 1],
  bobot = [0.5, 0.5],
  config = { k: 4, iterate: 200, coefisien: 0.4 }
) => {
  const ichmVal = ichm(slopeone(rating), content, config);

  const coldStart = [];
  const nonColdStart = [];
  content.forEach((rowVal, rowIndex) => {
    coldStart.push([rowVal[indexJarak], ichmVal.coldStart[indexUser][rowIndex]]);
    nonColdStart.push([rowVal[indexJarak], ichmVal.nonColdStart[indexUser][rowIndex]]);
  });

  return {
    coldStart: saw(coldStart, flag, bobot),
    nonColdStart: saw(nonColdStart, flag, bobot),
  };
};
