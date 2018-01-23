import math from 'mathjs';

const mae = (rating, rekomendasi) => {
  const result = [];

  rating.forEach((row, rowIndex) => {
    let pembilang = 0;
    const penyebut = row.length;
    row.forEach((val, valIndex) => {
      pembilang += val - rekomendasi[rowIndex][valIndex];
    });
    pembilang = math.abs(pembilang);
    result.push(pembilang / penyebut);
  });

  return result;
};

export default mae;
