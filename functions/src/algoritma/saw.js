import math from 'mathjs';

const normalisasi = (matriks, flag) => {
  const max = math.max(matriks, 0);
  const min = math.min(matriks, 0);
  const normal = [];
  matriks.forEach((row) => {
    const rowNormal = [];
    row.forEach((col, colIndex) => {
      const formula = flag[colIndex] === 1 ?
        col / max[colIndex] :
        min[colIndex] / col;
      rowNormal.push(formula);
    });
    normal.push(rowNormal);
  });
  return normal;
};

const preferensi = (normalMatriks, bobot) => {
  const pref = [];
  normalMatriks.forEach((row) => {
    let item = 0;
    row.forEach((col, colIndex) => {
      item += bobot[colIndex] * col;
    });
    pref.push(item);
  });
  return pref;
};

export default (matriks, flag, bobot) => preferensi(normalisasi(matriks, flag), bobot);
