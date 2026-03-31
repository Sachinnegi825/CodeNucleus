import { DlpServiceClient } from '@google-cloud/dlp';
import dotenv from 'dotenv';
dotenv.config();

// Initialize DLP Client using the same credentials as your GCS Bucket
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
      // ✅ Stable + supported built-in detectors
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

      // ✅ Custom healthcare identifiers (CRITICAL)
      customInfoTypes: [
        {
          infoType: { name: 'PATIENT_ID' },
          regex: { pattern: 'PT-\\d{6}' }
        },
        {
          infoType: { name: 'ENCOUNTER_ID' },
          regex: { pattern: 'ENC-\\d{6}' }
        },
        {
          infoType: { name: 'POLICY_NUMBER' },
          regex: { pattern: 'MC-\\d{6}' }
        }
      ],

      minLikelihood: 'POSSIBLE',
    },

    // 🔐 Safe automatic replacement (NO index bugs)
    deidentifyConfig: {
      infoTypeTransformations: {
        transformations: [
          {
            primitiveTransformation: {
              replaceWithInfoTypeConfig: {}
              // Output: [PERSON_NAME], [DATE], etc.
            }
          }
        ]
      }
    },

    item: { value: text },
  };

  try {
    const [response] = await dlp.deidentifyContent(request);

    return {
      scrubbedText: response.item.value,
    };

  } catch (error) {
    console.error('DLP Error:', error);
    throw error;
  }
};