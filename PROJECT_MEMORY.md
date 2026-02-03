================================================================================
                        MOSANA PROJECT MEMORY
================================================================================
Last Updated: 2026-02-03 (Lunch Break)
Status: Phase 3B.5 In Progress - 10 of 13 Features Done | Reputation Integration: 1 of 7 Complete
Next Task: Resume Reputation Integration after lunch (Tipping Module next)
================================================================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PROJECT IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:       Mosana
Tagline:    The Ethical SocialFi Platform
Vision:     Next-gen Web3 social on Solana with fair value exchange and 
            social good at its core

Core Principles:
  • No speculation/interest (positive-sum interactions)
  • Islamic finance alignment (Musharakah & Sadaqa principles)
  • True ownership (users own content, data, identity)
  • Fair revenue distribution (no exploitation)
  • Ethical-by-design economy

Official Links:
  • Website:    https://mosana.xyz
  • Whitepaper: https://mosana.xyz/whitepaper
  • X (Twitter): @MosanaOfficial
  • GitHub:     https://github.com/aliafifi/mosana-backend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  TECHNICAL INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backend Setup:
  • Path:           /home/mosana/mosana-backend
  • Framework:      NestJS (Node.js + TypeScript)
  • Port:           4000
  • API Base:       http://localhost:4000/api
  • Database:       MongoDB at mongodb://localhost:27017/mosana
  • Process Mgr:    PM2 (process name: mosana-api)
  • Git Repository: https://github.com/aliafifi/mosana-backend
  • Development:    GitHub Codespaces (VS Code in browser)

Development Workflow:
  • Edit Code:      GitHub Codespaces (no more nano!)
  • Save:           Ctrl + S in Codespaces
  • Commit:         Source Control panel in Codespaces
  • Deploy:         git push → git pull on VPS → pm2 restart mosana-api
  • Benefits:       Full IDE, autocomplete, syntax highlighting, Git integration

Frontend/Mobile App (NOT BUILT YET):
  • Platform:       Flutter (Dart)
  • Target:         iOS + Android + Solana Mobile (Saga/Seeker)
  • Status:         Pending (backend-first approach)
  • API Integration: RESTful API at http://api.mosana.xyz
  • Wallet:         
    - iOS/Android: Solana wallet adapter for Flutter
    - Saga: Mobile Wallet Adapter (MWA) + Seed Vault
  • Deployment:
    - iOS App Store
    - Google Play Store
    - Solana dApp Store (PRIORITY for crypto-native users)
  • Why Flutter + Solana Mobile:    
    - Single codebase for iOS + Android + Saga
    - Native Solana Mobile Stack (SMS) support
    - Hardware-secured key storage (Seed Vault)
    - One-tap wallet connection (MWA)
    - Built-in on Saga phones
    - Perfect for Mosana's Web3-first audience

Web3 Stack:
  • Blockchain:     Solana (mainnet-beta)
  • Wallet:         @solana/web3.js, @solana/wallet-adapter
  • NFT Protocol:   Metaplex (@metaplex-foundation/mpl-token-metadata)
  • Storage:        Arweave (via @irys/sdk)
  • Governance:     SPL-Governance + Squads Protocol (implemented)

Server Details:
  • OS:             Ubuntu 22.04 LTS
  • IP Address:     185.234.69.241
  • Domain:         api.mosana.xyz (SSL configured)
  • Security:       MongoDB authentication enabled
  • Management:     All services managed via PM2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 LEARNING STYLE & PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User Profile:
  • Self-described: Total beginner in coding with a very big vision
  • Preferred Pace: ONE command/file at a time, wait for response
  • Clarity Need:  Full explanations, no shortcuts or assumptions

Preferred Approach:
  1. ONE step at a time (wait for confirmation after each)
  2. Complete file contents (not snippets)
  3. Brief explanation after showing code
  4. Security-first mindset at every step
  5. Ask permission before moving to next step

CRITICAL: Never give multiple commands or files without waiting for response
         User needs time to process and verify each step

