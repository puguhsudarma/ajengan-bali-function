import clusterMaker from 'clusters';
import math from 'mathjs';
import _ from 'lodash';
import {
  clusterConfig,
  rangeNormalized as range,
} from './config';

const sse = (clusters) => {
  let resultSSE = 0;
  clusters.forEach((el) => {
    let sumCj = 0;
    el.points.forEach((x) => {
      sumCj += math.pow(math.distance(x, el.centroid), 2);
    });
    resultSSE += sumCj;
  });

  return resultSSE;
};

const elbow = (sseResult) => {
  // declare var
  const selisih = [];
  let previousVal = 0;

  // proccess
  sseResult.forEach((el, i) => {
    // first iteration
    if (i === 0) {
      selisih.push(0);
      previousVal = el;
      return;
    }

    selisih.push(previousVal - el);
    previousVal = el;
  });

  // find the best elbow
  const max = math.max(selisih);
  const bestElbow = _.findIndex(selisih, el => el === max);

  return bestElbow;
};

const normalisasi = (dataset, minRange = range.min, maxRange = range.max) => {
  const minValue = math.min(dataset, 0);
  const maxValue = math.max(dataset, 0);
  const result = [];
  dataset.forEach((row) => {
    const rowResult = [];
    row.forEach((x, index) => {
      const normal = ((x - minValue[index]) * (maxRange - minRange)) /
        ((maxValue[index] - minValue[index]) + minRange);
      rowResult.push(normal);
    });
    result.push(rowResult);
  });

  return result;
};

const clustering = (dataset, config = clusterConfig) => {
  // declare var
  const clusters = [];
  const SSE = [];

  // Preproccessing
  const normalDataset = normalisasi(dataset);

  // clustering proccess
  clusterMaker.iterations(config.iterate);
  clusterMaker.data(normalDataset);
  for (let k = config.minK; k <= config.maxK; k += 1) {
    clusterMaker.k(k);
    const kmean = clusterMaker.clusters();
    clusters.push(kmean);
    // calculate error
    SSE.push(sse(kmean));
  }

  // console.log(SSE);

  // compare error
  const bestK = elbow(SSE);

  // return the best cluster
  return clusters[bestK];
};

export default clustering;
