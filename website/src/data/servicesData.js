// =====================================================
// 1. LEGAL SERVICES ICONS (All 12 Images Imported)
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

// =====================================================
// 2. BUSINESS & FINANCIAL SERVICES ICONS (12 PNGs)
// =====================================================
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

// =====================================================
// 3. OTHER SERVICES ICONS (12 PNGs)
// =====================================================
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

const serviceCategories = [
  {
    id: 1,
    title: "Legal Services",
    description: "Complete legal solutions for individuals and businesses",
    slug: "legal-services",

    services: [
      {
        title: "Marriage Registration",
        slug: "marriage-registration",
        image: marriageRegImg,
      },
      {
        title: "Leave & Licence / Rent Agreement",
        slug: "leave-licence-rent-agreement",
        image: rentAgreementImg,
      },
      {
        title: "Tenant Police Verification",
        slug: "tenant-police-verification",
        image: tenantVerificationImg,
      },
      {
        title: "Govt. Gazette – Name / DOB / Religion Change",
        slug: "govt-gazette-change",
        image: govtGazetteImg,
      },
      {
        title: "Partnership Deed (Notary & Registration of Firm)",
        slug: "partnership-deed",
        image: partnershipDeedImg,
      },
      {
        title: "Sale Deed / Will / Gift Deed",
        slug: "sale-will-gift-deed",
        image: saleWillGiftImg,
      },
      {
        title: "Mortgage Deed / Release Deed",
        slug: "mortgage-release-deed",
        image: mortgageDeedImg,
      },
      {
        title: "Title Search Report",
        slug: "title-search-report",
        image: titleSearchImg,
      },
      {
        title: "Trademark Registration",
        slug: "trademark-registration",
        image: trademarkImg,
      },
      {
        title: "Patent / Copyright Registration",
        slug: "patent-copyright-registration",
        image: patentCopyrightImg,
      },
      {
        title: "Digital 7/12 & Mutation Entries",
        slug: "digital-7-12-mutation",
        image: digital712Img,
      },
      {
        title: "Character Certificate by Police",
        slug: "character-certificate",
        image: characterCertificateImg,
      },
    ],
  },

  {
    id: 2,
    title: "Business & Financial Services",
    description: "Business setup, taxation and financial solutions",
    slug: "business-financial-services",
    services: [
      {
        title: "Income Tax Services",
        slug: "income-tax-services",
        image: incomeTaxImg,
      },
      {
        title: "GST Registration & Filing",
        slug: "gst-registration-filing",
        image: gstRegistrationImg,
      },
      {
        title: "Bank Loan / Financing Consultancy",
        slug: "bank-loan-consultancy",
        image: bankLoanImg,
      },
      {
        title: "Liaisoning with Govt. Offices",
        slug: "government-liaisoning",
        image: govtLiaisoningImg,
      },
      {
        title: "Tender Consultancy",
        slug: "tender-consultancy",
        image: tenderConsultancyImg,
      },
      {
        title: "Company Registration & Annual Compliance",
        slug: "company-registration-compliance",
        image: companyRegImg,
      },
      {
        title: "LLP Registration & Related Compliance",
        slug: "llp-registration",
        image: llpRegImg,
      },
      {
        title: "Accounting / Audit Services",
        slug: "accounting-audit-services",
        image: accountingAuditImg,
      },
      {
        title: "Project Report & Financing",
        slug: "project-report-financing",
        image: projectReportImg,
      },
      {
        title: "Trust Registration & Audit",
        slug: "trust-registration",
        image: trustRegImg,
      },
      {
        title: "Import Export Code (IEC)",
        slug: "import-export-code",
        image: iecCodeImg,
      },
      {
        title: "Digital Signature Certificate (DSC)",
        slug: "digital-signature-certificate",
        image: dscImg,
      },
    ],
  },

  {
    id: 3,
    title: "Other Services",
    description: "Additional professional and government services",
    slug: "other-services",

    services: [
      {
        title: "Real Estate Services (Sell / Purchase / Rent / Lease)",
        slug: "real-estate-services",
        image: realEstateImg,
      },
      {
        title: "Name Transfer & Address Update in Light Bill",
        slug: "light-bill-name-transfer",
        image: lightBillTransferImg,
      },
      {
        title: "Name Transfer in Property / Water Tax Bill / NMC Services",
        slug: "property-water-tax-transfer",
        image: propertyTaxTransferImg,
      },
      {
        title: "All Types of Insurance",
        slug: "insurance-services",
        image: insuranceImg,
      },
      {
        title: "Services for Start-Ups",
        slug: "startup-services",
        image: startupServicesImg,
      },
      {
        title: "Digital Marketing",
        slug: "digital-marketing",
        image: digitalMarketingImg,
      },
      {
        title: "MSME / UDYAM Registration",
        slug: "msme-registration",
        image: msmeUdyamImg,
      },
      {
        title: "Shop Act License",
        slug: "shop-act-license",
        image: shopActImg,
      },
      {
        title: "FSSAI / Food License",
        slug: "fssai-license",
        image: fssaiImg,
      },
      {
        title: "Passport Services",
        slug: "passport-services",
        image: passportImg,
      },
      {
        title: "Voter ID / PAN / TAN Services",
        slug: "voter-pan-tan-services",
        image: voterPanTanImg,
      },
      {
        title: "Liquor Consumption License",
        slug: "liquor-license",
        image: liquorLicenseImg,
      },
    ],
  },
];

export default serviceCategories;

// =====================================================
// ALL SERVICES FLAT LIST
// =====================================================
export const allServices = serviceCategories.flatMap((cat) =>
  cat.services.map((service) => ({
    ...service,
    category: cat.title,
    categorySlug: cat.slug,
  }))
);