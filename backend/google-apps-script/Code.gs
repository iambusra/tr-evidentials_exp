/**
 * Private Google Drive receiver for the Turkish evidentiality experiment.
 *
 * Deploy this file as a Google Apps Script web app from the Stanford account
 * that should own the research data. Never copy Script Properties into GitHub.
 */

var SERVICE_NAME = 'tr-evidentials-exp-receiver';
var EXPECTED_SCHEMA_VERSION = 3;
var EXPECTED_CRITICAL_COUNT = 16;
var EXPECTED_FILLER_COUNT = 16;
var EXPECTED_ATTENTION_COUNT = 2;
var EXPECTED_RESPONSE_COUNT = 34;
var EXPECTED_PRACTICE_COUNT = 3;
var MAX_BODY_CHARACTERS = 500000;
var DEFAULT_MAX_REQUESTS_PER_MINUTE = 120;

function doGet() {
  var properties = PropertiesService.getScriptProperties();
  return jsonResponse_({
    ok: true,
    service: SERVICE_NAME,
    schemaVersion: EXPECTED_SCHEMA_VERSION,
    collectionActive: properties.getProperty('COLLECTION_ACTIVE') === 'true'
  });
}

function doPost(event) {
  try {
    var payload = parsePayload_(event);
    var settings = getSettings_();
    assert_(settings.collectionActive, 'COLLECTION_CLOSED');

    var lock = LockService.getScriptLock();
    assert_(lock.tryLock(10000), 'SERVICE_BUSY');
    try {
      enforceRateLimit_(settings.maxRequestsPerMinute);
      if (payload.action === 'raffleEntry') {
        return jsonResponse_(saveRaffleEntry_(payload, settings));
      }
      if (payload.action === 'submitExperiment') {
        return jsonResponse_(saveExperimentResponse_(payload, settings));
      }
      throw new Error('UNKNOWN_ACTION');
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error && error.stack ? error.stack : String(error));
    return jsonResponse_({
      ok: false,
      errorCode: publicErrorCode_(error)
    });
  }
}

/**
 * Run once from the Apps Script editor while signed into the Stanford account.
 * It creates two private storage locations and a server-only token secret.
 * Collection remains closed until startCollection() is run.
 */
function setupExperimentStorage() {
  var properties = PropertiesService.getScriptProperties();
  var studyId = properties.getProperty('STUDY_ID') || 'turkish-evidentiality-v1';
  var responseFolderId = properties.getProperty('RESPONSES_FOLDER_ID');
  var raffleSpreadsheetId = properties.getProperty('RAFFLE_SPREADSHEET_ID');

  if (!responseFolderId) {
    var responseFolder = DriveApp.createFolder(studyId + '_PRIVATE_RESPONSES');
    responseFolderId = responseFolder.getId();
    properties.setProperty('RESPONSES_FOLDER_ID', responseFolderId);
  }

  if (!raffleSpreadsheetId) {
    var raffleSpreadsheet = SpreadsheetApp.create(studyId + '_PRIVATE_RAFFLE');
    raffleSpreadsheetId = raffleSpreadsheet.getId();
    properties.setProperty('RAFFLE_SPREADSHEET_ID', raffleSpreadsheetId);
    initializeRaffleSpreadsheet_(raffleSpreadsheet);
  } else {
    initializeRaffleSpreadsheet_(SpreadsheetApp.openById(raffleSpreadsheetId));
  }

  if (!properties.getProperty('TOKEN_PEPPER')) {
    properties.setProperty(
      'TOKEN_PEPPER',
      Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid()
    );
  }

  properties.setProperties({
    STUDY_ID: studyId,
    COLLECTION_ACTIVE: properties.getProperty('COLLECTION_ACTIVE') || 'false',
    MAX_REQUESTS_PER_MINUTE:
      properties.getProperty('MAX_REQUESTS_PER_MINUTE') ||
      String(DEFAULT_MAX_REQUESTS_PER_MINUTE)
  });

  DriveApp.getFolderById(responseFolderId).setSharing(
    DriveApp.Access.PRIVATE,
    DriveApp.Permission.NONE
  );
  DriveApp.getFileById(raffleSpreadsheetId).setSharing(
    DriveApp.Access.PRIVATE,
    DriveApp.Permission.NONE
  );

  return getStorageStatus();
}

