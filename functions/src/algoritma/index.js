import slopeone from './slopeone';
import ichm from './ichm';
import saw from './saw';
import {
  indexJarakSAW,
} from './config';

export default (
  rating,
  content,
  indexUser,
  indexJarak = indexJarakSAW,
) => {
  // Algoritma Slope One
  const slopeOne = slopeone(rating);
  // console.log(slopeOne);

  // Algoritma ICHM
  const ichmVal = ichm(slopeOne, content, indexUser);
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
    coldStart.push([rowVal[indexJarak], ichmVal[rowIndex]]);
  });
  const sawResult = saw(coldStart);

  return sawResult;
};
