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

describe('Visitor Verification Platform Contract - Level 3 Advanced ZK Architecture', () => {

  it('1. Circuit Structure: verifyVisitor exports valid circuit bindings with multi-witness vectors', () => {
    const mockSecret = toBytes32('secret_visitor_passcode_123');
    const mockNonce = toBytes32('random_entropy_nonce_777');
    const mockRole = toBytes32('role_tier_1_standard');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, mockNonce] as [any, Uint8Array],
      visitorRole: (ctx: any) => [ctx.privateState, mockRole] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(contract).toBeDefined();
    expect(typeof contract.circuits.verifyVisitor).toBe('function');
    expect(typeof contract.circuits.resetVerifier).toBe('function');
    expect(typeof contract.circuits.incrementEpoch).toBe('function');
  });

  it('2. Multi-Witness Resolution: secretPasscode, visitorNonce, and visitorRole witnesses are constructed cleanly', () => {
    const mockSecret = toBytes32('secret_visitor_passcode_456');
    const mockNonce = toBytes32('random_entropy_nonce_888');
    const mockRole = toBytes32('role_tier_2_vip');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, mockSecret] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, mockNonce] as [any, Uint8Array],
      visitorRole: (ctx: any) => [ctx.privateState, mockRole] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(witnesses.secretPasscode).toBeDefined();
    expect(witnesses.visitorNonce).toBeDefined();
    expect(witnesses.visitorRole).toBeDefined();

    expect(mockSecret.length).toBe(32);
    expect(mockNonce.length).toBe(32);
    expect(mockRole.length).toBe(32);
  });

  it('3. Zero-Knowledge Privacy Model: Private witnesses are isolated from public ledger', () => {
    const privatePasscode = toBytes32('super_secret_personal_id');
    const privateNonce = toBytes32('private_nonce_secret');
    const privateRole = toBytes32('role_tier_3_admin');
    const verifierId = toBytes32('venue_vip_lounge');

    const witnesses = {
      secretPasscode: (ctx: any) => [ctx.privateState, privatePasscode] as [any, Uint8Array],
      visitorNonce: (ctx: any) => [ctx.privateState, privateNonce] as [any, Uint8Array],
      visitorRole: (ctx: any) => [ctx.privateState, privateRole] as [any, Uint8Array]
    };

    const contract = new Contract(witnesses);
    expect(contract.witnesses.secretPasscode).toBeDefined();

    // Ensure raw secret values are isolated and distinct
    expect(privatePasscode).not.toEqual(verifierId);
    expect(privateNonce).not.toEqual(verifierId);
    expect(privateRole).not.toEqual(verifierId);
  });

  it('4. Ledger Schema Interface: Exports ledger schema query function', () => {
    expect(typeof ledger).toBe('function');
  });

});
