// =============================================================================
// 1. LEGAL SERVICES IMAGE IMPORTS (12 Images)
// =============================================================================
import marriageRegImg from "../assets/marriage-registration.png";
import rentAgreementImg from "../assets/rent-agreement.png";
import tenantVerificationImg from "../assets/tenant-police-verification.png";
import govtGazetteImg from "../assets/govt-gazette.png";
import partnershipDeedImg from "../assets/partnership-deed.png";
import saleWillGiftImg from "../assets/sale-will-gift-deed.png";
import mortgageDeedImg from "../assets/mortgage-release-deed.png";
import titleSearchImg from "../assets/title-search-report.png";
import trademarkImg from "../assets/trademark-registration.png";
import patentCopyrightImg from "../assets/patent-copyright.png";
import digital712Img from "../assets/digital.webp";
import characterCertificateImg from "../assets/character-certificate.png";

// =============================================================================
// 2. BUSINESS & FINANCIAL SERVICES IMAGE IMPORTS (12 Images)
// =============================================================================
import incomeTaxImg from "../assets/income-tax.png";
import gstRegistrationImg from "../assets/gst-registration.jpg";
import bankLoanImg from "../assets/bank-loan.png";
import govtLiaisoningImg from "../assets/govt-liaisoning.png";
import tenderConsultancyImg from "../assets/tender-consultancy.png";
import companyRegImg from "../assets/company-registration.png";
import llpRegImg from "../assets/llp-registration.png";
import accountingAuditImg from "../assets/accounting-audit.png";
import projectReportImg from "../assets/project-report.png";
import trustRegImg from "../assets/trust-registration.png";
import iecCodeImg from "../assets/growth.jpg";
import dscImg from "../assets/digital.webp";

// =============================================================================
// 3. OTHER SERVICES IMAGE IMPORTS (12 Images)
// =============================================================================
import realEstateImg from "../assets/real-estate-services.png";
import lightBillTransferImg from "../assets/light-bill-transfer.png";
import propertyTaxTransferImg from "../assets/property-water-tax.png";
import insuranceImg from "../assets/insurance-services.png";
import startupServicesImg from "../assets/startup-services.png";
import digitalMarketingImg from "../assets/digital-marketing.png";
import msmeUdyamImg from "../assets/msme.png";
import shopActImg from "../assets/shop-act-license.png";
import fssaiImg from "../assets/fssai-license.png";
import passportImg from "../assets/passport-services.png";
import voterPanTanImg from "../assets/hero2.jpg";
import liquorLicenseImg from "../assets/liquor-license.png";

