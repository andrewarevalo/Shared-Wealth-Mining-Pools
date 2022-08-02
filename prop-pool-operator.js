"use strict";

//const { Miner, Blockchain } = require('spartan-gold');
const PoolOperator = require('./pool-operator');

const TOTAL_MINER_REWARD = 20;

module.exports = class PropPoolOperator extends PoolOperator {
    constructor(...args){
        super(...args);
        this.shares = [];
    }






    rewardMiner(minerAddress) {
        this.log(`recording share ${minerAddress}`);
        //this.postTransaction([{address: minerAddress, amount: SHARE_REWARD}], 0);
        this.shares.push(minerAddress);
    }


    payRewards(){
        /*
        for every miner inside of shares, pay them in gold, in proportion to how much shares they gave to us. 
        */
       let payOut = TOTAL_MINER_REWARD/ this.shares.length;
       for(let i = 0; i < this.shares.length; i++){
           this.postTransaction([{address: this.shares[i], amount: payOut}], 0);
       }
    }
    
}