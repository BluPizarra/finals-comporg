# 5x5 Electronic Parol LED Matrix Sequencer

[![Tinkercad](https://img.shields.io/badge/Tinkercad-Circuit%20Simulation-0086D6?style=for-the-badge&logo=autodesk&logoColor=white)](https://www.tinkercad.com/things/2AHTjSkFMHO-finals-comporg)
[![Arduino](https://img.shields.io/badge/Arduino-Uno%20R3-00979D?style=for-the-badge&logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![Logic Gates](https://img.shields.io/badge/Logic-74xx%20TTL-E34F26?style=for-the-badge)](https://github.com/BluPizarra/finals-comporg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Academic](https://img.shields.io/badge/APC-COMPORG%20Finals-B3665B?style=for-the-badge)](https://www.apc.edu.ph/)

> **Computer Organization (COMPORG Finals)**  
> **Interactive Tinkercad Circuit:** [finals-comporg on Tinkercad](https://www.tinkercad.com/things/2AHTjSkFMHO-finals-comporg)  
> **Author:** [Bludylan Cyrus A. Pizarra](https://github.com/BluPizarra) (@BluPizarra)

---

## Project Overview

The **5x5 Electronic Parol Sequencer** is a digital logic system that recreates the rhythmic, animated lighting patterns of an iconic **Philippine Christmas Lantern (*Parol*)** using fundamental computer engineering concepts.

An **Arduino Uno** serves as a synchronous 4-bit binary counter cycling from `0000` to `1111` ($0$ to $15$ decimal). The 4 output bits drive a discrete combinational logic array composed of **74xx-series TTL integrated circuits** (Hex Inverters, 4-input AND, 3-input AND, 2-input AND, and 2-input OR gates). The array decodes the count into **13 symmetric control channels ($X_1$ through $X_{13}$)** driving a **25-LED $5 \times 5$ matrix**.

```
                           +----------------------+
                           |     Arduino Uno      |
                           | 4-Bit Binary Counter |
                           |  (Pins D4, D5, D6, D7)|
                           +----------+-----------+
                                      | A, B, C, D (4 bits)
                                      v
                    +------------------------------------+
                    |   Combinational Logic Decoder      |
                    |   7404 Hex Inverter (A',B',C',D')  |
                    |   7421 Dual 4-Input AND Gates      |
                    |   7411 Triple 3-Input AND Gates    |
                    |   7408 Quad 2-Input AND Gates      |
                    |   7432 Quad 2-Input OR Gates       |
                    +-----------------+------------------+
                                      | X1 to X13 (13 Channels)
                                      v
                    +------------------------------------+
                    |      5x5 Parol Matrix Display      |
                    |  25 High-Efficiency Symmetrical   |
                    |  LEDs (Green, Red, Blue, Yellow)   |
                    |  with 220Ω Current Limiters        |
                    +------------------------------------+
```

---

## 5x5 Matrix Spatial Mapping & Symmetry

The 25 discrete LEDs in the $5 \times 5$ grid are mapped into 13 symmetrical channel pairs to produce authentic chasing borders, diamond contractions, and celebratory starbursts:

```
          Col 1    Col 2    Col 3    Col 4    Col 5
Row 1   [  X1  ] [  X2  ] [  X3  ] [  X4  ] [  X5  ]   <-- Top Perimeter
Row 2   [  X8  ] [  X9  ] [ X10  ] [ X11  ] [  X6  ]   <-- Upper Inner Core
Row 3   [  X7  ] [ X12  ] [ X13  ] [ X12  ] [  X7  ]   <-- Center Core & Wings
Row 4   [  X6  ] [ X11  ] [ X10  ] [  X9  ] [  X8  ]   <-- Lower Inner Core
Row 5   [  X5  ] [  X4  ] [  X3  ] [  X2  ] [  X1  ]   <-- Bottom Perimeter
```

* **Channels $X_1$ to $X_8$:** Drive the 16 perimeter LEDs (outer border of the star).
* **Channels $X_9$ to $X_{12}$:** Drive the 8 inner square/diamond LEDs (inner star core).
* **Channel $X_{13}$:** Drives the single center star LED $(3,3)$.
* **Total Physical LEDs:** $12 \times 2 + 1 = 25\text{ LEDs}$.

---

## 16-State Animation Progression

| State | Binary ($ABCD$) | Active Channels | Lighting Effect / Parol Pattern |
|:---:|:---:|:---:|:---|
| **0** | `0000` | $X_1$ | **Perimeter Chase 1:** Top-left & bottom-right outer corners |
| **1** | `0001` | $X_2$ | **Perimeter Chase 2:** Top-left inner & bottom-right inner |
| **2** | `0010` | $X_3$ | **Perimeter Chase 3:** Top-middle & bottom-middle |
| **3** | `0011` | $X_4$ | **Perimeter Chase 4:** Top-right inner & bottom-left inner |
| **4** | `0100` | $X_5$ | **Perimeter Chase 5:** Top-right & bottom-left outer corners |
| **5** | `0101` | $X_6$ | **Perimeter Chase 6:** Upper right & lower left outer edges |
| **6** | `0110` | $X_7$ | **Perimeter Chase 7:** Outer horizontal wings |
| **7** | `0111` | $X_8$ | **Perimeter Chase 8:** Upper left & lower right outer edges |
| **8** | `1000` | $X_9$ | **Inner Diamond 1:** Upper-left & lower-right inner diagonals |
| **9** | `1001` | $X_{10}$ | **Inner Diamond 2:** Upper & lower vertical center nodes |
| **10** | `1010` | $X_{11}$ | **Inner Diamond 3:** Upper-right & lower-left inner diagonals |
| **11** | `1011` | $X_{12}$ | **Inner Diamond 4:** Left & right inner horizontal nodes |
| **12** | `1100` | $X_{13}$ | **Center Star:** Solitary center core illumination |
| **13** | `1101` | $X_9, X_{10}, X_{11}, X_{12}, X_{13}$ | **Grand Finale 1:** Complete 9-LED Inner Star Diamond (3×3) |
| **14** | `1110` | $X_1$–$X_8, X_{13}$ | **Grand Finale 2:** Complete 16-LED Outer Border + Center Star (17 LEDs) |
| **15** | `1111` | $X_1, X_5, X_{13}$ | **Grand Finale 3:** 4-Corner Diagonal Cross "X" + Center Star |

Detailed breakdown available in [`docs/truth_table.md`](docs/truth_table.md).

---

## Boolean Logic Equations & Gate Sharing

Using Boolean algebra and Karnaugh Maps, expressions were simplified into minimal Sum-of-Products (SOP) forms, leveraging common sub-expressions to dramatically reduce the required 74xx IC gate count:

$$\begin{aligned}
X_1 &= A'B'C'D' + \mathbf{ABC} \\
X_2 &= A'B'C'D + \mathbf{ABCD'} \\
X_3 &= A'B'CD' + \mathbf{ABCD'} \\
X_4 &= A'B'CD + \mathbf{ABCD'} \\
X_5 &= A'BC'D' + \mathbf{ABC} \\
X_6 &= A'BC'D + \mathbf{ABCD'} \\
\mathbf{X_7} &= \mathbf{BCD'} \quad \text{\small (Simplified from } A'BCD' + ABCD' \text{ to single 3-input AND!)} \\
X_8 &= A'BCD + \mathbf{ABCD'} \\
X_9 &= AB'C'D' + \mathbf{ABC'D} \\
\mathbf{X_{10}} &= \mathbf{AC'D} \quad \text{\small (Simplified from } AB'C'D + ABC'D \text{ to single 3-input AND!)} \\
X_{11} &= AB'CD' + \mathbf{ABC'D} \\
X_{12} &= AB'CD + \mathbf{ABC'D} \\
\mathbf{X_{13}} &= \mathbf{AB} \quad \text{\small (Simplified across minterms 12, 13, 14, 15 to single 2-input AND!)}
\end{aligned}$$

### Key Gate Optimizations:
1. **$ABCD'$** is computed once and shared across 5 outputs: $X_2, X_3, X_4, X_6, X_8$.
2. **$ABC'D$** is computed once and shared across 3 outputs: $X_9, X_{11}, X_{12}$.
3. **$ABC$** is computed once and shared between $X_1$ and $X_5$.
4. **$X_7, X_{10}, X_{13}$** require **zero OR gates**; they drive LEDs directly from single AND gates.

Complete derivation in [`docs/boolean_derivation.md`](docs/boolean_derivation.md).

---

## Hardware Bill of Materials (BOM)

| Component | Part / Value | Qty | Function |
|:---|:---|:---:|:---|
| **Microcontroller** | Arduino Uno R3 / ATmega328P | 1 | Synchronous 4-bit binary counter (Pins D4–D7) |
| **Hex Inverter** | 74HC04 / 74LS04 | 1 | Generates inverted signals $A', B', C', D'$ |
| **Dual 4-Input AND** | 74HC21 / 74LS21 | Multiple | Decodes 4-variable minterm product terms |
| **Triple 3-Input AND** | 74HC11 / 74LS11 | Multiple | Computes shared terms ($ABC$, $BCD'$, $AC'D$) |
| **Quad 2-Input AND** | 74HC08 / 74LS08 | 1 | Computes center star control $AB$ ($X_{13}$) |
| **Quad 2-Input OR** | 74HC32 / 74LS32 | Multiple | Combines product terms for multi-minterm channels |
| **LEDs** | 5mm Diffused (Green, Red, Blue, Yellow, Orange) | 25 | $5 \times 5$ Symmetrical Parol Display Matrix |
| **Resistors** | $220\,\Omega$, $1/4\text{W}$ | 25 | Current-limiting resistors for LEDs |
| **Prototyping** | Full-size Solderless Breadboards | 6 | Logic gate array and matrix assembly |
| **Wiring** | Solid core jumper wires | Bundle | Bus connections for $V_{CC}$, GND, and signals |

---

## Arduino Counter Firmware

The Arduino sketch (`arduino/finals_comporg/finals_comporg.ino`) clocks the 4-bit binary states with a 300ms cycle delay:

```cpp
// Define the pins for each bit
const int bit3 = 7; // Most Significant Bit (A)
const int bit2 = 6; // Bit B
const int bit1 = 5; // Bit C
const int bit0 = 4; // Least Significant Bit (D)

void setup() {
  // Set all pins as OUTPUT
  pinMode(bit0, OUTPUT);
  pinMode(bit1, OUTPUT);
  pinMode(bit2, OUTPUT);
  pinMode(bit3, OUTPUT);
}

void loop() {
  // Loop through numbers 0 to 15 (0000 to 1111 in binary)
  for (int i = 0; i < 16; i++) {
    // Output each bit to the corresponding pin
    digitalWrite(bit0, (i >> 0) & 1); // D4 (LSB / D)
    digitalWrite(bit1, (i >> 1) & 1); // D5 (C)
    digitalWrite(bit2, (i >> 2) & 1); // D6 (B)
    digitalWrite(bit3, (i >> 3) & 1); // D7 (MSB / A)

    delay(300);
  }
}
```

---

## Running the Project

### Option 1: Interactive Browser Simulator
Open `index.html` in any modern web browser or host on GitHub Pages:
* Real-time $5 \times 5$ matrix animation with glowing neon LED effects.
* Toggle between **Auto Clock** and **Manual Mode** (click individual bit switches A, B, C, D).
* Live logic evaluator and clickable channel inspector for $X_1$–$X_{13}$.
* Synchronized truth table highlighting active row.

### Option 2: Tinkercad Circuit Simulation
1. Visit the [Tinkercad Finals Circuit](https://www.tinkercad.com/things/2AHTjSkFMHO-finals-comporg).
2. Click **Start Simulation**.
3. Observe the counter cycling on the Arduino Uno and the 25 LEDs illuminating across the breadboard.

### Option 3: Physical Hardware Deployment
1. Connect the Arduino Uno to your PC via USB.
2. Open `arduino/finals_comporg/finals_comporg.ino` in the Arduino IDE.
3. Select board `Arduino Uno` and the correct COM port.
4. Wire the 74xx ICs and 25 LEDs as shown in [`docs/schematics/tinkercad_schematic.pdf`](docs/schematics/tinkercad_schematic.pdf).
5. Upload the sketch and enjoy your electronic Parol!

---

## Repository Structure

```
finals-comporg/
├── index.html                   # Interactive web simulator & documentation app
├── style.css                    # Dark-mode styling, glowing LED bloom effects
├── app.js                       # Digital logic engine, clock controller, UI
├── arduino/
│   └── finals_comporg/
│       └── finals_comporg.ino   # Arduino 4-bit binary counter sketch
├── assets/
│   └── tinkercad_annotated_breadboard.jpg  # Annotated circuit photo
├── docs/
│   ├── truth_table.md           # Full 16-row truth table & mapping
│   ├── boolean_derivation.md    # Algebraic minimization & gate sharing
│   └── schematics/
│       ├── tinkercad_schematic.pdf          # 6-sheet Tinkercad schematic
│       ├── tinkercad_schematic_overview.png # Circuit schematic render
│       └── truth_table_and_design.pdf       # Original project specification
├── .gitignore                   # Standard Arduino & IDE ignores
└── LICENSE                      # MIT License
```

---

## Author & Acknowledgments

* **Student:** Bludylan Cyrus A. Pizarra ([@BluPizarra](https://github.com/BluPizarra))
* **Course:** Computer Organization (COMPORG Finals)
* **Degree:** Bachelor of Science in Information Technology
* **Simulation Environment:** Autodesk Tinkercad Circuits

---

## License

This project is licensed under the [MIT License](LICENSE).
