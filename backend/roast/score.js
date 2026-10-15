const SEVERITY_WEIGHT = { toasted: 4, charred: 9, cremated: 16 };

export function scoreFindings(findings) {
  const total = findings.reduce((sum, f) => sum + (SEVERITY_WEIGHT[f.severity] ?? 0), 0);
  return Math.max(0, Math.min(100, Math.round(total)));
}

export function verdictFor(score) {
  if (score <= 14) return 'Barely warm';
  if (score <= 34) return 'Lightly toasted';
  if (score <= 59) return 'Medium rare';
  if (score <= 79) return 'Well done';
  return 'Cremated';
}

export function summaryFor(score, count) {
  if (count === 0) return 'We found nothing worth complaining about in the markup we received.';
  if (score <= 14) return `We found ${count} thing${count === 1 ? '' : 's'}, and none of them are embarrassing.`;
  if (score <= 34) return `${count} issues, all of them fixable in an afternoon.`;
  if (score <= 59) return `${count} issues across the markup. Nothing here is fatal, but they compound.`;
  if (score <= 79) return `${count} issues, several of them serious. This page is fighting itself.`;
  return `${count} issues and a lot of them are foundational. Start with the missing metadata.`;
}