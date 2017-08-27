"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// dep
let clusterMaker = require('clusters');
let math = require('mathjs');
let _ = require('lodash');
/**
 * Clustering with K-means method
 * Probabilitas Clustering with Pro(j,k) formula
 *
 * @param {number} k
 * @param {number} iterate
 * @param {number[][]} contentItem
 * @returns
 */
const clustering = (k, iterate, contentItem) => {
    clusterMaker.k(k);
    clusterMaker.iterations(iterate);
    clusterMaker.data(contentItem);
    const cluster = clusterMaker.clusters();
    let matrixPro = [];
    _.forEach(cluster, (item, index) => {
        let counterSimilarity = [];
        let maxCS = 0;
        let eachCluster = [];
        // Calc. CS(j,k) and MaxCS(j,k)
        _.forEach(contentItem, (val, idx) => {
            // // Persamaan CS(j,k) => Eucledian Distance : (De) = Sqrt((Xi-Si)^2+(Yi-Ti)^2)
            const De = math.sqrt(math.pow((val[0] - item.centroid[0]), 2) + math.pow((val[1] - item.centroid[1]), 2));
            maxCS = (maxCS < De) ? De : maxCS;
            counterSimilarity.push(De);
        });
        // Calc. Pro(j,k)
        _.forEach(counterSimilarity, (val, idx) => {
            eachCluster.push((1 - (val / maxCS)));
        });
        //assign
        matrixPro.push(eachCluster);
        //reset
        counterSimilarity = [];
        maxCS = 0;
        eachCluster = [];
    });
    return math.transpose(matrixPro);
};
exports.clustering = clustering;
/**
 * Pearson Correlation-based Similarity
 *
 * @param {number} k
 * @param {number} l
 * @param {number[][]} data
 * @returns
 */
const pearsonCorrelationBasedSimilarity = (k, l, data) => {
    const RMean = [math.mean(data[k]), math.mean(data[l])];
    let simPembilang = 0;
    let simPenyebutA = 0;
    let simPenyebutB = 0;
    data = math.transpose(data); // -> transpose untuk mendapatkan item menjadi kolom
    _.forEach(data, (val, key) => {
        const calc_i = val[k] - RMean[0];
        const calc_j = val[l] - RMean[1];
        simPembilang += (calc_i * calc_j);
        simPenyebutA += math.pow(calc_i, 2);
        simPenyebutB += math.pow(calc_j, 2);
    });
    const simPenyebut = math.sqrt(simPenyebutA) * math.sqrt(simPenyebutB);
    return (simPenyebut !== 0) ? (simPembilang / simPenyebut) : 0;
};
exports.pearsonCorrelationBasedSimilarity = pearsonCorrelationBasedSimilarity;
/**
 * Adjusted Cosine Similarity
 *
 * @param {number} k
 * @param {number} l
 * @param {number[][]} data
 * @returns
 */
const adjustCosineSimilarity = (k, l, data) => {
    data = math.transpose(data); // transpose matrik, agar kluster menjadi baris
    const RuMean = math.mean(data, 1);
    let simPembilang = 0;
    let simPenyebutA = 0;
    let simPenyebutB = 0;
    _.forEach(data, (val, key) => {
        const calc_k = val[k] - RuMean[key];
        const calc_l = val[l] - RuMean[key];
        simPembilang += (calc_k * calc_l);
        simPenyebutA += math.pow(calc_k, 2);
        simPenyebutB += math.pow(calc_l, 2);
    });
    const simPenyebut = math.sqrt(simPenyebutA) * math.sqrt(simPenyebutB);
    return (simPenyebut !== 0) ? (simPembilang / simPenyebut) : 0;
};
exports.adjustCosineSimilarity = adjustCosineSimilarity;
/**
 * Linear Combination
 *
 * @param {number} ratingSimilarity
 * @param {number} groupRatingSimilarity
 * @param {number} [coefisien=0.4]
 * @returns
 */
const linearCombination = (ratingSimilarity, groupRatingSimilarity, coefisien = 0.4) => {
    return (ratingSimilarity * (1 - coefisien)) + (groupRatingSimilarity * coefisien);
};
exports.linearCombination = linearCombination;
/**
 * Weighted Average of Deviation
 *
 * @param {number} u
 * @param {number} k
 * @param {number[][]} linearSim
 * @param {number[][]} ratingItem
 * @returns
 */
const weightedAverageDeviation = (u, k, linearSim, ratingItem) => {
    const RkMean = math.mean(ratingItem[k]);
    const RiMean = math.mean(ratingItem, 1);
    let prediksiPembilang = 0;
    let prediksiPenyebut = 0;
    _.forEach(ratingItem, (val, i) => {
        prediksiPembilang += (val[u] - RiMean[i]) * linearSim[k][i];
        prediksiPenyebut += math.abs(linearSim[k][i]);
    });
    return (prediksiPenyebut !== 0) ? RkMean + (prediksiPembilang / prediksiPenyebut) : 0;
};
exports.weightedAverageDeviation = weightedAverageDeviation;
/**
 * Weighted Sum
 *
 * @param {number} u
 * @param {number} k
 * @param {number[][]} linearSim
 * @param {number[][]} ratingItem
 * @returns
 */
const weightedSum = (u, k, linearSim, ratingItem) => {
    let simPembilang = 0;
    let simPenyebut = 0;
    _.forEach(ratingItem, (val, i) => {
        simPembilang += val[u] * linearSim[k][i];
        simPenyebut += math.abs(linearSim[k][i]);
    });
    return (simPenyebut !== 0) ? simPembilang / simPenyebut : 0;
};
exports.weightedSum = weightedSum;
/**
 * Item Clustered Hybrid Method. Recommendation Hybrid Method.
 *
 * @param {number[][]} groupRating
 * @param {number[][]} ratingItems
 * @returns
 */
const ICHM = (contentItems, ratingItems, config = { k: 4, iterate: 100 }) => {
    const groupRating = clustering(config.k, config.iterate, contentItems);
    let simGroupRating = [];
    _.forEach(groupRating, (val_k, k) => {
        let eachRow = [];
        _.forEach(groupRating, (val_l, l) => {
            eachRow.push(adjustCosineSimilarity(k, l, groupRating).toFixed(2));
        });
        simGroupRating.push([...eachRow]);
    });
    let simRating = [];
    _.forEach(ratingItems, (val_k, k) => {
        let eachRow = [];
        _.forEach(ratingItems, (val_l, l) => {
            eachRow.push(pearsonCorrelationBasedSimilarity(k, l, ratingItems).toFixed(2));
        });
        simRating.push([...eachRow]);
    });
    let combine = [];
    _.forEach(ratingItems, (val_k, k) => {
        let eachRow = [];
        _.forEach(ratingItems, (val_l, l) => {
            eachRow.push(linearCombination(simRating[k][l], simGroupRating[k][l]).toFixed(2));
        });
        combine.push([...eachRow]);
    });
    let weightDev = [];
    _.forEach(ratingItems, (items, k) => {
        let eachRow = [];
        _.forEach(items, (user, u) => {
            eachRow.push(weightedAverageDeviation(u, k, combine, ratingItems).toFixed(2));
        });
        weightDev.push([...eachRow]);
    });
    let weightSum = [];
    _.forEach(ratingItems, (items, k) => {
        let eachRow = [];
        _.forEach(items, (user, u) => {
            eachRow.push(weightedSum(u, k, combine, ratingItems).toFixed(2));
        });
        weightSum.push([...eachRow]);
    });
    return { weightDev, weightSum };
};
exports.ICHM = ICHM;