const serviceDetailsData = [
  // ===========================================================================
  // SECTION 1: LEGAL SERVICES (1 - 12)
  // ===========================================================================

  // 1. MARRIAGE REGISTRATION
  {
    slug: "marriage-registration",
    title: "Marriage Registration",
    category: "Legal Services",
    image: marriageRegImg,
    heroTitle: "Marriage Registration Online – Complete Legal Assistance",
    description:
      "Get complete assistance for marriage registration with document guidance, application support and hassle-free processing.",
    highlights: [
      {
        title: "Easy Registration",
        description: "Get complete assistance for registering your marriage legally.",
      },
      {
        title: "Document Support",
        description: "Guidance for preparing and submitting the required documents.",
      },
      {
        title: "Expert Assistance",
        description: "Professional support throughout the registration process.",
      },
    ],
    process: [
      { step: "1", title: "Share Details", description: "Provide basic details of both partners and the marriage." },
      { step: "2", title: "Submit Documents", description: "Provide the required documents for verification." },
      { step: "3", title: "Registration Support", description: "Get assistance with the marriage registration process." },
    ],
    documents: [
      "Aadhaar Card",
      "Address Proof",
      "Age Proof",
      "Marriage Proof / Photographs",
      "Witness Details",
    ],
    benefits: [
      "Legal proof of marriage",
      "Official marriage certificate",
      "Useful for government and legal purposes",
      "Professional documentation support",
    ],
    faq: [
      {
        question: "Why is marriage registration important?",
        answer:
          "Marriage registration provides official legal proof of the marriage and can be useful for various government, financial and legal purposes.",
      },
    ],
  },

  // 2. LEAVE & LICENCE / RENT AGREEMENT
  {
    slug: "leave-licence-rent-agreement",
    title: "Leave & Licence / Rent Agreement",
    category: "Legal Services",
    image: rentAgreementImg,
    heroTitle: "Leave & Licence / Rent Agreement Online",
    description:
      "Get assistance with preparing and registering your Leave & Licence or Rent Agreement with proper documentation support.",
    highlights: [
      {
        title: "Agreement Preparation",
        description: "Get assistance in preparing your rental agreement.",
      },
      {
        title: "Documentation Support",
        description: "Guidance for required documents and information.",
      },
      {
        title: "Secure Process",
        description: "Your agreement details and documents are handled securely.",
      },
    ],
    process: [
      { step: "1", title: "Share Property Details", description: "Provide landlord, tenant and property information." },
      { step: "2", title: "Agreement Preparation", description: "The required agreement is prepared based on the provided details." },
      { step: "3", title: "Registration Support", description: "Get assistance with the registration and documentation process." },
    ],
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Property Address Proof",
      "Owner Details",
      "Tenant Details",
    ],
    benefits: [
      "Proper rental documentation",
      "Legal documentation support",
      "Clear terms between parties",
      "Convenient registration assistance",
    ],
    faq: [
      {
        question: "What is a Leave & Licence Agreement?",
        answer:
          "A Leave & Licence Agreement records the terms under which a property is given for use by another person for a specified period.",
      },
    ],
  },

  // 3. TENANT POLICE VERIFICATION
  {
    slug: "tenant-police-verification",
    title: "Tenant Police Verification",
    category: "Legal Services",
    image: tenantVerificationImg,
    heroTitle: "Tenant Police Verification Online",
    description:
      "Get assistance with tenant police verification and complete the required documentation conveniently.",
    highlights: [
      {
        title: "Police Verification Support",
        description: "Assistance with the tenant verification process.",
      },
      {
        title: "Document Guidance",
        description: "Guidance on documents and information required for verification.",
      },
      {
        title: "Simple Process",
        description: "Get support throughout the verification procedure.",
      },
    ],
    process: [
      { step: "1", title: "Share Tenant Details", description: "Provide the required tenant and property information." },
      { step: "2", title: "Document Submission", description: "Submit the required identification and address documents." },
      { step: "3", title: "Verification Support", description: "Get assistance with the police verification process." },
    ],
    documents: [
      "Tenant Aadhaar Card",
      "Tenant Address Proof",
      "Photograph",
      "Owner Details",
      "Property Details",
    ],
    benefits: [
      "Tenant verification support",
      "Better documentation",
      "Convenient application assistance",
      "Professional guidance",
    ],
    faq: [
      {
        question: "Why is tenant police verification required?",
        answer:
          "Tenant verification helps maintain proper records and supports the verification of tenant information.",
      },
    ],
  },

  // 4. GOVT GAZETTE
  {
    slug: "govt-gazette-change",
    title: "Govt. Gazette – Name / DOB / Religion Change",
    category: "Legal Services",
    image: govtGazetteImg,
    heroTitle: "Government Gazette Name, DOB & Other Changes",
    description:
      "Get assistance with Government Gazette publication for eligible changes such as name, date of birth and other personal details.",
    highlights: [
      {
        title: "Gazette Assistance",
        description: "Complete guidance for the Gazette publication process.",
      },
      {
        title: "Document Support",
        description: "Assistance with preparing the required documentation.",
      },
      {
        title: "Professional Guidance",
        description: "Support throughout the application process.",
      },
    ],
    process: [
      { step: "1", title: "Share Details", description: "Provide details about the change you want to make." },
      { step: "2", title: "Prepare Documents", description: "Submit the required documents and declarations." },
      { step: "3", title: "Gazette Publication", description: "Get assistance with the Gazette publication process." },
    ],
    documents: [
      "Aadhaar Card",
      "Address Proof",
      "Existing Identity Documents",
      "Required Declaration / Affidavit",
      "Supporting Documents",
    ],
    benefits: [
      "Official Gazette publication support",
      "Documentation assistance",
      "Useful for updating official records",
      "Professional process guidance",
    ],
    faq: [
      {
        question: "What changes can be published through Gazette?",
        answer:
          "Depending on applicable rules, Gazette publication may be used for certain personal changes such as name and other details.",
      },
    ],
  },

  // 5. PARTNERSHIP DEED
  {
    slug: "partnership-deed",
    title: "Partnership Deed (Notary & Registration of Firm)",
    category: "Legal Services",
    image: partnershipDeedImg,
    heroTitle: "Partnership Deed & Firm Registration",
    description:
      "Get assistance with partnership deed preparation, notarisation and registration of your partnership firm.",
    highlights: [
      {
        title: "Deed Preparation",
        description: "Assistance with preparing a partnership deed.",
      },
      {
        title: "Documentation",
        description: "Guidance on the required documents and details.",
      },
      {
        title: "Firm Registration",
        description: "Support for the registration process of the partnership firm.",
      },
    ],
    process: [
      { step: "1", title: "Share Partner Details", description: "Provide details of all partners and the proposed business." },
      { step: "2", title: "Prepare Partnership Deed", description: "The deed is prepared according to the provided business terms." },
      { step: "3", title: "Registration Support", description: "Get assistance with notarisation and firm registration." },
    ],
    documents: [
      "Partners' Aadhaar Cards",
      "Partners' PAN Cards",
      "Address Proof",
      "Business Address Proof",
      "Partnership Details",
    ],
    benefits: [
      "Proper partnership documentation",
      "Clear roles and responsibilities",
      "Firm registration assistance",
      "Professional legal guidance",
    ],
    faq: [
      {
        question: "What is a partnership deed?",
        answer:
          "A partnership deed is an agreement that records the terms and conditions governing the relationship between partners in a business.",
      },
    ],
  },

  // 6. SALE DEED / WILL / GIFT DEED
  {
    slug: "sale-will-gift-deed",
    title: "Sale Deed / Will / Gift Deed",
    category: "Legal Services",
    image: saleWillGiftImg,
    heroTitle: "Sale Deed, Will & Gift Deed Assistance",
    description:
      "Get professional documentation assistance for Sale Deed, Will and Gift Deed requirements.",
    highlights: [
      {
        title: "Document Preparation",
        description: "Assistance with preparing the required legal documents.",
      },
      {
        title: "Property Documentation",
        description: "Support for property-related documentation requirements.",
      },
      {
        title: "Legal Guidance",
        description: "Professional guidance throughout the documentation process.",
      },
    ],
    process: [
      { step: "1", title: "Share Details", description: "Provide the relevant property and party details." },
      { step: "2", title: "Document Preparation", description: "Prepare the required deed or legal document." },
      { step: "3", title: "Registration Support", description: "Get assistance with the applicable registration process." },
    ],
    documents: [
      "Identity Proof",
      "Address Proof",
      "Property Documents",
      "Party Details",
      "Supporting Documents",
    ],
    benefits: [
      "Proper legal documentation",
      "Professional drafting assistance",
      "Property documentation support",
      "Registration guidance",
    ],
    faq: [
      {
        question: "What is a Sale Deed?",
        answer:
          "A Sale Deed is a legal document used to record the transfer of ownership of property from the seller to the buyer.",
      },
    ],
  },

  // 7. MORTGAGE / RELEASE DEED
  {
    slug: "mortgage-release-deed",
    title: "Mortgage Deed / Release Deed",
    category: "Legal Services",
    image: mortgageDeedImg,
    heroTitle: "Mortgage Deed & Release Deed Assistance",
    description:
      "Get assistance with mortgage and release deed documentation for property-related transactions.",
    highlights: [
      {
        title: "Property Documentation",
        description: "Assistance with mortgage and release deed documentation.",
      },
      {
        title: "Document Support",
        description: "Guidance on the required documents and details.",
      },
      {
        title: "Professional Assistance",
        description: "Support throughout the documentation process.",
      },
    ],
    process: [
      { step: "1", title: "Share Property Details", description: "Provide the relevant property and transaction details." },
      { step: "2", title: "Document Verification", description: "Review the required property and supporting documents." },
      { step: "3", title: "Deed Support", description: "Get assistance with preparation and applicable registration." },
    ],
    documents: [
      "Identity Proof",
      "Property Documents",
      "Existing Mortgage Documents",
      "Loan / Financial Documents",
      "Address Proof",
    ],
    benefits: [
      "Property documentation support",
      "Proper deed preparation",
      "Professional guidance",
      "Registration assistance",
    ],
    faq: [
      {
        question: "What is a Release Deed?",
        answer:
          "A Release Deed is generally used to release or relinquish a person's rights or interest in a property in applicable circumstances.",
      },
    ],
  },

  // 8. TITLE SEARCH REPORT
  {
    slug: "title-search-report",
    title: "Title Search Report",
    category: "Legal Services",
    image: titleSearchImg,
    heroTitle: "Property Title Search Report",
    description:
      "Get assistance with property title search and documentation review to understand the available property records.",
    highlights: [
      {
        title: "Title Search",
        description: "Assistance with reviewing available property title records.",
      },
      {
        title: "Document Review",
        description: "Support in reviewing relevant property documents.",
      },
      {
        title: "Professional Guidance",
        description: "Get assistance in understanding property documentation.",
      },
    ],
    process: [
      { step: "1", title: "Share Property Details", description: "Provide the available property and ownership details." },
      { step: "2", title: "Document Review", description: "Relevant property records and documents are reviewed." },
      { step: "3", title: "Title Report", description: "Receive the title search findings and relevant documentation." },
    ],
    documents: [
      "Property Documents",
      "Previous Sale Deeds",
      "Ownership Documents",
      "Property Tax Records",
      "Available Supporting Documents",
    ],
    benefits: [
      "Property record review",
      "Ownership documentation assistance",
      "Better understanding of title records",
      "Professional support",
    ],
    faq: [
      {
        question: "What is a title search report?",
        answer:
          "A title search report provides information obtained from reviewing available property ownership and related records.",
      },
    ],
  },

  // 9. TRADEMARK REGISTRATION
  {
    slug: "trademark-registration",
    title: "Trademark Registration",
    category: "Legal Services",
    image: trademarkImg,
    heroTitle: "Trademark Registration Online",
    description:
      "Protect your brand name, logo or other eligible marks with trademark registration assistance.",
    highlights: [
      {
        title: "Brand Protection",
        description: "Get assistance with protecting your eligible brand identity.",
      },
      {
        title: "Trademark Search",
        description: "Assistance with checking available trademark information.",
      },
      {
        title: "Filing Support",
        description: "Professional assistance with preparing and filing the application.",
      },
    ],
    process: [
      { step: "1", title: "Share Brand Details", description: "Provide your brand name, logo or other relevant details." },
      { step: "2", title: "Trademark Search", description: "Available trademark information is reviewed." },
      { step: "3", title: "Application Filing", description: "Get assistance with filing the trademark application." },
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Business Details",
      "Brand / Logo Details",
      "Address Proof",
    ],
    benefits: [
      "Brand protection",
      "Trademark application assistance",
      "Professional filing support",
      "Helps establish brand identity",
    ],
    faq: [
      {
        question: "Why should I register a trademark?",
        answer:
          "Trademark registration can provide legal protection for eligible marks and help establish rights associated with your brand.",
      },
    ],
  },

  // 10. PATENT / COPYRIGHT
  {
    slug: "patent-copyright-registration",
    title: "Patent / Copyright Registration",
    category: "Legal Services",
    image: patentCopyrightImg,
    heroTitle: "Patent & Copyright Registration Assistance",
    description:
      "Get assistance with patent and copyright registration for eligible inventions, creative works and intellectual property.",
    highlights: [
      {
        title: "IP Protection",
        description: "Assistance with protecting eligible intellectual property.",
      },
      {
        title: "Documentation Support",
        description: "Guidance with the required application documentation.",
      },
      {
        title: "Professional Guidance",
        description: "Support throughout the registration process.",
      },
    ],
    process: [
      { step: "1", title: "Share IP Details", description: "Provide details about your invention or creative work." },
      { step: "2", title: "Document Preparation", description: "Prepare the required documents for the application." },
      { step: "3", title: "Application Support", description: "Get assistance with the applicable registration process." },
    ],
    documents: [
      "Applicant Identity Proof",
      "Address Proof",
      "Invention / Work Details",
      "Supporting Documents",
      "Ownership Details",
    ],
    benefits: [
      "Intellectual property protection",
      "Professional application support",
      "Documentation assistance",
      "Better protection of eligible creations",
    ],
    faq: [
      {
        question: "What is copyright registration?",
        answer:
          "Copyright registration provides an official record of a copyright claim for eligible creative works.",
      },
    ],
  },

  // 11. DIGITAL 7/12 & MUTATION
  {
    slug: "digital-7-12-mutation",
    title: "Digital 7/12 & Mutation Entries",
    category: "Legal Services",
    image: digital712Img,
    heroTitle: "Digital 7/12 & Mutation Entry Assistance",
    description:
      "Get assistance with Digital 7/12 records and mutation-related documentation for eligible property matters.",
    highlights: [
      {
        title: "7/12 Record Support",
        description: "Assistance with obtaining and understanding Digital 7/12 records.",
      },
      {
        title: "Property Records",
        description: "Support with property-related record requirements.",
      },
      {
        title: "Mutation Assistance",
        description: "Guidance for applicable mutation entry requirements.",
      },
    ],
    process: [
      { step: "1", title: "Share Property Details", description: "Provide the relevant property and ownership information." },
      { step: "2", title: "Document Verification", description: "Review the available property documents." },
      { step: "3", title: "Record / Mutation Support", description: "Get assistance with the applicable record or mutation process." },
    ],
    documents: [
      "Property Documents",
      "Ownership Proof",
      "Identity Proof",
      "Previous Property Records",
      "Supporting Documents",
    ],
    benefits: [
      "Property record assistance",
      "Digital 7/12 support",
      "Mutation documentation guidance",
      "Convenient professional assistance",
    ],
    faq: [
      {
        question: "What is a 7/12 extract?",
        answer:
          "A 7/12 extract is a land record containing information related to agricultural land and its recorded details.",
      },
    ],
  },

  // 12. CHARACTER CERTIFICATE
  {
    slug: "character-certificate",
    title: "Character Certificate by Police",
    category: "Legal Services",
    image: characterCertificateImg,
    heroTitle: "Police Character Certificate Assistance",
    description:
      "Get assistance with the application process and documentation required for obtaining a police character certificate.",
    highlights: [
      {
        title: "Application Support",
        description: "Assistance with the character certificate application.",
      },
      {
        title: "Document Guidance",
        description: "Guidance on the required identification and address documents.",
      },
      {
        title: "Verification Support",
        description: "Support through the applicable police verification process.",
      },
    ],
    process: [
      { step: "1", title: "Share Personal Details", description: "Provide the required personal and address information." },
      { step: "2", title: "Submit Documents", description: "Provide the required identity and address documents." },
      { step: "3", title: "Verification Support", description: "Get assistance with the applicable verification process." },
    ],
    documents: [
      "Aadhaar Card",
      "Address Proof",
      "Passport Size Photograph",
      "Application Details",
      "Supporting Documents",
    ],
    benefits: [
      "Character certificate application support",
      "Document preparation guidance",
      "Verification assistance",
      "Professional process support",
    ],
    faq: [
      {
        question: "What is a police character certificate?",
        answer:
          "A police character certificate is an official document issued through the applicable police verification process.",
      },
    ],
  },

  // ===========================================================================
  // SECTION 2: BUSINESS & FINANCIAL SERVICES (13 - 24)
  // ===========================================================================

  // 13. INCOME TAX SERVICES
  {
    slug: "income-tax-services",
    title: "Income Tax Services",
    category: "Business & Financial Services",
    image: incomeTaxImg,
    heroTitle: "Income Tax Return Filing & Advisory",
    description:
      "Get complete assistance with income tax return (ITR) filing, tax saving advisory, refund processing and notice compliance.",
    highlights: [
      {
        title: "Tax Optimization",
        description: "Maximize your deductions and minimize tax liability legally.",
      },
      {
        title: "Filing Support",
        description: "Expert assistance for salaried individuals, professionals and business firms.",
      },
      {
        title: "Quick & Accurate",
        description: "Fast computation, e-filing, and instant acknowledgment generation.",
      },
    ],
    process: [
      { step: "1", title: "Share Income Details", description: "Provide Form 16, bank statements, capital gains and investment proofs." },
      { step: "2", title: "Tax Computation", description: "Our experts compute total income, allowable exemptions, and final tax." },
      { step: "3", title: "E-Filing & Verification", description: "Your return is e-filed and e-verified on the official Income Tax portal." },
    ],
    documents: [
      "PAN Card & Aadhaar Card",
      "Form 16 / Form 16A / 26AS / AIS",
      "Bank Account Statements",
      "Investment Proofs (80C, 80D, etc.)",
      "Capital Gains / Business Income Proofs",
    ],
    benefits: [
      "Timely filing avoids penalties & interest",
      "Swift processing of tax refunds",
      "Essential income proof for bank loans and visas",
      "Professional compliance and error-free returns",
    ],
    faq: [
      {
        question: "Why should I file an Income Tax Return?",
        answer:
          "Filing an ITR provides legitimate proof of income, helps in claiming refunds of excess TDS deducted, and is necessary when applying for home loans, vehicle loans, or foreign visas.",
      },
    ],
  },

  // 14. GST REGISTRATION & FILING
  {
    slug: "gst-registration-filing",
    title: "GST Registration & Filing",
    category: "Business & Financial Services",
    image: gstRegistrationImg,
    heroTitle: "GST Registration & Return Filing Online",
    description:
      "Get your GST identification number (GSTIN) swiftly and maintain compliance with periodic GSTR-1, GSTR-3B and annual return filings.",
    highlights: [
      {
        title: "GSTIN Allotment",
        description: "Quick registration application and GST certificate issuance.",
      },
      {
        title: "Monthly/Quarterly Filing",
        description: "Seamless preparation and submission of GSTR-1 and GSTR-3B.",
      },
      {
        title: "ITC Reconciliation",
        description: "Maximize your input tax credit through accurate 2B reconciliations.",
      },
    ],
    process: [
      { step: "1", title: "Submit Business Info", description: "Provide business address proof, proprietor/partner KYC, and bank details." },
      { step: "2", title: "Application Preparation", description: "Prepare and submit the GST REG-01 application on the GST portal." },
      { step: "3", title: "GST Certificate", description: "Receive your verified 15-digit GSTIN registration certificate." },
    ],
    documents: [
      "PAN Card of Business / Proprietor",
      "Aadhaar Card of Promoters / Partners",
      "Electricity Bill / Rent Agreement of Premises",
      "Cancelled Cheque / Bank Statement",
      "Authorization Letter / Board Resolution",
    ],
    benefits: [
      "Legally recognized as a registered goods/service provider",
      "Enable inter-state trade and online e-commerce selling",
      "Pass on and claim Input Tax Credit seamlessly",
      "Avoid penalties under GST law",
    ],
    faq: [
      {
        question: "When is GST registration mandatory?",
        answer:
          "GST registration is mandatory for businesses supplying goods with turnover above ₹40 lakhs (₹20 lakhs in special states) and service providers above ₹20 lakhs (₹10 lakhs in special states), or for any inter-state supply.",
      },
    ],
  },

  // 15. BANK LOAN / FINANCING CONSULTANCY
  {
    slug: "bank-loan-consultancy",
    title: "Bank Loan / Financing Consultancy",
    category: "Business & Financial Services",
    image: bankLoanImg,
    heroTitle: "Bank Loan & Financing Consultation",
    description:
      "Comprehensive guidance and documentation assistance for business loans, MSME schemes, working capital, CC/OD limits, and personal/home loans.",
    highlights: [
      {
        title: "All Loan Types",
        description: "Support for CC Limits, Term Loans, OD, Mudra Loans, and CGTMSE.",
      },
      {
        title: "File Preparation",
        description: "Complete preparation of loan docket, financial statements, and ratio sheets.",
      },
      {
        title: "Bank Liaisoning",
        description: "Coordination with public and private banks for faster processing.",
      },
    ],
    process: [
      { step: "1", title: "Financial Profile Check", description: "Assess eligibility, credit profile, and funding requirements." },
      { step: "2", title: "Proposal & Dossier", description: "Compile financial models, CMA data, and property/KYC records." },
      { step: "3", title: "Sanction & Disbursal", description: "Assist through bank queries until loan sanction and amount disbursal." },
    ],
    documents: [
      "3 Years ITR with Computation and Balance Sheets",
      "Last 1 Year Bank Statements",
      "KYC of Promoters and Business Entity",
      "Collateral Property Papers (if applicable)",
      "Project Report & CMA Data",
    ],
    benefits: [
      "Access to competitive interest rates",
      "Higher approval rates with structured dossiers",
      "Guidance on government subsidy schemes",
      "Dedicated documentation support throughout",
    ],
    faq: [
      {
        question: "Can I get an MSME business loan without collateral?",
        answer:
          "Yes, under government schemes like CGTMSE and MUDRA, eligible micro and small enterprises can avail collateral-free loans up to specified statutory limits.",
      },
    ],
  },

  // 16. LIAISONING WITH GOVT OFFICES
  {
    slug: "government-liaisoning",
    title: "Liaisoning with Govt. Offices",
    category: "Business & Financial Services",
    image: govtLiaisoningImg,
    heroTitle: "Government Liaisoning & Statutory Clearances",
    description:
      "Get professional liaisoning and compliance coordination with various municipal corporations, state ministries, and regulatory authorities.",
    highlights: [
      {
        title: "Department Coordination",
        description: "Handling filings and queries across various government departments.",
      },
      {
        title: "License & NOC Support",
        description: "Securing statutory clearances, NOCs, and municipal trade permits.",
      },
      {
        title: "Timely Follow-ups",
        description: "Minimizing bureaucratic bottlenecks through proactive follow-ups.",
      },
    ],
    process: [
      { step: "1", title: "Requirement Assessment", description: "Identify statutory licenses and NOCs needed for your activity." },
      { step: "2", title: "Drafting & Application", description: "Prepare compliant representations and submit applications." },
      { step: "3", title: "Clearance & Delivery", description: "Coordinate with authorities to obtain approved orders and certificates." },
    ],
    documents: [
      "Entity Incorporation / KYC Documents",
      "Premises Ownership / Rental Documents",
      "Site Plans / Layout Plans",
      "Specific Department Application Forms",
      "Authorized Signatory Declarations",
    ],
    benefits: [
      "Zero compliance headaches for business owners",
      "Swift resolution of departmental queries",
      "Full transparency and adherence to legal norms",
      "Comprehensive regulatory clearance support",
    ],
    faq: [
      {
        question: "What departments do you provide liaisoning for?",
        answer:
          "We assist with Municipal Corporations, Revenue Departments, Pollution Control Boards, Fire Departments, and State Licensing Authorities.",
      },
    ],
  },

  // 17. TENDER CONSULTANCY
  {
    slug: "tender-consultancy",
    title: "Tender Consultancy",
    category: "Business & Financial Services",
    image: tenderConsultancyImg,
    heroTitle: "E-Tendering Consultancy & Bid Management",
    description:
      "End-to-end e-tendering support, GEM portal registration, bid preparation, and technical documentation to help you win government contracts.",
    highlights: [
      {
        title: "E-Procurement Portals",
        description: "Support for GeM, CPPP, State e-Tenders, and Railway portals.",
      },
      {
        title: "Bid Preparation",
        description: "Precise drafting of technical and financial bidding documents.",
      },
      {
        title: "Eligibility Analysis",
        description: "Detailed analysis of tender terms, EMD, and qualification criteria.",
      },
    ],
    process: [
      { step: "1", title: "Tender Scrutiny", description: "Review tender document (RFP), qualification criteria and EMD terms." },
      { step: "2", title: "Bid Compilation", description: "Prepare technical dossiers, declarations, and BOQ price templates." },
      { step: "3", title: "Online Submission", description: "Complete encrypted submission on designated e-tendering portal using DSC." },
    ],
    documents: [
      "Class 3 Digital Signature Certificate (DSC)",
      "Company Registration & GST Certificate",
      "3 Years Audited Financial Statements & CA Net Worth Certificate",
      "Past Work Orders & Completion Certificates",
      "Non-Blacklisting Affidavits & Declarations",
    ],
    benefits: [
      "Eliminates technical rejection errors",
      "Access high-value government procurement contracts",
      "GeM seller profile setup & product catalogue upload",
      "Complete bid submission support",
    ],
    faq: [
      {
        question: "What is required to participate in Government e-Tenders?",
        answer:
          "You need a Class 3 Digital Signature Certificate (DSC), active GST registration, appropriate vendor registration on the target portal (like GeM or eProcure), and relevant financial/technical credentials.",
      },
    ],
  },

  // 18. COMPANY REGISTRATION & ANNUAL COMPLIANCE
  {
    slug: "company-registration-compliance",
    title: "Company Registration & Annual Compliance",
    category: "Business & Financial Services",
    image: companyRegImg,
    heroTitle: "Private Limited & OPC Company Incorporation & Compliance",
    description:
      "Register your Private Limited Company, One Person Company (OPC), or Public Limited company with the MCA along with annual compliance filing support.",
    highlights: [
      {
        title: "MCA SPICe+ Filing",
        description: "Integrated incorporation including DIN, PAN, TAN, EPFO, and ESIC.",
      },
      {
        title: "MoA & AoA Drafting",
        description: "Customized Memorandum and Articles of Association for your company.",
      },
      {
        title: "Annual Compliance",
        description: "Complete support for AOC-4, MGT-7, and statutory ROC annual returns.",
      },
    ],
    process: [
      { step: "1", title: "Name Approval (RUN)", description: "Search and reserve a unique company name with the MCA." },
      { step: "2", title: "Documentation & DSC", description: "Obtain Digital Signatures and prepare incorporation affidavits." },
      { step: "3", title: "Incorporation Certificate", description: "Receive Certificate of Incorporation (CoI), PAN, TAN & DIN." },
    ],
    documents: [
      "PAN Card and Aadhaar Card of all Directors",
      "Voter ID / Passport / Driving License of Directors",
      "Bank Statement / Utility Bill (Latest 2 months) of Directors",
      "Registered Office Address Proof (Electricity bill & NOC)",
      "Passport-size Photographs",
    ],
    benefits: [
      "Limited liability protection for shareholders",
      "Enhanced credibility with investors and financial institutions",
      "Separate legal identity and perpetual succession",
      "Easy equity fundraising and scalability",
    ],
    faq: [
      {
        question: "How many directors are required for a Private Limited Company?",
        answer:
          "A minimum of 2 directors (at least one Indian resident) and 2 shareholders are required to incorporate a Private Limited Company.",
      },
    ],
  },

  // 19. LLP REGISTRATION & RELATED COMPLIANCE
  {
    slug: "llp-registration",
    title: "LLP Registration & Related Compliance",
    category: "Business & Financial Services",
    image: llpRegImg,
    heroTitle: "Limited Liability Partnership (LLP) Registration & Compliance",
    description:
      "Form your LLP combining the benefits of a partnership structure with limited liability protection under the MCA, plus Form 8 and Form 11 annual filings.",
    highlights: [
      {
        title: "Hybrid Structure",
        description: "Enjoy flexibility of a partnership with corporate legal standing.",
      },
      {
        title: "Limited Liability",
        description: "Partners are protected from unlimited liability and joint negligence.",
      },
      {
        title: "LLP Agreement",
        description: "Customized LLP Agreement drafted and filed via Form 3 with MCA.",
      },
    ],
    process: [
      { step: "1", title: "Name Reservation (RUN-LLP)", description: "Apply for unique LLP name reservation on the MCA portal." },
      { step: "2", title: "Incorporation Filing", description: "Submit FiLLiP forms along with partner KYC and DSC." },
      { step: "3", title: "Agreement Execution", description: "Draft, notarize, and file the LLP Agreement within 30 days." },
    ],
    documents: [
      "PAN Card & Aadhaar Card of Designated Partners",
      "Bank Statements / Utility Bills of Partners",
      "Registered Office Address Proof & Utility Bill",
      "NOC from the Property Owner",
      "Digital Signature Certificate (DSC)",
    ],
    benefits: [
      "Lower compliance burden compared to Pvt Ltd companies",
      "No mandatory audit requirement until specific turnover thresholds",
      "No minimum capital requirement",
      "Operational flexibility governed by agreement",
    ],
    faq: [
      {
        question: "When is statutory audit mandatory for an LLP?",
        answer:
          "An LLP is required to get its accounts audited only if its annual turnover exceeds ₹40 lakhs or its capital contribution exceeds ₹25 lakhs.",
      },
    ],
  },

  // 20. ACCOUNTING / AUDIT SERVICES
  {
    slug: "accounting-audit-services",
    title: "Accounting / Audit Services",
    category: "Business & Financial Services",
    image: accountingAuditImg,
    heroTitle: "Professional Accounting, Bookkeeping & Audit Services",
    description:
      "Maintain accurate financial records, regular bookkeeping, payroll management, and statutory audit readiness for your enterprise.",
    highlights: [
      {
        title: "Cloud Bookkeeping",
        description: "Ledger maintenance on Tally, Zoho Books, QuickBooks, or Busy.",
      },
      {
        title: "Tax & Statutory Audit",
        description: "Assistance with Tax Audits (Section 44AB), Internal and Statutory Audits.",
      },
      {
        title: "Payroll & MIS",
        description: "Monthly MIS reports, balance sheet finalization, and payroll processing.",
      },
    ],
    process: [
      { step: "1", title: "Data Collection", description: "Share sales/purchase invoices, bank statements, and expense vouchers." },
      { step: "2", title: "Ledger Reconciliation", description: "Categorization of transactions, bank reconciliations, and trial balance." },
      { step: "3", title: "Finalization & Audit", description: "Drafting P&L accounts, balance sheets, and coordinating audit review." },
    ],
    documents: [
      "Bank Statements of all business accounts",
      "Sales and Purchase Invoices / Registers",
      "Expense Bills and Vouchers",
      "Previous Year Balance Sheets & Tax Filings",
      "Fixed Asset Invoices and Registers",
    ],
    benefits: [
      "Real-time insight into business financial health",
      "Full compliance with accounting standards (Ind-AS/GAAP)",
      "Hassle-free tax filings and audit completions",
      "Cost-effective alternative to hiring an in-house accounting team",
    ],
    faq: [
      {
        question: "How frequently will my accounts be updated?",
        answer:
          "We offer flexible plans ranging from daily, weekly, to monthly bookkeeping updates depending on your transaction volume and reporting needs.",
      },
    ],
  },

  // 21. PROJECT REPORT & FINANCING
  {
    slug: "project-report-financing",
    title: "Project Report & Financing",
    category: "Business & Financial Services",
    image: projectReportImg,
    heroTitle: "Detailed Project Reports (DPR) & CMA Data Preparation",
    description:
      "Bankable Project Reports, CMA Data, and Financial Viability Models customized for bank loan approvals, venture funding, and subsidies.",
    highlights: [
      {
        title: "Bank-Compliant CMA",
        description: "Multi-year Credit Monitoring Arrangement (CMA) data in bank formats.",
      },
      {
        title: "Detailed Project Report",
        description: "Comprehensive industry, operational, and financial feasibility analysis.",
      },
      {
        title: "Financial Projections",
        description: "Projected P&L, Balance Sheet, Cash Flow, DSCR, and Break-Even Analysis.",
      },
    ],
    process: [
      { step: "1", title: "Business Model Discussion", description: "Understand project cost, machinery, working capital, and revenue model." },
      { step: "2", title: "Drafting Projections & CMA", description: "Formulate realistic financial forecasts and calculate key banking ratios." },
      { step: "3", title: "Final Report Delivery", description: "Delivery of bank-ready signed and certified project reports." },
    ],
    documents: [
      "Promoter KYC & Profile Summary",
      "Past 3 Years Audited Financials (if existing business)",
      "Quotations for Machinery / Civil Construction Estimates",
      "Proposed Product Pricing and Capacity Utilisation Assumptions",
      "Bank Loan Requirement Details",
    ],
    benefits: [
      "Accelerates bank loan appraisal and sanction process",
      "Accurate calculation of DSCR, IRR, and Current Ratio",
      "Tailored for PMEGP, Stand-Up India, Mudra, and Subsidy schemes",
      "Prepared by seasoned financial analysts and CAs",
    ],
    faq: [
      {
        question: "What is CMA data and why do banks require it?",
        answer:
          "CMA (Credit Monitoring Arrangement) data is a comprehensive financial report that presents past performance and future projections, helping bankers assess repayment capacity and working capital limits.",
      },
    ],
  },

  // 22. TRUST REGISTRATION & AUDIT
  {
    slug: "trust-registration",
    title: "Trust Registration & Audit",
    category: "Business & Financial Services",
    image: trustRegImg,
    heroTitle: "Trust, Society & Section 8 NGO Registration",
    description:
      "Establish your non-profit organization with Public Trust registration, Society formation, Section 8 Company incorporation, and 12A/80G tax exemptions.",
    highlights: [
      {
        title: "Multiple NGO Formats",
        description: "Assistance with Charitable Trusts, Societies, and Section 8 Companies.",
      },
      {
        title: "Trust Deed Drafting",
        description: "Comprehensive drafting of bylaws, trust deeds, and non-profit MOA/AOA.",
      },
      {
        title: "12A & 80G Exemptions",
        description: "Filing for income tax exemption under Section 12A and donor benefits under 80G.",
      },
    ],
    process: [
      { step: "1", title: "Structure Selection", description: "Choose between Trust, Society, or Section 8 Company based on your objectives." },
      { step: "2", title: "Deed / MoA Drafting", description: "Draft the objects, trustee rules, and operational guidelines." },
      { step: "3", title: "Registration & Tax Filings", description: "Complete registration with Charity Commissioner / Registrar / MCA and apply for 12A/80G." },
    ],
    documents: [
      "KYC (PAN & Aadhaar) of all Trustees / Directors",
      "Registered Office Proof & Electricity Bill",
      "NOC from Property Owner",
      "Trust Deed / Memorandum of Association",
      "Photographs of all Trustees / Founders",
    ],
    benefits: [
      "Official legal identity for philanthropic and social causes",
      "100% tax exemption on trust income with 12A registration",
      "Tax deduction benefits for donors under Section 80G",
      "Eligibility for Government grants and CSR funding",
    ],
    faq: [
      {
        question: "Which NGO format is best: Trust, Society, or Section 8 Company?",
        answer:
          "Charitable Trusts are simple to set up locally, Societies are ideal for member-based clubs and associations, whereas Section 8 Companies enjoy national recognition, higher transparency, and easier CSR funding.",
      },
    ],
  },

  // 23. IMPORT EXPORT CODE (IEC)
  {
    slug: "import-export-code",
    title: "Import Export Code (IEC)",
    category: "Business & Financial Services",
    image: iecCodeImg,
    heroTitle: "Import Export Code (IEC) Registration Online",
    description:
      "Get your 10-digit Import Export Code (IEC) issued by the Directorate General of Foreign Trade (DGFT) to start global trading.",
    highlights: [
      {
        title: "DGFT Allotment",
        description: "Quick online application and verification with DGFT integration.",
      },
      {
        title: "Lifetime Validity",
        description: "IEC comes with lifetime validity and requires only annual online renewal.",
      },
      {
        title: "Global Trade Access",
        description: "Mandatory for customs clearance, receiving foreign remittances, and export incentives.",
      },
    ],
    process: [
      { step: "1", title: "Submit KYC & Business Proofs", description: "Provide entity PAN, bank certificate, and address proof." },
      { step: "2", title: "DGFT Application Filing", description: "We prepare and submit the online application via the DGFT portal using DSC/Aadhaar OTP." },
      { step: "3", title: "IEC Certificate Download", description: "Receive your official IEC e-Certificate directly in your email." },
    ],
    documents: [
      "Individual / Business PAN Card",
      "Aadhaar Card of Applicant",
      "Cancelled Cheque / Bank Certificate showing Business Account",
      "Registered Business Address Proof (Electricity bill / Rent agreement)",
      "Digital Signature Certificate (Class 3) or Aadhaar OTP access",
    ],
    benefits: [
      "Expands your market reach globally",
      "Unlocks government export schemes and RoDTEP benefits",
      "No periodic return filings required for IEC alone",
      "Hassle-free customs port clearance",
    ],
    faq: [
      {
        question: "Is annual updating of IEC mandatory?",
        answer:
          "Yes, as per DGFT guidelines, every IEC holder must confirm/update their IEC details electronically on the DGFT portal annually between April and June.",
      },
    ],
  },

  // 24. DIGITAL SIGNATURE CERTIFICATE (DSC)
  {
    slug: "digital-signature-certificate",
    title: "Digital Signature Certificate (DSC)",
    category: "Business & Financial Services",
    image: dscImg,
    heroTitle: "Class 3 Digital Signature Certificate (DSC) Online",
    description:
      "Get Class 3 Digital Signature Certificates with FIPS certified USB crypto tokens for MCA filings, e-tenders, GST, income tax, and trademark portals.",
    highlights: [
      {
        title: "Class 3 Security",
        description: "Highest cryptographic assurance for signing, encryption, and combo use.",
      },
      {
        title: "Instant Video Verification",
        description: "Fast-track paperless verification approved within 30 minutes.",
      },
      {
        title: "Hardware USB Token",
        description: "Pre-installed on secure, tamper-proof USB tokens (ePass2003 / Watchdata).",
      },
    ],
    process: [
      { step: "1", title: "Submit Identification", description: "Provide PAN, Aadhaar, email, and mobile number." },
      { step: "2", title: "Video Verification", description: "Complete a quick 30-second mobile video recording for identity proof." },
      { step: "3", title: "Token Dispatch / Download", description: "DSC is downloaded to your crypto token and ready for immediate use." },
    ],
    documents: [
      "Applicant PAN Card",
      "Applicant Aadhaar Card (linked with mobile)",
      "Passport Size Photograph",
      "Active Mobile Number and Email ID",
      "Organization proofs (if applying for Company DSC)",
    ],
    benefits: [
      "Legally valid and accepted on all Indian government portals",
      "Essential for MCA, Income Tax, GST, PF, and e-Tendering",
      "Encrypted security prevents document forgery and tampering",
      "Validity options of 2 years or 3 years",
    ],
    faq: [
      {
        question: "What is the difference between Signing and Combo DSC?",
        answer:
          "Signing DSC is used for authenticating digital forms (MCA, GST, ITR), whereas Combo DSC includes both Signing and Encryption, which is compulsory for e-tendering and e-procurement portals.",
      },
    ],
  },

  // ===========================================================================
  // SECTION 3: OTHER SERVICES (25 - 36)
  // ===========================================================================

  // 25. REAL ESTATE SERVICES
  {
    slug: "real-estate-services",
    title: "Real Estate Services (Sell / Purchase / Rent / Lease)",
    category: "Other Services",
    image: realEstateImg,
    heroTitle: "End-to-End Real Estate & Property Advisory",
    description:
      "Comprehensive advisory on property acquisitions, sales, leasing, legal due diligence, title verification, valuation reports, and transaction execution.",
    highlights: [
      {
        title: "Property Verification",
        description: "Thorough legal scrutiny of land records, approved layouts, and title chains.",
      },
      {
        title: "RERA Guidance",
        description: "Compliance advisory for real estate buyers, sellers, and promoters under RERA.",
      },
      {
        title: "Transaction Structuring",
        description: "Drafting MoUs, agreements for sale, development agreements, and deeds.",
      },
    ],
    process: [
      { step: "1", title: "Property & Document Submission", description: "Share available property papers, survey numbers, and ownership history." },
      { step: "2", title: "Legal Scrutiny & Due Diligence", description: "Our legal team verifies municipal records, encumbrances, and litigation history." },
      { step: "3", title: "Advisory & Closing", description: "Receive legal opinion report and assistance during final deed execution." },
    ],
    documents: [
      "Chain of Title Deeds / Previous Sale Deeds",
      "7/12 Extract / Property Card / Index II",
      "Sanctioned Building Plan & Layout Approvals",
      "Property Tax Paid Receipts",
      "Identity Proof of Buyer and Seller",
    ],
    benefits: [
      "Eliminate fraud and disputed property risks",
      "Transparent valuation and legal verification",
      "Smooth execution of high-value property deals",
      "Expert assistance through RERA compliance",
    ],
    faq: [
      {
        question: "Why is title due diligence necessary before buying property?",
        answer:
          "Title due diligence confirms the seller's legal ownership, checks for pending mortgages or legal disputes, and ensures the property is free of encumbrances.",
      },
    ],
  },

  // 26. LIGHT BILL NAME TRANSFER
  {
    slug: "light-bill-name-transfer",
    title: "Name Transfer & Address Update in Light Bill",
    category: "Other Services",
    image: lightBillTransferImg,
    heroTitle: "Electricity / Light Bill Name Change Assistance",
    description:
      "Get your electricity meter and bill transferred into your name effortlessly across state and private electricity distribution boards.",
    highlights: [
      {
        title: "Discom Support",
        description: "Assistance across MSEDCL, Adani Electricity, Tata Power, BESCOM, and more.",
      },
      {
        title: "Swift Processing",
        description: "Complete paperwork and online submission to prevent service delays.",
      },
      {
        title: "NOC & Indemnity Drafting",
        description: "Preparation of necessary affidavits, indemnity bonds, and owner NOCs.",
      },
    ],
    process: [
      { step: "1", title: "Document Submission", description: "Upload your latest electricity bill, property proof, and ID proof." },
      { step: "2", title: "Application Preparation", description: "We prepare Form U/A6 and supporting indemnity undertakings." },
      { step: "3", title: "Department Approval", description: "Follow-up with the discom office until name update reflects on the bill." },
    ],
    documents: [
      "Latest Electricity Bill copy",
      "Registered Sale Deed / Index II / Gift Deed / Will",
      "Property Tax Receipt / Allotment Letter",
      "Aadhaar Card and PAN Card of New Owner",
      "NOC from Previous Owner (or Death Certificate if inherited)",
    ],
    benefits: [
      "Official ownership record updated with utility board",
      "Prevents future disputes regarding energy consumption and dues",
      "Valid proof of address in your name for banking and visa",
      "Hassle-free process without visiting local electricity offices",
    ],
    faq: [
      {
        question: "What if the previous owner is deceased?",
        answer:
          "In case of inheritance or deceased owner, the legal heir can transfer the meter by providing the death certificate along with legal heir certificate/succession certificate and indemnity bond.",
      },
    ],
  },

  // 27. PROPERTY / WATER TAX TRANSFER
  {
    slug: "property-water-tax-transfer",
    title: "Name Transfer in Property / Water Tax Bill / NMC Services",
    category: "Other Services",
    image: propertyTaxTransferImg,
    heroTitle: "Property Tax & Water Tax Name Transfer (Ferfar)",
    description:
      "Update your name in Municipal Corporation records for property tax, water meter assessment, and municipal tax bills.",
    highlights: [
      {
        title: "Municipal Records Update",
        description: "Facilitating mutation in BMC, PMC, PCMC, BBMP, NMC and local councils.",
      },
      {
        title: "Document Scrutiny",
        description: "Ensuring Index II, chain deeds, and NOCs meet civic municipal requirements.",
      },
      {
        title: "Water Tax Transfer",
        description: "Simultaneous transfer of municipal water connection and billing records.",
      },
    ],
    process: [
      { step: "1", title: "Share Property Records", description: "Provide the latest tax assessment receipt, Index II, and sale deed." },
      { step: "2", title: "Municipal Filing", description: "Submit transfer/mutation application with required indemnity declarations." },
      { step: "3", title: "Name Mutation Receipt", description: "Receive the official updated property tax extract in your name." },
    ],
    documents: [
      "Latest Property Tax Bill & Paid Receipt",
      "Registered Sale Deed / Gift Deed & Index II",
      "Society NOC (if applicable)",
      "Applicant Aadhaar Card & PAN Card",
      "Affidavit / Indemnity Bond on Stamp Paper",
    ],
    benefits: [
      "Official municipal recognition of ownership",
      "Prevents legal liabilities of previous owner's tax defaults",
      "Required for property resale, redevelopment, and housing loans",
      "Direct municipal billing in the rightful owner's name",
    ],
    faq: [
      {
        question: "How long does property tax name transfer take?",
        answer:
          "Depending on the municipal corporation and document verification speed, the mutation is typically completed within 15 to 30 working days.",
      },
    ],
  },

  // 28. ALL TYPES OF INSURANCE
  {
    slug: "insurance-services",
    title: "All Types of Insurance",
    category: "Other Services",
    image: insuranceImg,
    heroTitle: "Comprehensive Insurance & Wealth Protection",
    description:
      "Expert advisory and hassle-free policy issuance for Health Insurance, Term Life Plans, Commercial Insurance, and Vehicle Insurance.",
    highlights: [
      {
        title: "Comprehensive Coverage",
        description: "Health, Term Life, Fire, Marine, Liability, and Motor Insurance.",
      },
      {
        title: "Claim Settlement Support",
        description: "Dedicated assistance during hospitalization and claims processing.",
      },
      {
        title: "Comparative Analysis",
        description: "Unbiased comparison across leading IRDAI-registered insurance providers.",
      },
    ],
    process: [
      { step: "1", title: "Need Analysis", description: "Identify family health risks, financial liabilities, and asset values." },
      { step: "2", title: "Plan Comparison", description: "Review benefits, network hospitals, exclusions, and premium quotes." },
      { step: "3", title: "Policy Issuance", description: "Instant medical scheduling and rapid policy document delivery." },
    ],
    documents: [
      "KYC (PAN & Aadhaar Card) of Proposer & Insured",
      "Passport Size Photograph",
      "Medical Records / Past Treatment History (if applicable)",
      "Income Proof (ITR / Salary Slips for high-value Term plans)",
      "Vehicle RC Book (for Motor Insurance)",
    ],
    benefits: [
      "Financial security against unforeseen medical emergencies",
      "Tax saving benefits under Section 80D (Health) and 80C (Life)",
      "Cashless claims across thousands of network hospitals",
      "Customized add-ons and riders for total coverage",
    ],
    faq: [
      {
        question: "Can I get health insurance without pre-policy medical checkups?",
        answer:
          "Yes, many insurance plans offer instant coverage without medical tests for individuals below 45-50 years of age with no declared pre-existing illnesses.",
      },
    ],
  },

  // 29. SERVICES FOR START-UPS
  {
    slug: "startup-services",
    title: "Services for Start-Ups",
    category: "Other Services",
    image: startupServicesImg,
    heroTitle: "DPIIT Startup India Recognition & Advisory",
    description:
      "Turn your innovative idea into an officially recognized startup with DPIIT recognition, Seed Fund schemes, and tax exemption filings.",
    highlights: [
      {
        title: "Startup India Certificate",
        description: "Get DPIIT recognition to unlock government tenders and tax holidays.",
      },
      {
        title: "Section 80-IAC Exemption",
        description: "Assistance with 3-year consecutive income tax exemption applications.",
      },
      {
        title: "IP Fast-Tracking",
        description: "Avail up to 80% rebate on patent and 50% rebate on trademark filings.",
      },
    ],
    process: [
      { step: "1", title: "Pitch & Innovation Deck", description: "Review business model, innovation aspect, and scalability potential." },
      { step: "2", title: "DPIIT Portal Application", description: "Submit registration with detailed write-ups, pitch deck, and video demo." },
      { step: "3", title: "Certificate Issuance", description: "Receive your official DPIIT Startup Certificate and access portal perks." },
    ],
    documents: [
      "Company / LLP Certificate of Incorporation",
      "MoA & AoA / Partnership Agreement",
      "Pitch Deck / Business Innovation Brief",
      "Website URL / Mobile App Link / Product Demo",
      "Director KYC and Shareholding Details",
    ],
    benefits: [
      "Exemption from Angel Tax under Section 56(2)(viib)",
      "Eligibility for Startup India Seed Fund Scheme (SISFS)",
      "Exemption from prior experience/turnover criteria in govt tenders",
      "Self-certification compliance under 6 labour and 3 environmental laws",
    ],
    faq: [
      {
        question: "Who is eligible for DPIIT Startup India Recognition?",
        answer:
          "An entity incorporated as a Private Limited Company, LLP, or Registered Partnership within the last 10 years, with turnover under ₹100 crores and working towards innovation, development, or improvement of products or scalable business models.",
      },
    ],
  },

  // 30. DIGITAL MARKETING
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Other Services",
    image: digitalMarketingImg,
    heroTitle: "Digital Marketing, SEO & Web Growth Solutions",
    description:
      "Grow your online presence, generate verified leads, and build authority with expert SEO, Google Ads, Social Media, and Web Development.",
    highlights: [
      {
        title: "Search Engine Optimization",
        description: "Rank on Page 1 of Google for high-intent business keywords.",
      },
      {
        title: "Performance Marketing",
        description: "High-ROI Google Search Ads, Meta (FB/Instagram) Ads & Lead Generation.",
      },
      {
        title: "Website & Branding",
        description: "Modern, high-converting responsive websites and corporate branding.",
      },
    ],
    process: [
      { step: "1", title: "Audit & Strategy", description: "Analyze market competitors, target audience, and current digital footprint." },
      { step: "2", title: "Campaign Execution", description: "Deploy landing pages, creative ads, tracking pixels, and SEO optimizations." },
      { step: "3", title: "Optimization & Scaling", description: "Continuous A/B testing, cost-per-lead reduction, and weekly analytics reports." },
    ],
    documents: [
      "Business Profile & Service Offerings",
      "Domain and Hosting Access (if existing)",
      "Brand Logos & Brand Color Guidelines",
      "Target Audience & Geographic Target Details",
    ],
    benefits: [
      "Consistent influx of qualified customer inquiries and sales",
      "Higher brand trust, visibility, and market authority",
      "Measurable return on advertising spend (ROAS)",
      "Customized growth plans suited for startups to established enterprises",
    ],
    faq: [
      {
        question: "How soon can I expect results from digital marketing campaigns?",
        answer:
          "Paid search and social ads deliver inbound leads within 24 to 48 hours of launch, while organic SEO builds compounding organic traffic over 3 to 6 months.",
      },
    ],
  },

  // 31. MSME / UDYAM REGISTRATION
  {
    slug: "msme-registration",
    title: "MSME / UDYAM Registration",
    category: "Other Services",
    image: msmeUdyamImg,
    heroTitle: "MSME / Udyam Registration Online",
    description:
      "Register your Micro, Small or Medium enterprise on the Udyam portal to unlock bank loan subsidies, priority lending, and government concessions.",
    highlights: [
      {
        title: "Government Recognition",
        description: "Official Udyam Certificate with unique registration number and QR code.",
      },
      {
        title: "Priority Lending",
        description: "Lower interest rates and collateral-free bank loans under MSME schemes.",
      },
      {
        title: "100% Paperless",
        description: "Aadhaar-based instant registration with zero departmental visits.",
      },
    ],
    process: [
      { step: "1", title: "Share Enterprise Details", description: "Provide enterprise name, plant/office address, and bank account info." },
      { step: "2", title: "NIC Code Mapping", description: "Correct selection of National Industrial Classification (NIC) manufacturing/service codes." },
      { step: "3", title: "Certificate Issuance", description: "Udyam Registration Certificate is generated with permanent validity." },
    ],
    documents: [
      "Aadhaar Card of the Proprietor / Partner / Director",
      "PAN Card of the Enterprise / Applicant",
      "Bank Account Details & IFSC Code",
      "Business Address & Number of Employees",
      "Investment in Plant & Machinery / Turnover Details",
    ],
    benefits: [
      "Protection against delayed payments under MSMED Act",
      "50% subsidy on patent and trademark registration fees",
      "Concession in electricity bills and ISO certification charges",
      "Direct eligibility for public procurement tender exemptions",
    ],
    faq: [
      {
        question: "Is Udyam registration free and does it have an expiration date?",
        answer:
          "The Udyam registration certificate has lifetime validity and does not require periodic renewal once issued.",
      },
    ],
  },

  // 32. SHOP ACT LICENSE
  {
    slug: "shop-act-license",
    title: "Shop Act License",
    category: "Other Services",
    image: shopActImg,
    heroTitle: "Shop & Establishment License (Gumasta) Online",
    description:
      "Obtain your municipal Shop and Establishment registration / Gumasta license mandatory for operating commercial premises and opening current accounts.",
    highlights: [
      {
        title: "Mandatory Compliance",
        description: "Compulsory for shops, offices, commercial establishments, and eateries.",
      },
      {
        title: "Current Account Ready",
        description: "Primary legal proof accepted by all banks to open a business bank account.",
      },
      {
        title: "Intimation / Registration",
        description: "Assistance with Form A (0-9 employees intimation) and Form B registrations.",
      },
    ],
    process: [
      { step: "1", title: "Submit Shop Details", description: "Provide business name, nature of activity, and number of workers." },
      { step: "2", title: "Municipal Portal Application", description: "Submit online application along with premises photo and owner KYC." },
      { step: "3", title: "License Delivery", description: "Receive the official Shop Act Registration certificate." },
    ],
    documents: [
      "Aadhaar Card and PAN Card of Employer",
      "Photo of Shop / Office with Signboard visible",
      "Rent Agreement and Owner NOC (if rented premises)",
      "Electricity Bill / Property Tax Receipt of Premises",
      "List of Employees and designation details (if applicable)",
    ],
    benefits: [
      "Legal entitlement to conduct trade and commercial activities",
      "Avoid municipal inspection penalties and closures",
      "Serves as official business entity proof for other statutory licenses",
      "Smooth employee regulation and statutory welfare compliance",
    ],
    faq: [
      {
        question: "Is Shop Act license required for home-based businesses or freelancers?",
        answer:
          "Yes, if you operate a commercial service from home or need to open a formal bank current account in your business trade name, a Shop Act intimation is recommended.",
      },
    ],
  },

  // 33. FSSAI / FOOD LICENSE
  {
    slug: "fssai-license",
    title: "FSSAI / Food License",
    category: "Other Services",
    image: fssaiImg,
    heroTitle: "FSSAI Food Safety License & Registration (FOSCOS)",
    description:
      "Get your 14-digit FSSAI Food Safety License or Registration mandatory for all Food Business Operators (FBOs), restaurants, cloud kitchens, and traders.",
    highlights: [
      {
        title: "14-Digit FSSAI Number",
        description: "Mandatory registration printed on all food packages and restaurant bills.",
      },
      {
        title: "All Categories Covered",
        description: "Basic Registration, State License, and Central FSSAI License support.",
      },
      {
        title: "Zomato / Swiggy Ready",
        description: "Compulsory prerequisite for onboarding on food delivery platforms.",
      },
    ],
    process: [
      { step: "1", title: "Category Selection", description: "Determine eligibility for Basic, State, or Central license based on turnover." },
      { step: "2", title: "FoSCoS Filing", description: "File application with food category list and kitchen layout plans." },
      { step: "3", title: "License Allotment", description: "Receive official FSSAI certificate with chosen validity (1 to 5 years)." },
    ],
    documents: [
      "Applicant Photo and Identity Proof (Aadhaar/PAN)",
      "Premises Address Proof (Electricity bill & Rent Agreement)",
      "List of Food Products / Categories to be handled",
      "Kitchen Layout Plan / Water Test Report (for State/Central License)",
      "Partnership Deed / Incorporation Certificate (if applicable)",
    ],
    benefits: [
      "Builds high consumer trust in food safety standards",
      "Compulsory for selling food items online (Swiggy, Zomato, Blinkit)",
      "Avoid heavy fines and statutory prosecution under FSS Act",
      "Enables smooth legal expansion of food brand franchises",
    ],
    faq: [
      {
        question: "What is the difference between FSSAI Registration and FSSAI License?",
        answer:
          "FSSAI Basic Registration is for small food businesses with an annual turnover up to ₹12 lakhs. Businesses exceeding ₹12 lakhs up to ₹20 crores require a State License, and those above ₹20 crores require a Central License.",
      },
    ],
  },

  // 34. PASSPORT SERVICES
  {
    slug: "passport-services",
    title: "Passport Services",
    category: "Other Services",
    image: passportImg,
    heroTitle: "Fresh & Renewal Passport Application Assistance",
    description:
      "End-to-end guidance for fresh passport applications, Tatkaal passports, renewals, minor passports, and appointment booking at PSK / POPSK.",
    highlights: [
      {
        title: "Fresh & Tatkaal Passports",
        description: "Fast-track application filing with priority appointment slots.",
      },
      {
        title: "Passport Renewal",
        description: "Seamless renewal for expired passports or address/name changes.",
      },
      {
        title: "Document Scrutiny",
        description: "Pre-appointment document check to avoid rejection at the PSK counter.",
      },
    ],
    process: [
      { step: "1", title: "Submit Applicant Info", description: "Provide personal details, educational qualifications, and address proofs." },
      { step: "2", title: "Slot Booking & Fee Payment", description: "We file the online form and book your preferred date at the nearest PSK." },
      { step: "3", title: "PSK Visit & Police Verification", description: "Guidance for your biometric counter visit and local police verification." },
    ],
    documents: [
      "Aadhaar Card (with matching name and date of birth)",
      "PAN Card / Voter ID / Driving License",
      "Birth Certificate / 10th Standard Passing Certificate (for Non-ECR)",
      "Old Passport booklet copy (in case of renewal/reissue)",
      "Marriage Certificate / Annexure (if updating spouse name)",
    ],
    benefits: [
      "Error-free form submission avoiding application rejections",
      "Priority appointment date booking",
      "Clear guidance on Non-ECR (Emigration Check Not Required) status",
      "Complete tracking until passport is delivered by Speed Post",
    ],
    faq: [
      {
        question: "How fast can I get a passport under the Tatkaal scheme?",
        answer:
          "Under the Tatkaal scheme, passports are dispatched within 1 to 3 business days following the successful appointment and verification at the Passport Seva Kendra.",
      },
    ],
  },

  // 35. VOTER ID / PAN / TAN SERVICES
  {
    slug: "voter-pan-tan-services",
    title: "Voter ID / PAN / TAN Services",
    category: "Other Services",
    image: voterPanTanImg,
    heroTitle: "Voter ID, PAN Card & TAN Application Services",
    description:
      "Fast application and correction services for Permanent Account Number (PAN), Tax Deduction Account Number (TAN), and Voter ID cards.",
    highlights: [
      {
        title: "PAN Card Services",
        description: "Fresh PAN, correction in name/DOB, minor-to-major update, and e-PAN download.",
      },
      {
        title: "TAN Allotment",
        description: "Mandatory 10-digit TAN allotment for TDS deduction and filing compliance.",
      },
      {
        title: "Voter ID (EPIC)",
        description: "New voter card registration (Form 6), address change, and digital EPIC card.",
      },
    ],
    process: [
      { step: "1", title: "Select Service & Upload KYC", description: "Submit your basic identification and address documents." },
      { step: "2", title: "Verification & Filing", description: "Application is submitted on NSDL/UTIITSL/ECI portals with digital authentication." },
      { step: "3", title: "Card Issuance & Dispatch", description: "Digital e-card issued quickly and physical card dispatched to your address." },
    ],
    documents: [
      "Aadhaar Card (linked with mobile)",
      "Proof of Date of Birth (Birth Certificate / School Leaving)",
      "Proof of Address (Utility Bill / Bank Statement)",
      "Passport Size Photographs",
      "Entity Proof (for Corporate PAN/TAN applications)",
    ],
    benefits: [
      "Essential identity cards for banking, tax filings, and legal affairs",
      "Speedy resolution for corrections and lost card duplicates",
      "Assistance with instant e-PAN generation in emergencies",
      "Direct home delivery by India Post",
    ],
    faq: [
      {
        question: "How long does it take to receive a physical PAN card?",
        answer:
          "Digital e-PAN is generated within 24 to 48 hours, and the physical laminated PAN card is delivered by Speed Post within 7 to 10 working days.",
      },
    ],
  },

  // 36. LIQUOR CONSUMPTION LICENSE
  {
    slug: "liquor-license",
    title: "Liquor Consumption License",
    category: "Other Services",
    image: liquorLicenseImg,
    heroTitle: "Liquor License & State Excise Permissions",
    description:
      "Professional documentation and liaisoning for State Excise Department liquor licenses, party permits, bar/restaurant FL-III licenses, and retail permissions.",
    highlights: [
      {
        title: "FL-II & FL-III Licenses",
        description: "Licensing support for bars, restaurants, permit rooms, and retail vendors.",
      },
      {
        title: "One-Day Event Permits",
        description: "Quick temporary party permits (FL-4) for private functions and weddings.",
      },
      {
        title: "Excise Compliance",
        description: "Guidance on distance norms, police NOCs, and municipal clearances.",
      },
    ],
    process: [
      { step: "1", title: "Premises & Eligibility Check", description: "Evaluate location for statutory distance restrictions from schools/places of worship." },
      { step: "2", title: "Compilation of NOCs & Dossier", description: "Gather fire NOC, health license, police clearance, and layout drawings." },
      { step: "3", title: "State Excise Submission", description: "Submit to the State Excise Commissionerate and manage departmental inspection." },
    ],
    documents: [
      "Applicant Identity Proof (PAN, Aadhaar, IT Returns)",
      "Premises Ownership / 5-Year Registered Lease Agreement",
      "Sanctioned Commercial Layout Plan with Site Blueprints",
      "Health / Trade License from Municipal Authority",
      "Fire Department NOC & Police Verification Report",
    ],
    benefits: [
      "Full compliance with strict State Excise legal statutes",
      "Avoid hefty police and excise department penalties",
      "Seamless licensing for hospitality and entertainment venues",
      "Clear advice on annual license renewal and tax fee structures",
    ],
    faq: [
      {
        question: "What is a temporary one-day liquor permit?",
        answer:
          "A temporary one-day permit (such as Form FL-4) is issued by the State Excise department allowing the legal serving of liquor at private parties, banquets, and commercial events for a specific date and venue.",
      },
    ],
  },
];

export default serviceDetailsData;