function startCollection() {
  getSettings_();
  PropertiesService.getScriptProperties().setProperty('COLLECTION_ACTIVE', 'true');
  return getStorageStatus();
}

function stopCollection() {
  PropertiesService.getScriptProperties().setProperty('COLLECTION_ACTIVE', 'false');
  return getStorageStatus();
}

function getStorageStatus() {
  var properties = PropertiesService.getScriptProperties();
  return {
    studyId: properties.getProperty('STUDY_ID'),
    collectionActive: properties.getProperty('COLLECTION_ACTIVE') === 'true',
    responseFolderConfigured: Boolean(properties.getProperty('RESPONSES_FOLDER_ID')),
    raffleSpreadsheetConfigured: Boolean(
      properties.getProperty('RAFFLE_SPREADSHEET_ID')
    ),
    tokenSecretConfigured: Boolean(properties.getProperty('TOKEN_PEPPER'))
  };
}

function saveExperimentResponse_(payload, settings) {
  validateExperimentPayload_(payload, settings.studyId);

  var sessionHash = sha256Hex_(payload.session.sessionId + ':' + settings.tokenPepper);
  var confirmationCode = sessionHash.slice(0, 12).toUpperCase();
  var fileName = settings.studyId + '__' + sessionHash + '.json';
  var folder = DriveApp.getFolderById(settings.responsesFolderId);
  var existingFiles = folder.getFilesByName(fileName);
  var duplicate = existingFiles.hasNext();

  if (!duplicate) {
    var storedPayload = JSON.parse(JSON.stringify(payload));
    delete storedPayload.action;
    storedPayload.server = {
      receivedAt: new Date().toISOString(),
      confirmationCode: confirmationCode,
      receiverVersion: '2026-09-02-r1'
    };
    folder.createFile(
      fileName,
      JSON.stringify(storedPayload, null, 2),
      MimeType.PLAIN_TEXT
    );
  }

  var result = {
    ok: true,
    duplicate: duplicate,
    confirmationCode: confirmationCode
  };

  if (payload.participant.recruitmentSource === 'network') {
    var raffleToken = makeRaffleToken_(sessionHash, settings.tokenPepper);
    recordRaffleToken_(raffleToken, settings.raffleSpreadsheetId);
    result.raffleToken = raffleToken;
  }

  return result;
}

function saveRaffleEntry_(payload, settings) {
  assertExactKeys_(payload, ['action', 'studyId', 'raffleToken', 'email']);
  assert_(payload.action === 'raffleEntry', 'INVALID_RAFFLE_ACTION');
  assert_(payload.studyId === settings.studyId, 'INVALID_STUDY');
  assertString_(payload.raffleToken, 'raffleToken', 20, 500);
  assertString_(payload.email, 'email', 3, 254);
  assert_(isEmail_(payload.email), 'INVALID_EMAIL');

  var spreadsheet = SpreadsheetApp.openById(settings.raffleSpreadsheetId);
  initializeRaffleSpreadsheet_(spreadsheet);
  var tokensSheet = spreadsheet.getSheetByName('Tokens');
  var entriesSheet = spreadsheet.getSheetByName('Entries');
  var tokenHash = sha256Hex_(payload.raffleToken);
  var tokenRow = findTokenRow_(tokensSheet, tokenHash);

  assert_(tokenRow > 1, 'INVALID_RAFFLE_TOKEN');
  var usedAt = tokensSheet.getRange(tokenRow, 3).getValue();
  assert_(!usedAt, 'RAFFLE_TOKEN_USED');

  var now = new Date().toISOString();
  var normalizedEmail = payload.email.trim().toLowerCase();
  entriesSheet.appendRow([escapeSheetValue_(normalizedEmail), now]);
  tokensSheet.getRange(tokenRow, 3).setValue(now);

  return { ok: true };
}

