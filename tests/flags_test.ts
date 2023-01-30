import {
  Clarinet,
  Tx,
  type Chain,
  type Account,
  type Block,
  types,
} from "https://deno.land/x/clarinet@v1.4.0/index.ts";

const ownablePrincipal = (deployerAddr: string): string => {
  return types.principal(`${deployerAddr}.ownable`);
};

const setContractOwner = (
  chain: Chain,
  deployerAddress: string,
  txSender: string
): Block => {
  return chain.mineBlock([
    Tx.contractCall(
      "flags",
      "set-contract-owner",
      [ownablePrincipal(deployerAddress)],
      txSender
    ),
  ]);
};

const setContractFlag = (
  flag: string,
  chain: Chain,
  deployerAddress: string,
  txSender: string
): Block => {
  return chain.mineBlock([
    Tx.contractCall(
      "flags",
      "set-flag",
      [ownablePrincipal(deployerAddress), types.buff(flag), types.bool(true)],
      txSender
    ),
  ]);
};

/*
 ****** set-contract-owner
 */
Clarinet.test({
  name: "should return error if caller if not owner of the contract",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const user = accounts.get("wallet_1")!;

    const block = setContractOwner(chain, deployer.address, user.address);

    block.receipts[0].result.expectErr().expectUint(1);
  },
});

Clarinet.test({
  name: "should set tx-sender as the contract owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;

    const block = setContractOwner(chain, deployer.address, deployer.address);

    block.receipts[0].result.expectOk().expectBool(true);

    const isOwner = chain.callReadOnlyFn(
      "flags",
      "is-owner",
      [ownablePrincipal(deployer.address)],
      deployer.address
    );

    isOwner.result.expectBool(true);
  },
});

/*
 ****** set-flag
 */
Clarinet.test({
  name: "should return error if caller is not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const user = accounts.get("wallet_1")!;
    setContractOwner(chain, deployer.address, deployer.address);

    const block = setContractFlag(
      "some flag",
      chain,
      deployer.address,
      user.address
    );

    block.receipts[0].result.expectErr().expectUint(1);
  },
});

Clarinet.test({
  name: "should set a flag for an owned contract",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    setContractOwner(chain, deployer.address, deployer.address);

    const block = setContractFlag(
      "some flag",
      chain,
      deployer.address,
      deployer.address
    );

    block.receipts[0].result.expectOk().expectBool(true);
  },
});

/*
 ****** is-owner
 */

Clarinet.test({
  name: "should set tx-sender as the contract owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;

    const block = setContractOwner(chain, deployer.address, deployer.address);

    block.receipts[0].result.expectOk().expectBool(true);

    const isOwner = chain.callReadOnlyFn(
      "flags",
      "is-owner",
      [ownablePrincipal(deployer.address)],
      deployer.address
    );

    isOwner.result.expectBool(true);
  },
});

Clarinet.test({
  name: "should return whether or not the caller is owner of the contract",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const user = accounts.get("wallet_1")!;

    setContractOwner(chain, deployer.address, deployer.address);

    let isOwner = chain.callReadOnlyFn(
      "flags",
      "is-owner",
      [ownablePrincipal(deployer.address)],
      deployer.address
    );
    isOwner.result.expectBool(true);

    isOwner = chain.callReadOnlyFn(
      "flags",
      "is-owner",
      [ownablePrincipal(deployer.address)],
      user.address
    );
    isOwner.result.expectBool(false);
  },
});

/*
 ****** is-flag-on
 */
Clarinet.test({
  name: "should return whether or not a flag is on",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const flag = "some flag";

    setContractOwner(chain, deployer.address, deployer.address);
    setContractFlag(flag, chain, deployer.address, deployer.address);

    let isFlagOn = chain.callReadOnlyFn(
      "flags",
      "is-flag-on",
      [ownablePrincipal(deployer.address), types.buff(flag)],
      deployer.address
    );
    isFlagOn.result.expectBool(true);

    isFlagOn = chain.callReadOnlyFn(
      "flags",
      "is-flag-on",
      [ownablePrincipal(deployer.address), types.buff("another-flag")],
      deployer.address
    );
    isFlagOn.result.expectBool(false);
  },
});