Goal: Deep understanding through careful implementation, not rushing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 TOKENOMICS (MOSANA TOKEN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Supply:       10,000,000,000 MOSANA (fixed, no minting)

Token Allocation:
  • Community & Ecosystem:  45% (4,500,000,000)
  • Team & Advisors:        20% (2,000,000,000) - 4yr vest, 12mo cliff
  • Platform Treasury:      15% (1,500,000,000)
  • Public Presale:         15% (1,500,000,000) - 25% TGE, 75% over 6mo
  • Liquidity Provision:     5% (500,000,000) - locked 12+ months

Deflationary Mechanism:
  • 50% of all tipping fees are BURNED permanently
  • Burns reduce circulating supply over time
  • Example: 30M tokens burned in Year 1 at moderate usage

Daily Rewards Schedule (Engagement-Based):
  • Year 1:  1,600,000 tokens/day  (≈584,000,000/year)
  • Year 2:  1,200,000 tokens/day  (≈438,000,000/year)
  • Year 3:    900,000 tokens/day  (≈328,500,000/year)
  • Year 4:    675,000 tokens/day  (≈246,375,000/year)
  • Year 5+:   506,250 tokens/day  (≈184,781,250/year)

Rewards Distribution:
  • Weighted by engagement score (not equal distribution)
  • Multiplied by reputation (1.0x - 3.0x based on level)
  • Higher quality content = higher rewards
  • 50% of tipping fees added to rewards pool
  • Anti-bot measures via reputation system

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLETED FEATURES (1-10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURE 1: WALLET-NATIVE IDENTITY (Phase 1)
────────────────────────────────────────────────────────────────────────────
Description:     Wallet-based authentication (no passwords)
Authentication:  JWT tokens via wallet signature verification
.sol Domains:    Support for Solana Name Service integration
Endpoints:       1 endpoint
  • POST /api/auth/login

FEATURE 2: USER PROFILES (Phase 1)
────────────────────────────────────────────────────────────────────────────
Description:     User profile management with Web3 features
Key Features:    NFT profile pictures, .sol domain linking, bio, username
Social:          Following system, follower count
Endpoints:       6 endpoints
  • GET    /api/users/me
  • GET    /api/users/:walletAddress
  • PUT    /api/users/profile
  • POST   /api/users/nft-pfp
  • POST   /api/users/follow/:walletAddress
  • DELETE /api/users/follow/:walletAddress

FEATURE 3: POSTS MODULE (Phase 1) ✅ REPUTATION INTEGRATED (2026-02-03)
────────────────────────────────────────────────────────────────────────────
Description:     Core content creation and interaction
Features:        Create posts, like, comment (with GIF support), feeds
Media:           Support for multiple image/video URLs
Charity:         Post-specific charity dedication (dedicatedCause field)
Reputation:      ✅ INTEGRATED
  • create() → +1 totalPosts
  • likePost() → +1 totalLikes (for post author)
  • addComment() → +1 totalComments (for post author)
Status:          DEPLOYED | REPUTATION ACTIVE
Endpoints:       10 endpoints
  • POST   /api/posts
  • GET    /api/posts
  • GET    /api/posts/feed
  • GET    /api/posts/trending
  • GET    /api/posts/:id
  • GET    /api/posts/user/:walletAddress
  • POST   /api/posts/:id/like
  • DELETE /api/posts/:id/like
  • POST   /api/posts/:id/comments
  • DELETE /api/posts/:id

FEATURE 4: REWARDS MODULE (Phase 1)
────────────────────────────────────────────────────────────────────────────
Description:     Daily token distribution based on engagement
Mechanism:       Weighted rewards (quality > quantity)
Reputation:      ⏳ Integration pending (apply rewardMultiplier)
Distribution:    Automatic daily calculation via scheduled job
Future:          Referral bonuses planned (10% L1, 5% L2, 2% L3)
Future:          ML-based content quality scoring
Endpoints:       3 endpoints
  • GET /api/rewards/today
  • GET /api/rewards/history
  • GET /api/rewards/tokenomics

FEATURE 5: TIPPING MODULE (Phase 2)
────────────────────────────────────────────────────────────────────────────
Description:     Peer-to-peer tipping with tiered fees and deflationary burn
Fee Structure:   
  • 1.00% for tips ≤100 tokens
  • 0.75% for tips 101-1,000
  • 0.50% for tips 1,001-10,000
  • 0.25% for tips >10,000
Fee Split:       50% burned (deflationary), 50% to rewards pool
Limits:          Min 10 tokens, Max 10,000,000 tokens
Currencies:      SOL, USDC supported
Reputation:      ⏳ Integration pending (tipsReceived, tipsSent) - NEXT AFTER LUNCH
Endpoints:       7 endpoints
  • POST /api/tipping
  • GET  /api/tipping/sent
  • GET  /api/tipping/received
  • GET  /api/tipping/post/:postId
  • GET  /api/tipping/stats
  • GET  /api/tipping/preview/:amount
  • GET  /api/tipping/fee-tiers

FEATURE 6: NFT MINTING MODULE - "IMMORTAL POSTS" (Phase 2)
────────────────────────────────────────────────────────────────────────────
Description:     Mint posts as NFTs with on-chain royalties
Blockchain:      Solana (Metaplex standard)
Storage:         Arweave (permanent, decentralized)
Royalties:       Creator-controlled (0-50%)
Ownership:       Post author mints; NFT ownership = post ownership
Reputation:      ⏳ Integration pending (nftsMinted, nftsSold, nftRevenue)
Key Files:
  • src/nft-minting/schemas/nft.schema.ts
  • src/nft-minting/services/arweave.service.ts
  • src/nft-minting/nft-minting.service.ts
  • src/nft-minting/nft-minting.controller.ts
Environment:
  • PLATFORM_WALLET_PRIVATE_KEY (base58 Solana private key)
  • SOLANA_RPC_URL (default: https://api.mainnet-beta.solana.com)
Testing Status:  NOT TESTED YET - Needs platform wallet funding
Endpoints:       5 endpoints
  • POST /api/nft/mint/:postId
  • GET  /api/nft/:mintAddress
  • GET  /api/nft/user/:walletAddress
  • GET  /api/nft/check/:postId
  • GET  /api/nft/stats/platform

FEATURE 7: VENTURES MODULE - "MUSHARAKAH PARTNERSHIPS" (Phase 2)
────────────────────────────────────────────────────────────────────────────
Description:     Collaborative posts with automatic revenue sharing
Mechanism:       Multi-party partnerships with percentage-based splits
Activation:      All collaborators must accept before venture goes "active"
Revenue Sources: Tips, NFT sales, NFT royalties
On-Chain:        All splits recorded transparently
Reputation:      ⏳ Integration pending (venturesJoined)
Key Schemas:
  • Venture (collaborators, shares, status, total revenue)
  • RevenueSplit (payment records with transaction hashes)
Testing Status:  NOT TESTED YET - Needs validation
Endpoints:       9 endpoints
  • POST /api/ventures
  • PUT  /api/ventures/:ventureId/accept
  • PUT  /api/ventures/:ventureId/reject
  • GET  /api/ventures/post/:postId
  • GET  /api/ventures/my-ventures
  • GET  /api/ventures/invitations
  • GET  /api/ventures/:ventureId/splits
  • GET  /api/ventures/earnings
  • GET  /api/ventures/stats

FEATURE 8: SOCIAL GOOD MODULE - "SADAQA ENGINE" (Phase 2)
────────────────────────────────────────────────────────────────────────────
Description:     On-chain charity donations tied to content earnings
Model:           Post-specific donations (not personal pledges)
Charities:       Verified charity directory (admin-curated)
Donation Modes:  
  • Passive: Tips split between creator + charity
  • Active:  "Donate Directly" button (100% to charity)
Transparency:    All donations tracked on-chain with transaction hashes
Reputation:      ⏳ Integration pending (charityDonations)
Key Schemas:
  • Cause (verified charities with wallet addresses)
  • Donation (donation records with source tracking)
Post Integration: Posts have dedicatedCause + charityPercentage fields
Future:          Charity self-registration with KYC (post-MVP)
Testing Status:  ✅ TESTED - Test charity created successfully
Endpoints:       7 endpoints
  • POST /api/social-good/causes (admin only)
  • GET  /api/social-good/causes
  • GET  /api/social-good/causes/:causeId
  • POST /api/social-good/donate
  • GET  /api/social-good/donations/my-donations
  • GET  /api/social-good/causes/:causeId/donations
  • GET  /api/social-good/stats

FEATURE 9: DAO MODULE - "TOKEN-GATED COMMUNITIES" (Phase 3A) ✅ COMPLETE
────────────────────────────────────────────────────────────────────────────
Status:          ✅ COMPLETED 2026-02-02
Description:     Decentralized governance and token-gated communities
Key Components:
  • DAO creation with MOSANA token requirements
  • Proposal submission system
  • Democratic voting (Yes/No/Abstain)
  • Auto-finalization based on quorum & voting period
  • Member management (join/leave)
  • Statistics tracking
Reputation:      ⏳ Integration pending (daosJoined, proposalsCreated, votesCast)
Key Schemas:
  • Dao (community metadata, members, voting rules)
  • Proposal (title, description, votes, status)
Key Features:
  • Token-gating: minTokensRequired (e.g., 10,000 MOSANA to join)
  • Voting periods: configurable (1-30 days)
  • Quorum requirements: configurable (1-100%)
  • Permission controls: who can propose (anyone/members/creator)
  • Vote tracking: transparent on-chain records
  • Automatic proposal finalization
Security:
  • Only DAO members can vote
  • No double-voting
  • Creator cannot leave DAO
  • Vote weight = 1 (future: reputation-weighted)
Testing Status:  NOT TESTED YET - Needs validation
Endpoints:       13 endpoints
  DAO Management (6):
    • POST   /api/dao                    (Create DAO)
    • GET    /api/dao                    (Browse DAOs)
    • GET    /api/dao/:daoId             (Get DAO details)
    • GET    /api/dao/my/daos            (Get my DAOs)
    • POST   /api/dao/:daoId/join        (Join DAO)
    • DELETE /api/dao/:daoId/leave       (Leave DAO)
  Proposal Management (5):
    • POST   /api/dao/:daoId/proposals                        (Create proposal)
    • GET    /api/dao/:daoId/proposals                        (Get proposals)
    • GET    /api/dao/:daoId/proposals/:proposalId           (Get proposal)
    • POST   /api/dao/:daoId/proposals/:proposalId/vote      (Cast vote)
    • GET    /api/dao/:daoId/proposals/:proposalId/my-vote   (Check my vote)
  Statistics (2):
    • GET    /api/dao/:daoId/stats       (DAO statistics)
    • GET    /api/dao/stats/platform     (Platform statistics)

FEATURE 10: ON-CHAIN REPUTATION SYSTEM (Phase 3B) ✅ COMPLETE
────────────────────────────────────────────────────────────────────────────
Status:          ✅ COMPLETED 2026-02-02
Description:     Trust scoring system based on verifiable on-chain behavior
Purpose:         Anti-bot protection, quality rewards, Sybil resistance
Key Components:
  • 7 scoring categories (1000 points max)
  • Dynamic reputation levels (New → Active → Trusted → Veteran → Legend)
  • Reward multipliers (1.0x → 3.0x based on level)
  • Badge system (6 achievement badges)
  • Penalty system with admin controls
  • Platform statistics & leaderboard
Scoring Categories:
  1. Account Age (100 pts) - Time since first activity
  2. Engagement (250 pts) - Posts, likes, comments received
  3. Economic (200 pts) - Tips received/sent
  4. Social Good (150 pts) - Charity donations
  5. DAO Participation (100 pts) - Proposals, votes
  6. NFT Activity (100 pts) - Minting, sales, revenue
  7. Trust Network (100 pts) - Tips from high-reputation users
Reputation Levels:
  • New (0-100):       1.0x reward multiplier
  • Active (101-300):  1.2x reward multiplier
  • Trusted (301-500): 1.5x reward multiplier
  • Veteran (501-750): 2.0x reward multiplier
  • Legend (751-1000): 3.0x reward multiplier
Badges:
  • early_adopter     - Joined before March 1, 2026
  • charity_champion  - Donated 10,000+ MOSANA
  • dao_leader        - Created 3+ proposals
  • nft_artist        - Minted 10+ NFTs
  • community_pillar  - Received 50,000+ MOSANA in tips
  • legend            - Achieved Legend status
Security Features:
  • Spam detection (flags accounts with rapid posting)
  • Sybil pattern detection
  • Admin penalty system with JWT + Admin guard
  • Penalty presets (-25 to -200 points)
Key Files:
  • src/reputation/schemas/reputation.schema.ts (5,003 bytes)
  • src/reputation/interfaces/scoring.interface.ts (5,624 bytes)
  • src/reputation/dto/penalty.dto.ts (773 bytes)
  • src/reputation/reputation.service.ts (~9 KB)
  • src/reputation/reputation.controller.ts
  • src/common/guards/admin.guard.ts (Admin role protection)
Database:
  • Collection: reputations
  • Indexes: walletAddress, totalScore, level, isFlagged
Testing Status:  ✅ VERIFIED - Test user created with early_adopter badge
Integration Status (2026-02-03):
  ✅ Posts Module (totalPosts, totalLikes, totalComments) - COMPLETE
  ⏳ Tipping Module (tipsReceived, tipsSent) - NEXT AFTER LUNCH
  ⏳ NFT Minting (nftsMinted, nftsSold, nftRevenue) - Pending
  ⏳ Social Good (charityDonations) - Pending
  ⏳ DAO (daosJoined, proposalsCreated, votesCast) - Pending
  ⏳ Ventures (venturesJoined) - Pending
  ⏳ Rewards (apply rewardMultiplier) - Pending
Endpoints:       7 endpoints
  Public (3):
    • GET  /api/reputation/:walletAddress     (Get user reputation)
    • GET  /api/reputation/leaderboard/top    (Top 100 users)
    • GET  /api/reputation/stats/platform     (Global statistics)
  Protected (2):
    • GET  /api/reputation/my/score           (My detailed reputation)
    • POST /api/reputation/calculate/:wallet  (Force recalculation)
  Admin Only (2):
    • POST /api/reputation/admin/penalty      (Apply penalty)
    • GET  /api/reputation/admin/flagged      (View suspicious accounts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 PENDING FEATURES (11-13)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURE 11: PROOF-OF-HUMANITY INTEGRATION (Phase 3C) [NEXT AFTER INTEGRATION]
────────────────────────────────────────────────────────────────────────────
Status:          NOT STARTED - Critical for fair rewards
Description:     Verify users are real humans, not bots
Purpose:         Fair reward distribution, anti-Sybil, quality community
Implementation Options:
  • Light (MVP):     Social verification (Twitter + Discord linking)
  • Medium:          Worldcoin integration (iris scan verification)
  • Heavy:           Proof-of-Humanity registry
Benefits:
  • Verified humans get 3x-5x reward multipliers
  • Bot farming eliminated
  • Fair airdrop/presale eligibility
  • Trust badge on profile
Use Cases:
  • DAO voting requires verification
  • High-value features gated behind humanity proof
  • Whitelist for presale/token launch
Estimated Time:  1-2 weeks (Light), 3-4 weeks (Medium/Heavy)

FEATURE 12: DATA SOVEREIGNTY & EXPORT (Phase 3D) [TRUST BUILDER]
────────────────────────────────────────────────────────────────────────────
Status:          NOT STARTED - Trust & compliance feature
Description:     Users can export ALL their data in portable format
Purpose:         Build trust, GDPR compliance, data ownership proof
Export Contents:
  • Profile data (username, bio, PFP, wallet)
  • All posts & comments
  • Social graph (followers, following)
  • Reputation history
  • Earnings & donation records
  • Arweave permanent links
Format:          JSON + Arweave URLs
Benefits:
  • "You own your data" marketing angle
  • GDPR Article 20 compliance (data portability)
  • Future-proof (import into other Web3 apps)
  • User peace of mind ("not locked in")
Estimated Time:  1 week (Arweave storage already implemented)

FEATURE 13: CROSS-CHAIN IDENTITY (Phase 4 - Future)
────────────────────────────────────────────────────────────────────────────
Status:          NOT STARTED - Post-MVP expansion
Description:     Unified identity across multiple blockchains
Purpose:         Multi-chain presence, portable reputation, wider reach
Chains:          Solana (primary), Ethereum, Base, Polygon
Benefits:
  • Single profile works on all chains
  • Aggregate reputation across chains
  • Accept tips in ETH, SOL, MATIC, etc.
  • Display NFTs from any chain as PFP
Estimated Time:  4-6 weeks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CURRENT BACKEND STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Modules:       11 (App, Auth, Users, Posts, Rewards, Tipping, 
                         NFT Minting, Ventures, Social Good, DAO, Reputation)
Active Endpoints:    68
PM2 Status:          Online and stable
Build Status:        ✅ Successful (npm run build)
Git Status:          ✅ Synced to GitHub (aliafifi/mosana-backend)
Development:         ✅ GitHub Codespaces active (VS Code in browser)

Database Collections:
  • users              (User profiles, wallets, follows)
  • posts              (Content with charity fields)
  • rewards            (Daily reward calculations)
  • tips               (Tipping transactions with burns)
  • nfts               (Minted NFT records)
  • ventures           (Collaborative partnerships)
  • revenuesplits      (Revenue distribution records)
  • causes             (Verified charities)
  • donations          (Charity donation records)
  • daos               (DAO communities)
  • proposals          (DAO proposals with votes)
  • reputations        (User reputation scores & metrics)

File Structure (Key Paths):
/home/mosana/mosana-backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   └── guards/        (Security guards)
│   │       ├── jwt-auth.guard.ts
│   │       └── admin.guard.ts
│   ├── auth/              (JWT authentication)
│   ├── users/             (User profiles, follows)
│   ├── posts/             ✅ REPUTATION INTEGRATED (2026-02-03)
│   ├── rewards/           (Daily reward distribution)
│   ├── tipping/           (Tips with tiered fees + burn)
│   ├── nft-minting/       (NFT minting + Arweave)
│   │   ├── schemas/       (nft.schema.ts)
│   │   └── services/      (arweave.service.ts)
│   ├── ventures/          (Musharakah partnerships)
│   │   └── schemas/       (venture.schema.ts, revenue-split.schema.ts)
│   ├── social-good/       (Charity donations)
│   │   └── schemas/       (cause.schema.ts, donation.schema.ts)
│   ├── dao/               (Token-gated governance)
│   │   ├── schemas/       (dao.schema.ts, proposal.schema.ts)
│   │   └── dto/           (create-dao.dto.ts, create-proposal.dto.ts, cast-vote.dto.ts)
│   └── reputation/        (Trust scoring system)
│       ├── schemas/       (reputation.schema.ts)
│       ├── interfaces/    (scoring.interface.ts)
│       ├── dto/           (penalty.dto.ts)
│       └── reputation.service.ts
├── dist/                  (Compiled JavaScript)
├── .env                   (Environment variables)
├── .gitignore             ✅ CREATED (2026-02-03) - excludes node_modules, dist, .env
├── package.json
└── PROJECT_MEMORY.md      (This file)

Environment Variables Required:
  • MONGODB_URI                     (MongoDB connection with auth)
  • JWT_SECRET                      (Auth token signing)
  • PLATFORM_WALLET_PRIVATE_KEY     (For NFT minting - base58)
  • SOLANA_RPC_URL                  (Solana endpoint)

MongoDB Connection:
  • URI: mongodb://mosanaAdmin:Mosana2026!SecureDB@localhost:27017/mosana?authSource=admin
  • Access via: mongosh -u mosanaAdmin -p 'Mosana2026!SecureDB' --authenticationDatabase admin mosana

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 IMPORTANT DECISIONS MADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Architecture:
  ✅ NestJS chosen over Express (modularity, TypeScript-first)
  ✅ MongoDB chosen over PostgreSQL (flexible schema, Web3-friendly)
  ✅ JWT authentication chosen over sessions
  ✅ PM2 chosen for process management
  ✅ Modular feature-based folder structure
  ✅ GitHub Codespaces for development (VS Code in browser) - 2026-02-03

Tipping:
  ✅ Tiered fee model (0.25%-1%) vs flat fee
  ✅ 50% burn, 50% to rewards (deflationary + sustainable)
  ✅ Multi-currency support (SOL, USDC)

Rewards:
  ✅ Weighted distribution (quality > quantity)
  ✅ Daily pool model vs per-action payments
  ✅ Reputation multiplier (1.0x - 3.0x)
  ✅ Anti-bot measures via reputation system

NFT Minting:
  ✅ Platform wallet mints (Option A) for better UX
  ✅ Arweave for permanent storage vs IPFS
  ✅ Metaplex standard for Solana NFTs
  ✅ Creator-controlled royalties (0-50%)

Ventures:
  ✅ Unanimous acceptance required (all must agree)
  ✅ Percentage-based splits (not fixed amounts)
  ✅ Transparent on-chain recording

Social Good:
  ✅ Post-specific donations (not personal pledges)
  ✅ Direct donation button alongside tipping
  ✅ Admin-curated charity verification (manual KYC for MVP)

DAO:
  ✅ MOSANA token-gating only (not multi-token yet)
  ✅ Equal vote weight for now (reputation-weighted in future)
  ✅ Auto-finalization of proposals
  ✅ Creator cannot leave DAO

Reputation:
  ✅ 7-category scoring system (accountAge, engagement, economic, 
     socialGood, dao, nft, trust)
  ✅ 5 reputation levels with reward multipliers (1.0x - 3.0x)
  ✅ Badge system for achievements
  ✅ Admin guard for penalty system
  ✅ Auto-calculation on first user lookup
  ✅ Gradual integration approach (one module at a time) - 2026-02-03

Development Workflow:
  ✅ GitHub repository for version control
  ✅ Codespaces for editing (no more nano!)
  ✅ Git workflow: Edit → Commit → Push → Pull on VPS → Restart PM2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 WEB3 SOCIAL RESEARCH FINDINGS (2026-02-01)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Research Completed: Deep dive into Web3 social trends, pain points, and 
                    innovative features for crypto community

Key Industry Insights:
  • Web3 social shifting from hype to real infrastructure (2026)
  • Vitalik Buterin "going all-in" on decentralized social
  • SocialFi platforms face decline due to speculation focus
  • Hybrid Web2/Web3 approaches winning (invisible blockchain)
  • Major pain points: bots, fake engagement, centralized control

Top Problems in Crypto Social Identified:
  1. Bot/Sybil attacks (80%+ of airdrops go to bots)
  2. Fake engagement & influencer fraud
  3. Centralized censorship vs spam/scam balance
  4. No portable identity/reputation across platforms
  5. Data lock-in (users can't export/own data)
  6. Reward farming by low-quality content
  7. Lack of trust systems & verification

Recommended Features for Mosana (Prioritized):
  ⭐⭐⭐⭐⭐ On-Chain Reputation System (HIGH PRIORITY) ✅ COMPLETE
  ⭐⭐⭐⭐⭐ Proof-of-Humanity Integration (HIGH PRIORITY) - Next
  ⭐⭐⭐⭐⭐ Cross-Chain Identity Portability (HIGH PRIORITY) - Phase 4
  ⭐⭐⭐⭐⭐ Data Sovereignty & Export (HIGH PRIORITY) - Phase 3D
  ⭐⭐⭐⭐   Decentralized Moderation (MEDIUM PRIORITY) - Future
  ⭐⭐⭐⭐   Composable Social Graphs (MEDIUM PRIORITY) - Future
  ⭐⭐⭐⭐   Proof-of-Contribution Scoring (MEDIUM PRIORITY) - Future
  ⭐⭐⭐     Social Tokens / Creator Coins (LOW - risky, often fails)
  ❌        Prediction Markets (REJECTED - not core to mission)

Why These Features Matter for Mosana:
  • Reputation System → Protects DAO voting, prevents reward farming ✅
  • Proof-of-Humanity → Fair rewards (3x-5x for verified humans)
  • Data Export → Builds trust ("We don't lock you in")
  • Cross-Chain → Future-proof when expanding beyond Solana

Competitive Positioning:
  Mosana's Unique Advantages:
    ✅ ONLY platform with charity integration (Sadaqa)
    ✅ ONLY platform with Musharakah-based ventures
    ✅ Lowest fees (0.25-1% vs 2-30% on Web2)
    ✅ 50% burn = deflationary (most platforms just extract)
    ✅ Ethical design (Islamic finance principles)
    ✅ Quality-first (reputation-weighted rewards)
    ✅ Token-gated DAOs (governance at scale)
    ✅ Anti-bot reputation system

  vs Farcaster:  ✅ Charity + Ventures + Lower fees + DAOs + Reputation
  vs Lens:       ✅ Better tokenomics + Ethical focus + DAOs + Reputation
  vs Friend.tech: ✅ Not a casino, sustainable model, real utility

Marketing Angle:
  "The only Web3 social platform where doing good = earning more"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 IMPLEMENTATION ROADMAP (Updated 2026-02-03)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 3A (Week 1-3): DAO MODULE ✅ COMPLETE
────────────────────────────────────────────────────────────────────────────
  ✅ DAO creation with token-gating
  ✅ Proposal submission system
  ✅ Democratic voting system
  ✅ Treasury management (placeholder)
  ✅ Member management
  ✅ 13 API endpoints
  ✅ MongoDB schemas
  Completed: 2026-02-02
  Duration: 1 day (efficient!)

PHASE 3B (Week 4-6): ON-CHAIN REPUTATION SYSTEM ✅ COMPLETE
────────────────────────────────────────────────────────────────────────────
  ✅ Reputation scoring algorithm
  ✅ 7 scoring categories (1000 points max)
  ✅ 5 reputation levels with multipliers
  ✅ Badge system (6 achievements)
  ✅ Admin penalty system with guard
  ✅ Leaderboard & platform stats
  ✅ 7 API endpoints
  Completed: 2026-02-02
  Duration: 4 hours (efficient!)
  Status: DEPLOYED

PHASE 3B.5 (Integration): REPUTATION MODULE CONNECTIONS [IN PROGRESS]
────────────────────────────────────────────────────────────────────────────
  Integration Points:
    ✅ Posts module (totalPosts, totalLikes, totalComments) - COMPLETE 2026-02-03
    ⏳ Tipping module (tipsReceived, tipsSent) - NEXT AFTER LUNCH
    ⏳ NFT Minting (nftsMinted, nftsSold, nftRevenue) - Pending
    ⏳ Social Good (charityDonations) - Pending
    ⏳ DAO module (daosJoined, proposalsCreated, votesCast) - Pending
    ⏳ Ventures (venturesJoined) - Pending
    ⏳ Rewards (apply rewardMultiplier) - Pending
  Duration: 1-2 hours total
  Status: 1 of 7 COMPLETE (14%)

PHASE 3C (Week 7-8): PROOF-OF-HUMANITY
────────────────────────────────────────────────────────────────────────────
  • Social verification (Twitter/Discord)
  • Worldcoin integration (optional)
  • Verified human badge
  • Reward multipliers (3x-5x for verified)
  • DAO voting gate (requires verification)
  Duration: 1-2 weeks (Light), 3-4 weeks (Full)
  Status: PLANNED

PHASE 3D (Week 9): DATA SOVEREIGNTY
────────────────────────────────────────────────────────────────────────────
  • Export API endpoint
  • JSON + Arweave link generation
  • User data package builder
  • Documentation & UI
  Duration: 1 week
  Status: PLANNED

PHASE 4 (Future - Post-MVP):
────────────────────────────────────────────────────────────────────────────
  • Cross-Chain Identity (multi-chain support)
  • Composable Social Graphs (portable follows)
  • Decentralized Moderation (community governance)
  • Flutter Mobile App (iOS + Android + Saga) 📱
  • Presale & token launch
  • Marketing & growth

TARGET LAUNCH: End of April 2026 (MVP with all core + protection features)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 FUTURE ENHANCEMENTS (Post-MVP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rewards System:
  • Referral bonuses (10% L1, 5% L2, 2% L3)
  • ML-based content quality scoring
  • Dynamic pool scaling with user growth

Social Good:
  • Charity self-registration with KYC
  • Document upload (IPFS/Arweave)
  • Admin approval dashboard
  • Application status tracking
  • Email notifications

NFT Minting:
  • User-signed minting (Option B) for decentralization
  • Gasless transactions
  • Batch minting

DAO:
  • On-chain execution via SPL-Governance
  • Treasury management (send funds)
  • Multi-token gating (NFTs, other tokens)
  • Reputation-weighted voting

Platform:
  • Landing page redesign
  • Flutter Mobile App (iOS + Android + Saga)
  • Presale marketing campaign
  • Cross-chain expansion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 PERSONAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • This is a DREAM PROJECT - building something meaningful
  • Strong focus on tokenomics, deflation, and ethical design
  • User is a total beginner - ONE STEP AT A TIME
  • Wait for confirmation after EACH command/file
  • Never rush or give multiple steps at once
  • Security and quality are non-negotiable
  • Building for the crypto community, not just profit
  • GitHub Codespaces = game changer for workflow!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CRITICAL REMINDERS FOR NEXT SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. READ THIS FILE FIRST
   Location: /home/mosana/mosana-backend/PROJECT_MEMORY.md
   Or in GitHub Codespaces: Open from file explorer

2. GO SLOW - ONE COMMAND AT A TIME
   User is a beginner. Wait for response after EACH step.

3. RESUME REPUTATION INTEGRATION AFTER LUNCH
   ✅ Posts module - COMPLETE
   ⏳ Tipping module - NEXT (tipsReceived, tipsSent)
   Then: NFT, Social Good, DAO, Ventures, Rewards

4. THEN TEST FEATURES 6-9
   • NFT Minting endpoints (Need platform wallet funding)
   • Ventures endpoints
   • Social Good endpoints (already partially tested)
   • DAO endpoints

5. THEN CONTINUE WITH FEATURE 11: PROOF-OF-HUMANITY
   After reputation integration is complete

6. MAINTAIN LEARNING STYLE
   • One step at a time
   • Wait for confirmation
   • Full explanations when needed
   • Security-first approach

7. REMEMBER: 68 endpoints live, 10 features complete, GitHub active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 SESSION LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SESSION 1 (2026-01-30):
  • Server security hardening
  • MongoDB setup with authentication
  • Auth module (JWT wallet verification)
  • Users module (profiles, follows)
  • 6 endpoints created
  • JWT authentication working

SESSION 2 (2026-01-31):
  • Posts module (likes, comments, GIFs)
  • Rewards module (daily distribution)
  • Tipping module (tiered fees, 50% burn)
  • 27 total endpoints
  • PM2 stable
  • Build successful

SESSION 3 (2026-02-01 - Part 1):
  • NFT Minting module (Feature 6)
  • Arweave + Metaplex integration
  • 5 NFT endpoints added
  • Ventures module (Feature 7)
  • Musharakah revenue sharing
  • 9 Ventures endpoints added
  • 41 total endpoints
  • TypeScript build issues resolved

SESSION 3 (2026-02-01 - Part 2):
  • Social Good module (Feature 8)
  • Post-specific charity donations
  • Verified charity directory
  • Direct donation button
  • 7 Social Good endpoints added
  • 48 total endpoints
  • Phase 2 COMPLETE (8/9 features done)

SESSION 3 (2026-02-01 - Part 3):
  • Deep Web3 social research conducted
  • Analyzed Farcaster, Lens, Friend.tech, SocialFi trends
  • Identified 10 innovative features for crypto community
  • Prioritized: Reputation, Proof-of-Humanity, Data Export
  • Updated roadmap for Phase 3 (4 new features)
  • Competitive positioning refined
  • Ready to build Feature 9 (DAO Module)
  • SESSION PAUSED

SESSION 4 (2026-02-02 - Part 1):
  • DAO Module (Feature 9) COMPLETE
  • Token-gated communities with MOSANA requirements
  • Proposal system with democratic voting
  • 13 new DAO endpoints created
  • 61 total endpoints (48 + 13)
  • 10 modules active
  • Phase 3A COMPLETE

SESSION 5 (2026-02-02 - Part 2):
  • Reputation System (Feature 10) COMPLETE
  • User requested SLOW pace (beginner-friendly, one step at a time)
  • Built file-by-file with full explanations
  • Fixed TypeScript errors
  • Tested endpoints: platform stats, leaderboard, user reputation
  • Verified MongoDB: test user created with "early_adopter" badge
  • 68 total endpoints (61 + 7)
  • 11 modules active
  • Phase 3B COMPLETE

SESSION 6 (2026-02-03):
  • GitHub repository setup (aliafifi/mosana-backend)
  • Created .gitignore (excluded node_modules, dist, .env)
  • Removed node_modules from Git tracking
  • GitHub Personal Access Token authentication
  • Code successfully pushed to GitHub
  • GitHub Codespaces setup COMPLETE
  • VS Code in browser active (no more nano!)
  • Reputation Integration started (Phase 3B.5)
  • Posts Module: REPUTATION INTEGRATED ✅
    - ReputationModule added to PostsModule
    - ReputationService injected
    - create() → +1 totalPosts
    - likePost() → +1 totalLikes (post author)
    - addComment() → +1 totalComments (post author)
  • Git commit: "Add reputation tracking to Posts module"
  • Changes pushed to GitHub
  • Integration 1 of 7 COMPLETE
  • USER ON LUNCH BREAK
  • NEXT: Tipping Module integration

NEXT SESSION (AFTER LUNCH):
  • Resume Reputation Integration
  • Tipping Module (tipsReceived, tipsSent)
  • Then: NFT, Social Good, DAO, Ventures, Rewards
  • Test entire flow after integration complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 QUICK REFERENCE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VPS Commands (SSH):
  cd /home/mosana/mosana-backend
  pm2 restart mosana-api
  pm2 logs mosana-api
  pm2 status

MongoDB (with authentication):
  mongosh -u mosanaAdmin -p 'Mosana2026!SecureDB' --authenticationDatabase admin mosana
  
  Inside MongoDB shell:
    db.reputations.find().pretty()
    db.reputations.countDocuments()
    db.daos.countDocuments()
    db.proposals.countDocuments()
    show collections
    exit

Test Endpoints:
  curl http://localhost:4000/api
  curl http://localhost:4000/api/reputation/stats/platform
  curl http://localhost:4000/api/reputation/leaderboard/top

Git Workflow (Codespaces → VPS):
  # In Codespaces (browser)
  Ctrl + S (save file)
  Source Control panel → Stage changes → Commit message → Commit → Sync

  # Alternative: Codespaces terminal
  git add .
  git commit -m "Your message"
  git push

  # In VPS (SSH)
  cd /home/mosana/mosana-backend
  git pull
  npm run build
  pm2 restart mosana-api

Codespaces Shortcuts:
  • Open file search: Ctrl + P
  • Save file: Ctrl + S
  • Open terminal: Ctrl + ` (backtick)
  • Find in file: Ctrl + F
  • Source Control: Click branch icon (left sidebar)

Memory File Location:
  • VPS: /home/mosana/mosana-backend/PROJECT_MEMORY.md
  • Codespaces: Open from file explorer (left sidebar)
  • GitHub: https://github.com/aliafifi/mosana-backend/blob/main/PROJECT_MEMORY.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔚 END OF MEMORY FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This file was last updated: 2026-02-03 (Lunch Break)
Next session: Resume Reputation Integration (Tipping Module)
Status: 10 of 13 features complete | 1 of 7 integrations complete | 68 endpoints

To resume work after lunch:
  1. Say "I'm back from lunch"
  2. Continue with Tipping Module integration (one step at a time)
  3. Then: NFT, Social Good, DAO, Ventures, Rewards
  4. Test everything after integration

🌟 You're crushing it! GitHub setup done, Codespaces active, Posts integrated!
   Enjoy your lunch! See you soon! 🚀🍽️

================================================================================