function validateExperimentPayload_(payload, studyId) {
  assertExactKeys_(payload, [
    'action',
    'schemaVersion',
    'studyId',
    'stimulusVersion',
    'participant',
    'session',
    'demographics',
    'practiceResponses',
    'responses'
  ]);
  assert_(payload.action === 'submitExperiment', 'INVALID_ACTION');
  assert_(payload.schemaVersion === EXPECTED_SCHEMA_VERSION, 'INVALID_SCHEMA');
  assert_(payload.studyId === studyId, 'INVALID_STUDY');
  assertString_(payload.stimulusVersion, 'stimulusVersion', 1, 100);
  assert_(!containsEmailAddress_(payload), 'EMAIL_IN_RESPONSE_PAYLOAD');

  validateParticipant_(payload.participant);
  validateSession_(payload.session);
  validateDemographics_(payload.demographics);
  validatePracticeResponses_(payload.practiceResponses);
  validateTrialResponses_(payload.responses, payload.session.marker);
}

function validateParticipant_(participant) {
  assertPlainObject_(participant, 'participant');
  assertExactKeys_(participant, [
    'participantId',
    'participantIdSource',
    'recruitmentSource',
    'prolificStudyId',
    'prolificSessionId'
  ]);
  assertString_(participant.participantId, 'participantId', 1, 200);
  assertOneOf_(participant.participantIdSource, ['prolific', 'url', 'generated']);
  assertOneOf_(participant.recruitmentSource, ['prolific', 'network']);
  assertNullableString_(participant.prolificStudyId, 'prolificStudyId', 200);
  assertNullableString_(participant.prolificSessionId, 'prolificSessionId', 200);
}

function validateSession_(session) {
  assertPlainObject_(session, 'session');
  assertExactKeys_(session, [
    'sessionId',
    'listId',
    'totalLists',
    'contentListId',
    'marker',
    'criticalTrialCount',
    'fillerTrialCount',
    'consentedAt',
    'completedAt',
    'timezone',
    'language',
    'proofOfHumanSessionId'
  ]);
  assertString_(session.sessionId, 'sessionId', 1, 200);
  assertIntegerInRange_(session.listId, 1, 38, 'listId');
  assert_(session.totalLists === 38, 'INVALID_TOTAL_LISTS');
  assertIntegerInRange_(session.contentListId, 1, 19, 'contentListId');
  assertOneOf_(session.marker, ['di', 'mis']);
  assert_(session.criticalTrialCount === EXPECTED_CRITICAL_COUNT, 'INVALID_CRITICAL_COUNT');
  assert_(session.fillerTrialCount === EXPECTED_FILLER_COUNT, 'INVALID_FILLER_COUNT');
  assertIsoDate_(session.consentedAt, 'consentedAt');
  assertIsoDate_(session.completedAt, 'completedAt');
  assertString_(session.timezone, 'timezone', 1, 100);
  assertString_(session.language, 'language', 1, 100);
  assertNullableString_(session.proofOfHumanSessionId, 'proofOfHumanSessionId', 500);
}

