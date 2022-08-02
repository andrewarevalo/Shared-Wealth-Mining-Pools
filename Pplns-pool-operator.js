"use strict";

//const { Miner, Blockchain } = require('spartan-gold');
const PoolOperator = require('./pool-operator');

const TOTAL_MINER_REWARD = 20;
const MAX_AMOUNT_OF_MINERS = 5;


module.exports = class PplnsPoolOperator extends PoolOperator {
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
       //let payOut = TOTAL_MINER_REWARD/ this.shares.length;
       const payPerMiner = TOTAL_MINER_REWARD / MAX_AMOUNT_OF_MINERS
       for(let i = 0 ; i < this.shares.length; i++){
           this.postTransaction([{address: this.shares[i], amount: payPerMiner}], 0);
           if(this.shares.length > MAX_AMOUNT_OF_MINERS){
               this.shares.shift;
           }
       }
    }
    
}