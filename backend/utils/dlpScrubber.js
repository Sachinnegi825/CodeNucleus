import { DlpServiceClient } from '@google-cloud/dlp';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// --- ENCRYPTION ENGINE ---
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

const getHashedKey = () => {
  const key = process.env.ENCRYPTION_KEY || 'your_fallback_32_char_key_here!!';
  return crypto.createHash('sha256').update(key).digest(); 
};

const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getHashedKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decrypt = (hash) => {
  if (!hash || !hash.includes(':')) return "[DE-IDENTIFIED]";
  try {
    const [ivHex, authTagHex, encryptedHex] = hash.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, getHashedKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return "[ENCRYPTION_ERROR]";
  }
};

// --- DLP SCRUBBER ---
const dlp = new DlpServiceClient({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
});

export const scrubText = async (text) => {
  const projectId = process.env.GCS_PROJECT_ID;

  const request = {
    parent: `projects/${projectId}/locations/global`,
    inspectConfig: {
      infoTypes: [
         { name: 'PERSON_NAME' },
        { name: 'DATE' },
        { name: 'EMAIL_ADDRESS' },
        { name: 'PHONE_NUMBER' },
        { name: 'LOCATION' },
        { name: 'CREDIT_CARD_NUMBER' },
        { name: 'US_SOCIAL_SECURITY_NUMBER' },
        { name: 'IP_ADDRESS' },
        { name: 'AGE' },
        { name: 'MEDICAL_RECORD_NUMBER' }
      ],
      customInfoTypes: [
        { infoType: { name: 'PATIENT_ID' }, regex: { pattern: 'PT-\\d{6}' } },
        { infoType: { name: 'ENCOUNTER_ID' }, regex: { pattern: 'ENC-\\d{6}' } },
        { infoType: { name: 'POLICY_NUMBER' }, regex: { pattern: 'MC-\\d{6}' } }
      ],
      minLikelihood: 'POSSIBLE',
    },
    item: { value: text },
  };

  try {
    const [response] = await dlp.inspectContent(request);
    let findings = response.result.findings || [];

    // 1. Sort by position (Start to End)
    findings.sort((a, b) => a.location.codepointRange.start - b.location.codepointRange.start);

    // 2. COLLISION GUARD: Remove findings that overlap with a previous finding
    const uniqueFindings = [];
    let lastEnd = -1;

    for (const f of findings) {
      const start = Number(f.location.codepointRange.start);
      const end = Number(f.location.codepointRange.end);
      
      if (start >= lastEnd) {
        uniqueFindings.push(f);
        lastEnd = end;
      }
    }

    // 3. Process in Reverse (End to Start) to keep string indices correct
    uniqueFindings.sort((a, b) => b.location.codepointRange.start - a.location.codepointRange.start);

    let scrubbedText = text;
    const phiMap = {};
    const typeCounters = {};

    uniqueFindings.forEach((finding) => {
      const start = Number(finding.location.codepointRange.start);
      const end = Number(finding.location.codepointRange.end);
      const infoType = finding.infoType.name;
      const realValue = text.substring(start, end);

      if (!typeCounters[infoType]) typeCounters[infoType] = 1;
      const placeholder = `[${infoType}_${typeCounters[infoType]}]`;
      typeCounters[infoType]++;

      // Store Encrypted Value
      phiMap[placeholder] = encrypt(realValue);

      // Replace Text
      scrubbedText = scrubbedText.substring(0, start) + placeholder + scrubbedText.substring(end);
    });

    return { scrubbedText, phiMap };

  } catch (error) {
    console.error('DLP Error:', error);
    throw error;
  }
};