function validateDemographics_(demographics) {
  assertPlainObject_(demographics, 'demographics');
  assertExactKeys_(demographics, [
    'ageBand',
    'gender',
    'education',
    'nativeTurkish',
    'turkishLearningStart',
    'speaksOtherLanguages',
    'otherLanguages',
    'currentCountry',
    'longestResidenceCountry'
  ]);
  assertString_(demographics.ageBand, 'ageBand', 1, 50);
  assertString_(demographics.gender, 'gender', 0, 100);
  assertString_(demographics.education, 'education', 1, 100);
  assertOneOf_(demographics.nativeTurkish, ['yes', 'no']);
  assertString_(demographics.turkishLearningStart, 'turkishLearningStart', 1, 100);
  assertOneOf_(demographics.speaksOtherLanguages, ['yes', 'no']);
  assertString_(demographics.otherLanguages, 'otherLanguages', 0, 1000);
  assertString_(demographics.currentCountry, 'currentCountry', 1, 200);
  assertString_(
    demographics.longestResidenceCountry,
    'longestResidenceCountry',
    1,
    200
  );
  if (demographics.speaksOtherLanguages === 'yes') {
    assert_(demographics.otherLanguages.trim().length > 0, 'MISSING_OTHER_LANGUAGES');
  }
}

function validatePracticeResponses_(responses) {
  assert_(Array.isArray(responses), 'INVALID_PRACTICE_RESPONSES');
  assert_(responses.length === EXPECTED_PRACTICE_COUNT, 'INVALID_PRACTICE_COUNT');
  responses.forEach(function (response) {
    assertPlainObject_(response, 'practiceResponse');
    assertExactKeys_(response, [
      'practiceId',
      'rating',
      'expectedMin',
      'expectedMax',
      'correct'
    ]);
    assertString_(response.practiceId, 'practiceId', 1, 100);
    assertIntegerInRange_(response.rating, 1, 7, 'practiceRating');
    assertIntegerInRange_(response.expectedMin, 1, 7, 'expectedMin');
    assertIntegerInRange_(response.expectedMax, 1, 7, 'expectedMax');
    assert_(typeof response.correct === 'boolean', 'INVALID_PRACTICE_CORRECT');
  });
}

function validateTrialResponses_(responses, sessionMarker) {
  assert_(Array.isArray(responses), 'INVALID_RESPONSES');
  assert_(responses.length === EXPECTED_RESPONSE_COUNT, 'INVALID_RESPONSE_COUNT');

  var counts = { critical: 0, filler: 0, attention: 0 };
  var trialIds = {};
  responses.forEach(function (response, index) {
    assertPlainObject_(response, 'response');
    assertExactKeys_(response, [
      'trialId',
      'itemId',
      'itemType',
      'sequence',
      'rating',
      'responseTimeMs',
      'condition',
      'marker',
      'evidenceSource',
      'evidenceStrength',
      'acquisitionTiming',
      'fillerIntended',
      'attentionExpected',
      'attentionPassed'
    ]);
    assertString_(response.trialId, 'trialId', 1, 200);
    assertString_(response.itemId, 'itemId', 1, 200);
    assert_(!trialIds[response.trialId], 'DUPLICATE_TRIAL_ID');
    trialIds[response.trialId] = true;
    assertOneOf_(response.itemType, ['critical', 'filler', 'attention']);
    counts[response.itemType] += 1;
    assert_(response.sequence === index + 1, 'INVALID_SEQUENCE');
    assertIntegerInRange_(response.rating, 1, 7, 'rating');
    assertIntegerInRange_(response.responseTimeMs, 0, 43200000, 'responseTimeMs');

    if (response.itemType === 'critical') {
      assertString_(response.condition, 'condition', 1, 100);
      assert_(response.marker === sessionMarker, 'MARKER_MISMATCH');
      assertOneOf_(response.evidenceSource, ['own', 'reportative']);
      assertOneOf_(response.evidenceStrength, ['strong', 'weak']);
      assertOneOf_(response.acquisitionTiming, ['realtime', 'after']);
      assert_(response.fillerIntended === null, 'INVALID_CRITICAL_FILLER_VALUE');
      assert_(response.attentionExpected === null, 'INVALID_CRITICAL_ATTENTION_VALUE');
      assert_(response.attentionPassed === null, 'INVALID_CRITICAL_ATTENTION_PASS');
    } else if (response.itemType === 'filler') {
      assertOneOf_(response.fillerIntended, ['good', 'bad']);
      assertNullCriticalFields_(response);
      assert_(response.attentionExpected === null, 'INVALID_FILLER_ATTENTION_VALUE');
      assert_(response.attentionPassed === null, 'INVALID_FILLER_ATTENTION_PASS');
    } else {
      assertOneOf_(response.attentionExpected, [2, 5]);
      assert_(typeof response.attentionPassed === 'boolean', 'INVALID_ATTENTION_PASS');
      assert_(
        response.attentionPassed === (response.rating === response.attentionExpected),
        'ATTENTION_PASS_MISMATCH'
      );
      assertNullCriticalFields_(response);
      assert_(response.fillerIntended === null, 'INVALID_ATTENTION_FILLER_VALUE');
    }
  });

  assert_(counts.critical === EXPECTED_CRITICAL_COUNT, 'INVALID_CRITICAL_COUNT');
  assert_(counts.filler === EXPECTED_FILLER_COUNT, 'INVALID_FILLER_COUNT');
  assert_(counts.attention === EXPECTED_ATTENTION_COUNT, 'INVALID_ATTENTION_COUNT');
}

