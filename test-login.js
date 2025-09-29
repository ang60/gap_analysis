const { PrismaClient } = require('@prisma/client');

async function testLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking available users...\n');
    
    // Get all users
    const users = await prisma.user.findMany();
    
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Organization ID: ${user.organizationId}`);
      console.log(`   Branch ID: ${user.branchId || 'None'}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('   ---');
    });
    
    // Test specific credentials
    console.log('\n🧪 Testing login credentials...\n');
    
    const testCredentials = [
      { email: 'admin@bank.co.ke', password: 'admin123', orgId: 1 },
      { email: 'manager@bank.co.ke', password: 'ManagerPass123', orgId: 1 },
      { email: 'officer@bank.co.ke', password: 'OfficerPass123', orgId: 1 },
      { email: 'admin@testa.local', password: 'BankAPass123', orgId: 3 },
      { email: 'admin@testb.local', password: 'BankBPass123', orgId: 4 }
    ];
    
    for (const cred of testCredentials) {
      const user = await prisma.user.findUnique({
        where: { email: cred.email }
      });
      
      if (user) {
        console.log(`✅ User found: ${user.email}`);
        console.log(`   Organization ID: ${user.organizationId}`);
        console.log(`   Expected Org: ${cred.orgId}`);
        console.log(`   Match: ${user.organizationId === cred.orgId ? '✅' : '❌'}`);
        console.log(`   Active: ${user.isActive}`);
      } else {
        console.log(`❌ User not found: ${cred.email}`);
      }
      console.log('   ---');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
