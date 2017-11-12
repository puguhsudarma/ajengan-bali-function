/**
 * Fungsi untuk mengubah derajat menjadi radius
 * @param {*} deg
 * @source https://stackoverflow.com/a/27943/6548504
 */
const deg2rad = deg => deg * (Math.PI / 180);

/**
 * Fungsi untuk menghitung jarak antara dua titik koordinat
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @source https://stackoverflow.com/a/27943/6548504
 */
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a1 = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const a2 = Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2));
  const a3 = Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const a = (a1 + a2) * a3;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(2));
};

module.exports = getDistance;
