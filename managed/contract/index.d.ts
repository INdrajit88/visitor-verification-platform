import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  secretPasscode(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  visitorNonce(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  visitorRole(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  verifyVisitor(context: __compactRuntime.CircuitContext<PS>,
                expectedVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  resetVerifier(context: __compactRuntime.CircuitContext<PS>,
                newVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementEpoch(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verifyVisitor(context: __compactRuntime.CircuitContext<PS>,
                expectedVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  resetVerifier(context: __compactRuntime.CircuitContext<PS>,
                newVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementEpoch(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  verifyVisitor(context: __compactRuntime.CircuitContext<PS>,
                expectedVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  resetVerifier(context: __compactRuntime.CircuitContext<PS>,
                newVerifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementEpoch(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly visitorCount: bigint;
  readonly verifierId: Uint8Array;
  readonly lastVisitorCommitment: Uint8Array;
  readonly activeEpoch: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initialVerifier_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
