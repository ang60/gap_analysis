import { PrismaClient, Priority, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('AdminPass123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bank.co.ke' },
    update: {},
    create: {
      email: 'admin@bank.co.ke',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
    },
  });

  // Create default branch
  const defaultBranch = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Head Office',
      region: 'Nairobi',
      managerId: adminUser.id,
    },
  });

  // Update admin user with branch
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { branchId: defaultBranch.id },
  });

  // Create additional test users
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@bank.co.ke' },
    update: {},
    create: {
      email: 'manager@bank.co.ke',
      password: await bcrypt.hash('ManagerPass123', 10),
      firstName: 'John',
      lastName: 'Mwangi',
      role: UserRole.MANAGER,
      branchId: defaultBranch.id,
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: 'officer@bank.co.ke' },
    update: {},
    create: {
      email: 'officer@bank.co.ke',
      password: await bcrypt.hash('OfficerPass123', 10),
      firstName: 'Jane',
      lastName: 'Wanjiku',
      role: UserRole.COMPLIANCE_OFFICER,
      branchId: defaultBranch.id,
    },
  });

  // ISO 27001:2022 Requirements
  const isoRequirements = [
    // Clause 4: Context of Organization
    {
      clause: '4.1',
      title: 'Understanding the organization and its context',
      description: 'The organization shall determine external and internal issues that are relevant to its purpose and that affect its ability to achieve the intended outcome(s) of its information security management system.',
      section: 'Clause 4',
      priority: Priority.CRITICAL,
    },
    {
      clause: '4.2',
      title: 'Understanding the needs and expectations of interested parties',
      description: 'The organization shall determine the interested parties that are relevant to the information security management system and the relevant requirements of these interested parties.',
      section: 'Clause 4',
      priority: Priority.CRITICAL,
    },
    {
      clause: '4.3',
      title: 'Determining the scope of the information security management system',
      description: 'The organization shall determine the boundaries and applicability of the information security management system to establish its scope.',
      section: 'Clause 4',
      priority: Priority.CRITICAL,
    },
    {
      clause: '4.4',
      title: 'Information security management system',
      description: 'The organization shall establish, implement, maintain and continually improve an information security management system, including the processes needed and their interactions, in accordance with the requirements of this document.',
      section: 'Clause 4',
      priority: Priority.CRITICAL,
    },

    // Clause 5: Leadership
    {
      clause: '5.1',
      title: 'Leadership and commitment',
      description: 'Top management shall demonstrate leadership and commitment with respect to the information security management system.',
      section: 'Clause 5',
      priority: Priority.CRITICAL,
    },
    {
      clause: '5.2',
      title: 'Policy',
      description: 'Top management shall establish an information security policy.',
      section: 'Clause 5',
      priority: Priority.CRITICAL,
    },
    {
      clause: '5.3',
      title: 'Organizational roles, responsibilities and authorities',
      description: 'Top management shall ensure that the responsibilities and authorities for relevant roles are assigned and communicated within the organization.',
      section: 'Clause 5',
      priority: Priority.HIGH,
    },

    // Clause 6: Planning
    {
      clause: '6.1',
      title: 'Actions to address risks and opportunities',
      description: 'When planning for the information security management system, the organization shall consider the issues referred to in 4.1 and the requirements referred to in 4.2 and determine the risks and opportunities that need to be addressed.',
      section: 'Clause 6',
      priority: Priority.CRITICAL,
    },
    {
      clause: '6.2',
      title: 'Information security objectives and planning to achieve them',
      description: 'The organization shall establish information security objectives at relevant functions and levels.',
      section: 'Clause 6',
      priority: Priority.HIGH,
    },

    // Clause 7: Support
    {
      clause: '7.1',
      title: 'Resources',
      description: 'The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the information security management system.',
      section: 'Clause 7',
      priority: Priority.HIGH,
    },
    {
      clause: '7.2',
      title: 'Competence',
      description: 'The organization shall determine the necessary competence of person(s) doing work under its control that affects its information security performance.',
      section: 'Clause 7',
      priority: Priority.HIGH,
    },
    {
      clause: '7.3',
      title: 'Awareness',
      description: 'Persons doing work under the organization\'s control shall be aware of the information security policy and their contribution to the effectiveness of the information security management system.',
      section: 'Clause 7',
      priority: Priority.HIGH,
    },
    {
      clause: '7.4',
      title: 'Communication',
      description: 'The organization shall determine the need for internal and external communications relevant to the information security management system.',
      section: 'Clause 7',
      priority: Priority.MEDIUM,
    },
    {
      clause: '7.5',
      title: 'Documented information',
      description: 'The organization\'s information security management system shall include documented information required by this document and documented information determined by the organization as being necessary for the effectiveness of the information security management system.',
      section: 'Clause 7',
      priority: Priority.HIGH,
    },

    // Clause 8: Operation
    {
      clause: '8.1',
      title: 'Operational planning and control',
      description: 'The organization shall plan, implement and control the processes needed to meet information security requirements.',
      section: 'Clause 8',
      priority: Priority.CRITICAL,
    },
    {
      clause: '8.2',
      title: 'Information security risk assessment',
      description: 'The organization shall perform information security risk assessments at planned intervals or when significant changes occur.',
      section: 'Clause 8',
      priority: Priority.CRITICAL,
    },
    {
      clause: '8.3',
      title: 'Information security risk treatment',
      description: 'The organization shall implement the information security risk treatment plan.',
      section: 'Clause 8',
      priority: Priority.CRITICAL,
    },

    // Clause 9: Performance evaluation
    {
      clause: '9.1',
      title: 'Monitoring, measurement, analysis and evaluation',
      description: 'The organization shall evaluate the information security performance and the effectiveness of the information security management system.',
      section: 'Clause 9',
      priority: Priority.HIGH,
    },
    {
      clause: '9.2',
      title: 'Internal audit',
      description: 'The organization shall conduct internal audits at planned intervals to provide information on whether the information security management system conforms to the organization\'s own requirements.',
      section: 'Clause 9',
      priority: Priority.CRITICAL,
    },
    {
      clause: '9.3',
      title: 'Management review',
      description: 'Top management shall review the organization\'s information security management system at planned intervals to ensure its continuing suitability, adequacy and effectiveness.',
      section: 'Clause 9',
      priority: Priority.CRITICAL,
    },

    // Clause 10: Improvement
    {
      clause: '10.1',
      title: 'Nonconformity and corrective action',
      description: 'When a nonconformity occurs, the organization shall react to the nonconformity and take action to control and correct it.',
      section: 'Clause 10',
      priority: Priority.HIGH,
    },
    {
      clause: '10.2',
      title: 'Continual improvement',
      description: 'The organization shall continually improve the suitability, adequacy and effectiveness of the information security management system.',
      section: 'Clause 10',
      priority: Priority.HIGH,
    },

    // Annex A: Information Security Controls
    {
      clause: 'A.5.1',
      title: 'Information security policies',
      description: 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.5.2',
      title: 'Review of information security policies',
      description: 'The information security policies shall be reviewed at planned intervals or if significant changes occur to ensure their continuing suitability, adequacy and effectiveness.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.6.1',
      title: 'Internal organization',
      description: 'A management framework shall be established to initiate and control the implementation and operation of information security within the organization.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.6.2',
      title: 'Mobile devices and teleworking',
      description: 'A policy and supporting security measures shall be adopted to manage the risks introduced by using mobile devices.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.7.1',
      title: 'Prior to employment',
      description: 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics and shall be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.7.2',
      title: 'During employment',
      description: 'Management shall require all employees and contractors to apply information security in accordance with the established policies and procedures of the organization.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.7.3',
      title: 'Termination and change of employment',
      description: 'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, communicated to the employee or contractor and enforced.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.8.1',
      title: 'Responsibility for assets',
      description: 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.8.2',
      title: 'Information classification',
      description: 'Information shall be classified in terms of legal requirements, value, criticality and sensitivity to unauthorized disclosure or modification.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.8.3',
      title: 'Media handling',
      description: 'Media shall be handled and disposed of securely.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.9.1',
      title: 'Business requirement of access control',
      description: 'Access to information and information processing facilities shall be controlled on the basis of business and security requirements.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.9.2',
      title: 'User access management',
      description: 'Formal user registration and de-registration procedures shall be implemented to enable assignment of access rights.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.9.3',
      title: 'User responsibilities',
      description: 'Users shall be required to follow good security practices in the selection and use of passwords.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.9.4',
      title: 'System and application access control',
      description: 'Access to systems and applications shall be controlled by a secure log-on procedure.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.10.1',
      title: 'Cryptographic controls',
      description: 'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.11.1',
      title: 'Secure areas',
      description: 'Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.11.2',
      title: 'Equipment',
      description: 'Equipment shall be sited and protected to reduce the risks from environmental threats and hazards, and opportunities for unauthorized access.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.12.1',
      title: 'Operational procedures and responsibilities',
      description: 'Operating procedures shall be documented, maintained, and made available to all users who need them.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.12.2',
      title: 'Protection from malware',
      description: 'Detection, prevention and recovery controls to protect against malware shall be implemented, combined with appropriate user awareness.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.12.3',
      title: 'Backup',
      description: 'Backup copies of information, software and system images shall be taken and tested regularly in accordance with an agreed backup policy.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.12.4',
      title: 'Logging and monitoring',
      description: 'Event logs shall be produced, kept and regularly reviewed.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.12.5',
      title: 'Control of operational software',
      description: 'Rules governing the installation of software by users shall be established and implemented.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.12.6',
      title: 'Technical vulnerability management',
      description: 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion, the organization\'s exposure to such vulnerabilities evaluated and appropriate measures taken to address the associated risk.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.12.7',
      title: 'Information systems audit considerations',
      description: 'Information systems audit controls shall be planned and agreed to minimize disruption to business processes.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.13.1',
      title: 'Network security management',
      description: 'Networks shall be managed and controlled to protect information in systems and applications.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.13.2',
      title: 'Information transfer',
      description: 'Information transfer policies and procedures shall be in place to protect the transfer of information through the use of all types of communication facilities.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.14.1',
      title: 'Security requirements of information systems',
      description: 'Information security requirements shall be included in the requirements for new information systems or enhancements to existing information systems.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.14.2',
      title: 'Security in development and support processes',
      description: 'Information systems shall be developed, tested and maintained in a secure manner.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.15.1',
      title: 'Information security in supplier relationships',
      description: 'Information security requirements for mitigating the risks associated with supplier\'s access to the organization\'s assets shall be agreed with the supplier and documented.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.15.2',
      title: 'Supplier service delivery management',
      description: 'Organizations shall plan, implement, monitor, review and maintain information security and service delivery in accordance with supplier service agreements.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.16.1',
      title: 'Management of information security incidents and improvements',
      description: 'Responsibilities and procedures shall be established to ensure a quick, effective and orderly response to information security incidents.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.17.1',
      title: 'Information security continuity',
      description: 'Information security continuity shall be embedded in the organization\'s business continuity management systems.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
    {
      clause: 'A.17.2',
      title: 'Redundancies',
      description: 'Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements.',
      section: 'Annex A',
      priority: Priority.MEDIUM,
    },
    {
      clause: 'A.18.1',
      title: 'Compliance with legal and contractual requirements',
      description: 'All relevant legislative statutory, regulatory, contractual requirements and the organization\'s approach to meet these requirements shall be explicitly defined, documented and kept up to date for each information system and the organization.',
      section: 'Annex A',
      priority: Priority.CRITICAL,
    },
    {
      clause: 'A.18.2',
      title: 'Information security reviews',
      description: 'Information systems shall be regularly reviewed for compliance with the organization\'s information security policies and standards.',
      section: 'Annex A',
      priority: Priority.HIGH,
    },
  ];

  // Create ISO 27001:2022 requirements
  for (const req of isoRequirements) {
    await prisma.requirement.upsert({
      where: { clause: req.clause },
      update: {},
      create: {
        ...req,
        createdById: adminUser.id,
        branchId: defaultBranch.id,
      },
    });
  }

  console.log(`✅ Created ${isoRequirements.length} ISO 27001:2022 requirements`);

  // Create sample schedules
  const sampleSchedules = [
    {
      type: 'RISK_ASSESSMENT' as const,
      title: 'Quarterly Risk Assessment',
      description: 'Conduct comprehensive risk assessment for all business processes',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      frequency: 'QUARTERLY' as const,
      priority: Priority.CRITICAL,
      isRecurring: true,
      branchId: defaultBranch.id,
      responsibleId: managerUser.id,
      createdById: adminUser.id,
    },
    {
      type: 'INTERNAL_AUDIT' as const,
      title: 'Annual Internal Audit',
      description: 'Perform internal audit of the ISMS',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      frequency: 'ANNUAL' as const,
      priority: Priority.CRITICAL,
      isRecurring: true,
      branchId: defaultBranch.id,
      responsibleId: officerUser.id,
      createdById: adminUser.id,
    },
    {
      type: 'TRAINING' as const,
      title: 'Information Security Awareness Training',
      description: 'Conduct information security awareness training for all staff',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      frequency: 'SEMI_ANNUAL' as const,
      priority: Priority.HIGH,
      isRecurring: true,
      branchId: defaultBranch.id,
      responsibleId: officerUser.id,
      createdById: adminUser.id,
    },
  ];

  for (const schedule of sampleSchedules) {
    await prisma.schedule.create({
      data: schedule,
    });
  }

  console.log(`✅ Created ${sampleSchedules.length} sample schedules`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Admin: admin@bank.co.ke / AdminPass123');
  console.log('Manager: manager@bank.co.ke / ManagerPass123');
  console.log('Officer: officer@bank.co.ke / OfficerPass123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
