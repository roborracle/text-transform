#!/bin/bash
# Text Transform - Railway Deployment Script
# Usage: ./scripts/deploy.sh [--skip-tests]

set -e

echo "=========================================="
echo "Text Transform - Railway Deployment"
echo "=========================================="

SKIP_TESTS=false
if [ "$1" == "--skip-tests" ]; then
  SKIP_TESTS=true
  echo "Skipping tests (--skip-tests flag)"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pre-flight checks
echo -e "\n${YELLOW}Step 1: Pre-flight checks${NC}"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
  echo -e "${RED}Railway CLI not found. Install with: npm install -g @railway/cli${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Railway CLI installed${NC}"

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
  echo -e "${RED}Not logged in to Railway. Run: railway login${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Logged in to Railway${NC}"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}Warning: Uncommitted changes detected${NC}"
  git status --short
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
echo -e "${GREEN}✓ Git status checked${NC}"

# Step 2: Run tests (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
  echo -e "\n${YELLOW}Step 2: Running tests${NC}"
  npm test
  echo -e "${GREEN}✓ Tests passed${NC}"
else
  echo -e "\n${YELLOW}Step 2: Tests skipped${NC}"
fi

# Step 3: Build verification
echo -e "\n${YELLOW}Step 3: Building for production${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

# Step 4: Lint check
echo -e "\n${YELLOW}Step 4: Running lint${NC}"
npm run lint || true
echo -e "${GREEN}✓ Lint check completed${NC}"

# Step 5: Deploy to Railway
echo -e "\n${YELLOW}Step 5: Deploying to Railway${NC}"
railway up

echo -e "\n${GREEN}=========================================="
echo "Deployment complete!"
echo "==========================================${NC}"

# Show deployment URL
echo -e "\nView your deployment:"
echo "  railway open"
echo ""
echo "View logs:"
echo "  railway logs"
echo ""
echo "Test endpoints:"
echo "  curl <your-url>/api/health"
echo "  curl <your-url>/api/tools"
