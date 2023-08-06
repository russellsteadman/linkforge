import test from 'ava';
import {forge} from '../index.js';

test('can create arrays', (t) => {
  t.deepEqual(forge().toArray(), []);
  t.deepEqual(forge([]).toArray(), []);
  t.deepEqual(forge([1]).toArray(), [1]);
  t.deepEqual(forge([1, 2]).toArray(), [1, 2]);
  t.deepEqual(forge([1, 2, 3]).toArray(), [1, 2, 3]);
});

test('can create sets', (t) => {
  t.deepEqual(forge().toSet(), new Set());
  t.deepEqual(forge([]).toSet(), new Set());
  t.deepEqual(forge([1]).toSet(), new Set([1]));
  t.deepEqual(forge([1, 2]).toSet(), new Set([1, 2]));
  t.deepEqual(forge([1, 2, 3]).toSet(), new Set([1, 2, 3]));

  // Removes duplicates
  t.deepEqual(forge([1, 2, 3, 1, 2, 3]).toSet(), new Set([1, 2, 3]));
});

test('can push to arrays', (t) => {
  t.deepEqual(forge().push(1).toArray(), [1]);
  t.deepEqual(forge([1]).push(2).toArray(), [1, 2]);
  t.deepEqual(forge([1, 2]).push(3).toArray(), [1, 2, 3]);
});

test('can unshift to arrays', (t) => {
  t.deepEqual(forge().unshift(1).toArray(), [1]);
  t.deepEqual(forge([1]).unshift(2).toArray(), [2, 1]);
  t.deepEqual(forge([1, 2]).unshift(3).toArray(), [3, 1, 2]);
});

test('can pop from arrays', (t) => {
  const forge1 = forge([1, 2, 3]);
  t.is(forge1.pop(), 3);
  t.deepEqual(forge1.toArray(), [1, 2]);

  const forge2 = forge([1, 2]);
  t.is(forge2.pop(), 2);
  t.deepEqual(forge2.toArray(), [1]);

  const forge3 = forge([1]);
  t.is(forge3.pop(), 1);
  t.deepEqual(forge3.toArray(), []);

  const forge4 = forge([]);
  t.is(forge4.pop(), undefined);
  t.deepEqual(forge4.toArray(), []);
});

test('can shift from arrays', (t) => {
  const forge1 = forge([1, 2, 3]);
  t.is(forge1.shift(), 1);
  t.deepEqual(forge1.toArray(), [2, 3]);

  const forge2 = forge([1, 2]);
  t.is(forge2.shift(), 1);
  t.deepEqual(forge2.toArray(), [2]);

  const forge3 = forge([1]);
  t.is(forge3.shift(), 1);
  t.deepEqual(forge3.toArray(), []);

  const forge4 = forge([]);
  t.is(forge4.shift(), undefined);
  t.deepEqual(forge4.toArray(), []);
});

test('can iterate arrays', (t) => {
  const forge1 = forge([1, 2, 3]);
  t.deepEqual([...forge1], [1, 2, 3]);

  const forge2 = forge([1, 2]);
  t.deepEqual([...forge2], [1, 2]);

  const forge3 = forge([1]);
  t.deepEqual([...forge3], [1]);

  const forge4 = forge([]);
  t.deepEqual([...forge4], []);

  let iter = 1;
  for (const x of forge1) {
    t.is(x, iter);
    iter++;
  }
});

test('can reverse arrays', (t) => {
  t.deepEqual(forge().reverse().toArray(), []);
  t.deepEqual(forge([1]).reverse().toArray(), [1]);
  t.deepEqual(forge([1, 2]).reverse().toArray(), [2, 1]);
  t.deepEqual(forge([1, 2, 3]).reverse().toArray(), [3, 2, 1]);

  // Changes the original
  const forge1 = forge([1, 2, 3]);
  t.deepEqual(forge1.reverse().toArray(), [3, 2, 1]);
  t.deepEqual(forge1.toArray(), [3, 2, 1]);
});

test('can filter arrays', (t) => {
  t.deepEqual(
    forge([1, 2, 3])
      .filter((x) => x % 2 === 0)
      .toArray(),
    [2],
  );
  t.deepEqual(
    forge([1, 2, 3])
      .filter((x) => x % 2 === 1)
      .toArray(),
    [1, 3],
  );
  t.deepEqual(
    forge([1, 2, 3])
      .filter((x) => x % 2 === 2)
      .toArray(),
    [],
  );

  // Maintains the original
  const forge1 = forge([1, 2, 3]);
  t.deepEqual(forge1.filter((x) => x % 2 === 0).toArray(), [2]);
  t.deepEqual(forge1.toArray(), [1, 2, 3]);
});

test('can map arrays', (t) => {
  t.deepEqual(
    forge([1, 2, 3])
      .map((x) => x * 2)
      .toArray(),
    [2, 4, 6],
  );
  t.deepEqual(
    forge([1, 2, 3])
      .map((x) => x * 3)
      .toArray(),
    [3, 6, 9],
  );
  t.deepEqual(
    forge([1, 2, 3])
      .map((x) => x * 4)
      .toArray(),
    [4, 8, 12],
  );

  // Maintains the original
  const forge1 = forge([1, 2, 3]);
  t.deepEqual(forge1.map((x) => x * 2).toArray(), [2, 4, 6]);
  t.deepEqual(forge1.toArray(), [1, 2, 3]);
});

test('can reduce arrays', (t) => {
  t.is(
    forge([1, 2, 3]).reduce((a, b) => a + b, 0),
    6,
  );
  t.is(
    forge([1, 2, 3]).reduce((a, b) => a + b, 1),
    7,
  );
  t.is(
    forge([1, 2, 3]).reduce((a, b) => a + b, 2),
    8,
  );

  // Maintains the original
  const forge1 = forge([1, 2, 3]);
  t.is(
    forge1.reduce((a, b) => a + b, 0),
    6,
  );
  t.deepEqual(forge1.toArray(), [1, 2, 3]);
});