function assertNullCriticalFields_(response) {
  ['condition', 'marker', 'evidenceSource', 'evidenceStrength', 'acquisitionTiming'].forEach(
    function (key) {
      assert_(response[key] === null, 'INVALID_NONCRITICAL_' + key.toUpperCase());
    }
  );
}

function parsePayload_(event) {
  assert_(event && event.postData && typeof event.postData.contents === 'string', 'EMPTY_BODY');
  var body = event.postData.contents;
  assert_(body.length > 0 && body.length <= MAX_BODY_CHARACTERS, 'INVALID_BODY_SIZE');
  var payload = JSON.parse(body);
  assertPlainObject_(payload, 'payload');
  return payload;
}

function getSettings_() {
  var properties = PropertiesService.getScriptProperties().getProperties();
  assertString_(properties.STUDY_ID, 'STUDY_ID', 1, 100);
  assertString_(properties.RESPONSES_FOLDER_ID, 'RESPONSES_FOLDER_ID', 1, 500);
  assertString_(properties.RAFFLE_SPREADSHEET_ID, 'RAFFLE_SPREADSHEET_ID', 1, 500);
  assertString_(properties.TOKEN_PEPPER, 'TOKEN_PEPPER', 32, 1000);
  return {
    studyId: properties.STUDY_ID,
    responsesFolderId: properties.RESPONSES_FOLDER_ID,
    raffleSpreadsheetId: properties.RAFFLE_SPREADSHEET_ID,
    tokenPepper: properties.TOKEN_PEPPER,
    collectionActive: properties.COLLECTION_ACTIVE === 'true',
    maxRequestsPerMinute: Math.max(
      1,
      Number(properties.MAX_REQUESTS_PER_MINUTE) || DEFAULT_MAX_REQUESTS_PER_MINUTE
    )
  };
}

function initializeRaffleSpreadsheet_(spreadsheet) {
  var tokensSheet = spreadsheet.getSheetByName('Tokens');
  if (!tokensSheet) {
    var firstSheet = spreadsheet.getSheets()[0];
    tokensSheet = firstSheet.getName() === 'Sheet1' ? firstSheet : spreadsheet.insertSheet();
    tokensSheet.setName('Tokens');
  }
  if (tokensSheet.getLastRow() === 0) {
    tokensSheet.appendRow(['token_hash', 'issued_at', 'used_at']);
    tokensSheet.setFrozenRows(1);
  }

  var entriesSheet = spreadsheet.getSheetByName('Entries');
  if (!entriesSheet) entriesSheet = spreadsheet.insertSheet('Entries');
  if (entriesSheet.getLastRow() === 0) {
    entriesSheet.appendRow(['email', 'entered_at']);
    entriesSheet.setFrozenRows(1);
  }
}

