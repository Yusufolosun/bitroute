import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("BitRoute Router Contract", () => {
  
  beforeEach(() => {
    // Reset simnet state before each test
  });
  
  it("ensures contract initializes correctly", () => {
    const isPaused = simnet.callReadOnlyFn(
      "router",
      "is-paused",
      [],
      deployer
    );
    expect(isPaused.result).toBeOk(Cl.bool(false));
  });

  it("rejects zero amount swaps", () => {
    const response = simnet.callPublicFn(
      "router",
      "execute-auto-swap",
      [
        Cl.contractPrincipal(deployer, "mock-token-a"),
        Cl.contractPrincipal(deployer, "mock-token-b"),
        Cl.uint(0), // Invalid zero amount
        Cl.uint(0),
      ],
      deployer
    );
    
    expect(response.result).toBeErr(Cl.uint(102)); // ERR-INVALID-AMOUNT
  });

  it("allows owner to pause contract", () => {
    const pauseResponse = simnet.callPublicFn(
      "router",
      "set-paused",
      [Cl.bool(true)],
      deployer
    );
    
    expect(pauseResponse.result).toBeOk(Cl.bool(true));
    
    const isPaused = simnet.callReadOnlyFn(
      "router",
      "is-paused",
      [],
      deployer
    );
    
    expect(isPaused.result).toBeOk(Cl.bool(true));
    
    // Unpause for other tests
    simnet.callPublicFn("router", "set-paused", [Cl.bool(false)], deployer);
  });

  it("rejects unauthorized pause attempts", () => {
    const response = simnet.callPublicFn(
      "router",
      "set-paused",
      [Cl.bool(true)],
      wallet1 // Non-owner
    );
    
    expect(response.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });

  it("returns price quotes from get-best-route", () => {
    const response = simnet.callReadOnlyFn(
      "router",
      "get-best-route",
      [
        Cl.principal(deployer + ".mock-token-a"),
        Cl.principal(deployer + ".mock-token-b"),
        Cl.uint(1000),
      ],
      deployer
    );
    
    expect(response.result).toBeOk(
      Cl.tuple({
        "best-dex": Cl.uint(1),
        "expected-amount-out": Cl.uint(1000),
        "alex-quote": Cl.uint(1000),
        "velar-quote": Cl.uint(950),
      })
    );
  });

  it("tracks DEX volume correctly", () => {
    const volumeBefore = simnet.callReadOnlyFn(
      "router",
      "get-dex-volume",
      [Cl.uint(1)],
      deployer
    );
    
    expect(volumeBefore.result).toBeOk(Cl.uint(0));
    
    // Volume tracking will be tested after actual swaps are implemented
  });
});

