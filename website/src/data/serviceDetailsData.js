// =====================================================
// IMAGE ASSET IMPORTS FROM ../assets/
// =====================================================
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

const serviceDetailsData = [
  // =========================================================
  // 1. MARRIAGE REGISTRATION
  // =========================================================
  {
    slug: "marriage-registration",
    title: "Marriage Registration",
    image: marriageRegImg, // 🖼️ Added Image Property

    heroTitle: "Marriage Registration Online – Complete Legal Assistance",

    description:
      "Get complete assistance for marriage registration with document guidance, application support and hassle-free processing.",

    highlights: [
      {
        icon: "💍",
        title: "Easy Registration",
        description:
          "Get complete assistance for registering your marriage legally.",
      },
      {
        icon: "📄",
        title: "Document Support",
        description:
          "Guidance for preparing and submitting the required documents.",
      },
      {
        icon: "✅",
        title: "Expert Assistance",
        description:
          "Professional support throughout the registration process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Details",
        description:
          "Provide basic details of both partners and the marriage.",
      },
      {
        step: "2",
        title: "Submit Documents",
        description:
          "Provide the required documents for verification.",
      },
      {
        step: "3",
        title: "Registration Support",
        description:
          "Get assistance with the marriage registration process.",
      },
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

  // =========================================================
  // 2. LEAVE & LICENCE / RENT AGREEMENT
  // =========================================================
  {
    slug: "leave-licence-rent-agreement",
    title: "Leave & Licence / Rent Agreement",
    image: rentAgreementImg, // 🖼️ Added Image Property

    heroTitle: "Leave & Licence / Rent Agreement Online",

    description:
      "Get assistance with preparing and registering your Leave & Licence or Rent Agreement with proper documentation support.",

    highlights: [
      {
        icon: "🏠",
        title: "Agreement Preparation",
        description:
          "Get assistance in preparing your rental agreement.",
      },
      {
        icon: "📄",
        title: "Documentation Support",
        description:
          "Guidance for required documents and information.",
      },
      {
        icon: "🔐",
        title: "Secure Process",
        description:
          "Your agreement details and documents are handled securely.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Property Details",
        description:
          "Provide landlord, tenant and property information.",
      },
      {
        step: "2",
        title: "Agreement Preparation",
        description:
          "The required agreement is prepared based on the provided details.",
      },
      {
        step: "3",
        title: "Registration Support",
        description:
          "Get assistance with the registration and documentation process.",
      },
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

  // =========================================================
  // 3. TENANT POLICE VERIFICATION
  // =========================================================
  {
    slug: "tenant-police-verification",
    title: "Tenant Police Verification",
    image: tenantVerificationImg, // 🖼️ Added Image Property

    heroTitle: "Tenant Police Verification Online",

    description:
      "Get assistance with tenant police verification and complete the required documentation conveniently.",

    highlights: [
      {
        icon: "👮",
        title: "Police Verification Support",
        description:
          "Assistance with the tenant verification process.",
      },
      {
        icon: "📄",
        title: "Document Guidance",
        description:
          "Guidance on documents and information required for verification.",
      },
      {
        icon: "⚡",
        title: "Simple Process",
        description:
          "Get support throughout the verification procedure.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Tenant Details",
        description:
          "Provide the required tenant and property information.",
      },
      {
        step: "2",
        title: "Document Submission",
        description:
          "Submit the required identification and address documents.",
      },
      {
        step: "3",
        title: "Verification Support",
        description:
          "Get assistance with the police verification process.",
      },
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

  // =========================================================
  // 4. GOVT GAZETTE
  // =========================================================
  {
    slug: "govt-gazette-change",
    title: "Govt. Gazette – Name / DOB / Religion Change",
    image: govtGazetteImg, // 🖼️ Added Image Property

    heroTitle: "Government Gazette Name, DOB & Other Changes",

    description:
      "Get assistance with Government Gazette publication for eligible changes such as name, date of birth and other personal details.",

    highlights: [
      {
        icon: "📜",
        title: "Gazette Assistance",
        description:
          "Complete guidance for the Gazette publication process.",
      },
      {
        icon: "📄",
        title: "Document Support",
        description:
          "Assistance with preparing the required documentation.",
      },
      {
        icon: "✅",
        title: "Professional Guidance",
        description:
          "Support throughout the application process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Details",
        description:
          "Provide details about the change you want to make.",
      },
      {
        step: "2",
        title: "Prepare Documents",
        description:
          "Submit the required documents and declarations.",
      },
      {
        step: "3",
        title: "Gazette Publication",
        description:
          "Get assistance with the Gazette publication process.",
      },
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

  // =========================================================
  // 5. PARTNERSHIP DEED
  // =========================================================
  {
    slug: "partnership-deed",
    title: "Partnership Deed (Notary & Registration of Firm)",
    image: partnershipDeedImg, // 🖼️ Added Image Property

    heroTitle: "Partnership Deed & Firm Registration",

    description:
      "Get assistance with partnership deed preparation, notarisation and registration of your partnership firm.",

    highlights: [
      {
        icon: "🤝",
        title: "Deed Preparation",
        description:
          "Assistance with preparing a partnership deed.",
      },
      {
        icon: "📄",
        title: "Documentation",
        description:
          "Guidance on the required documents and details.",
      },
      {
        icon: "🏢",
        title: "Firm Registration",
        description:
          "Support for the registration process of the partnership firm.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Partner Details",
        description:
          "Provide details of all partners and the proposed business.",
      },
      {
        step: "2",
        title: "Prepare Partnership Deed",
        description:
          "The deed is prepared according to the provided business terms.",
      },
      {
        step: "3",
        title: "Registration Support",
        description:
          "Get assistance with notarisation and firm registration.",
      },
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

  // =========================================================
  // 6. SALE DEED / WILL / GIFT DEED
  // =========================================================
  {
    slug: "sale-will-gift-deed",
    title: "Sale Deed / Will / Gift Deed",
    image: saleWillGiftImg, // 🖼️ Added Image Property

    heroTitle: "Sale Deed, Will & Gift Deed Assistance",

    description:
      "Get professional documentation assistance for Sale Deed, Will and Gift Deed requirements.",

    highlights: [
      {
        icon: "📄",
        title: "Document Preparation",
        description:
          "Assistance with preparing the required legal documents.",
      },
      {
        icon: "🏠",
        title: "Property Documentation",
        description:
          "Support for property-related documentation requirements.",
      },
      {
        icon: "⚖️",
        title: "Legal Guidance",
        description:
          "Professional guidance throughout the documentation process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Details",
        description:
          "Provide the relevant property and party details.",
      },
      {
        step: "2",
        title: "Document Preparation",
        description:
          "Prepare the required deed or legal document.",
      },
      {
        step: "3",
        title: "Registration Support",
        description:
          "Get assistance with the applicable registration process.",
      },
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

  // =========================================================
  // 7. MORTGAGE / RELEASE DEED
  // =========================================================
  {
    slug: "mortgage-release-deed",
    title: "Mortgage Deed / Release Deed",
    image: mortgageDeedImg, // 🖼️ Added Image Property

    heroTitle: "Mortgage Deed & Release Deed Assistance",

    description:
      "Get assistance with mortgage and release deed documentation for property-related transactions.",

    highlights: [
      {
        icon: "🏦",
        title: "Property Documentation",
        description:
          "Assistance with mortgage and release deed documentation.",
      },
      {
        icon: "📄",
        title: "Document Support",
        description:
          "Guidance on the required documents and details.",
      },
      {
        icon: "⚖️",
        title: "Professional Assistance",
        description:
          "Support throughout the documentation process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Property Details",
        description:
          "Provide the relevant property and transaction details.",
      },
      {
        step: "2",
        title: "Document Verification",
        description:
          "Review the required property and supporting documents.",
      },
      {
        step: "3",
        title: "Deed Support",
        description:
          "Get assistance with preparation and applicable registration.",
      },
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

  // =========================================================
  // 8. TITLE SEARCH REPORT
  // =========================================================
  {
    slug: "title-search-report",
    title: "Title Search Report",
    image: titleSearchImg, // 🖼️ Added Image Property

    heroTitle: "Property Title Search Report",

    description:
      "Get assistance with property title search and documentation review to understand the available property records.",

    highlights: [
      {
        icon: "🔍",
        title: "Title Search",
        description:
          "Assistance with reviewing available property title records.",
      },
      {
        icon: "📑",
        title: "Document Review",
        description:
          "Support in reviewing relevant property documents.",
      },
      {
        icon: "⚖️",
        title: "Professional Guidance",
        description:
          "Get assistance in understanding property documentation.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Property Details",
        description:
          "Provide the available property and ownership details.",
      },
      {
        step: "2",
        title: "Document Review",
        description:
          "Relevant property records and documents are reviewed.",
      },
      {
        step: "3",
        title: "Title Report",
        description:
          "Receive the title search findings and relevant documentation.",
      },
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

  // =========================================================
  // 9. TRADEMARK REGISTRATION
  // =========================================================
  {
    slug: "trademark-registration",
    title: "Trademark Registration",
    image: trademarkImg, // 🖼️ Added Image Property

    heroTitle: "Trademark Registration Online",

    description:
      "Protect your brand name, logo or other eligible marks with trademark registration assistance.",

    highlights: [
      {
        icon: "™️",
        title: "Brand Protection",
        description:
          "Get assistance with protecting your eligible brand identity.",
      },
      {
        icon: "🔍",
        title: "Trademark Search",
        description:
          "Assistance with checking available trademark information.",
      },
      {
        icon: "📄",
        title: "Filing Support",
        description:
          "Professional assistance with preparing and filing the application.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Brand Details",
        description:
          "Provide your brand name, logo or other relevant details.",
      },
      {
        step: "2",
        title: "Trademark Search",
        description:
          "Available trademark information is reviewed.",
      },
      {
        step: "3",
        title: "Application Filing",
        description:
          "Get assistance with filing the trademark application.",
      },
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

  // =========================================================
  // 10. PATENT / COPYRIGHT
  // =========================================================
  {
    slug: "patent-copyright-registration",
    title: "Patent / Copyright Registration",
    image: patentCopyrightImg, // 🖼️ Added Image Property

    heroTitle: "Patent & Copyright Registration Assistance",

    description:
      "Get assistance with patent and copyright registration for eligible inventions, creative works and intellectual property.",

    highlights: [
      {
        icon: "💡",
        title: "IP Protection",
        description:
          "Assistance with protecting eligible intellectual property.",
      },
      {
        icon: "📄",
        title: "Documentation Support",
        description:
          "Guidance with the required application documentation.",
      },
      {
        icon: "⚖️",
        title: "Professional Guidance",
        description:
          "Support throughout the registration process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share IP Details",
        description:
          "Provide details about your invention or creative work.",
      },
      {
        step: "2",
        title: "Document Preparation",
        description:
          "Prepare the required documents for the application.",
      },
      {
        step: "3",
        title: "Application Support",
        description:
          "Get assistance with the applicable registration process.",
      },
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

  // =========================================================
  // 11. DIGITAL 7/12 & MUTATION
  // =========================================================
  {
    slug: "digital-7-12-mutation",
    title: "Digital 7/12 & Mutation Entries",
    image: digital712Img, // 🖼️ Added Image Property

    heroTitle: "Digital 7/12 & Mutation Entry Assistance",

    description:
      "Get assistance with Digital 7/12 records and mutation-related documentation for eligible property matters.",

    highlights: [
      {
        icon: "📑",
        title: "7/12 Record Support",
        description:
          "Assistance with obtaining and understanding Digital 7/12 records.",
      },
      {
        icon: "🏠",
        title: "Property Records",
        description:
          "Support with property-related record requirements.",
      },
      {
        icon: "⚖️",
        title: "Mutation Assistance",
        description:
          "Guidance for applicable mutation entry requirements.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Property Details",
        description:
          "Provide the relevant property and ownership information.",
      },
      {
        step: "2",
        title: "Document Verification",
        description:
          "Review the available property documents.",
      },
      {
        step: "3",
        title: "Record / Mutation Support",
        description:
          "Get assistance with the applicable record or mutation process.",
      },
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

  // =========================================================
  // 12. CHARACTER CERTIFICATE
  // =========================================================
  {
    slug: "character-certificate",
    title: "Character Certificate by Police",
    image: characterCertificateImg, // 🖼️ Added Image Property

    heroTitle: "Police Character Certificate Assistance",

    description:
      "Get assistance with the application process and documentation required for obtaining a police character certificate.",

    highlights: [
      {
        icon: "🪪",
        title: "Application Support",
        description:
          "Assistance with the character certificate application.",
      },
      {
        icon: "📄",
        title: "Document Guidance",
        description:
          "Guidance on the required identification and address documents.",
      },
      {
        icon: "👮",
        title: "Verification Support",
        description:
          "Support through the applicable police verification process.",
      },
    ],

    process: [
      {
        step: "1",
        title: "Share Personal Details",
        description:
          "Provide the required personal and address information.",
      },
      {
        step: "2",
        title: "Submit Documents",
        description:
          "Provide the required identity and address documents.",
      },
      {
        step: "3",
        title: "Verification Support",
        description:
          "Get assistance with the applicable verification process.",
      },
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
];

export default serviceDetailsData;