#!/bin/bash

echo "🧪 Simple Multitenancy Test"
echo "=============================="

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start it with: cd backend && npm run start:dev"
    exit 1
fi

# Test 1: Check if organizations endpoint exists
echo ""
echo "📝 Test 1: Checking organizations endpoint..."
ORG_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3000/organizations)
if [ "$ORG_RESPONSE" = "401" ] || [ "$ORG_RESPONSE" = "200" ]; then
    echo "✅ Organizations endpoint is accessible (HTTP $ORG_RESPONSE)"
else
    echo "❌ Organizations endpoint failed (HTTP $ORG_RESPONSE)"
fi

# Test 2: Check if we can get the default organization
echo ""
echo "📝 Test 2: Checking default organization..."
DEFAULT_ORG=$(curl -s http://localhost:3000/organizations | jq -r '.[0].id' 2>/dev/null)
if [ "$DEFAULT_ORG" != "null" ] && [ "$DEFAULT_ORG" != "" ]; then
    echo "✅ Default organization found (ID: $DEFAULT_ORG)"
else
    echo "❌ No default organization found"
fi

# Test 3: Check database schema
echo ""
echo "📝 Test 3: Checking database schema..."
cd /home/angie/Sites/gapanalysis/backend
if npx prisma db pull > /dev/null 2>&1; then
    echo "✅ Database schema is accessible"
else
    echo "❌ Database schema check failed"
fi

# Test 4: Check if migration was applied
echo ""
echo "📝 Test 4: Checking if multitenancy migration was applied..."
MIGRATION_CHECK=$(npx prisma migrate status 2>/dev/null | grep "add_multitenancy" | wc -l)
if [ "$MIGRATION_CHECK" -gt 0 ]; then
    echo "✅ Multitenancy migration found"
else
    echo "❌ Multitenancy migration not found"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Fix remaining compilation errors in backend services"
echo "2. Run the full test suite from MULTITENANCY_TESTING_GUIDE.md"
echo "3. Test data isolation between organizations"
echo "4. Verify authentication includes organization context"

echo ""
echo "📚 For detailed testing, see: MULTITENANCY_TESTING_GUIDE.md"
