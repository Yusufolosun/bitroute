# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Transaction status monitoring with live updates
- Transaction history panel
- Network status indicator
- Slippage tolerance warnings
- Quote refresh functionality
- Loading skeletons for better UX

### Changed
- Enhanced error message styling
- Improved slippage tolerance UI
- Better wallet connection state management

### Fixed
- Token address validation for testnet
- Wallet connection persistence
- Transaction cancellation handling

## [0.1.0] - 2026-02-05

### Added
- Initial router smart contract (Clarity)
- Frontend application (Next.js + React)
- Wallet integration (Leather/Xverse)
- Basic swap functionality
- Testnet deployment
- Price quote comparison (ALEX vs Velar)
- Slippage protection
- Admin pause mechanism
- Comprehensive test suite

### Contract Functions
- `get-best-route` - Read-only price discovery
- `execute-auto-swap` - Public swap execution
- `set-paused` - Admin control
- `get-dex-volume` - Volume tracking
- `get-user-stats` - User statistics

### Frontend Features
- Token selection UI
- Amount input with validation
- Real-time price quotes
- Transaction execution
- Responsive design
- Dark mode support

## [0.0.1] - 2026-01-15

### Added
- Project initialization
- Basic project structure
- Development environment setup
