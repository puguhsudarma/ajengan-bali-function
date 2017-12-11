import algoritma from '../algoritma';

const ratingItem = [
  [0, 2, 2, 3, 5, 4, 2, 1, 5, 0], // -> user
  [1, 0, 5, 2, 1, 3, 1, 5, 1, 2],
  [4, 1, 5, 1, 1, 1, 5, 0, 3, 4],
  [0, 5, 0, 0, 3, 2, 3, 3, 4, 1],
  [5, 0, 0, 1, 2, 2, 0, 4, 1, 0],
  [3, 5, 2, 3, 1, 2, 3, 5, 0, 1],
  [2, 0, 3, 5, 0, 1, 2, 3, 5, 0],
];

const contentItem = [
  [10600, 2.94],
  [7870, 0.96],
  [1353, 1.11],
  [657, 1.73],
  [5885, 1.11],
  [6913, 3.01],
  [3109, 4.08],
  [4180, 1.51],
  [7524, 0.66],
  [4082, 1.37],
];

console.log(algoritma(ratingItem, contentItem, 0));
