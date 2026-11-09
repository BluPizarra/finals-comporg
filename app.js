/**
 * 5x5 Electronic Parol LED Matrix Sequencer
 * Logic Engine & Interactive Simulator
 * Course: Computer Organization (COMPORG Finals)
 * Author: Bludylan Cyrus A. Pizarra (@BluPizarra)
 */

// 5x5 Matrix Layout mapping to Channels (X1 through X13)
const MATRIX_MAP = [
  ['X1', 'X2',  'X3',  'X4',  'X5'],
  ['X8', 'X9',  'X10', 'X11', 'X6'],
  ['X7', 'X12', 'X13', 'X12', 'X7'],
  ['X6', 'X11', 'X10', 'X9',  'X8'],
  ['X5', 'X4',  'X3',  'X2',  'X1']
];

// Color definitions matching physical circuit in Tinkercad
const CHANNEL_COLORS = {
  X1: 'green',
  X2: 'red',
  X3: 'green',
  X4: 'blue',
  X5: 'red',
  X6: 'red',
  X7: 'green',
  X8: 'blue',
  X9: 'orange',
  X10: 'yellow',
  X11: 'green',
  X12: 'blue',
  X13: 'green'
};

// Truth Table Specification (16 states x 13 outputs)
// [State 0..15] -> Array of 13 booleans (X1..X13)
const TRUTH_TABLE = [
  // A B C D : X1..X13
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0: 0000
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1: 0001
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2: 0010
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3: 0011
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 4: 0100
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 5: 0101
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 6: 0110
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // 7: 0111
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // 8: 1000
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // 9: 1001
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // 10: 1010
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // 11: 1011
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 12: 1100
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], // 13: 1101 (Inner Diamond + Center)
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1], // 14: 1110 (Outer Border + Center)
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]  // 15: 1111 (Corner Cross "X" + Center)
];

const PATTERN_NAMES = [
  "Step 0: Chasing Perimeter — Top-Left & Bottom-Right Corners (X1)",
  "Step 1: Chasing Perimeter — Top-Left Inner & Bottom-Right Inner (X2)",
  "Step 2: Chasing Perimeter — Top-Middle & Bottom-Middle (X3)",
  "Step 3: Chasing Perimeter — Top-Right Inner & Bottom-Left Inner (X4)",
  "Step 4: Chasing Perimeter — Top-Right & Bottom-Left Corners (X5)",
  "Step 5: Chasing Perimeter — Right-Upper & Left-Lower Perimeter (X6)",
  "Step 6: Chasing Perimeter — Horizontal Outer Wings (X7)",
  "Step 7: Chasing Perimeter — Left-Upper & Right-Lower Perimeter (X8)",
  "Step 8: Inner Star Ring — Top-Left & Bottom-Right Core Diagonals (X9)",
  "Step 9: Inner Star Ring — Vertical Core Diagonals (X10)",
  "Step 10: Inner Star Ring — Top-Right & Bottom-Left Core Diagonals (X11)",
  "Step 11: Inner Star Ring — Horizontal Inner Core Wings (X12)",
  "Step 12: Parol Center Core — Solitary Center Star Core (X13)",
  "Step 13: Finale Chorus 1 — Full 3x3 Inner Diamond & Center Star (X9–X13)",
  "Step 14: Finale Chorus 2 — Full 16-LED Outer Border & Center Star (X1–X8, X13)",
  "Step 15: Finale Chorus 3 — 4-Corner Cross 'X' and Center Star (X1, X5, X13)"
];

