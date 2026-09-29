const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, 'docs', 'requirements-analysis.md');

if (!fs.existsSync(docPath)) {
  console.error('ERROR: docs/requirements-analysis.md not found');
  process.exit(1);
}

const content = fs.readFileSync(docPath, 'utf8');
let passed = 0;
let failed = 0;

// AC-1: Check all 8 required sections present
const sections = [
  '## 1. Product Summary',
  '## 2. Functional Requirements',
  '## 3. Non-Functional Requirements',
  '## 4. User Roles and Permissions',
  '## 5. Recommended Implementation Phases',
  '## 6. Risks and Unresolved Questions',
  '## 7. Contradictions Found in the Document',
  '## 8. Missing Information'
];

const allSectionsPresent = sections.every(section => content.includes(section));
if (allSectionsPresent) {
  console.log('✓ AC-1 passed: All 8 required sections present');
  passed++;
} else {
  console.error('✗ AC-1 failed: Not all 8 sections found');
  sections.forEach(s => {
    if (!content.includes(s)) console.error(`  Missing: ${s}`);
  });
  failed++;
}

// AC-2: Check T-01, T-02, T-03 explicitly as unresolved
const contradictions = [
  { id: 'T-01', marker: '### T-01: Maximum Active Alarms Conflict', unresolved: 'Status**: Unresolved' },
  { id: 'T-02', marker: '### T-02: Alarm History Retention Conflict', unresolved: 'Status**: Unresolved' },
  { id: 'T-03', marker: '### T-03: MVP Launch Date Conflict', unresolved: 'Status**: Unresolved' }
];

const allContradictionsUnresolved = contradictions.every(c => 
  content.includes(c.marker) && content.includes(c.unresolved)
);
if (allContradictionsUnresolved) {
  console.log('✓ AC-2 passed: T-01, T-02, T-03 explicitly listed as unresolved');
  passed++;
} else {
  console.error('✗ AC-2 failed: Not all contradictions marked as unresolved');
  contradictions.forEach(c => {
    if (!content.includes(c.marker)) console.error(`  Missing marker: ${c.marker}`);
    if (!content.includes(c.unresolved)) console.error(`  Missing unresolved status for ${c.id}`);
  });
  failed++;
}

// AC-3: Check 4 open questions from Known Risks
const questions = [
  'Browser-Only Timer Reliability',
  'Email Delivery as Sole Critical Notification',
  'SMS Notification Decision Pending',
  'Family Member Schedule Creation Authority Unresolved'
];

const risksSection = content.match(/## 6\. Risks and Unresolved Questions[\s\S]*?## 7\./);
const allQuestionsPresent = questions.every(q => 
  risksSection && risksSection[0].includes(q)
);
if (allQuestionsPresent) {
  console.log('✓ AC-3 passed: All 4 open questions listed as unresolved');
  passed++;
} else {
  console.error('✗ AC-3 failed: Not all 4 open questions found');
  questions.forEach(q => {
    if (!risksSection || !risksSection[0].includes(q)) console.error(`  Missing: ${q}`);
  });
  failed++;
}

// AC-4: Check Missing Information section with specifics
const missingInfoSection = content.match(/## 8\. Missing Information[\s\S]*/);
const requiredSpecifics = [
  'Password complexity policy',
  'Session/token expiry policy',
  'Multi-factor authentication (MFA)',
  'API endpoint contracts',
  'Data residency'
];

const allSpecificsPresent = missingInfoSection && requiredSpecifics.every(spec => 
  missingInfoSection[0].includes(spec)
);
if (allSpecificsPresent) {
  console.log('✓ AC-4 passed: Missing Information section with specifics');
  passed++;
} else {
  console.error('✗ AC-4 failed: Missing Information section incomplete');
  if (!missingInfoSection) {
    console.error('  Missing entire section');
  } else {
    requiredSpecifics.forEach(spec => {
      if (!missingInfoSection[0].includes(spec)) console.error(`  Missing: ${spec}`);
    });
  }
  failed++;
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
