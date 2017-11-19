import math from 'mathjs';

const dev = (ratingItem) => {
  const items = math.transpose(ratingItem);
  let card = 0;
  let pembilang = 0;
  const deviation = [];

  items.forEach((jVal, j) => {
    const rowDeviation = [];
    items.forEach((iVal, i) => {
      if (j === i) {
        rowDeviation.push({
          card: 0,
          value: 0,
        });
        return;
      }

      iVal.forEach((colVal, colIndex) => {
        if (parseFloat(items[j][colIndex]) !== 0 && parseFloat(items[i][colIndex]) !== 0) {
          card += 1;
          pembilang += parseFloat(items[j][colIndex]) - parseFloat(items[i][colIndex]);
        }
      });
      rowDeviation.push({
        card,
        value: pembilang / card,
      });
      pembilang = 0;
      card = 0;
    });
    deviation.push(rowDeviation);
  });

  return deviation;
};

const p = (deviation, ratingItem) => {
  const newRatingPrediction = [];
  let pembilang = 0;
  let penyebut = 0;

  ratingItem.forEach((uVal, u) => {
    const rowNewRatingPrediction = [];
    uVal.forEach((jVal, j) => {
      if (parseFloat(jVal) === 0) {
        deviation[j].forEach((iVal, i) => {
          pembilang += (iVal.value + ratingItem[u][i]) * iVal.card;
          penyebut += iVal.card;
        });
        const predict = (penyebut !== 0) ? pembilang / penyebut : 0;
        penyebut = 0;
        pembilang = 0;
        rowNewRatingPrediction.push(predict);
      } else {
        rowNewRatingPrediction.push(jVal);
      }
    });
    newRatingPrediction.push(rowNewRatingPrediction);
  });

  return newRatingPrediction;
};

export default ratingItem => p(dev(ratingItem), ratingItem);