const CHANNEL_INFO = {
  X1: {
    formula: "X₁ = A'B'C'D' + ABC",
    minterms: "m₀, m₁₄, m₁₅",
    positions: "(1,1), (5,5) [Top-Left & Bottom-Right]",
    hardware: "7421 (4-input AND), 7411 (3-input AND for ABC), 7432 (OR)"
  },
  X2: {
    formula: "X₂ = A'B'C'D + ABCD'",
    minterms: "m₁, m₁₄",
    positions: "(1,2), (5,4)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABCD']"
  },
  X3: {
    formula: "X₃ = A'B'CD' + ABCD'",
    minterms: "m₂, m₁₄",
    positions: "(1,3), (5,3)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABCD']"
  },
  X4: {
    formula: "X₄ = A'B'CD + ABCD'",
    minterms: "m₃, m₁₄",
    positions: "(1,4), (5,2)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABCD']"
  },
  X5: {
    formula: "X₅ = A'BC'D' + ABC",
    minterms: "m₄, m₁₄, m₁₅",
    positions: "(1,5), (5,1) [Top-Right & Bottom-Left]",
    hardware: "7421 (4-input AND), 7411 (3-input AND for ABC), 7432 (OR)"
  },
  X6: {
    formula: "X₆ = A'BC'D + ABCD'",
    minterms: "m₅, m₁₄",
    positions: "(2,5), (4,1)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABCD']"
  },
  X7: {
    formula: "X₇ = BCD'",
    minterms: "m₆, m₁₄ (Simplified SOP)",
    positions: "(3,1), (3,5) [Horizontal Outer Wings]",
    hardware: "7411 (Triple 3-input AND) — single gate!"
  },
  X8: {
    formula: "X₈ = A'BCD + ABCD'",
    minterms: "m₇, m₁₄",
    positions: "(2,1), (4,5)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABCD']"
  },
  X9: {
    formula: "X₉ = AB'C'D' + ABC'D",
    minterms: "m₈, m₁₃",
    positions: "(2,2), (4,4)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABC'D]"
  },
  X10: {
    formula: "X₁₀ = AC'D",
    minterms: "m₉, m₁₃ (Simplified SOP)",
    positions: "(2,3), (4,3) [Vertical Inner Diagonals]",
    hardware: "7411 (Triple 3-input AND) — single gate!"
  },
  X11: {
    formula: "X₁₁ = AB'CD' + ABC'D",
    minterms: "m₁₀, m₁₃",
    positions: "(2,4), (4,2)",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABC'D]"
  },
  X12: {
    formula: "X₁₂ = AB'CD + ABC'D",
    minterms: "m₁₁, m₁₃",
    positions: "(3,2), (3,4) [Horizontal Inner Core]",
    hardware: "7421 (4-input AND), 7432 (OR) [shares ABC'D]"
  },
  X13: {
    formula: "X₁₃ = AB",
    minterms: "m₁₂, m₁₃, m₁₄, m₁₅ (Simplified SOP)",
    positions: "(3,3) [Parol Center Core Star]",
    hardware: "7408 (Quad 2-input AND) — single gate!"
  }
};

// Simulation State
let currentState = 0; // 0 to 15
let isPlaying = true;
let clockInterval = null;
let clockSpeedMs = 300;
let selectedChannel = 'X1';

// DOM Elements
const ledMatrixEl = document.getElementById('ledMatrix');
const stateNumberEl = document.getElementById('stateNumber');
const stateBinaryDisplayEl = document.getElementById('stateBinaryDisplay');
const patternLabelEl = document.getElementById('patternLabel');
const modeBadgeEl = document.getElementById('modeBadge');

const btnPrev = document.getElementById('btnPrev');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnNext = document.getElementById('btnNext');
const btnReset = document.getElementById('btnReset');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');

const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

const toggleA = document.getElementById('toggleA');
const toggleB = document.getElementById('toggleB');
const toggleC = document.getElementById('toggleC');
const toggleD = document.getElementById('toggleD');

const channelsGridEl = document.getElementById('channelsGrid');
const truthTableBodyEl = document.getElementById('truthTableBody');

const inspBadge = document.getElementById('inspBadge');
const inspStatus = document.getElementById('inspStatus');
const inspFormula = document.getElementById('inspFormula');
const inspMinterms = document.getElementById('inspMinterms');
const inspPositions = document.getElementById('inspPositions');
const inspHardware = document.getElementById('inspHardware');

