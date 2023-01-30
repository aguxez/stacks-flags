import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.4.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";

Clarinet.test({
  name: "should set the owner on deployment",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const chainOwner = chain.callReadOnlyFn(
      "ownable",
      "owner",
      [],
      deployer.address
    );

    assertEquals(chainOwner.result.expectOk(), deployer.address);
  },
});
