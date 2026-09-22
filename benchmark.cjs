const { performance } = require('perf_hooks');

const kinds = ['flight', 'hotel', 'activity'];
const items = Array.from({ length: 100000 }, (_, i) => ({
  id: String(i),
  kind: kinds[i % 3],
  status: i % 5 === 0 ? 'cancelled' : i % 4 === 0 ? 'pending' : 'booked',
  cost: Math.random() * 1000
}));

const trip = { items };

function oldWay() {
  const spent = trip.items
    .filter((item) => item.status !== 'cancelled')
    .reduce((sum, item) => sum + (item.cost || 0), 0)
  const pending = trip.items.filter((item) => item.status === 'pending').length

  const kindCounts = kinds.map(kind => trip.items.filter((item) => item.kind === kind).length);
  return { spent, pending, kindCounts };
}

function newWay() {
  return trip.items.reduce(
    (acc, item) => {
      if (item.status !== 'cancelled') acc.spent += item.cost || 0;
      if (item.status === 'pending') acc.pending++;
      acc.counts[item.kind]++;
      return acc;
    },
    { spent: 0, pending: 0, counts: { flight: 0, hotel: 0, activity: 0 } }
  );
}

// Warm up
for (let i = 0; i < 10; i++) {
  oldWay();
  newWay();
}

const N = 100;
const startOld = performance.now();
for (let i = 0; i < N; i++) oldWay();
const oldTime = performance.now() - startOld;

const startNew = performance.now();
for (let i = 0; i < N; i++) newWay();
const newTime = performance.now() - startNew;

console.log(`Baseline (multiple filters): ${oldTime.toFixed(2)} ms`);
console.log(`Optimized (single reduce): ${newTime.toFixed(2)} ms`);
console.log(`Improvement: ${((oldTime - newTime) / oldTime * 100).toFixed(2)}% faster`);
