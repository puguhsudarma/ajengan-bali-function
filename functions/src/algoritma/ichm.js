import math from 'mathjs';
import clusterMaker from './clustering';
import {
  configICHM,
} from './config';

const groupRating = (contentItem) => {
  // clustering
  const cluster = clusterMaker(contentItem);

  // group rating
  const matrixPro = [];
  cluster.forEach((numberCluster) => {
    let maxCS = 0;
    const CS = [];
    const rowCluster = [];

    // CS(j,k) and MaxCS(j,k)
    contentItem.forEach((rowItem) => {
      // Eucledian distance
      const De = math.distance(rowItem, numberCluster.centroid);
      CS.push(De);
      if (maxCS < De) maxCS = De;
    });

    // Pro(j,k)
    CS.forEach(valCS => rowCluster.push(1 - (valCS / maxCS)));

    // assign
    matrixPro.push(rowCluster);
  });

  return matrixPro;
};

const pearsonCorrelationBasedSimilarity = (ratingItem) => {
  // inisialisasi variabel
  const data = math.transpose(ratingItem);
  const mean = math.mean(data, 1);
  let simPembilang = 0;
  let simPenyebutA = 0;
  let simPenyebutB = 0;
  const similarity = [];

  // proses similarity
  data.forEach((iVal, i) => {
    const rowSimilarity = [];
    data.forEach((jVal, j) => {
      jVal.forEach((val, colIndex) => {
        const calcI = data[i][colIndex] - mean[i];
        const calcJ = data[j][colIndex] - mean[j];
        simPembilang += (calcI * calcJ);
        simPenyebutA += (math.pow(calcI, 2));
        simPenyebutB += (math.pow(calcJ, 2));
      });
      const simPenyebut = math.sqrt(simPenyebutA) * math.sqrt(simPenyebutB);
      rowSimilarity.push((simPenyebut !== 0) ? (simPembilang / simPenyebut) : 0);
      simPembilang = 0;
      simPenyebutA = 0;
      simPenyebutB = 0;
    });
    similarity.push(rowSimilarity);
  });

  return similarity;
};

const adjustCosineSimilarity = (dataGroupRating) => {
  // inisialisasi variabel
  const mean = math.mean(dataGroupRating, 1);
  let simPembilang = 0;
  let simPenyebutA = 0;
  let simPenyebutB = 0;
  const similarity = [];
  const data = math.transpose(dataGroupRating);

  // proses similarity
  data.forEach((kVal, k) => {
    const rowSimilarity = [];
    data.forEach((lVal, l) => {
      lVal.forEach((val, colIndex) => {
        const calcK = data[k][colIndex] - mean[colIndex];
        const calcL = data[l][colIndex] - mean[colIndex];
        simPembilang += (calcK * calcL);
        simPenyebutA += math.pow(calcK, 2);
        simPenyebutB += math.pow(calcL, 2);
      });
      const simPenyebut = math.sqrt(simPenyebutA) * math.sqrt(simPenyebutB);
      rowSimilarity.push((simPenyebut !== 0) ? (simPembilang / simPenyebut) : 0);
      simPembilang = 0;
      simPenyebutA = 0;
      simPenyebutB = 0;
    });
    similarity.push(rowSimilarity);
  });
  return similarity;
};

const linearCombination = (ratingSimilarity, groupRatingSimilarity, coefisien) => {
  const similarity = [];
  ratingSimilarity.forEach((row, rowIndex) => {
    const rowSimilarity = [];
    row.forEach((col, colIndex) => {
      const lc = (col * (1 - coefisien)) + (groupRatingSimilarity[rowIndex][colIndex] * coefisien);
      rowSimilarity.push(lc);
    });
    similarity.push(rowSimilarity);
  });
  return similarity;
};

// const weightedAverageDeviation = (ratingItem, linearSim) => {
//   const mean = math.mean(ratingItem, 0);
//   const nonColdStart = [];
//   let prediksiPembilang = 0;
//   let prediksiPenyebut = 0;

//   ratingItem.forEach((uVal) => {
//     const rowNonColdStart = [];
//     uVal.forEach((kVal, k) => {
//       uVal.forEach((iVal, i) => {
//         prediksiPembilang += (iVal - mean[i]) * linearSim[k][i];
//         prediksiPenyebut += math.abs(linearSim[k][i]);
//       });
//       const wad = (prediksiPenyebut !== 0) ?
//         mean[k] + (prediksiPembilang / prediksiPenyebut) :
//         0;
//       prediksiPembilang = 0;
//       prediksiPenyebut = 0;
//       rowNonColdStart.push(wad);
//     });
//     nonColdStart.push(rowNonColdStart);
//   });

//   return nonColdStart;
// };

// const weightedSum = (ratingItem, linearSim, indexUser) => {
//   const coldStart = [];
//   let prediksiPembilang = 0;
//   let prediksiPenyebut = 0;

//   ratingItem.forEach((uVal) => {
//     const rowColdStart = [];
//     uVal.forEach((kVal, k) => {
//       uVal.forEach((iVal, i) => {
//         prediksiPembilang += iVal * linearSim[k][i];
//         prediksiPenyebut += math.abs(linearSim[k][i]);
//       });
//       const ws = (prediksiPenyebut !== 0) ? prediksiPembilang / prediksiPenyebut : 0;
//       prediksiPembilang = 0;
//       prediksiPenyebut = 0;
//       rowColdStart.push(ws);
//     });
//     coldStart.push(rowColdStart);
//   });

//   return coldStart;
// };

const weightedSum = (ratingItem, linearSim, indexUser) => {
  const coldStart = [];
  let prediksiPembilang = 0;
  let prediksiPenyebut = 0;

  ratingItem[indexUser].forEach((kVal, k) => {
    ratingItem[indexUser].forEach((iVal, i) => {
      prediksiPembilang += iVal * linearSim[k][i];
      prediksiPenyebut += math.abs(linearSim[k][i]);
    });
    const ws = (prediksiPenyebut !== 0) ? prediksiPembilang / prediksiPenyebut : 0;
    prediksiPembilang = 0;
    prediksiPenyebut = 0;
    coldStart.push(ws);
  });

  return coldStart;
};

export default (ratingItem, contentItem, indexUser, config = configICHM) => {
  const gR = groupRating(contentItem);
  const simR = pearsonCorrelationBasedSimilarity(ratingItem);
  const simGR = adjustCosineSimilarity(gR);
  const lc = linearCombination(simR, simGR, config.coefisien);

  // return {
  //   nonColdStart: weightedAverageDeviation(ratingItem, lc),
  //   coldStart: weightedSum(ratingItem, lc),
  // };

  return weightedSum(ratingItem, lc, indexUser);
};
