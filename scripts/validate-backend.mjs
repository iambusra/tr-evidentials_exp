import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

class MockSheet {
  constructor(name) {
    this.name = name;
    this.rows = [];
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  getLastRow() {
    return this.rows.length;
  }

  appendRow(values) {
    this.rows.push([...values]);
  }

  setFrozenRows() {}

  getRange(row, column, rowCount = 1, columnCount = 1) {
    const rows = this.rows;
    return {
      getValue() {
        return rows[row - 1]?.[column - 1] ?? '';
      },
      setValue(value) {
        while (rows.length < row) rows.push([]);
        rows[row - 1][column - 1] = value;
      },
      getValues() {
        return Array.from({ length: rowCount }, (_, rowOffset) =>
          Array.from({ length: columnCount }, (_, columnOffset) =>
            rows[row - 1 + rowOffset]?.[column - 1 + columnOffset] ?? '',
          ),
        );
      },
    };
  }
}

class MockSpreadsheet {
  constructor(id) {
    this.id = id;
    this.sheets = [new MockSheet('Sheet1')];
  }

  getId() {
    return this.id;
  }

  getSheets() {
    return this.sheets;
  }

  getSheetByName(name) {
    return this.sheets.find((sheet) => sheet.getName() === name) ?? null;
  }

  insertSheet(name = `Sheet${this.sheets.length + 1}`) {
    const sheet = new MockSheet(name);
    this.sheets.push(sheet);
    return sheet;
  }
}

const propertyValues = new Map();
const folders = new Map();
const driveFiles = new Map();
const spreadsheets = new Map();
const cacheValues = new Map();
let nextId = 1;

const scriptProperties = {
  getProperty(key) {
    return propertyValues.get(key) ?? null;
  },
  setProperty(key, value) {
    propertyValues.set(key, String(value));
  },
  setProperties(values) {
    for (const [key, value] of Object.entries(values)) {
      propertyValues.set(key, String(value));
    }
  },
  getProperties() {
    return Object.fromEntries(propertyValues);
  },
};

const sandbox = {
  console: { log: console.log, error: () => {} },
  Date,
  JSON,
  Math,
  Number,
  Object,
  Array,
  Boolean,
  String,
  RegExp,
  Error,
  isNaN,
  PropertiesService: {
    getScriptProperties: () => scriptProperties,
  },
  DriveApp: {
    Access: { PRIVATE: 'PRIVATE' },
    Permission: { NONE: 'NONE' },
    createFolder() {
      const id = `folder-${nextId++}`;
      const folder = {
        id,
        files: new Map(),
        getId: () => id,
        setSharing: () => folder,
        getFilesByName(name) {
          let delivered = false;
          return {
            hasNext: () => !delivered && folder.files.has(name),
            next: () => {
              delivered = true;
              return folder.files.get(name);
            },
          };
        },
        createFile(name, content, mimeType) {
          const file = { name, content, mimeType };
          folder.files.set(name, file);
          return file;
        },
      };
      folders.set(id, folder);
      return folder;
    },
    getFolderById: (id) => folders.get(id),
    getFileById: (id) => driveFiles.get(id),
  },
  SpreadsheetApp: {
    create() {
      const id = `sheet-${nextId++}`;
      const spreadsheet = new MockSpreadsheet(id);
      spreadsheets.set(id, spreadsheet);
      driveFiles.set(id, { setSharing() { return this; } });
      return spreadsheet;
    },
    openById: (id) => spreadsheets.get(id),
  },
  LockService: {
    getScriptLock: () => ({
      tryLock: () => true,
      releaseLock: () => {},
    }),
  },
  CacheService: {
    getScriptCache: () => ({
      get: (key) => cacheValues.get(key) ?? null,
      put: (key, value) => cacheValues.set(key, value),
    }),
  },
  Utilities: {
    Charset: { UTF_8: 'utf8' },
    DigestAlgorithm: { SHA_256: 'sha256' },
    getUuid: () => crypto.randomUUID(),
    formatDate: () => '202609020101',
    computeDigest: (_algorithm, value) => [...crypto.createHash('sha256').update(value).digest()],
    computeHmacSha256Signature: (value, key) => [
      ...crypto.createHmac('sha256', key).update(value).digest(),
    ],
    base64EncodeWebSafe: (bytes) => Buffer.from(bytes).toString('base64url'),
  },
  MimeType: { PLAIN_TEXT: 'text/plain' },
  ContentService: {
    MimeType: { JSON: 'application/json' },
    createTextOutput(text) {
      return {
        text,
        setMimeType() {
          return this;
        },
      };
    },
  },
};

vm.createContext(sandbox);
const receiverCode = fs.readFileSync(
  new URL('../backend/google-apps-script/Code.gs', import.meta.url),
  'utf8',
);
vm.runInContext(receiverCode, sandbox, { filename: 'Code.gs' });

function trialResponse(itemType, index) {
  const base = {
    trialId: `${itemType}-${index}`,
    itemId: `${itemType}-item-${index}`,
    itemType,
    sequence: index + 1,
    rating: 4,
    responseTimeMs: 1500,
    condition: null,
    marker: null,
    evidenceSource: null,
    evidenceStrength: null,
    acquisitionTiming: null,
    fillerIntended: null,
    attentionExpected: null,
    attentionPassed: null,
  };

  if (itemType === 'critical') {
    return {
      ...base,
      condition: 'own_strong_realtime',
      marker: 'di',
      evidenceSource: 'own',
      evidenceStrength: 'strong',
      acquisitionTiming: 'realtime',
    };
  }
  if (itemType === 'filler') {
    return { ...base, fillerIntended: index % 2 === 0 ? 'good' : 'bad' };
  }
  const attentionExpected = index % 2 === 0 ? 2 : 5;
  return {
    ...base,
    rating: attentionExpected,
    attentionExpected,
    attentionPassed: true,
  };
}

function experimentPayload() {
  const itemTypes = [
    ...Array(16).fill('critical'),
    ...Array(16).fill('filler'),
    ...Array(2).fill('attention'),
  ];
  return {
    action: 'submitExperiment',
    schemaVersion: 3,
    studyId: 'turkish-evidentiality-v1',
    stimulusVersion: 'test-version',
    participant: {
      participantId: 'test-participant',
      participantIdSource: 'generated',
      recruitmentSource: 'network',
      prolificStudyId: null,
      prolificSessionId: null,
    },
    session: {
      sessionId: 'test-session',
      listId: 1,
      totalLists: 38,
      contentListId: 1,
      marker: 'di',
      criticalTrialCount: 16,
      fillerTrialCount: 16,
      consentedAt: '2026-09-02T10:00:00.000Z',
      completedAt: '2026-09-02T10:15:00.000Z',
      timezone: 'Europe/Istanbul',
      language: 'tr-TR',
      proofOfHumanSessionId: null,
    },
    demographics: {
      ageBand: '25–34',
      gender: '',
      education: 'Lisans',
      nativeTurkish: 'yes',
      turkishLearningStart: 'Doğumdan itibaren',
      speaksOtherLanguages: 'yes',
      otherLanguages: 'İngilizce',
      currentCountry: 'Türkiye',
      longestResidenceCountry: 'Türkiye',
    },
    practiceResponses: Array.from({ length: 3 }, (_, index) => ({
      practiceId: `practice-${index + 1}`,
      rating: 4,
      expectedMin: 1,
      expectedMax: 7,
      correct: true,
    })),
    responses: itemTypes.map((itemType, index) => trialResponse(itemType, index)),
  };
}

function post(payload) {
  const output = sandbox.doPost({ postData: { contents: JSON.stringify(payload) } });
  return JSON.parse(output.text);
}

const setupStatus = sandbox.setupExperimentStorage();
assert.equal(setupStatus.collectionActive, false);
assert.equal(setupStatus.responseFolderConfigured, true);
assert.equal(setupStatus.raffleSpreadsheetConfigured, true);
assert.equal(setupStatus.tokenSecretConfigured, true);

sandbox.startCollection();
const payload = experimentPayload();
const firstSubmission = post(payload);
assert.equal(firstSubmission.ok, true);
assert.equal(firstSubmission.duplicate, false);
assert.match(firstSubmission.confirmationCode, /^[A-F0-9]{12}$/);
assert.match(firstSubmission.raffleToken, /^v1\./);

const responseFolder = folders.get(propertyValues.get('RESPONSES_FOLDER_ID'));
assert.equal(responseFolder.files.size, 1);
const storedResponse = JSON.parse([...responseFolder.files.values()][0].content);
assert.equal(storedResponse.action, undefined);
assert.equal(storedResponse.responses.length, 34);
assert.equal(storedResponse.server.confirmationCode, firstSubmission.confirmationCode);

const duplicateSubmission = post(payload);
assert.equal(duplicateSubmission.ok, true);
assert.equal(duplicateSubmission.duplicate, true);
assert.equal(duplicateSubmission.raffleToken, firstSubmission.raffleToken);
assert.equal(responseFolder.files.size, 1);

const raffleResult = post({
  action: 'raffleEntry',
  studyId: payload.studyId,
  raffleToken: firstSubmission.raffleToken,
  email: 'test@example.org',
});
assert.equal(raffleResult.ok, true);

const raffleSpreadsheet = spreadsheets.get(propertyValues.get('RAFFLE_SPREADSHEET_ID'));
const entriesSheet = raffleSpreadsheet.getSheetByName('Entries');
assert.deepEqual(entriesSheet.rows[1], ['test@example.org', entriesSheet.rows[1][1]]);

const reusedToken = post({
  action: 'raffleEntry',
  studyId: payload.studyId,
  raffleToken: firstSubmission.raffleToken,
  email: 'second@example.org',
});
assert.deepEqual(reusedToken, { ok: false, errorCode: 'RAFFLE_TOKEN_USED' });
assert.equal(entriesSheet.rows.length, 2);

const unexpectedField = experimentPayload();
unexpectedField.extra = true;
assert.throws(
  () => sandbox.validateExperimentPayload_(unexpectedField, payload.studyId),
  /UNEXPECTED_FIELDS/,
);

const emailLeak = experimentPayload();
emailLeak.demographics.otherLanguages = 'test@example.org';
assert.throws(
  () => sandbox.validateExperimentPayload_(emailLeak, payload.studyId),
  /EMAIL_IN_RESPONSE_PAYLOAD/,
);

sandbox.stopCollection();
assert.deepEqual(post(payload), { ok: false, errorCode: 'COLLECTION_CLOSED' });

console.log(
  'Backend validation passed: private response files, duplicate protection, separate one-use raffle entries, strict schema checks, and collection controls.',
);
