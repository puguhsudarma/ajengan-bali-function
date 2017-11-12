// const slopeone = require('./slopeone');
const ichm = require('./ichm');
const saw = require('./saw');

module.exports = (
  rating,
  content,
  indexUser,
  indexJarak = 0,
  flag = [-1, 1],
  bobot = [0.5, 0.5],
  config = { k: 4, iterate: 200, coefisien: 0.4 },
) => {
  // Algoritma Slope One
  // const slopeOne = slopeone(rating);
  // console.log(slopeOne);

  // Algoritma ICHM
  const ichmVal = ichm(rating, content, config);
  // console.log(ichmVal);

  // Algoritma SAW
  // const coldStart = [];
  // const nonColdStart = [];
  // content.forEach((rowVal, rowIndex) => {
  //   coldStart.push([rowVal[indexJarak], ichmVal.coldStart[indexUser][rowIndex]]);
  //   nonColdStart.push([rowVal[indexJarak], ichmVal.nonColdStart[indexUser][rowIndex]]);
  // });
  // const sawResult = {
  //   coldStart: saw(coldStart, flag, bobot),
  //   nonColdStart: saw(nonColdStart, flag, bobot),
  // };

  const coldStart = [];
  content.forEach((rowVal, rowIndex) => {
    coldStart.push([rowVal[indexJarak], ichmVal.coldStart[indexUser][rowIndex]]);
  });
  const sawResult = saw(coldStart, flag, bobot);

  return sawResult;
};
