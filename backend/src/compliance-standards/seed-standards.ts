import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedComplianceStandards() {
  console.log('🌱 Seeding compliance standards...');

  // Get the default organization
  const defaultOrg = await prisma.organization.findFirst({
    where: { domain: 'default.local' },
  });

  if (!defaultOrg) {
    console.log('❌ Default organization not found. Skipping compliance standards seeding.');
    return;
  }

  const standards = [
    {
      name: 'ISO 27001',
      version: '2022',
      description: 'Information Security Management System (ISMS) - International standard for information security management',
      category: 'Information Security',
      isDefault: true,
      isActive: true,
      metadata: {
        scope: 'Information Security Management',
        certification: 'Required for certification',
        framework: 'ISO/IEC 27001:2022',
        controls: 114,
        domains: ['Information Security Policies', 'Organization of Information Security', 'Human Resource Security', 'Asset Management', 'Access Control', 'Cryptography', 'Physical and Environmental Security', 'Operations Security', 'Communications Security', 'System Acquisition, Development and Maintenance', 'Supplier Relationships', 'Information Security Incident Management', 'Information Security Aspects of Business Continuity Management', 'Compliance']
      }
    },
    {
      name: 'PCI DSS',
      version: '4.0',
      description: 'Payment Card Industry Data Security Standard - Security requirements for organizations that handle credit card data',
      category: 'Financial',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Payment Card Data Security',
        certification: 'Required for card processing',
        framework: 'PCI DSS v4.0',
        requirements: 12,
        domains: ['Build and Maintain a Secure Network and Systems', 'Protect Cardholder Data', 'Maintain a Vulnerability Management Program', 'Implement Strong Access Control Measures', 'Regularly Monitor and Test Networks', 'Maintain an Information Security Policy']
      }
    },
    {
      name: 'SOX',
      version: '2002',
      description: 'Sarbanes-Oxley Act - Financial reporting and corporate governance requirements for public companies',
      category: 'Financial',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Financial Reporting and Corporate Governance',
        certification: 'Required for public companies',
        framework: 'Sarbanes-Oxley Act of 2002',
        sections: ['Section 302', 'Section 404', 'Section 409', 'Section 802'],
        domains: ['Internal Controls', 'Financial Reporting', 'Audit Requirements', 'Corporate Governance']
      }
    },
    {
      name: 'GDPR',
      version: '2018',
      description: 'General Data Protection Regulation - EU regulation for data protection and privacy',
      category: 'Privacy',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Data Protection and Privacy',
        certification: 'Required for EU operations',
        framework: 'EU GDPR 2016/679',
        principles: 7,
        domains: ['Lawfulness, Fairness and Transparency', 'Purpose Limitation', 'Data Minimisation', 'Accuracy', 'Storage Limitation', 'Integrity and Confidentiality', 'Accountability']
      }
    },
    {
      name: 'ISO 9001',
      version: '2015',
      description: 'Quality Management Systems - International standard for quality management',
      category: 'Quality',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Quality Management',
        certification: 'Optional for quality improvement',
        framework: 'ISO 9001:2015',
        clauses: 10,
        domains: ['Context of the Organization', 'Leadership', 'Planning', 'Support', 'Operation', 'Performance Evaluation', 'Improvement']
      }
    },
    {
      name: 'NIST Cybersecurity Framework',
      version: '1.1',
      description: 'National Institute of Standards and Technology Cybersecurity Framework - Voluntary framework for improving cybersecurity',
      category: 'Information Security',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Cybersecurity Risk Management',
        certification: 'Voluntary framework',
        framework: 'NIST CSF v1.1',
        functions: 5,
        domains: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
      }
    },
    {
      name: 'COBIT',
      version: '2019',
      description: 'Control Objectives for Information and Related Technologies - Framework for IT governance and management',
      category: 'IT Governance',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'IT Governance and Management',
        certification: 'Voluntary framework',
        framework: 'COBIT 2019',
        domains: ['Govern and Manage', 'Align, Plan and Organize', 'Build, Acquire and Implement', 'Deliver, Service and Support', 'Monitor, Evaluate and Assess']
      }
    },
    {
      name: 'HIPAA',
      version: '1996',
      description: 'Health Insurance Portability and Accountability Act - US law for protecting health information',
      category: 'Privacy',
      isDefault: false,
      isActive: true,
      metadata: {
        scope: 'Health Information Privacy and Security',
        certification: 'Required for healthcare organizations',
        framework: 'HIPAA 1996',
        rules: ['Privacy Rule', 'Security Rule', 'Breach Notification Rule', 'Enforcement Rule'],
        domains: ['Administrative Safeguards', 'Physical Safeguards', 'Technical Safeguards']
      }
    }
  ];

  for (const standard of standards) {
    try {
      await prisma.complianceStandard.upsert({
        where: {
          name_version_organizationId: {
            name: standard.name,
            version: standard.version,
            organizationId: defaultOrg.id,
          },
        },
        update: standard,
        create: {
          ...standard,
          organizationId: defaultOrg.id,
        },
      });
      console.log(`✅ Seeded compliance standard: ${standard.name} ${standard.version}`);
    } catch (error) {
      console.log(`❌ Failed to seed ${standard.name}:`, error.message);
    }
  }

  console.log('🎉 Compliance standards seeding completed!');
}

// Run if called directly
if (require.main === module) {
  seedComplianceStandards()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
