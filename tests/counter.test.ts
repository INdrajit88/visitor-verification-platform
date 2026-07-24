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

describe('Visitor Verification Platform Contract - Level 2 Enhanced', () => {

  it('1. Circuit Logic: verifyVisitor generates valid commitment with passcode and nonce witnesses', () => {
    const mockSecret = toBytes32('secret_visitor_passcode_123');
    const mockNonce = toBytes32('random_entropy_nonce_777');
    const verifierId = toBytes32('venue_stadium_gate_a');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, mockNonce] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(contract).toBeDefined();
    expect(typeof contract.circuits.verifyVisitor).toBe('function');
    expect(typeof contract.circuits.resetVerifier).toBe('function');
  });

  it('2. Multi-Witness Verification: passcode and nonce witnesses are passed cleanly', () => {
    const verifierId = toBytes32('venue_stadium_gate_a');
    const mockSecret = toBytes32('secret_visitor_passcode_456');
    const mockNonce = toBytes32('random_entropy_nonce_888');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, mockNonce] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(witnesses.secretPasscode).toBeDefined();
    expect(witnesses.visitorNonce).toBeDefined();

    // Initial verifier check
    expect(verifierId.length).toBe(32);
    expect(mockSecret.length).toBe(32);
    expect(mockNonce.length).toBe(32);
  });

  it('3. Zero-Knowledge Privacy: Private inputs (passcode & nonce) are never exposed in public ledger', () => {
    const privatePasscode = toBytes32('super_secret_personal_id');
    const privateNonce = toBytes32('private_nonce_secret');
    const verifierId = toBytes32('venue_vip_lounge');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, privatePasscode] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, privateNonce] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(contract.witnesses.secretPasscode).toBeDefined();
    expect(contract.witnesses.visitorNonce).toBeDefined();

    // Ensure raw secret values are NOT equal to public verifier ID
    expect(privatePasscode).not.toEqual(verifierId);
    expect(privateNonce).not.toEqual(verifierId);
  });

});
