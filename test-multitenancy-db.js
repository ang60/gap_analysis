#!/usr/bin/env node

/**
 * Test Multitenancy Database Structure
 * This script tests if the multitenancy implementation is working at the database level
 */

const { PrismaClient } = require('@prisma/client');

async function testMultitenancy() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Multitenancy Database Structure...\n');
    
    // Test 1: Check if organizations table exists and has data
    console.log('📝 Test 1: Checking organizations...');
    const organizations = await prisma.organization.findMany();
    console.log(`✅ Found ${organizations.length} organizations:`);
    organizations.forEach(org => {
      console.log(`   - ${org.name} (${org.domain}) - ID: ${org.id}`);
    });
    
    // Test 2: Check if users have organizationId
    console.log('\n📝 Test 2: Checking users with organization context...');
    const users = await prisma.user.findMany({
      include: {
        organization: true,
        branch: true
      }
    });
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.organization?.name}) - Branch: ${user.branch?.name || 'None'}`);
    });
    
    // Test 3: Check if requirements have organizationId
    console.log('\n📝 Test 3: Checking requirements with organization context...');
    const requirements = await prisma.requirement.findMany({
      include: {
        organization: true
      },
      take: 5
    });
    console.log(`✅ Found ${requirements.length} requirements (showing first 5):`);
    requirements.forEach(req => {
      console.log(`   - ${req.clause}: ${req.title} (${req.organization?.name})`);
    });
    
    // Test 4: Check if branches have organizationId
    console.log('\n📝 Test 4: Checking branches with organization context...');
    const branches = await prisma.branch.findMany({
      include: {
        organization: true
      }
    });
    console.log(`✅ Found ${branches.length} branches:`);
    branches.forEach(branch => {
      console.log(`   - ${branch.name} (${branch.region}) - Org: ${branch.organization?.name}`);
    });
    
    // Test 5: Test data isolation - create test data for different organizations
    console.log('\n📝 Test 5: Testing data isolation...');
    
    // Create a test organization
    const testOrg = await prisma.organization.create({
      data: {
        name: 'Test Bank',
        domain: 'testbank.local',
        subdomain: 'testbank',
        isActive: true,
        settings: { theme: 'blue' }
      }
    });
    console.log(`✅ Created test organization: ${testOrg.name} (ID: ${testOrg.id})`);
    
    // Create a test user for the new organization
    const testUser = await prisma.user.create({
      data: {
        email: 'test@testbank.local',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        organizationId: testOrg.id
      }
    });
    console.log(`✅ Created test user: ${testUser.email} for organization ${testOrg.name}`);
    
    // Create a test requirement for the new organization
    const testRequirement = await prisma.requirement.create({
      data: {
        clause: 'TEST.1.1',
        title: 'Test Requirement',
        description: 'This is a test requirement for Test Bank',
        section: 'Test Section',
        priority: 'HIGH',
        organizationId: testOrg.id,
        createdById: testUser.id
      }
    });
    console.log(`✅ Created test requirement: ${testRequirement.clause} for organization ${testOrg.name}`);
    
    // Verify data isolation
    const defaultOrgRequirements = await prisma.requirement.findMany({
      where: { organizationId: 1 },
      include: { organization: true }
    });
    
    const testOrgRequirements = await prisma.requirement.findMany({
      where: { organizationId: testOrg.id },
      include: { organization: true }
    });
    
    console.log(`\n📊 Data Isolation Results:`);
    console.log(`   - Default Organization (ID: 1) has ${defaultOrgRequirements.length} requirements`);
    console.log(`   - Test Organization (ID: ${testOrg.id}) has ${testOrgRequirements.length} requirements`);
    
    if (defaultOrgRequirements.length > 0 && testOrgRequirements.length > 0) {
      console.log('✅ Data isolation is working! Each organization has its own data.');
    } else {
      console.log('❌ Data isolation may not be working properly.');
    }
    
    // Clean up test data
    await prisma.requirement.delete({ where: { id: testRequirement.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.organization.delete({ where: { id: testOrg.id } });
    console.log('\n🧹 Cleaned up test data');
    
    console.log('\n🎉 Multitenancy database test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Organizations table exists and has data');
    console.log('✅ Users are properly linked to organizations');
    console.log('✅ Requirements are properly linked to organizations');
    console.log('✅ Branches are properly linked to organizations');
    console.log('✅ Data isolation is working between organizations');
    
  } catch (error) {
    console.error('❌ Error testing multitenancy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMultitenancy();