function recordRaffleToken_(token, spreadsheetId) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  initializeRaffleSpreadsheet_(spreadsheet);
  var sheet = spreadsheet.getSheetByName('Tokens');
  var tokenHash = sha256Hex_(token);
  if (findTokenRow_(sheet, tokenHash) < 0) {
    sheet.appendRow([tokenHash, new Date().toISOString(), '']);
  }
}

function findTokenRow_(sheet, tokenHash) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var index = 0; index < values.length; index += 1) {
    if (values[index][0] === tokenHash) return index + 2;
  }
  return -1;
}

function makeRaffleToken_(sessionHash, pepper) {
  var bytes = Utilities.computeHmacSha256Signature(
    'raffle:' + sessionHash,
    pepper,
    Utilities.Charset.UTF_8
  );
  return 'v1.' + Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

function enforceRateLimit_(maximum) {
  var cache = CacheService.getScriptCache();
  var minute = Utilities.formatDate(new Date(), 'GMT', 'yyyyMMddHHmm');
  var key = 'requests:' + minute;
  var count = Number(cache.get(key) || '0') + 1;
  assert_(count <= maximum, 'RATE_LIMITED');
  cache.put(key, String(count), 120);
}

function sha256Hex_(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return bytes
    .map(function (byte) {
      var normalized = (byte + 256) % 256;
      return ('0' + normalized.toString(16)).slice(-2);
    })
    .join('');
}

function containsEmailAddress_(value) {
  if (typeof value === 'string') {
    return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
  }
  if (Array.isArray(value)) return value.some(containsEmailAddress_);
  if (value && typeof value === 'object') {
    return Object.keys(value).some(function (key) {
      return containsEmailAddress_(value[key]);
    });
  }
  return false;
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function escapeSheetValue_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function assertExactKeys_(value, expectedKeys) {
  assertPlainObject_(value, 'object');
  var actualKeys = Object.keys(value).sort();
  var expected = expectedKeys.slice().sort();
  assert_(JSON.stringify(actualKeys) === JSON.stringify(expected), 'UNEXPECTED_FIELDS');
}

function assertPlainObject_(value, name) {
  assert_(Boolean(value) && typeof value === 'object' && !Array.isArray(value), 'INVALID_' + name);
}

function assertString_(value, name, minimum, maximum) {
  assert_(typeof value === 'string', 'INVALID_' + name);
  assert_(value.length >= minimum && value.length <= maximum, 'INVALID_' + name + '_LENGTH');
}

function assertNullableString_(value, name, maximum) {
  assert_(value === null || (typeof value === 'string' && value.length <= maximum), 'INVALID_' + name);
}

function assertIntegerInRange_(value, minimum, maximum, name) {
  assert_(Number.isInteger(value) && value >= minimum && value <= maximum, 'INVALID_' + name);
}

function assertIsoDate_(value, name) {
  assertString_(value, name, 10, 100);
  assert_(!isNaN(Date.parse(value)), 'INVALID_' + name);
}

function assertOneOf_(value, choices) {
  assert_(choices.indexOf(value) >= 0, 'INVALID_ENUM_VALUE');
}

function assert_(condition, code) {
  if (!condition) throw new Error(code);
}

function publicErrorCode_(error) {
  var code = error && error.message ? String(error.message) : 'SERVER_ERROR';
  var publicCodes = [
    'COLLECTION_CLOSED',
    'SERVICE_BUSY',
    'RATE_LIMITED',
    'INVALID_RAFFLE_TOKEN',
    'RAFFLE_TOKEN_USED',
    'INVALID_EMAIL'
  ];
  return publicCodes.indexOf(code) >= 0 ? code : 'INVALID_REQUEST';
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON
  );
}
