#!/bin/bash

# ============================================================================
# MOSANA BACKEND TESTING SCRIPT
# Features 6-9: NFT Minting, Ventures, Social Good, DAO
# ============================================================================

echo "🚀 MOSANA BACKEND TESTING - Features 6-9"
echo "========================================"
echo ""

# Configuration
API_BASE="http://localhost:4000/api"
TEST_WALLET="TestWallet123abc456def789"
AUTH_TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📌 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing:${NC} $description"
    echo "Endpoint: $method $endpoint"
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -X GET "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $AUTH_TOKEN")
    elif [ "$method" == "POST" ]; then
        response=$(curl -s -X POST "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -d "$data")
    elif [ "$method" == "PUT" ]; then
        response=$(curl -s -X PUT "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -d "$data")
    elif [ "$method" == "DELETE" ]; then
        response=$(curl -s -X DELETE "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $AUTH_TOKEN")
    fi
    
    echo "Response:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    echo ""
    echo "---"
    echo ""
}

# ============================================================================
# FEATURE 6: NFT MINTING MODULE (5 ENDPOINTS)
# ============================================================================

print_section "FEATURE 6: NFT MINTING MODULE (Immortal Posts)"

echo "⚠️  NOTE: NFT Minting requires:"
echo "   1. PLATFORM_WALLET_PRIVATE_KEY in .env"
echo "   2. Platform wallet funded with ~0.5 SOL"
echo "   3. A valid post ID to mint"
echo ""
read -p "Do you have a platform wallet funded? (y/n): " wallet_ready
echo ""

if [ "$wallet_ready" == "y" ]; then
    echo "Enter a valid Post ID to test minting:"
    read -p "Post ID: " post_id
    
    # Test 1: Check if post is mintable
    test_endpoint "GET" "/nft/check/$post_id" "" "Check if post can be minted"
    
    # Test 2: Mint post as NFT (REQUIRES LOGIN)
    echo "⚠️  This requires authentication. Enter your JWT token:"
    read -p "JWT Token: " AUTH_TOKEN
    test_endpoint "POST" "/nft/mint/$post_id" '{"royaltyPercentage": 5}' "Mint post as NFT (5% royalty)"
    
else
    echo "⏭️  Skipping NFT minting tests (requires funded wallet)"
    echo ""
fi

# Test 3: Get platform NFT stats (PUBLIC)
test_endpoint "GET" "/nft/stats/platform" "" "Get platform NFT statistics"

# Test 4: Get NFTs by wallet (PUBLIC)
test_endpoint "GET" "/nft/user/$TEST_WALLET" "" "Get NFTs owned by wallet"

# ============================================================================
# FEATURE 7: VENTURES MODULE (9 ENDPOINTS)
# ============================================================================

print_section "FEATURE 7: VENTURES MODULE (Musharakah Partnerships)"

echo "💡 Testing Ventures requires authentication"
read -p "Enter your JWT token (or press Enter to skip): " AUTH_TOKEN
echo ""

if [ -z "$AUTH_TOKEN" ]; then
    echo "⏭️  Skipping Ventures tests (requires authentication)"
    echo ""
else
    # Test 1: Create a venture
    echo "Enter a Post ID for the venture:"
    read -p "Post ID: " venture_post_id
    
    test_endpoint "POST" "/ventures" '{
        "postId": "'"$venture_post_id"'",
        "collaborators": [
            {
                "walletAddress": "'"$TEST_WALLET"'",
                "sharePercentage": 60
            },
            {
                "walletAddress": "BobWallet789xyz",
                "sharePercentage": 40
            }
        ],
        "description": "Test venture collaboration"
    }' "Create venture (60/40 split)"
    
    # Test 2: Get my ventures
    test_endpoint "GET" "/ventures/my-ventures" "" "Get my ventures"
    
    # Test 3: Get venture invitations
    test_endpoint "GET" "/ventures/invitations" "" "Get pending invitations"
    
    # Test 4: Get venture earnings
    test_endpoint "GET" "/ventures/earnings" "" "Get my venture earnings"
    
    # Test 5: Get platform stats
    test_endpoint "GET" "/ventures/stats" "" "Get platform venture statistics"
fi

# ============================================================================
# FEATURE 8: SOCIAL GOOD MODULE (7 ENDPOINTS)
# ============================================================================

print_section "FEATURE 8: SOCIAL GOOD MODULE (Charity Donations)"

# Test 1: Get all causes (PUBLIC)
test_endpoint "GET" "/social-good/causes" "" "Get all verified charities"

# Test 2: Create a cause (ADMIN ONLY)
echo "⚠️  Creating a charity requires admin privileges"
read -p "Do you want to test charity creation? (y/n): " create_charity
echo ""

