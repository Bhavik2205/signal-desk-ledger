<img src="logo.svg" alt="Signal Desk" width="64" height="64">

# Signal Desk — verified paper-trading record

Automatic paper trades that followed the alerts of [Signal Desk](https://desk.arcticfawn.com), on **live NSE market prices**
(Zerodha Kite feed), from **2026-10-12**. No practice/simulated prices, no manual trades. Fills happen at the
trader's reaction delay with slippage; profits are **after Zerodha charges** (brokerage, STT, exchange, SEBI, stamp, GST).

> **Paper trades, not real money.** These are simulated fills on real prices. They are published so that the record
> can be checked, not as an offer or a promise of returns.

## Results

**Starting balance ₹55,510** (paper) · each trade risks 1% of ₹55,510 (the loss if its stop-loss is hit) · now 1% of the paper balance at the time
**Balance now ₹68,525 (+23.45% on the starting balance)**

**57 closed trades · 35 won (61%) · net ₹13,015 after ₹4,012 charges**

### By date

| Date | Trades | Won | Net P&L | Charges | Total R | Day fingerprint | Balance at close | Bitcoin timestamp |
|---|---:|---:|---:|---:|---:|---|---:|---|
| 2026-10-12 | 14 | 8 | ₹5,368 | ₹1,043 | 230.39 | `641da3c3e0769d16…` | ₹60,878 | ✅ in Bitcoin |
| 2026-10-13 | 3 | 2 | −₹662 | ₹204 | 0.1 | `f91d2ad802c91f97…` | ₹60,216 | ✅ in Bitcoin |
| 2026-10-14 | 20 | 13 | ₹5,767 | ₹1,395 | 3.14 | `d83195c9ef9c37e2…` | ₹65,983 | ✅ in Bitcoin |
| 2026-10-15 | 20 | 12 | ₹2,542 | ₹1,370 | -4.27 | `b946b2676faf3db3…` | ₹68,525 | ⏳ pending |

### By time of day (when the trade was entered, IST)

| Time | Trades | Won | Win rate | Net P&L |
|---|---:|---:|---:|---:|
| 09:15–10:00 | 23 | 15 | 65% | ₹7,503 |
| 10:00–11:00 | 15 | 8 | 53% | ₹159 |
| 11:00–12:00 | 6 | 3 | 50% | ₹59 |
| 12:00–13:00 | 12 | 8 | 67% | ₹4,966 |
| 13:00–14:00 | 1 | 1 | 100% | ₹328 |
| 14:00–15:30 | 0 | 0 | — | ₹0 |

### By weekday

| Day | Trades | Won | Win rate | Net P&L |
|---|---:|---:|---:|---:|
| Mon | 14 | 8 | 57% | ₹5,368 |
| Tue | 3 | 2 | 67% | −₹662 |
| Wed | 20 | 13 | 65% | ₹5,767 |
| Thu | 20 | 12 | 60% | ₹2,542 |
| Fri | 0 | 0 | — | ₹0 |

## How to verify it yourself

Every alert, paper fill and exit was appended to `ledger/<date>.jsonl` as it happened. Each entry contains the
SHA-256 fingerprint of the entry before it, so changing, adding or removing any past entry breaks every fingerprint
after it. At the close each day is sealed by a `DAY_CLOSE` entry; its fingerprint is in `ledger/<date>.root`.

1. **The chain is intact and the totals add up** (Node.js 18+, no other software):
   ```
   node verify-ledger.js ledger
   ```
2. **Each day existed at that time and has not changed since**: `ledger/<date>.root.ots` is an
   [OpenTimestamps](https://opentimestamps.org) proof that the day's fingerprint was recorded in the **Bitcoin
   blockchain**. Drop `<date>.root` and `<date>.root.ots` onto https://opentimestamps.org, or run
   `ots verify ledger/<date>.root.ots`.
3. The Git history of this repository shows when each day was published.

_Last updated automatically by Signal Desk._
