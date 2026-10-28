<img src="logo.svg" alt="Signal Desk" width="64" height="64">

# Signal Desk — verified paper-trading record

Automatic paper trades that followed the alerts of [Signal Desk](https://desk.arcticfawn.com), on **live NSE market prices**
(Zerodha Kite feed), from **2026-10-12**. No practice/simulated prices, no manual trades. Fills happen at the
trader's reaction delay with slippage; profits are **after Zerodha charges** (brokerage, STT, exchange, SEBI, stamp, GST).

> **Paper trades, not real money.** These are simulated fills on real prices. They are published so that the record
> can be checked, not as an offer or a promise of returns.

## Results

**Starting balance ₹55,510** (paper) · each trade risks 1% of ₹55,510 (the loss if its stop-loss is hit) · now 1% of the paper balance at the time
**Balance now ₹65,132 (+17.33% on the starting balance)**

**72 closed trades · 39 won (54%) · net ₹9,622 after ₹5,004 charges**

### By date

| Date | Trades | Won | Net P&L | Charges | Total R | Day fingerprint | Balance at close | Bitcoin timestamp |
|---|---:|---:|---:|---:|---:|---|---:|---|
| 2026-10-12 | 14 | 8 | ₹5,368 | ₹1,043 | 230.39 | `641da3c3e0769d16…` | ₹60,878 | ✅ in Bitcoin |
| 2026-10-13 | 3 | 2 | −₹662 | ₹204 | 0.1 | `f91d2ad802c91f97…` | ₹60,216 | ✅ in Bitcoin |
| 2026-10-14 | 20 | 13 | ₹5,767 | ₹1,395 | 3.14 | `d83195c9ef9c37e2…` | ₹65,983 | ✅ in Bitcoin |
| 2026-10-15 | 20 | 12 | ₹2,542 | ₹1,370 | -4.27 | `b946b2676faf3db3…` | ₹68,525 | ✅ in Bitcoin |
| 2026-10-16 | 4 | 1 | −₹2,559 | ₹241 | -1.69 | `57e793c58ef18eec…` | ₹65,966 | ✅ in Bitcoin |
| 2026-10-19 | 6 | 3 | ₹5,850 | ₹409 | 1.76 | `559d93efbde68763…` | ₹71,816 | ✅ in Bitcoin |
| 2026-10-21 | 1 | 0 | −₹2,747 | ₹67 | -0.87 | `bd738016bacf285c…` | ₹69,069 | ✅ in Bitcoin |
| 2026-10-22 | 1 | 0 | −₹512 | ₹62 | -1.25 | `6e4095bb30b40eaa…` | ₹68,557 | ✅ in Bitcoin |
| 2026-10-25 | 0 | 0 | ₹0 | ₹0 | 0 | `b963a2cd1c69992b…` | ₹68,557 | ✅ in Bitcoin |
| 2026-10-26 | 1 | 0 | −₹68 | ₹32 | -0.04 | `80f5ddcd3d2718b5…` | ₹68,489 | ✅ in Bitcoin |
| 2026-10-27 | 1 | 0 | −₹1,347 | ₹97 | -0.85 | `1bc7ae2c0db2ce74…` | ₹67,142 | ✅ in Bitcoin |

### By time of day (when the trade was entered, IST)

| Time | Trades | Won | Win rate | Net P&L |
|---|---:|---:|---:|---:|
| 09:15–10:00 | 26 | 15 | 58% | ₹2,233 |
| 10:00–11:00 | 17 | 9 | 53% | ₹1,161 |
| 11:00–12:00 | 9 | 4 | 44% | −₹1,222 |
| 12:00–13:00 | 18 | 10 | 56% | ₹7,948 |
| 13:00–14:00 | 1 | 1 | 100% | ₹328 |
| 14:00–15:30 | 1 | 0 | 0% | −₹827 |

### By weekday

| Day | Trades | Won | Win rate | Net P&L |
|---|---:|---:|---:|---:|
| Mon | 21 | 11 | 52% | ₹11,150 |
| Tue | 4 | 2 | 50% | −₹2,008 |
| Wed | 22 | 13 | 59% | ₹1,009 |
| Thu | 21 | 12 | 57% | ₹2,030 |
| Fri | 4 | 1 | 25% | −₹2,559 |

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