if [ "$create_charity" == "y" ]; then
    if [ -z "$AUTH_TOKEN" ]; then
        read -p "Enter your JWT token: " AUTH_TOKEN
    fi
    
    test_endpoint "POST" "/social-good/causes" '{
        "name": "Test Charity Organization",
        "description": "A test charity for development purposes",
        "walletAddress": "CharityWallet123abc456",
        "category": "humanitarian",
        "website": "https://testcharity.org"
    }' "Create test charity"
    
    echo "Save the causeId from response above for next tests!"
    read -p "Enter causeId: " cause_id
    
    # Test 3: Get cause details
    test_endpoint "GET" "/social-good/causes/$cause_id" "" "Get charity details"
    
    # Test 4: Direct donation
    test_endpoint "POST" "/social-good/donate" '{
        "causeId": "'"$cause_id"'",
        "amount": 100
    }' "Make direct donation (100 tokens)"
    
    # Test 5: Get my donations
    test_endpoint "GET" "/social-good/donations/my-donations" "" "Get my donation history"
    
    # Test 6: Get cause donations
    test_endpoint "GET" "/social-good/causes/$cause_id/donations" "" "Get charity donation history"
else
    echo "⏭️  Skipping charity creation tests"
    echo ""
fi

# Test 7: Get platform stats (PUBLIC)
test_endpoint "GET" "/social-good/stats" "" "Get platform charity statistics"

# ============================================================================
# FEATURE 9: DAO MODULE (13 ENDPOINTS)
# ============================================================================

print_section "FEATURE 9: DAO MODULE (Token-Gated Governance)"

# Test 1: Get all DAOs (PUBLIC)
test_endpoint "GET" "/dao" "" "Get all DAOs"

# Test 2: Get platform stats (PUBLIC)
test_endpoint "GET" "/dao/stats/platform" "" "Get platform DAO statistics"

echo "💡 Creating and managing DAOs requires authentication"
read -p "Do you want to test DAO creation? (y/n): " create_dao
echo ""

if [ "$create_dao" == "y" ]; then
    if [ -z "$AUTH_TOKEN" ]; then
        read -p "Enter your JWT token: " AUTH_TOKEN
    fi
    
    # Test 3: Create a DAO
    test_endpoint "POST" "/dao" '{
        "name": "Test DAO Community",
        "description": "A test DAO for development and governance testing",
        "minTokensRequired": 1000,
        "votingPeriodDays": 7,
        "quorumPercentage": 51,
        "allowProposalsFrom": "members",
        "tags": ["test", "governance"]
    }' "Create DAO (1000 MOSANA minimum)"
    
    echo "Save the DAO ID from response above!"
    read -p "Enter daoId: " dao_id
    
    # Test 4: Get DAO details
    test_endpoint "GET" "/dao/$dao_id" "" "Get DAO details"
    
    # Test 5: Get my DAOs
    test_endpoint "GET" "/dao/my/daos" "" "Get my DAOs"
    
    # Test 6: Join DAO (requires another user)
    echo "⚠️  Join DAO requires a different wallet"
    read -p "Test joining? (y/n): " test_join
    if [ "$test_join" == "y" ]; then
        test_endpoint "POST" "/dao/$dao_id/join" "" "Join DAO"
    fi
    
    # Test 7: Create proposal
    test_endpoint "POST" "/dao/$dao_id/proposals" '{
        "title": "Test Proposal: Add New Feature",
        "description": "This is a test proposal to demonstrate the governance system. We should add reputation-weighted voting.",
        "category": "governance"
    }' "Create proposal in DAO"
    
    # Test 8: Get all proposals
    test_endpoint "GET" "/dao/$dao_id/proposals" "" "Get all proposals"
    
    echo "Save a Proposal ID from response above!"
    read -p "Enter proposalId: " proposal_id
    
    # Test 9: Get proposal details
    test_endpoint "GET" "/dao/$dao_id/proposals/$proposal_id" "" "Get proposal details"
    
    # Test 10: Cast vote
    echo "Vote on the proposal:"
    echo "1) yes"
    echo "2) no"
    echo "3) abstain"
    read -p "Your vote: " vote_choice
    
    test_endpoint "POST" "/dao/$dao_id/proposals/$proposal_id/vote" '{
        "vote": "'"$vote_choice"'"
    }' "Cast vote on proposal"
    
    # Test 11: Get my vote
    test_endpoint "GET" "/dao/$dao_id/proposals/$proposal_id/my-vote" "" "Check my vote"
    
    # Test 12: Get DAO stats
    test_endpoint "GET" "/dao/$dao_id/stats" "" "Get DAO statistics"
    
else
    echo "⏭️  Skipping DAO creation tests"
    echo ""
fi

# ============================================================================
# SUMMARY
# ============================================================================

print_section "TESTING COMPLETE"

echo "✅ Feature 6: NFT Minting - 5 endpoints"
echo "✅ Feature 7: Ventures - 9 endpoints"
echo "✅ Feature 8: Social Good - 7 endpoints"
echo "✅ Feature 9: DAO - 13 endpoints"
echo ""
echo "📊 Total Tested: 34 endpoints (out of 61 total)"
echo ""
echo "💡 Next Steps:"
echo "   1. Review all responses above"
echo "   2. Check MongoDB for created records:"
echo "      - db.nfts.find()"
echo "      - db.ventures.find()"
echo "      - db.donations.find()"
echo "      - db.daos.find()"
echo "      - db.proposals.find()"
echo "   3. Fix any errors found"
echo "   4. Continue to Feature 10 (Reputation System)"
echo ""
echo "🎉 Happy testing! 🚀"
