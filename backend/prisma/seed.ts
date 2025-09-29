import { PrismaClient, Priority, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Super Admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@gapanalysis.com' },
    update: {},
    create: {
      email: 'superadmin@gapanalysis.com',
      password: await bcrypt.hash('SuperAdmin@123', 10),
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      organizationId: 1, // Will be updated after organizations are created
    },
  });

  console.log('✅ Super Admin created:', superAdmin.email);

  // Create multiple organizations for multi-tenancy testing
  const equityBank = await prisma.organization.upsert({
    where: { domain: 'equitybank.co.ke' },
    update: {},
    create: {
      name: 'Equity Bank Kenya',
      domain: 'equitybank.co.ke',
      subdomain: 'equity',
      isActive: true,
      settings: {},
    },
  });

  const kcbBank = await prisma.organization.upsert({
    where: { domain: 'kcbgroup.com' },
    update: {},
    create: {
      name: 'KCB Bank Kenya',
      domain: 'kcbgroup.com',
      subdomain: 'kcb',
      isActive: true,
      settings: {},
    },
  });

  const coopBank = await prisma.organization.upsert({
    where: { domain: 'co-opbank.co.ke' },
    update: {},
    create: {
      name: 'Co-operative Bank of Kenya',
      domain: 'co-opbank.co.ke',
      subdomain: 'coop',
      isActive: true,
      settings: {},
    },
  });

  // Create default organization for backward compatibility
  const defaultOrg = await prisma.organization.upsert({
    where: { domain: 'default.local' },
    update: {},
    create: {
      name: 'Default Organization',
      domain: 'default.local',
      subdomain: 'default',
      isActive: true,
      settings: {},
    },
  });

  // Create branches for each organization (let database auto-increment IDs)
  const equityBranch = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Equity Bank Head Office',
        organizationId: equityBank.id,
      }
    },
    update: {},
    create: {
      name: 'Equity Bank Head Office',
      region: 'Nairobi',
      organizationId: equityBank.id,
    },
  });

  const kcbBranch = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'KCB Bank Head Office',
        organizationId: kcbBank.id,
      }
    },
    update: {},
    create: {
      name: 'KCB Bank Head Office',
      region: 'Nairobi',
      organizationId: kcbBank.id,
    },
  });

  const coopBranch = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Co-op Bank Head Office',
        organizationId: coopBank.id,
      }
    },
    update: {},
    create: {
      name: 'Co-op Bank Head Office',
      region: 'Nairobi',
      organizationId: coopBank.id,
    },
  });

  const defaultBranch = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Default Head Office',
        organizationId: defaultOrg.id,
      }
    },
    update: {},
    create: {
      name: 'Default Head Office',
      region: 'Nairobi',
      organizationId: defaultOrg.id,
    },
  });

  // Create additional branches for the default organization
  const defaultBranch2 = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Nairobi CBD Branch',
        organizationId: defaultOrg.id,
      }
    },
    update: {},
    create: {
      name: 'Nairobi CBD Branch',
      region: 'Nairobi',
      organizationId: defaultOrg.id,
    },
  });

  const defaultBranch3 = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Mombasa Branch',
        organizationId: defaultOrg.id,
      }
    },
    update: {},
    create: {
      name: 'Mombasa Branch',
      region: 'Mombasa',
      organizationId: defaultOrg.id,
    },
  });

  const defaultBranch4 = await prisma.branch.upsert({
    where: { 
      name_organizationId: {
        name: 'Kisumu Branch',
        organizationId: defaultOrg.id,
      }
    },
    update: {},
    create: {
      name: 'Kisumu Branch',
      region: 'Kisumu',
      organizationId: defaultOrg.id,
    },
  });

  // Create users for Equity Bank
  const equityAdmin = await prisma.user.upsert({
    where: { email: 'admin@equitybank.co.ke' },
    update: {},
    create: {
      email: 'admin@equitybank.co.ke',
      password: await bcrypt.hash('EquityAdmin123', 10),
      firstName: 'James',
      lastName: 'Mwangi',
      role: UserRole.ADMIN,
      organizationId: equityBank.id,
      branchId: equityBranch.id,
    },
  });

  const equityManager = await prisma.user.upsert({
    where: { email: 'manager@equitybank.co.ke' },
    update: {},
    create: {
      email: 'manager@equitybank.co.ke',
      password: await bcrypt.hash('EquityManager123', 10),
      firstName: 'Mary',
      lastName: 'Wanjiku',
      role: UserRole.MANAGER,
      organizationId: equityBank.id,
      branchId: equityBranch.id,
    },
  });

  // Create users for KCB Bank
  const kcbAdmin = await prisma.user.upsert({
    where: { email: 'admin@kcbgroup.com' },
    update: {},
    create: {
      email: 'admin@kcbgroup.com',
      password: await bcrypt.hash('KcbAdmin123', 10),
      firstName: 'Peter',
      lastName: 'Kimani',
      role: UserRole.ADMIN,
      organizationId: kcbBank.id,
      branchId: kcbBranch.id,
    },
  });

  const kcbManager = await prisma.user.upsert({
    where: { email: 'manager@kcbgroup.com' },
    update: {},
    create: {
      email: 'manager@kcbgroup.com',
      password: await bcrypt.hash('KcbManager123', 10),
      firstName: 'Grace',
      lastName: 'Akinyi',
      role: UserRole.MANAGER,
      organizationId: kcbBank.id,
      branchId: kcbBranch.id,
    },
  });

  // Create users for Co-op Bank
  const coopAdmin = await prisma.user.upsert({
    where: { email: 'admin@co-opbank.co.ke' },
    update: {},
    create: {
      email: 'admin@co-opbank.co.ke',
      password: await bcrypt.hash('CoopAdmin123', 10),
      firstName: 'David',
      lastName: 'Ochieng',
      role: UserRole.ADMIN,
      organizationId: coopBank.id,
      branchId: coopBranch.id,
    },
  });

  const coopManager = await prisma.user.upsert({
    where: { email: 'manager@co-opbank.co.ke' },
    update: {},
    create: {
      email: 'manager@co-opbank.co.ke',
      password: await bcrypt.hash('CoopManager123', 10),
      firstName: 'Sarah',
      lastName: 'Muthoni',
      role: UserRole.MANAGER,
      organizationId: coopBank.id,
      branchId: coopBranch.id,
    },
  });

  // Create default users for backward compatibility
  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'admin@bank.co.ke' },
    update: {},
    create: {
      email: 'admin@bank.co.ke',
      password: await bcrypt.hash('AdminPass123', 10),
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      organizationId: defaultOrg.id,
      branchId: defaultBranch.id,
    },
  });

  const defaultManager = await prisma.user.upsert({
    where: { email: 'manager@bank.co.ke' },
    update: {},
    create: {
      email: 'manager@bank.co.ke',
      password: await bcrypt.hash('ManagerPass123', 10),
      firstName: 'John',
      lastName: 'Mwangi',
      role: UserRole.MANAGER,
      organizationId: defaultOrg.id,
      branchId: defaultBranch.id,
    },
  });

  const defaultOfficer = await prisma.user.upsert({
    where: { email: 'officer@bank.co.ke' },
    update: {},
    create: {
      email: 'officer@bank.co.ke',
      password: await bcrypt.hash('OfficerPass123', 10),
      firstName: 'Jane',
      lastName: 'Wanjiku',
      role: UserRole.COMPLIANCE_OFFICER,
      organizationId: defaultOrg.id,
      branchId: defaultBranch.id,
    },
  });

  // Create additional test users with different roles for each organization
  // Equity Bank additional users
  const equityComplianceOfficer = await prisma.user.upsert({
    where: { email: 'compliance@equitybank.co.ke' },
    update: {},
    create: {
      email: 'compliance@equitybank.co.ke',
      password: await bcrypt.hash('EquityCompliance123', 10),
      firstName: 'Alice',
      lastName: 'Njoroge',
      role: UserRole.COMPLIANCE_OFFICER,
      organizationId: equityBank.id,
      branchId: equityBranch.id,
    },
  });

  const equityStaff = await prisma.user.upsert({
    where: { email: 'staff@equitybank.co.ke' },
    update: {},
    create: {
      email: 'staff@equitybank.co.ke',
      password: await bcrypt.hash('EquityStaff123', 10),
      firstName: 'Brian',
      lastName: 'Kiprop',
      role: UserRole.STAFF,
      organizationId: equityBank.id,
      branchId: equityBranch.id,
    },
  });

  // KCB Bank additional users
  const kcbComplianceOfficer = await prisma.user.upsert({
    where: { email: 'compliance@kcbgroup.com' },
    update: {},
    create: {
      email: 'compliance@kcbgroup.com',
      password: await bcrypt.hash('KcbCompliance123', 10),
      firstName: 'Catherine',
      lastName: 'Wanjala',
      role: UserRole.COMPLIANCE_OFFICER,
      organizationId: kcbBank.id,
      branchId: kcbBranch.id,
    },
  });

  const kcbStaff = await prisma.user.upsert({
    where: { email: 'staff@kcbgroup.com' },
    update: {},
    create: {
      email: 'staff@kcbgroup.com',
      password: await bcrypt.hash('KcbStaff123', 10),
      firstName: 'Daniel',
      lastName: 'Mutua',
      role: UserRole.STAFF,
      organizationId: kcbBank.id,
      branchId: kcbBranch.id,
    },
  });

  // Co-op Bank additional users
  const coopComplianceOfficer = await prisma.user.upsert({
    where: { email: 'compliance@co-opbank.co.ke' },
    update: {},
    create: {
      email: 'compliance@co-opbank.co.ke',
      password: await bcrypt.hash('CoopCompliance123', 10),
      firstName: 'Esther',
      lastName: 'Nyong\'o',
      role: UserRole.COMPLIANCE_OFFICER,
      organizationId: coopBank.id,
      branchId: coopBranch.id,
    },
  });

  const coopStaff = await prisma.user.upsert({
    where: { email: 'staff@co-opbank.co.ke' },
    update: {},
    create: {
      email: 'staff@co-opbank.co.ke',
      password: await bcrypt.hash('CoopStaff123', 10),
      firstName: 'Francis',
      lastName: 'Omondi',
      role: UserRole.STAFF,
      organizationId: coopBank.id,
      branchId: coopBranch.id,
    },
  });

  // Default organization additional users
  const defaultStaff = await prisma.user.upsert({
    where: { email: 'staff@bank.co.ke' },
    update: {},
    create: {
      email: 'staff@bank.co.ke',
      password: await bcrypt.hash('StaffPass123', 10),
      firstName: 'Hannah',
      lastName: 'Kamau',
      role: UserRole.STAFF,
      organizationId: defaultOrg.id,
      branchId: defaultBranch.id,
    },
  });

  // Update branch managers
  await prisma.branch.update({
    where: { id: equityBranch.id },
    data: { managerId: equityAdmin.id },
  });

  await prisma.branch.update({
    where: { id: kcbBranch.id },
    data: { managerId: kcbAdmin.id },
  });

  await prisma.branch.update({
    where: { id: coopBranch.id },
    data: { managerId: coopAdmin.id },
  });

  await prisma.branch.update({
    where: { id: defaultBranch.id },
    data: { managerId: defaultAdmin.id },
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

  // Create ISO 27001:2022 requirements for each organization
  const organizations = [equityBank, kcbBank, coopBank, defaultOrg];
  const adminUsers = [equityAdmin, kcbAdmin, coopAdmin, defaultAdmin];
  const branches = [equityBranch, kcbBranch, coopBranch, defaultBranch];

  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const branch = branches[i];

  for (const req of isoRequirements) {
    await prisma.requirement.upsert({
      where: { 
        clause_organizationId: {
          clause: req.clause,
            organizationId: org.id,
        }
      },
      update: {},
      create: {
        ...req,
          organizationId: org.id,
          createdById: admin.id,
          branchId: branch.id,
      },
    });
    }
  }

  console.log(`✅ Created ${isoRequirements.length} ISO 27001:2022 requirements`);

  // Create sample schedules for each organization
  const sampleSchedules = [
    {
      type: 'RISK_ASSESSMENT' as const,
      title: 'Quarterly Risk Assessment',
      description: 'Conduct comprehensive risk assessment for all business processes',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      frequency: 'QUARTERLY' as const,
      priority: Priority.CRITICAL,
      isRecurring: true,
    },
    {
      type: 'INTERNAL_AUDIT' as const,
      title: 'Annual Internal Audit',
      description: 'Perform internal audit of the ISMS',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      frequency: 'ANNUAL' as const,
      priority: Priority.CRITICAL,
      isRecurring: true,
    },
    {
      type: 'TRAINING' as const,
      title: 'Information Security Awareness Training',
      description: 'Conduct information security awareness training for all staff',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      frequency: 'SEMI_ANNUAL' as const,
      priority: Priority.HIGH,
      isRecurring: true,
    },
  ];

  const managerUsers = [equityManager, kcbManager, coopManager, defaultManager];

  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const manager = managerUsers[i];
    const branch = branches[i];

  for (const schedule of sampleSchedules) {
    await prisma.schedule.create({
      data: {
        ...schedule,
          organizationId: org.id,
          branchId: branch.id,
          responsibleId: manager.id,
          createdById: admin.id,
      },
    });
    }
  }

  console.log(`✅ Created ${sampleSchedules.length} sample schedules for each organization`);

  // Create sample gap assessments for each organization
  console.log('📊 Creating sample gap assessments...');
  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const manager = managerUsers[i];
    const branch = branches[i];

    // Get some requirements for this organization
    const orgRequirements = await prisma.requirement.findMany({
      where: { organizationId: org.id },
      take: 5, // Take first 5 requirements
    });

    for (let j = 0; j < orgRequirements.length; j++) {
      const req = orgRequirements[j];
      await prisma.gapAssessment.create({
        data: {
          status: Math.floor(Math.random() * 4), // 0-3 scale
          description: `Gap assessment for ${req.clause} - ${org.name}`,
          evidenceLink: `https://${org.domain.toLowerCase()}/evidence/${req.clause}`,
          riskScore: Math.floor(Math.random() * 4), // 0-3 scale
          organizationId: org.id,
          requirementId: req.id,
          branchId: branch.id,
          createdById: admin.id,
        },
      });
    }
  }

  // Create sample action plans for each organization
  console.log('📋 Creating sample action plans...');
  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const manager = managerUsers[i];
    const branch = branches[i];

    // Get gap assessments for this organization
    const gapAssessments = await prisma.gapAssessment.findMany({
      where: { organizationId: org.id },
      take: 3,
    });

    for (const gap of gapAssessments) {
      // Get the requirement for this gap
      const requirement = await prisma.requirement.findUnique({
        where: { id: gap.requirementId },
      });

      await prisma.actionPlan.create({
        data: {
          actionText: `Implement ${requirement?.clause || 'compliance'} measures for ${org.name}`,
          priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any,
          status: ['PENDING', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
          deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within 90 days
          completionNotes: Math.random() > 0.5 ? `Action completed for ${org.name}` : null,
          completedAt: Math.random() > 0.7 ? new Date() : null,
          organizationId: org.id,
          gapId: gap.id,
          responsibleId: manager.id,
          createdById: admin.id,
          requirementId: gap.requirementId,
        },
      });
    }
  }

  // Create sample risks for each organization
  console.log('⚠️ Creating sample risks...');
  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const branch = branches[i];

    const riskTemplates = [
      {
        description: `Data breach risk in ${org.name} core banking system`,
        likelihood: 2,
        impact: 4,
        mitigation: `Implement multi-factor authentication and regular security audits`
      },
      {
        description: `Regulatory compliance failure for ${org.name} operations`,
        likelihood: 1,
        impact: 5,
        mitigation: `Establish compliance monitoring dashboard and regular training`
      },
      {
        description: `System downtime affecting ${org.name} customer services`,
        likelihood: 3,
        impact: 3,
        mitigation: `Implement redundant systems and disaster recovery procedures`
      },
      {
        description: `Insider threat risk within ${org.name} organization`,
        likelihood: 2,
        impact: 4,
        mitigation: `Implement access controls and regular background checks`
      },
      {
        description: `Third-party vendor security breach affecting ${org.name}`,
        likelihood: 2,
        impact: 3,
        mitigation: `Establish vendor security requirements and regular assessments`
      }
    ];

    for (const riskTemplate of riskTemplates) {
      await prisma.risk.create({
        data: {
          ...riskTemplate,
          status: ['ACTIVE', 'MITIGATED', 'CLOSED'][Math.floor(Math.random() * 3)] as any,
          organizationId: org.id,
          ownerId: admin.id,
          branchId: branch.id,
        },
      });
    }
  }

  // Create sample notifications for each organization
  console.log('🔔 Creating sample notifications...');
  for (let i = 0; i < organizations.length; i++) {
    const org = organizations[i];
    const admin = adminUsers[i];
    const manager = managerUsers[i];

    const notificationTemplates = [
      `Welcome to ${org.name} Gap Analysis System`,
      `New compliance requirement added for ${org.name}`,
      `Action plan deadline approaching for ${org.name}`,
      `Risk assessment completed for ${org.name}`,
      `Monthly compliance report ready for ${org.name}`
    ];

    for (const message of notificationTemplates) {
      await prisma.notification.create({
        data: {
          message,
          type: ['EMAIL', 'SYSTEM'][Math.floor(Math.random() * 2)] as any,
          status: ['PENDING', 'SENT'][Math.floor(Math.random() * 2)] as any,
          sentAt: Math.random() > 0.5 ? new Date() : null,
          organizationId: org.id,
          userId: Math.random() > 0.5 ? admin.id : manager.id,
        },
      });
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Multi-Tenant Test Credentials:');
  console.log('\n🏦 Equity Bank Kenya:');
  console.log('  Admin: admin@equitybank.co.ke / EquityAdmin123');
  console.log('  Manager: manager@equitybank.co.ke / EquityManager123');
  console.log('\n🏦 KCB Bank Kenya:');
  console.log('  Admin: admin@kcbgroup.com / KcbAdmin123');
  console.log('  Manager: manager@kcbgroup.com / KcbManager123');
  console.log('\n🏦 Co-operative Bank of Kenya:');
  console.log('  Admin: admin@co-opbank.co.ke / CoopAdmin123');
  console.log('  Manager: manager@co-opbank.co.ke / CoopManager123');
  console.log('\n🏦 Default Organization (Backward Compatibility):');
  console.log('  Admin: admin@bank.co.ke / AdminPass123');
  console.log('  Manager: manager@bank.co.ke / ManagerPass123');
  console.log('  Officer: officer@bank.co.ke / OfficerPass123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
