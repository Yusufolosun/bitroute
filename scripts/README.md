# Project Scripts

This directory contains useful scripts for development, deployment, and maintenance of BitRoute.

## scripts/deploy.js
Automates contract deployment using Clarinet CLI.

**Usage:**
```bash
node scripts/deploy.js
```

- Reads deployment config from `contracts/settings/`
- Runs Clarinet deployment commands
- Logs transaction IDs and contract addresses

## contracts/scripts/generate-mnemonics.js
Generates secure mnemonics for test accounts.

**Usage:**
```bash
node contracts/scripts/generate-mnemonics.js
```

- Outputs a new 12-word mnemonic
- Use for local testing only
- Never commit real mnemonics to git

## contracts/test-all.sh
Runs all contract tests in batch mode.

**Usage:**
```bash
bash contracts/test-all.sh
```

- Runs `clarinet test` for all test files
- Prints summary of results

---

## Adding New Scripts
- Place new scripts in `scripts/` or `contracts/scripts/`
- Document usage and purpose in this file
- Use descriptive filenames

## Security
- Never store secrets or mnemonics in scripts
- Use environment variables for sensitive data

---

For questions, contact the project maintainers.
