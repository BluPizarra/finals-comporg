# Boolean Algebra Derivation & Circuit Optimization

This document details the mathematical minimization, Karnaugh Mapping (K-map), and logic gate reduction for each of the 13 decoded channel outputs ($X_1$ through $X_{13}$).

---

## 1. Input Variables & Notation
* **$A$:** Arduino Pin D7 (Most Significant Bit, $2^3$)
* **$B$:** Arduino Pin D6 ($2^2$)
* **$C$:** Arduino Pin D5 ($2^1$)
* **$D$:** Arduino Pin D4 (Least Significant Bit, $2^0$)
* Inverted variables ($A', B', C', D'$) are produced by a **7404 Hex Inverter**.

---

## 2. Sum-of-Products (SOP) Derivations

### Channel $X_1$
* **Active Minterms:** $m_0, m_{14}, m_{15}$
* **Canonical SOP:**
  $$X_1 = A'B'C'D' + ABCD' + ABCD$$
* **Simplification:**
  $$ABCD' + ABCD = ABC(D' + D) = ABC$$
  $$\mathbf{X_1 = A'B'C'D' + ABC}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'B'C'D'$
  * 1 gate of 7411 (3-input AND): computes $ABC$
  * 1 gate of 7432 (2-input OR): sums the two terms

---

### Channel $X_2$
* **Active Minterms:** $m_1, m_{14}$
* **Canonical SOP & Form:**
  $$\mathbf{X_2 = A'B'C'D + ABCD'}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'B'C'D$
  * Shares term $ABCD'$ (computed once from 7421 and routed to $X_2, X_3, X_4, X_6, X_8$)
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_3$
* **Active Minterms:** $m_2, m_{14}$
* **Canonical SOP & Form:**
  $$\mathbf{X_3 = A'B'CD' + ABCD'}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'B'CD'$
  * Shares term $ABCD'$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_4$
* **Active Minterms:** $m_3, m_{14}$
* **Canonical SOP & Form:**
  $$\mathbf{X_4 = A'B'CD + ABCD'}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'B'CD$
  * Shares term $ABCD'$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_5$
* **Active Minterms:** $m_4, m_{14}, m_{15}$
* **Canonical SOP:**
  $$X_5 = A'BC'D' + ABCD' + ABCD$$
* **Simplification:**
  $$ABCD' + ABCD = ABC(D' + D) = ABC$$
  $$\mathbf{X_5 = A'BC'D' + ABC}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'BC'D'$
  * Shares term $ABC$ (computed once by 7411 and shared with $X_1$)
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_6$
* **Active Minterms:** $m_5, m_{14}$
* **Canonical SOP & Form:**
  $$\mathbf{X_6 = A'BC'D + ABCD'}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'BC'D$
  * Shares term $ABCD'$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_7$ (Full Reduction to Single 3-Input AND)
* **Active Minterms:** $m_6, m_{14}$
* **Canonical SOP:**
  $$X_7 = A'BCD' + ABCD'$$
* **Simplification:**
  $$X_7 = (A' + A)BCD'$$
  $$\mathbf{X_7 = BCD'}$$
* **Hardware Implementation:**
  * Single gate of **7411 (Triple 3-input AND)** directly drives $X_7$ without needing an OR gate!

---

### Channel $X_8$
* **Active Minterms:** $m_7, m_{14}$
* **Canonical SOP & Form:**
  $$\mathbf{X_8 = A'BCD + ABCD'}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $A'BCD$
  * Shares term $ABCD'$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_9$
* **Active Minterms:** $m_8, m_{13}$
* **Canonical SOP & Form:**
  $$\mathbf{X_9 = AB'C'D' + ABC'D}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $AB'C'D'$
  * Shares term $ABC'D$ (computed once from 7421 and routed to $X_9, X_{11}, X_{12}$)
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_{10}$ (Full Reduction to Single 3-Input AND)
* **Active Minterms:** $m_9, m_{13}$
* **Canonical SOP:**
  $$X_{10} = AB'C'D + ABC'D$$
* **Simplification:**
  $$X_{10} = A(B' + B)C'D$$
  $$\mathbf{X_{10} = AC'D}$$
* **Hardware Implementation:**
  * Single gate of **7411 (Triple 3-input AND)** directly drives $X_{10}$ without needing an OR gate!

---

### Channel $X_{11}$
* **Active Minterms:** $m_{10}, m_{13}$
* **Canonical SOP & Form:**
  $$\mathbf{X_{11} = AB'CD' + ABC'D}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $AB'CD'$
  * Shares term $ABC'D$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_{12}$
* **Active Minterms:** $m_{11}, m_{13}$
* **Canonical SOP & Form:**
  $$\mathbf{X_{12} = AB'CD + ABC'D}$$
* **Hardware Implementation:**
  * 1 gate of 7421 (4-input AND): computes $AB'CD$
  * Shares term $ABC'D$
  * 1 gate of 7432 (2-input OR)

---

### Channel $X_{13}$ (Full Reduction to Single 2-Input AND)
* **Active Minterms:** $m_{12}, m_{13}, m_{14}, m_{15}$
* **Canonical SOP:**
  $$X_{13} = ABC'D' + ABC'D + ABCD' + ABCD$$
* **Simplification:**
  $$ABC'(D' + D) + ABC(D' + D) = ABC' + ABC$$
  $$AB(C' + C) = AB$$
  $$\mathbf{X_{13} = AB}$$
* **Hardware Implementation:**
  * Single gate of **7408 (Quad 2-input AND)** directly drives $X_{13}$!

---

## 3. Sub-Expression Sharing Matrix

By factoring and busing common product terms across multiple breadboard rows, redundant IC logic was eliminated:

| Shared Term | Expression | Gate Source | Destinations |
|:---:|:---:|:---:|:---:|
| $T_A$ | $ABC$ | 7411 (3-input AND) | $X_1, X_5$ |
| $T_B$ | $ABCD'$ | 7421 (4-input AND) | $X_2, X_3, X_4, X_6, X_8$ |
| $T_C$ | $ABC'D$ | 7421 (4-input AND) | $X_9, X_{11}, X_{12}$ |
| Direct | $BCD'$ | 7411 (3-input AND) | $X_7$ (standalone output) |
| Direct | $AC'D$ | 7411 (3-input AND) | $X_{10}$ (standalone output) |
| Direct | $AB$ | 7408 (2-input AND) | $X_{13}$ (standalone output) |

This architecture saved more than **10 logic gates** compared to unminimized canonical decoders.
