#!/usr/bin/env node
// Verify a Signal Desk ledger without the app or any other software (Node.js 18+).
//   node verify-ledger.js [ledger folder]
// Checks: every entry's SHA-256 fingerprint, every link to the entry before it, the
// order of entries, each day's DAY_CLOSE totals against the day's own entries, and that
// <date>.root holds the day's fingerprint, and each day's closing balance (starting balance
// from the START entry + every recorded result so far). The Bitcoin timestamp (<date>.root.ots) is
// checked with OpenTimestamps: https://opentimestamps.org or `ots verify <date>.root.ots`.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = process.argv[2] || 'ledger';
const canonical = (v) => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  return `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
};
const hashOf = (e) => { const c = { ...e }; delete c.hash; return crypto.createHash('sha256').update(canonical(c)).digest('hex'); };
const r2 = (x) => Math.round(x * 100) / 100;

let prev = '0'.repeat(64), seq = 0, n = 0, bad = 0, start = null, cum = 0;
const fail = (msg) => { bad++; console.log(`✗ ${msg}`); };
const files = fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(f)).sort();
if (!files.length) { console.log(`No ledger files in ${dir}`); process.exit(1); }
for (const f of files) {
  const day = f.slice(0, 10);
  const entries = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  for (const e of entries) {
    n++;
    if (e.prev !== prev) fail(`${day} entry ${e.seq}: does not link to the entry before it`);
    if (hashOf(e) !== e.hash) fail(`${day} entry ${e.seq}: content differs from its fingerprint (edited)`);
    if (e.seq !== seq + 1) fail(`${day} entry ${e.seq}: expected entry ${seq + 1} (entries missing or reordered)`);
    prev = e.hash; seq = e.seq;
    if (e.type === 'START') { start = e.data; console.log(`  Starting balance ₹${start.capital.toLocaleString('en-IN')} · ${start.riskPct}% risk per trade (sized on: ${start.sizedOn})`); }
    if (e.type === 'CAPITAL') console.log(`  ${day}: sizing changed to ${e.data.riskPct}% of ₹${e.data.capital.toLocaleString('en-IN')} (${e.data.sizedOn})`);
    if (e.type === 'EXIT') cum += e.data.net || 0;
    if (e.type === 'DAY_CLOSE' && start && e.data.balance != null && r2(start.capital + cum) !== e.data.balance) fail(`${day}: DAY_CLOSE balance ${e.data.balance} ≠ starting balance + results ${r2(start.capital + cum)}`);
  }
  const close = entries.find((e) => e.type === 'DAY_CLOSE');
  if (close) {
    const before = entries.filter((e) => e.seq < close.seq);
    const exits = before.filter((e) => e.type === 'EXIT');
    const net = r2(exits.reduce((a, e) => a + (e.data.net || 0), 0));
    if (net !== close.data.net) fail(`${day}: DAY_CLOSE says net ${close.data.net}, the exits add up to ${net}`);
    if (exits.length !== close.data.closedTrades) fail(`${day}: DAY_CLOSE says ${close.data.closedTrades} trades, found ${exits.length}`);
    const rootFile = path.join(dir, `${day}.root`);
    if (fs.existsSync(rootFile) && fs.readFileSync(rootFile, 'utf8').trim() !== close.hash) fail(`${day}.root does not match the day's DAY_CLOSE fingerprint`);
    const ots = fs.existsSync(`${rootFile}.ots`) ? (fs.existsSync(`${rootFile}.ots.confirmed`) ? 'Bitcoin timestamp ✓' : 'Bitcoin timestamp pending') : 'no timestamp';
    console.log(`${bad ? '·' : '✓'} ${day}: ${entries.length} entries · ${exits.length} trades · net ₹${net}${close.data.balance != null ? ` · balance ₹${close.data.balance}` : ''} · ${ots}`);
  } else console.log(`· ${day}: ${entries.length} entries (not sealed yet)`);
}
console.log(bad ? `\n✗ ${bad} problem(s) in ${n} entries` : `\n✓ All ${n} entries intact. Last fingerprint: ${prev}`);
process.exit(bad ? 1 : 0);
