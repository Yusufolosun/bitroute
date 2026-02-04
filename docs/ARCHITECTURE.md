# BitRoute Architecture

## Overview

BitRoute is a decentralized Bitcoin routing optimizer built on the Stacks blockchain. It enables users to create, manage, and optimize Bitcoin transaction routes through smart contracts.

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  UI Layer    │  │  Stacks API  │  │  State Mgmt  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ Stacks.js
                         │
┌────────────────────────▼────────────────────────────────┐
│              Stacks Blockchain Layer                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Router Smart Contract (Clarity)          │  │
│  │                                                   │  │
│  │  • Route Creation & Management                   │  │
│  │  • Fee Optimization                              │  │
│  │  • Data Storage (Routes, Users)                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Smart Contracts (`/contracts`)

#### router.clar
The core smart contract that handles:
- **Route Creation**: Users can create new Bitcoin transaction routes
- **Route Management**: Update fees, activate/deactivate routes
- **Data Storage**: Maintains route information in on-chain maps
- **Access Control**: Owner-only functions for administrative tasks

**Key Functions:**
- `create-route`: Creates a new route with source, destination, and fee
- `update-route`: Modifies existing route parameters
- `deactivate-route`: Marks a route as inactive
- `get-route`: Retrieves route information
- `get-route-counter`: Returns total number of routes

**Data Structures:**
- `routes`: Map storing route details (source, destination, fee, timestamp, active status)
- `user-routes`: Map linking users to their created routes
- `route-counter`: Tracks total number of routes created

### 2. Frontend Application (`/frontend`)

#### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain Integration**: Stacks.js (@stacks/connect, @stacks/transactions)

#### Key Components

**RouteOptimizer.tsx**
Main component that provides:
- Wallet connection interface
- Route creation form
- Active routes display
- Transaction management

**useStacks.ts** (Custom Hook)
Handles all blockchain interactions:
- Wallet connection/disconnection
- Contract function calls
- Transaction broadcasting
- Network configuration

**stacks-config.ts**
Central configuration for:
- Contract addresses
- Network endpoints
- Environment-specific settings

#### Application Flow

1. **User Authentication**
   - User connects Stacks wallet (Hiro/Xverse)
   - Address is stored in local state
   - Session persists across page reloads

2. **Route Creation**
   - User inputs source address, destination address, and fee
   - Frontend validates input
   - Transaction is constructed using @stacks/transactions
   - User signs via wallet
   - Transaction is broadcast to network

3. **Route Querying**
   - Frontend queries blockchain for route data
   - Displays active routes in UI
   - Updates in real-time as blockchain state changes

### 3. Deployment Scripts (`/scripts`)

#### deploy.js
Node.js script for deploying contracts to Stacks blockchain:
- Reads contract source code
- Creates deployment transaction
- Broadcasts to testnet/mainnet
- Provides transaction confirmation and explorer links

**Usage:**
```bash
export STACKS_PRIVATE_KEY=your_private_key
export NETWORK=testnet
node scripts/deploy.js
```

## Data Flow

### Creating a Route

```
User Input (Frontend)
    ↓
Validate Input
    ↓
Construct Transaction (Stacks.js)
    ↓
Sign with Wallet
    ↓
Broadcast to Stacks Network
    ↓
Smart Contract Execution
    ↓
Update On-Chain State
    ↓
Confirmation to User
```

### Querying Routes

```
User Request (Frontend)
    ↓
Query Blockchain API
    ↓
Read Contract State
    ↓
Parse Response
    ↓
Display in UI
```

## Security Considerations

1. **Smart Contract Security**
   - Input validation for all public functions
   - Access control for administrative functions
   - Error handling with descriptive error codes

2. **Frontend Security**
   - No private keys stored in frontend
   - All transactions signed through user wallet
   - Input sanitization before contract calls

3. **Network Security**
   - Uses established Stacks network infrastructure
   - Transaction finality guaranteed by Bitcoin

## Development Workflow

1. **Local Development**
   - Use Clarinet for contract testing
   - Run frontend with `npm run dev`
   - Connect to testnet for integration testing

2. **Testing**
   - Unit tests in `router_test.clar`
   - Frontend component testing (recommended: Jest/React Testing Library)
   - Integration tests on testnet

3. **Deployment**
   - Test on devnet/testnet first
   - Use deployment script for mainnet
   - Verify contract on Stacks Explorer

## Future Enhancements

- **Route Optimization Algorithm**: Implement path-finding algorithms for multi-hop routes
- **Fee Market**: Dynamic fee adjustment based on network conditions
- **Analytics Dashboard**: Historical data and route performance metrics
- **Multi-signature Support**: Enable multi-sig routes for enhanced security
- **Lightning Network Integration**: Bridge to Lightning for instant settlements

## Technology Decisions

### Why Stacks?
- Bitcoin-settled smart contracts
- Clarity language provides security through decidability
- Native Bitcoin integration
- Established ecosystem and tooling

### Why Next.js?
- Server-side rendering for better SEO
- Built-in API routes
- Excellent TypeScript support
- Great developer experience

### Why Clarity?
- Decidable language (prevents common vulnerabilities)
- Built-in security features
- No gas fees (predictable costs)
- Bitcoin finality

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Stacks.js Documentation](https://stacks.js.org)
- [Next.js Documentation](https://nextjs.org/docs)
