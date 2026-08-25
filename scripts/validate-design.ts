import assert from 'node:assert/strict';
import {
  ATTENTION_CHECKS,
  CONDITION_KEYS,
  CRITICAL_ITEMS,
  FILLERS,
  PRACTICE_TRIALS,
} from '../app/stimuli.ts';

assert.equal(CRITICAL_ITEMS.length, 38, 'Expected 38 critical items');
assert.equal(FILLERS.length, 24, 'Expected 24 fillers');
assert.equal(PRACTICE_TRIALS.length, 3, 'Expected 3 practice trials');
assert.equal(ATTENTION_CHECKS.length, 2, 'Expected 2 attention checks');
assert.equal(CONDITION_KEYS.length, 8, 'Expected 8 context conditions');
assert.equal(new Set(CRITICAL_ITEMS.map((item) => item.id)).size, 38, 'Critical IDs must be unique');
assert.equal(new Set(FILLERS.map((item) => item.id)).size, 24, 'Filler IDs must be unique');
assert.equal(FILLERS.filter((item) => item.intended === 'good').length, 12, 'Expected 12 good fillers');
assert.equal(FILLERS.filter((item) => item.intended === 'bad').length, 12, 'Expected 12 bad fillers');

for (const item of PRACTICE_TRIALS) {
  assert.ok(item.context.length >= 20, `${item.id} needs a context`);
  assert.ok(item.target.length >= 10, `${item.id} needs a target`);
  assert.ok(item.expectedMin >= 1 && item.expectedMax <= 7, `${item.id} has an invalid range`);
  assert.ok(item.expectedMin <= item.expectedMax, `${item.id} has an inverted range`);
  assert.ok(item.explanation.length >= 20, `${item.id} needs feedback`);
}

for (const item of ATTENTION_CHECKS) {
  assert.ok(item.context.includes('dikkatle'), `${item.id} must identify the attention check`);
  assert.ok(item.target.includes('Lütfen'), `${item.id} must give an explicit instruction`);
  assert.ok(item.requiredRating >= 1 && item.requiredRating <= 7, `${item.id} has an invalid rating`);
}

for (const item of CRITICAL_ITEMS) {
  assert.notEqual(item.target.di, item.target.mis, `${item.id} needs two target forms`);
  for (const condition of CONDITION_KEYS) {
    assert.ok(item.contexts[condition].length >= 20, `${item.id} is missing ${condition}`);
  }

  const cells = new Set<string>();
  for (let listIndex = 0; listIndex < 16; listIndex += 1) {
    const itemIndex = CRITICAL_ITEMS.indexOf(item);
    const condition = CONDITION_KEYS[(itemIndex + (listIndex % 8)) % 8];
    const marker = (itemIndex + Math.floor(listIndex / 8)) % 2 === 0 ? 'di' : 'mis';
    cells.add(`${condition}:${marker}`);
  }
  assert.equal(cells.size, 16, `${item.id} must rotate through all 16 cells`);
}

for (let listIndex = 0; listIndex < 16; listIndex += 1) {
  const markers = CRITICAL_ITEMS.map((_, itemIndex) =>
    (itemIndex + Math.floor(listIndex / 8)) % 2 === 0 ? 'di' : 'mis',
  );
  assert.equal(markers.filter((marker) => marker === 'di').length, 19);
  assert.equal(markers.filter((marker) => marker === 'mis').length, 19);

  const conditionCounts = new Map(CONDITION_KEYS.map((condition) => [condition, 0]));
  CRITICAL_ITEMS.forEach((_, itemIndex) => {
    const condition = CONDITION_KEYS[(itemIndex + (listIndex % 8)) % 8];
    conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
  });
  for (const count of conditionCounts.values()) {
    assert.ok(count === 4 || count === 5, 'Every list must distribute items evenly across conditions');
  }
}

console.log(
  'Design validation passed: 38 critical items, 8 conditions, 2 markers, 24 fillers, 3 practice trials, and 2 attention checks.',
);