// Initialize Matrix DOM
function buildMatrix() {
  ledMatrixEl.innerHTML = '';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const channel = MATRIX_MAP[r][c];
      const color = CHANNEL_COLORS[channel];

      const node = document.createElement('div');
      node.className = `led-node color-${color}`;
      node.id = `led_${r}_${c}`;
      node.dataset.row = r;
      node.dataset.col = c;
      node.dataset.channel = channel;

      node.innerHTML = `
        <span class="channel-tag">${channel}</span>
        <span class="pos-tag">${r + 1},${c + 1}</span>
      `;

      node.addEventListener('click', () => {
        selectChannel(channel);
      });

      ledMatrixEl.appendChild(node);
    }
  }
}

// Build Channels List DOM
function buildChannelsGrid() {
  channelsGridEl.innerHTML = '';
  for (let i = 1; i <= 13; i++) {
    const chName = `X${i}`;
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.id = `card_${chName}`;
    card.dataset.channel = chName;

    card.innerHTML = `
      <div class="channel-header">
        <span class="channel-name">${chName}</span>
        <span class="channel-status-dot"></span>
      </div>
      <span class="channel-mini-formula">${CHANNEL_INFO[chName].formula.split('=')[1].trim()}</span>
    `;

    card.addEventListener('click', () => {
      selectChannel(chName);
    });

    channelsGridEl.appendChild(card);
  }
}

// Build Truth Table DOM
function buildTruthTable() {
  truthTableBodyEl.innerHTML = '';
  for (let s = 0; s < 16; s++) {
    const row = document.createElement('tr');
    row.id = `row_${s}`;
    row.dataset.state = s;

    const bitA = (s >> 3) & 1;
    const bitB = (s >> 2) & 1;
    const bitC = (s >> 1) & 1;
    const bitD = (s >> 0) & 1;

    let cellsHtml = `
      <td><strong>${s}</strong></td>
      <td class="${bitA ? 'bit-one' : 'bit-zero'}">${bitA}</td>
      <td class="${bitB ? 'bit-one' : 'bit-zero'}">${bitB}</td>
      <td class="${bitC ? 'bit-one' : 'bit-zero'}">${bitC}</td>
      <td class="${bitD ? 'bit-one' : 'bit-zero'}">${bitD}</td>
    `;

    for (let c = 0; c < 13; c++) {
      const active = TRUTH_TABLE[s][c];
      cellsHtml += `<td class="col-x${c + 1} ${active ? 'cell-active' : 'bit-zero'}">${active}</td>`;
    }

    cellsHtml += `<td style="text-align: left; padding-left: 0.75rem;">${PATTERN_NAMES[s]}</td>`;

    row.innerHTML = cellsHtml;

    row.addEventListener('click', () => {
      setModeManual();
      setState(s);
    });

    truthTableBodyEl.appendChild(row);
  }
}

// Update UI to reflect current state
function updateStateUI() {
  const s = currentState;

  // Bits A, B, C, D
  const bitA = (s >> 3) & 1;
  const bitB = (s >> 2) & 1;
  const bitC = (s >> 1) & 1;
  const bitD = (s >> 0) & 1;

  // Header State
  stateNumberEl.textContent = s;
  stateBinaryDisplayEl.textContent = `${bitA}${bitB}${bitC}${bitD}₂`;
  patternLabelEl.textContent = PATTERN_NAMES[s];

  // Bit Toggles
  updateBitButton(toggleA, bitA);
  updateBitButton(toggleB, bitB);
  updateBitButton(toggleC, bitC);
  updateBitButton(toggleD, bitD);

  // Active Channels
  const activeOutputs = TRUTH_TABLE[s]; // Array of 13 booleans

  for (let i = 1; i <= 13; i++) {
    const chName = `X${i}`;
    const isActive = activeOutputs[i - 1] === 1;

    const card = document.getElementById(`card_${chName}`);
    if (card) {
      card.classList.toggle('active', isActive);
    }
  }

  // Update 25 LEDs in 5x5 Matrix
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const channel = MATRIX_MAP[r][c];
      const chIndex = parseInt(channel.replace('X', ''), 10) - 1;
      const isLit = activeOutputs[chIndex] === 1;

      const node = document.getElementById(`led_${r}_${c}`);
      if (node) {
        node.classList.toggle('active', isLit);
      }
    }
  }

  // Highlight Active Table Row
  document.querySelectorAll('.truth-table tbody tr').forEach(r => r.classList.remove('active-row'));
  const activeRow = document.getElementById(`row_${s}`);
  if (activeRow) {
    activeRow.classList.add('active-row');
  }

  // Update Inspector for selected channel
  updateInspector();
}

