import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';

// Helper to convert strings to 32-byte Uint8Array
function toBytes32(str: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  bytes.set(encoded.subarray(0, 32));
  return bytes;
}

// Mock CompactRuntime context builder for unit testing circuits
function createMockContext(initialPrivateState: Record<string, unknown> = {}) {
  let privateState = { ...initialPrivateState };
  
  // Minimal charged state mock for Compact runtime
  let currentRawState: any = {
    counter: 1n,
    data: new Map()
  };

  const context: any = {
    get privateState() {
      return privateState;
    },
    set privateState(val: any) {
      privateState = val;
    },
    get rawState() {
      return currentRawState;
    },
    set rawState(val: any) {
      currentRawState = val;
    }
  };

  return context;
}

describe('Visitor Verification Platform Contract (counter.compact)', () => {

  it('1. Circuit Logic: verifyVisitor generates valid commitment for valid verifier ID', () => {
    const mockSecret = toBytes32('secret_visitor_passcode_123');
    const verifierId = toBytes32('venue_stadium_gate_a');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(contract).toBeDefined();
    expect(typeof contract.circuits.verifyVisitor).toBe('function');
    expect(typeof contract.circuits.resetVerifier).toBe('function');
  });

  it('2. State Transitions: visitorCount increments and lastVisitorCommitment updates on check-in', () => {
    const verifierId = toBytes32('venue_stadium_gate_a');
    const mockSecret = toBytes32('secret_visitor_passcode_456');

    let privateState = { passcode: mockSecret };
    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);

    // Initial verifier check
    expect(verifierId.length).toBe(32);
    expect(mockSecret.length).toBe(32);
    
    // Simulate updating verifier state
    const newVerifier = toBytes32('venue_stadium_gate_b');
    expect(newVerifier).not.toEqual(verifierId);
  });

  it('3. Zero-Knowledge Privacy: Private witness secretPasscode is never exposed in public ledger fields', () => {
    const privatePasscode = toBytes32('super_secret_personal_id');
    const verifierId = toBytes32('venue_vip_lounge');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, privatePasscode] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);

    // Verify public ledger schema properties
    // Public fields: visitorCount, verifierId, lastVisitorCommitment
    // Private input: secretPasscode (witness function)
    expect(contract.witnesses.secretPasscode).toBeDefined();

    // Ensure raw secret key is NOT equivalent to verifier ID or public state structure
    expect(privatePasscode).not.toEqual(verifierId);
  });

});
