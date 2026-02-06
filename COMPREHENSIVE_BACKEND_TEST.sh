#!/bin/bash

################################################################################
# MOSANA BACKEND COMPREHENSIVE TEST SUITE
# Created: 2026-02-06
# Purpose: Test all 77 endpoints before Flutter frontend development
# Backend Path: /home/mosana/webapp
################################################################################

BASE_URL="http://localhost:4000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test result function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local data=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "  ${YELLOW}$method${NC} $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$endpoint")
    elif [ "$method" = "PUT" ] && [ -n "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "  ${GREEN}✓ PASSED${NC} (Status: $response)\n"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $response)\n"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "================================================================================"
echo "                    MOSANA BACKEND COMPREHENSIVE TEST"
echo "================================================================================"
echo "Backend URL: $BASE_URL"
echo "Testing all 77 endpoints across 12 modules"
echo "Started: $(date)"
echo "================================================================================"
echo ""

################################################################################
# 1. BASIC API TEST (1 endpoint)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 1: BASIC API (1 endpoint)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/" "200" "Root API endpoint"

################################################################################
# 2. AUTH MODULE (1 endpoint)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 2: AUTH - Wallet Authentication (1 endpoint)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Login requires wallet signature - expect 400/401 without proper data
test_endpoint "POST" "/auth/login" "400" "Login endpoint (missing wallet data)"

################################################################################
# 3. USERS MODULE (6 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 3: USERS - Profile Management (6 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/users/me" "401" "Get my profile (requires auth)"
test_endpoint "GET" "/users/TestWallet123" "404" "Get user by wallet (non-existent)"
test_endpoint "PUT" "/users/profile" "401" "Update profile (requires auth)"
test_endpoint "POST" "/users/nft-pfp" "401" "Set NFT profile picture (requires auth)"
test_endpoint "POST" "/users/follow/TestWallet" "401" "Follow user (requires auth)"
test_endpoint "DELETE" "/users/follow/TestWallet" "401" "Unfollow user (requires auth)"

################################################################################
# 4. POSTS MODULE (10 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 4: POSTS - Content Creation (10 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/posts" "401" "Create post (requires auth)"
test_endpoint "GET" "/posts" "200" "Get all posts (public)"
test_endpoint "GET" "/posts/feed" "401" "Get personalized feed (requires auth)"
test_endpoint "GET" "/posts/trending" "200" "Get trending posts (public)"
test_endpoint "GET" "/posts/123456" "404" "Get post by ID (non-existent)"
test_endpoint "GET" "/posts/user/TestWallet" "200" "Get posts by user (public)"
test_endpoint "POST" "/posts/123/like" "401" "Like post (requires auth)"
test_endpoint "DELETE" "/posts/123/like" "401" "Unlike post (requires auth)"
test_endpoint "POST" "/posts/123/comments" "401" "Add comment (requires auth)"
test_endpoint "DELETE" "/posts/123" "401" "Delete post (requires auth)"

################################################################################
# 5. REWARDS MODULE (3 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 5: REWARDS - Daily Token Distribution (3 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/rewards/today" "401" "Get today's engagement (requires auth)"
test_endpoint "GET" "/rewards/history" "401" "Get rewards history (requires auth)"
test_endpoint "GET" "/rewards/tokenomics" "200" "Get tokenomics info (public)"

################################################################################
# 6. TIPPING MODULE (7 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 6: TIPPING - Peer-to-Peer Tips (7 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/tipping" "401" "Create tip (requires auth)"
test_endpoint "GET" "/tipping/sent" "401" "Get sent tips (requires auth)"
test_endpoint "GET" "/tipping/received" "401" "Get received tips (requires auth)"
test_endpoint "GET" "/tipping/post/123" "200" "Get tips for post (public)"
test_endpoint "GET" "/tipping/stats" "401" "Get tipping stats (requires auth)"
test_endpoint "GET" "/tipping/preview/1000" "200" "Preview tip fee (public)"
test_endpoint "GET" "/tipping/fee-tiers" "200" "Get fee tiers (public)"

################################################################################
# 7. NFT MINTING MODULE (5 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 7: NFT MINTING - Immortal Posts (5 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/nft/mint/123" "401" "Mint post as NFT (requires auth)"
test_endpoint "GET" "/nft/TestMintAddress" "404" "Get NFT by mint address (non-existent)"
test_endpoint "GET" "/nft/user/TestWallet" "200" "Get user NFTs (public)"
test_endpoint "GET" "/nft/check/123" "200" "Check if post is minted (public)"
test_endpoint "GET" "/nft/stats/platform" "200" "Get platform NFT stats (public)"

################################################################################
# 8. VENTURES MODULE (9 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 8: VENTURES - Musharakah Partnerships (9 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/ventures" "401" "Create venture (requires auth)"
test_endpoint "PUT" "/ventures/123/accept" "401" "Accept venture (requires auth)"
test_endpoint "PUT" "/ventures/123/reject" "401" "Reject venture (requires auth)"
test_endpoint "GET" "/ventures/post/123" "404" "Get venture for post (non-existent)"
test_endpoint "GET" "/ventures/my-ventures" "401" "Get my ventures (requires auth)"
test_endpoint "GET" "/ventures/invitations" "401" "Get venture invitations (requires auth)"
test_endpoint "GET" "/ventures/123/splits" "404" "Get venture splits (non-existent)"
test_endpoint "GET" "/ventures/earnings" "401" "Get venture earnings (requires auth)"
test_endpoint "GET" "/ventures/stats" "401" "Get venture stats (requires auth)"

################################################################################
# 9. SOCIAL GOOD MODULE (7 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 9: SOCIAL GOOD - Sadaqa Engine (7 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/social-good/causes" "401" "Create charity (admin only)"
test_endpoint "GET" "/social-good/causes" "200" "Get all charities (public)"
test_endpoint "GET" "/social-good/causes/123" "404" "Get charity by ID (non-existent)"
test_endpoint "POST" "/social-good/donate" "401" "Make donation (requires auth)"
test_endpoint "GET" "/social-good/donations/my-donations" "401" "Get my donations (requires auth)"
test_endpoint "GET" "/social-good/causes/123/donations" "200" "Get charity donations (public)"
test_endpoint "GET" "/social-good/stats" "200" "Get charity stats (public)"

################################################################################
# 10. DAO MODULE (13 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 10: DAO - Token-Gated Communities (13 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/dao" "401" "Create DAO (requires auth)"
test_endpoint "GET" "/dao" "200" "Browse DAOs (public)"
test_endpoint "GET" "/dao/123" "404" "Get DAO details (non-existent)"
test_endpoint "GET" "/dao/my/daos" "401" "Get my DAOs (requires auth)"
test_endpoint "POST" "/dao/123/join" "401" "Join DAO (requires auth)"
test_endpoint "DELETE" "/dao/123/leave" "401" "Leave DAO (requires auth)"
test_endpoint "POST" "/dao/123/proposals" "401" "Create proposal (requires auth)"
test_endpoint "GET" "/dao/123/proposals" "404" "Get proposals (non-existent DAO)"
test_endpoint "GET" "/dao/123/proposals/456" "404" "Get proposal (non-existent)"
test_endpoint "POST" "/dao/123/proposals/456/vote" "401" "Cast vote (requires auth)"
test_endpoint "GET" "/dao/123/proposals/456/my-vote" "401" "Check my vote (requires auth)"
test_endpoint "GET" "/dao/123/stats" "404" "Get DAO stats (non-existent)"
test_endpoint "GET" "/dao/stats/platform" "200" "Get platform DAO stats (public)"

################################################################################
# 11. REPUTATION MODULE (7 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 11: REPUTATION - Trust Scoring (7 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/reputation/TestWallet123" "200" "Get user reputation (public)"
test_endpoint "GET" "/reputation/leaderboard/top" "200" "Get leaderboard (public)"
test_endpoint "GET" "/reputation/stats/platform" "200" "Get platform stats (public)"
test_endpoint "GET" "/reputation/my/score" "401" "Get my detailed reputation (requires auth)"
test_endpoint "POST" "/reputation/calculate/TestWallet" "401" "Force recalculation (requires auth)"
test_endpoint "POST" "/reputation/admin/penalty" "401" "Apply penalty (admin only)"
test_endpoint "GET" "/reputation/admin/flagged" "401" "Get flagged accounts (admin only)"

################################################################################
# 12. VERIFICATION MODULE (6 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 12: VERIFICATION - Proof of Humanity (6 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/verification/providers" "200" "List verification types (public)"
test_endpoint "GET" "/verification/TestWallet/status" "200" "Check verification status (public)"
test_endpoint "POST" "/verification/TestWallet/refresh" "200" "Refresh from blockchain (public)"
test_endpoint "GET" "/verification/stats/platform" "200" "Get verification stats (public)"
test_endpoint "POST" "/verification/TestWallet/add" "401" "Add verification (admin only)"
test_endpoint "DELETE" "/verification/TestWallet/revoke" "401" "Revoke verification (admin only)"

################################################################################
# 13. EXPORT MODULE (3 endpoints)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}MODULE 13: EXPORT - Data Sovereignty (3 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/export/request" "401" "Request data export (requires auth)"
test_endpoint "GET" "/export/status/123" "401" "Check export status (requires auth)"
test_endpoint "GET" "/export/history" "401" "Get export history (requires auth)"

################################################################################
# FINAL SUMMARY
################################################################################
echo ""
echo "================================================================================"
echo "                           TEST SUMMARY"
echo "================================================================================"
echo -e "Total Tests:   ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed:        ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:        ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Backend is ready for Flutter development!${NC}"
else
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${YELLOW}⚠️  Pass Rate: $PASS_RATE%${NC}"
    echo -e "${YELLOW}Some tests failed - review failures above${NC}"
fi

echo ""
echo "Completed: $(date)"
echo "================================================================================"