function updateBitButton(btn, val) {
  btn.textContent = val;
  btn.classList.toggle('active', val === 1);
}

// Channel Selection & Inspector
function selectChannel(chName) {
  selectedChannel = chName;
  document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('selected'));
  const activeCard = document.getElementById(`card_${chName}`);
  if (activeCard) {
    activeCard.classList.add('selected');
  }

  updateInspector();
}

function updateInspector() {
  const ch = selectedChannel;
  const chIdx = parseInt(ch.replace('X', ''), 10) - 1;
  const isActive = TRUTH_TABLE[currentState][chIdx] === 1;
  const info = CHANNEL_INFO[ch];

  inspBadge.textContent = `Channel ${ch}`;
  inspStatus.textContent = isActive ? "ACTIVE (HIGH / 5V)" : "INACTIVE (LOW / 0V)";
  inspStatus.style.color = isActive ? "var(--accent-emerald)" : "var(--text-muted)";
  inspFormula.textContent = info.formula;
  inspMinterms.textContent = info.minterms;
  inspPositions.textContent = info.positions;
  inspHardware.textContent = info.hardware;
}

// State Control
function setState(newState) {
  currentState = (newState + 16) % 16;
  updateStateUI();
}

function nextState() {
  setState(currentState + 1);
}

function prevState() {
  setState(currentState - 1);
}

function resetState() {
  setState(0);
}

// Clock Timer
function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    nextState();
  }, clockSpeedMs);
  isPlaying = true;
  iconPlay.style.display = 'none';
  iconPause.style.display = 'block';
  modeBadgeEl.textContent = 'Auto Clock';
  modeBadgeEl.classList.remove('manual');
}

function pauseClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = null;
  isPlaying = false;
  iconPlay.style.display = 'block';
  iconPause.style.display = 'none';
}

function togglePlayPause() {
  if (isPlaying) {
    pauseClock();
  } else {
    startClock();
  }
}

function setModeManual() {
  pauseClock();
  modeBadgeEl.textContent = 'Manual Mode';
  modeBadgeEl.classList.add('manual');
}

// Bit Switch Click Handlers
function handleBitToggle(bitPosition) {
  setModeManual();
  const mask = 1 << bitPosition;
  const newState = currentState ^ mask;
  setState(newState);
}

// Event Listeners
function setupEvents() {
  btnPlayPause.addEventListener('click', togglePlayPause);
  btnNext.addEventListener('click', () => {
    setModeManual();
    nextState();
  });
  btnPrev.addEventListener('click', () => {
    setModeManual();
    prevState();
  });
  btnReset.addEventListener('click', () => {
    setModeManual();
    resetState();
  });

  speedSlider.addEventListener('input', (e) => {
    clockSpeedMs = parseInt(e.target.value, 10);
    speedValue.textContent = `${clockSpeedMs}ms`;
    if (isPlaying) {
      startClock();
    }
  });

  toggleA.addEventListener('click', () => handleBitToggle(3));
  toggleB.addEventListener('click', () => handleBitToggle(2));
  toggleC.addEventListener('click', () => handleBitToggle(1));
  toggleD.addEventListener('click', () => handleBitToggle(0));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === 'ArrowRight') {
      setModeManual();
      nextState();
    } else if (e.code === 'ArrowLeft') {
      setModeManual();
      prevState();
    }
  });
}

// Bootstrapping
window.addEventListener('DOMContentLoaded', () => {
  buildMatrix();
  buildChannelsGrid();
  buildTruthTable();
  setupEvents();
  selectChannel('X1');
  setState(0);
  startClock();
});
