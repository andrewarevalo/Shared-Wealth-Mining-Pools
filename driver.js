"use strict";

const { Blockchain, Block, Miner, Client, Transaction, FakeNet } = require('spartan-gold');

const PoolOperator = require('./pool-operator.js');
const PoolMiner = require('./pool-miner.js');
//const PropPoolOperator = require('./prop-pool-operator.js');
const PplnsPoolOperator = require('./Pplns-pool-operator.js')

console.log("Starting simulation.  This may take a moment...");

let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});
let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});

// Independent miners
let minnie = new Miner({name: "Minnie", net: fakeNet, miningRounds: 100});
let mickey = new Miner({name: "Mickey", net: fakeNet, miningRounds: 100});
let donald = new Miner({name: "Donald", net: fakeNet, miningRounds: 100});

// Mining Pool operator and miners
let poolNet = new FakeNet();
let snowWhite = new PplnsPoolOperator({name: "Snow White", net: fakeNet, poolNet: poolNet});
let doc = new PoolMiner({name: "Doc", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let happy = new PoolMiner({name: "Happy", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let sneezy = new PoolMiner({name: "Sneezy", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let sleepy = new PoolMiner({name: "Sleepy", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let bashful = new PoolMiner({name: "Bashful", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let grumpy = new PoolMiner({name: "Grumpy", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});
let dopey = new PoolMiner({name: "Dopey", net: fakeNet, operatorAddress: snowWhite.address, miningRounds: 100});

poolNet.register(snowWhite, doc, happy, sneezy, sleepy, bashful, grumpy, dopey);

let clientBalanceMap = new Map([
  [alice, 233],
  [bob, 99],
  [charlie, 67],
  [minnie, 300],
  [mickey, 300],
  [donald, 300],
  [snowWhite, 300],
  [doc, 300],
  [happy, 300],
  [sneezy, 300],
  [sleepy, 300],
  [bashful, 300],
  [grumpy, 300],
  [dopey, 300],
]);

// Creating genesis block
//makeGenesis is a static function that is only calling it on the class Blockchain itslef rather than an instance. 
Blockchain.makeGenesis({
  blockClass: Block,
  transactionClass: Transaction,
  clientBalanceMap: clientBalanceMap,
  powLeadingZeroes: 16,
});

function showBalances(client) {
  for (let cl of clientBalanceMap.keys()) {
    console.log(`${cl.name} has ${client.lastBlock.balanceOf(cl.address)} gold.`);
  }
}

// Showing the initial balances from Alice's perspective, for no particular reason.
console.log("Initial balances:");
showBalances(alice); // client is the name that you pass the function showBalances to it to 

for (let client of clientBalanceMap.keys()) {
  console.log(`Registering ${client.name}`);
  fakeNet.register(client); // find register function.
}

// Mining pool initializes
snowWhite.startNewSearch();

// Miners start mining.
for (let client of clientBalanceMap.keys()) {
  if (client.initialize !== undefined) {
    client.initialize();
  }
}

// Alice transfers some money to Bob.
console.log(`Alice is transferring 40 gold to ${bob.address}`);
alice.postTransaction([{ amount: 40, address: bob.address }]);

// Print out the final balances after it has been running for some time.
let showFinalBalances = function() {

  console.log();
  console.log(`Minnie has a chain of length ${minnie.currentBlock.chainLength}:`);

  console.log();
  console.log("Final balances (Minnie's perspective):");
  showBalances(minnie);

  process.exit(0);
}

setTimeout(showFinalBalances, 10000);
