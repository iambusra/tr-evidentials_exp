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
}

const contentListCount = CRITICAL_ITEMS.length / 2;
assert.equal(contentListCount, 19, 'Expected 19 content lists per marker');

for (const marker of ['di', 'mis'] as const) {
  const coverage = new Map<string, number>();

  for (let contentList = 0; contentList < contentListCount; contentList += 1) {
    const selectedItemIds = new Set<string>();
    const conditionCounts = new Map(CONDITION_KEYS.map((condition) => [condition, 0]));

    CONDITION_KEYS.forEach((condition, conditionIndex) => {
      const itemRow = (contentList + conditionIndex) % contentListCount;
      for (const itemIndex of [itemRow, itemRow + contentListCount]) {
        const item = CRITICAL_ITEMS[itemIndex];
        selectedItemIds.add(item.id);
        conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
        const cell = `${item.id}:${condition}:${marker}`;
        coverage.set(cell, (coverage.get(cell) ?? 0) + 1);
      }
    });

    assert.equal(selectedItemIds.size, 16, 'Each list must contain 16 unique critical items');
    for (const count of conditionCounts.values()) {
      assert.equal(count, 2, 'Each list must contain two critical items per condition');
    }
  }

  for (const item of CRITICAL_ITEMS) {
    for (const condition of CONDITION_KEYS) {
      assert.equal(
        coverage.get(`${item.id}:${condition}:${marker}`),
        1,
        `${item.id}:${condition}:${marker} must appear once per content-list cycle`,
      );
    }
  }
}

console.log(
  'Design validation passed: 38 items, 19 content lists per marker, 16 critical trials per participant, 8 conditions, 24 available fillers, 3 practice trials, and 2 attention checks.',
);
