/*
 * =====================================================================================
 * Project:       5x5 Electronic Parol LED Matrix Display Sequencer
 * Course:        Computer Organization (COMPORG Finals)
 * Author:        Bludylan Cyrus A. Pizarra (@BluPizarra)
 * Platform:      Arduino Uno / ATmega328P
 * Tinkercad URL: https://www.tinkercad.com/things/2AHTjSkFMHO-finals-comporg
 * =====================================================================================
 * 
 * Circuit Description:
 * An Arduino Uno is configured as a synchronous 4-bit binary counter cycling from 
 * 0000 to 1111 (0 to 15 decimal). The 4 output bits drive a combinational logic circuit 
 * composed of 74xx TTL logic gates (7404 NOT, 7408/7411/7421 AND, and 7432 OR ICs) that 
 * decode the binary state into 13 unique control channels (X1 through X13).
 * 
 * These 13 channels control a 25-LED 5x5 matrix configured with diagonal and rotational
 * symmetry to animate an electronic Philippine Christmas Lantern (Parol).
 *
 * Pin Connections to Breadboard Logic Gates:
 * - Arduino Pin 4  -> Bit 0 / D (Least Significant Bit)
 * - Arduino Pin 5  -> Bit 1 / C
 * - Arduino Pin 6  -> Bit 2 / B
 * - Arduino Pin 7  -> Bit 3 / A (Most Significant Bit)
 * - Arduino 5V     -> VCC rail for all 74xx ICs
 * - Arduino GND    -> Ground rail for all 74xx ICs & LED cathode resistors
 * =====================================================================================
 */

// Define the pins for each bit
const int bit3 = 7; // Most Significant Bit (Input A to logic array)
const int bit2 = 6; // Input B to logic array
const int bit1 = 5; // Input C to logic array
const int bit0 = 4; // Least Significant Bit (Input D to logic array)

// Delay duration in milliseconds per step (300ms matches Tinkercad simulation)
const unsigned long STEP_DELAY_MS = 300;

void setup() {
  // Set all 4 counter pins as digital OUTPUT
  pinMode(bit0, OUTPUT);
  pinMode(bit1, OUTPUT);
  pinMode(bit2, OUTPUT);
  pinMode(bit3, OUTPUT);

  // Initialize outputs to 0000
  digitalWrite(bit0, LOW);
  digitalWrite(bit1, LOW);
  digitalWrite(bit2, LOW);
  digitalWrite(bit3, LOW);
}

void loop() {
  // Loop through numbers 0 to 15 (0000 to 1111 in binary)
  for (int i = 0; i < 16; i++) {
    // Output each bit to the corresponding digital pin
    digitalWrite(bit0, (i >> 0) & 1); // D4 -> D (LSB)
    digitalWrite(bit1, (i >> 1) & 1); // D5 -> C
    digitalWrite(bit2, (i >> 2) & 1); // D6 -> B
    digitalWrite(bit3, (i >> 3) & 1); // D7 -> A (MSB)

    delay(STEP_DELAY_MS);
  }
}
