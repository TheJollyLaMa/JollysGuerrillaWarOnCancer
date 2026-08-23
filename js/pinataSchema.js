const requiredFields = [
  "title",
  "category",
  "accessibility_score",
  "evidence_tier",
  "associated_tags",
  "mechanism_of_action",
  "contraindications"
];

export function validateMethod(entry, schema = {}) {
  const normalizedSchema = schema ?? {};
  const errors = [];

  requiredFields.forEach((field) => {
    const value = entry[field];
    const missingArray = Array.isArray(value) && value.length === 0;

    if (value === undefined || value === null || value === "" || missingArray) {
      errors.push(`Missing ${field}`);
    }
  });

  if (
    !normalizedSchema.properties?.accessibility_score
  ) {
    errors.push("Missing schema definition");
  }

  if (
    normalizedSchema.properties?.accessibility_score?.minimum !== undefined &&
    entry.accessibility_score < normalizedSchema.properties.accessibility_score.minimum
  ) {
    errors.push("Accessibility score below schema minimum");
  }

  if (
    normalizedSchema.properties?.accessibility_score?.maximum !== undefined &&
    entry.accessibility_score > normalizedSchema.properties.accessibility_score.maximum
  ) {
    errors.push("Accessibility score above schema maximum");
  }

  return { valid: errors.length === 0, errors };
}

export function createPinataPayload(entry) {
  return {
    pinataContent: entry,
    pinataMetadata: {
      name: entry.title,
      keyvalues: {
        category: entry.category,
        evidence_tier: entry.evidence_tier,
        accessibility_score: String(entry.accessibility_score)
      }
    }
  };
}
