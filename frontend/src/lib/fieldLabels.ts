// src/lib/fieldLabels.ts

// Converts API field names like "isBplHousehold" into
// human-readable labels in English and Hindi
export const FIELD_LABELS: Record<string, { en: string; hi: string }> = {
  age:                  { en: 'Age',                   hi: 'आयु' },
  gender:               { en: 'Gender',                hi: 'लिंग' },
  state:                { en: 'State',                  hi: 'राज्य' },
  caste:                { en: 'Caste Category',         hi: 'जाति श्रेणी' },
  occupation:           { en: 'Occupation',             hi: 'व्यवसाय' },
  annualIncome:         { en: 'Annual Income',          hi: 'वार्षिक आय' },
  isBplHousehold:       { en: 'BPL Household status',  hi: 'BPL परिवार की स्थिति' },
  hasRationCard:        { en: 'Ration Card',            hi: 'राशन कार्ड' },
  hasBankAccount:       { en: 'Bank Account',           hi: 'बैंक खाता' },
  isCurrentlyStudying:  { en: 'Enrollment in school',   hi: 'स्कूल/कॉलेज में नामांकन' },
  landAreaAcres:        { en: 'Land Area (acres)',      hi: 'भूमि क्षेत्र (एकड़)' },
  isMarried:            { en: 'Marital Status',         hi: 'वैवाहिक स्थिति' },
  isDisabled:           { en: 'Disability status',      hi: 'विकलांगता की स्थिति' },
  disabilityPercentage: { en: 'Disability percentage',  hi: 'विकलांगता प्रतिशत' },
};

export function getFieldLabel(field: string, isHindi: boolean): string {
  const labels = FIELD_LABELS[field];
  if (!labels) return field;
  return isHindi ? labels.hi : labels.en;
}