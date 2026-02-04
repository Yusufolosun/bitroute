import bip39 from 'bip39';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Generating valid BIP39 mnemonics for Simnet...\n');

// Generate 3 valid mnemonics (deployer + 2 wallets)
const deployer = bip39.generateMnemonic();
const wallet1 = bip39.generateMnemonic();
const wallet2 = bip39.generateMnemonic();

// Verify they're valid
console.log('✓ Deployer mnemonic valid:', bip39.validateMnemonic(deployer));
console.log('✓ Wallet 1 mnemonic valid:', bip39.validateMnemonic(wallet1));
console.log('✓ Wallet 2 mnemonic valid:', bip39.validateMnemonic(wallet2));

console.log('\n📝 Generated mnemonics:');
console.log('\n[deployer]');
console.log(deployer);
console.log('\n[wallet_1]');
console.log(wallet1);
console.log('\n[wallet_2]');
console.log(wallet2);

// Read current Simnet.toml
const simnetPath = path.join(__dirname, '../settings/Simnet.toml');
let simnetContent = fs.readFileSync(simnetPath, 'utf8');

// Replace mnemonics using regex
simnetContent = simnetContent.replace(
  /(\[accounts\.deployer\][\s\S]*?mnemonic = ")[^"]*(")/,
  `$1${deployer}$2`
);

simnetContent = simnetContent.replace(
  /(\[accounts\.wallet_1\][\s\S]*?mnemonic = ")[^"]*(")/,
  `$1${wallet1}$2`
);

simnetContent = simnetContent.replace(
  /(\[accounts\.wallet_2\][\s\S]*?mnemonic = ")[^"]*(")/,
  `$1${wallet2}$2`
);

// Write back to file
fs.writeFileSync(simnetPath, simnetContent);

console.log('\n✅ Simnet.toml updated successfully!');
console.log('📁 File:', simnetPath);

