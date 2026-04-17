export const buildFHIRBundle = (encounter, realPatientName) => {
  const patientId = `patient-${encounter._id}`;
  
  const bundle = {
    resourceType: "Bundle",
    type: "document",
    timestamp: new Date().toISOString(),
    entry: [
      {
        // 1. Patient Resource (Re-hydrated with real name)
        resource: {
          resourceType: "Patient",
          id: patientId,
          active: true,
          name: [{ text: realPatientName || "Unknown Patient" }],
        }
      },
      {
        // 2. Encounter Resource
        resource: {
          resourceType: "Encounter",
          id: `enc-${encounter._id}`,
          status: "finished",
          class: { 
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", 
            code: "AMB", 
            display: "ambulatory" 
          },
          subject: { reference: `Patient/${patientId}` }
        }
      }
    ]
  };

  // 3. Add Diagnoses (ICD-10-CM) as "Condition" Resources
  encounter.aiResults?.filter(r => r.type === 'ICD-10-CM').forEach((diag, i) => {
    bundle.entry.push({
      resource: {
        resourceType: "Condition",
        id: `diag-${i}`,
        subject: { reference: `Patient/${patientId}` },
        code: {
          coding: [{ 
            system: "http://hl7.org/fhir/sid/icd-10-cm", 
            code: diag.code, 
            display: diag.description 
          }]
        }
      }
    });
  });

  // 4. Add Procedures (CPT) as "Procedure" Resources
  encounter.aiResults?.filter(r => r.type === 'CPT').forEach((proc, i) => {
    bundle.entry.push({
      resource: {
        resourceType: "Procedure",
        id: `proc-${i}`,
        status: "completed",
        subject: { reference: `Patient/${patientId}` },
        code: {
          coding: [{ 
            system: "http://www.ama-assn.org/go/cpt", 
            code: proc.code, 
            display: proc.description 
          }]
        }
      }
    });
  });

  return bundle;
};