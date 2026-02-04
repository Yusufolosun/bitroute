#!/usr/bin/env node

/**
 * BitRoute Deployment Script
 * Deploys the router smart contract to Stacks blockchain
 */

const {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  getNonce,
} = require('@stacks/transactions');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  network: process.env.NETWORK || 'testnet',
  privateKey: process.env.STACKS_PRIVATE_KEY,
  contractName: 'router',
  contractPath: path.join(__dirname, '../contracts/contracts/router.clar'),
};

async function deployContract() {
  console.log('🚀 BitRoute Deployment Script\n');

  // Validate configuration
  if (!CONFIG.privateKey) {
    console.error('❌ Error: STACKS_PRIVATE_KEY environment variable is required');
    console.log('Set it with: export STACKS_PRIVATE_KEY=your_private_key');
    process.exit(1);
  }

  // Read contract source code
  let contractSource;
  try {
    contractSource = fs.readFileSync(CONFIG.contractPath, 'utf8');
    console.log(`📄 Contract loaded: ${CONFIG.contractName}`);
  } catch (error) {
    console.error(`❌ Error reading contract file: ${error.message}`);
    process.exit(1);
  }

  // Set up network
  const network = CONFIG.network === 'mainnet' 
    ? new StacksMainnet()
    : new StacksTestnet();
  
  console.log(`🌐 Network: ${CONFIG.network}`);

  try {
    // Create contract deploy transaction
    console.log('\n📦 Creating deployment transaction...');
    
    const txOptions = {
      contractName: CONFIG.contractName,
      codeBody: contractSource,
      senderKey: CONFIG.privateKey,
      network,
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractDeploy(txOptions);

    // Broadcast transaction
    console.log('📡 Broadcasting transaction...');
    const broadcastResponse = await broadcastTransaction(transaction, network);

    if (broadcastResponse.error) {
      console.error('❌ Deployment failed:', broadcastResponse.error);
      if (broadcastResponse.reason) {
        console.error('Reason:', broadcastResponse.reason);
      }
      process.exit(1);
    }

    console.log('\n✅ Contract deployed successfully!');
    console.log(`📍 Transaction ID: ${broadcastResponse.txid}`);
    console.log(`🔗 View on explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=${CONFIG.network}`);

  } catch (error) {
    console.error('❌ Deployment error:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployContract().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { deployContract };
