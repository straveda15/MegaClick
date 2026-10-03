import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const sections = [
  {
    id: 1,
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          This website, www.megaclick.in (the "Website"), is operated by
          MegaClick Enterprises [constitution: proprietorship / partnership
          firm / LLP / private limited company — CONFIRM; add GSTIN /
          registration number], having its office at 4th Floor, Tristar
          Complex, Jehan Circle, Gangapur Road, above Canara Bank, beside
          Reliance Digital, D'souza Colony, Nashik, Maharashtra 422005, India
          ("MegaClick", "we", "us", "our").
        </p>

        <p>
          By visiting the Website, submitting an enquiry, or using or paying
          for any of our legal, financial, banking, real estate, compliance,
          registration, digital marketing or other services (the "Services"),
          you ("you", "Client", "User") agree to these Terms and Conditions
          ("Terms") and our Privacy Policy, which forms part of these Terms.
          These Terms are an electronic record under the Information Technology
          Act, 2000 and need no physical signature.
        </p>

        <p>
          If you do not agree, please do not use the Website or Services.
        </p>
      </>
    ),
  },

  {
    id: 2,
    title: "Our Role: Facilitator and Mediator",
    content: (
      <>
        <p>
          MegaClick is an integrated professional-services platform that acts
          as a mediator between individuals and businesses on one side, and
          government departments, authorities, banks, institutions and
          professionals on the other.
        </p>

        <p>By using our Services, you understand and agree that:</p>

        <ol>
          <li>
            MegaClick is not a government body, and is not affiliated with,
            endorsed by or an agent of any government department, ministry,
            authority or portal (including Income Tax, GST, MCA, Passport,
            UIDAI, MSME/UDYAM, FSSAI, Excise, Sub-Registrar or Municipal
            offices), unless expressly stated for a specific Service.
          </li>

          <li>
            Services may be performed by MegaClick's own team and/or by
            independent professionals in our network (such as advocates,
            chartered accountants, company secretaries, notaries and
            consultants). Where a professional is engaged, they remain
            responsible for their professional work.
          </li>

          <li>
            <strong>Legal Services.</strong> Information on the Website is
            general and does not constitute legal advice. Use of the Website or
            an enquiry does not by itself create an advocate-client
            relationship. Such a relationship arises only when an advocate is
            expressly engaged for your matter.
          </li>

          <li>
            <strong>Finance and loans.</strong> We provide consultancy and
            facilitation. We are not a bank, NBFC or lender, do not sanction
            loans, and approvals rest solely with the lender.
          </li>

          <li>
            <strong>Insurance.</strong> We facilitate access to insurance
            products offered by licensed insurers. [Add your IRDAI
            registration / POSP / agency details, if applicable — CONFIRM.]
          </li>

          <li>
            <strong>Real estate.</strong> We facilitate buying, selling,
            renting and leasing. We are not a party to any property transaction
            and do not guarantee title, price, tenancy or completion, and
            buyers and sellers should carry out their own due diligence. [Add
            RERA registration details for real estate agents, if applicable —
            CONFIRM.]
          </li>

          <li>
            <strong>Digital marketing.</strong> We do not guarantee any
            specific ranking, traffic, leads, or sales.
          </li>
        </ol>
      </>
    ),
  },

  {
    id: 3,
    title: "Eligibility",
    content: (
      <p>
        You must be at least 18 years old and capable of entering into a
        binding contract under the Indian Contract Act, 1872. If you use the
        Services on behalf of a company or other entity, you confirm you are
        authorised to bind it to these Terms.
      </p>
    ),
  },

  {
    id: 4,
    title: "Your Responsibilities",
    content: (
      <>
        <p>You agree that:</p>

        <ul>
          <li>
            All information, documents, signatures and declarations you give us
            are genuine, accurate, complete and lawfully obtained, and you will
            inform us promptly of any change.
          </li>

          <li>
            You will provide documents, approvals, OTPs, signatures, biometrics,
            payments and other inputs on time. Delays caused by you may delay
            or stop the Service.
          </li>

          <li>
            You will not ask us to prepare or submit false, forged or
            misleading documents or to carry out any unlawful activity. We may
            refuse or stop any Service, without refund of amounts already earned
            or paid to third parties, and may report suspected fraud to the
            authorities.
          </li>

          <li>
            You are responsible for the legal effect of the documents you sign
            and the declarations you make, and for reading them before you
            sign.
          </li>

          <li>
            You are responsible for keeping login details, OTPs and passwords
            confidential, and for activity under your account.
          </li>

          <li>
            Where you share government portal credentials with us, you
            authorise us to use them only for your Service, and you are
            responsible for changing them afterwards.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: 5,
    title: "Acceptable Use of the Website",
    content: (
      <>
        <p>You must not:</p>

        <ol>
          <li>
            Access or try to access the Website by automated means (bots,
            scrapers), or bypass security or authentication measures.
          </li>
          <li>
            Interfere with or disrupt the Website, servers or networks.
          </li>
          <li>
            Copy, reproduce, resell or exploit any part of the Website or
            Services without our written permission.
          </li>
          <li>Upload malware, spam or unlawful content.</li>
          <li>
            Use the Website for fraud, impersonation, or to infringe anyone's
            rights.
          </li>
        </ol>

        <p>
          You are responsible for loss we suffer because of your breach of this
          Section and may face civil or criminal liability.
        </p>
      </>
    ),
  },

  {
    id: 6,
    title: "User Content",
    content: (
      <p>
        Where you submit messages, files, reviews or feedback ("User Content"),
        you retain ownership, and you give us a non-exclusive, worldwide,
        royalty-free licence to use it only to operate the Website, provide
        the Services and, for public reviews, display it on the Website. We
        will ask for your permission before using your name, logo or testimonial
        in our marketing. User Content must not be unlawful, defamatory,
        abusive, misleading or infringe anyone's rights, and we may remove
        content that violates these Terms.
      </p>
    ),
  },

  {
    id: 7,
    title: "Fees and Payment",
    content: (
      <ul>
        <li>
          Service Fee and Government/Third-Party Fees are separate. Our service
          fee is our charge for the Service. Government fees, stamp duty,
          registration charges, court fees, franchise or licence fees, bank
          charges, notary fees, DSC/token charges and similar amounts are
          charged at actuals and are payable in addition, unless the quote says
          they are included.
        </li>

        <li>
          Prices are in Indian Rupees. GST and other applicable taxes are extra
          unless stated as inclusive.
        </li>

        <li>
          Work begins only after the advance or full payment stated in the
          quotation, invoice or order.
        </li>

        <li>
          Payments are processed through third-party gateways, and you agree to
          their terms.
        </li>

        <li>
          Additional work outside the agreed scope may be charged separately
          after informing you.
        </li>

        <li>
          We may correct pricing errors. If we do so after your order, you may
          cancel and be refunded what you paid for that order.
        </li>

        <li>
          [Optional: Priority or express service is available at an additional
          fee of ____ + GST, subject to the authority's processing capacity.]
        </li>
      </ul>
    ),
  },

  {
    id: 8,
    title: "Timelines and No Guarantee of Outcome",
    content: (
      <ul>
        <li>
          Timelines quoted are estimates, not guarantees. They depend on the
          completeness of your documents, your responses, and the working,
          systems and discretion of government departments, banks and other
          third parties, which we do not control.
        </li>

        <li>
          We do not guarantee that any application, registration, licence,
          certificate, loan, funding, permission, verification or approval will
          be granted, or by any particular date.
        </li>

        <li>
          Our obligation is to perform the Service with reasonable skill and
          care, as described in the quotation or order, not to guarantee the
          result.
        </li>

        <li>
          Services are generally handled in the order received, unless a
          priority service is purchased.
        </li>
      </ul>
    ),
  },

  {
    id: 9,
    title: "Cancellation and Refunds",
    content: (
      <>
        <p>
          Note for MegaClick: the percentages and timings below are suggested
          defaults. Change them to your real policy before publishing.
        </p>

        <div className="my-5 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr>
                <th className="border border-[#DCE5EE] bg-[#F5F9FD] px-4 py-3">
                  Stage of your order
                </th>

                <th className="border border-[#DCE5EE] bg-[#F5F9FD] px-4 py-3">
                  Refund of our service fee
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-[#DCE5EE] px-4 py-3">
                  Before we have started work or collected documents
                </td>

                <td className="border border-[#DCE5EE] px-4 py-3">
                  [100%] less payment gateway charges
                </td>
              </tr>

              <tr>
                <td className="border border-[#DCE5EE] px-4 py-3">
                  Work started, but nothing submitted to any authority
                </td>

                <td className="border border-[#DCE5EE] px-4 py-3">
                  [__%] (balance retained for work done)
                </td>
              </tr>

              <tr>
                <td className="border border-[#DCE5EE] px-4 py-3">
                  Application already submitted or filed with the authority
                </td>

                <td className="border border-[#DCE5EE] px-4 py-3">
                  [No refund] of service fee
                </td>
              </tr>

              <tr>
                <td className="border border-[#DCE5EE] px-4 py-3">
                  We are unable to perform or cancel the Service for reasons
                  within our control
                </td>

                <td className="border border-[#DCE5EE] px-4 py-3">
                  Full refund of the unperformed portion
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>
            Government fees, stamp duty and other third-party payments already
            made to an authority or third party are non-refundable and can be
            recovered only as that authority allows.
          </li>

          <li>
            If an application is rejected for reasons such as incorrect or
            insufficient documents provided by you, ineligibility, or the
            authority's discretion, the service fee is not refundable.
          </li>

          <li>
            Refund requests must be sent to megaclickofficial@gmail.com with
            your order details. Approved refunds are made to the original
            payment method within [7 to 10] working days.
          </li>

          <li>
            Cancellation is not available once a Service has been fully
            delivered.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: 10,
    title: "Consent to Communication",
    content: (
      <>
        <p>
          By giving us your contact details and ticking the consent box (or
          otherwise contacting us), you agree that MegaClick may contact you by
          phone, SMS, WhatsApp and email to give information about our Services,
          respond to your enquiries, update you on your applications, and
          inform you of relevant offers and compliance due dates.
        </p>

        <ul>
          <li>
            Your consent is voluntary and you can withdraw it at any time by
            writing to megaclickofficial@gmail.com, replying "STOP", or using
            the unsubscribe link.
          </li>

          <li>
            We may still send transactional and service messages even if you
            opt out of promotions.
          </li>

          <li>
            We comply with the TRAI Telecom Commercial Communications Customer
            Preference Regulations, 2018.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: 11,
    title: "Intellectual Property",
    content: (
      <p>
        All content on the Website, including text, graphics, the MegaClick®
        name and logo, tagline, images, layout, software and code, belongs to
        MegaClick or its licensors and is protected by Indian and international
        laws. You get a limited, non-exclusive, non-transferable, revocable
        right to use the Website for your personal or internal business
        purposes. You may not copy, modify, distribute, or create derivative
        works from any of it without our written permission.
      </p>
    ),
  },

  {
    id: 12,
    title: "Third-Party Links and Services",
    content: (
      <p>
        The Website may link to government portals, payment pages and other
        third-party sites. They are outside our control, and we are not
        responsible for their content, availability, downtime, charges or
        policies. Government portal outages, server issues or changes in
        procedures can affect timelines, and we are not liable for the
        resulting delay.
      </p>
    ),
  },

  {
    id: 13,
    title: "Disclaimer of Warranties",
    content: (
      <p>
        To the fullest extent permitted by law, the Website and Services are
        provided "as is" and "as available". We do not warrant that the Website
        will be uninterrupted or error-free, that information on it is always
        complete or current, or that any particular outcome will be achieved.
        Nothing here excludes rights you have under the Consumer Protection
        Act, 2019 or other laws that cannot be excluded.
      </p>
    ),
  },

  {
    id: 14,
    title: "Limitation of Liability",
    content: (
      <>
        <p>To the fullest extent permitted by law:</p>

        <ul>
          <li>
            MegaClick is not liable for indirect, incidental, special or
            consequential loss, including loss of profit, business,
            opportunity, data or goodwill.
          </li>

          <li>
            Our total liability for any claim relating to a Service is limited
            to the service fee actually paid to us for that Service.
          </li>

          <li>
            We are not liable for delay, rejection, penalties, interest or loss
            caused by incorrect or incomplete information or documents given by
            you, decisions or delays of any authority or institution,
            government portal failures, or changes in law.
          </li>

          <li>
            We are not responsible for the acts, omissions or advice of any
            third party, other than professionals we engage to the extent of
            their own professional responsibility.
          </li>
        </ul>

        <p>
          Nothing in these Terms limits liability that cannot legally be
          limited, including for fraud or wilful misconduct.
        </p>
      </>
    ),
  },

  {
    id: 15,
    title: "Indemnity",
    content: (
      <p>
        You agree to indemnify and hold harmless MegaClick, its owners,
        partners, directors, employees, associates and network professionals
        from claims, losses, penalties and expenses (including reasonable legal
        fees) arising from your breach of these Terms, false or forged
        information or documents you provide, your unlawful use of the
        Services, or your violation of any law or third-party right.
      </p>
    ),
  },

  {
    id: 16,
    title: "Suspension and Termination",
    content: (
      <p>
        We may suspend or terminate your access or any Service, with or without
        notice, for breach of these Terms, suspected fraud, forgery or
        illegality, non-payment, non-cooperation, or where required by law.
        Suspected unlawful activity may be reported to the authorities. Where
        we end a Service without cause, we will refund the fee for the
        undelivered portion under Section 9.
      </p>
    ),
  },

  {
    id: 17,
    title: "Force Majeure",
    content: (
      <p>
        We are not liable for delay or failure caused by events beyond our
        reasonable control, including natural disasters, epidemics, war,
        strikes, government orders, closure or slowdown of government offices,
        portal or internet failure, and changes in law or procedure.
      </p>
    ),
  },

  {
    id: 18,
    title: "Privacy and Confidentiality",
    content: (
      <p>
        Your use of the Website is governed by our Privacy Policy, which
        explains how we collect, use, share and protect your information,
        including identity documents. We treat the documents and information
        you give us as confidential and use them only for your Service, and
        share them only with the authorities, institutions and professionals
        needed to deliver it, as described in the Privacy Policy.
      </p>
    ),
  },

  {
    id: 19,
    title: "Governing Law, Disputes and Jurisdiction",
    content: (
      <>
        <p>
          These Terms are governed by the laws of India. If a dispute arises,
          please contact us first at megaclickofficial@gmail.com so we can try
          to resolve it amicably within [30] days.
        </p>

        <p>
          If not resolved, the dispute shall be [referred to arbitration under
          the Arbitration and Conciliation Act, 1996 before a sole arbitrator
          appointed by mutual consent, with the seat and venue at Nashik,
          Maharashtra, in English / subject to the exclusive jurisdiction of
          the courts at Nashik, Maharashtra, India].
        </p>

        <p>
          Consumers keep any rights they have under the Consumer Protection
          Act, 2019 to approach the appropriate consumer forum.
        </p>
      </>
    ),
  },

  {
    id: 20,
    title: "Changes to These Terms",
    content: (
      <p>
        We may update these Terms from time to time. The "Last updated" date
        shows the latest revision. For material changes, we will give notice on
        the Website or by email. Continued use after the changes take effect
        means you accept the updated Terms.
      </p>
    ),
  },

  {
    id: 21,
    title: "General",
    content: (
      <ul>
        <li>
          <strong>Entire agreement:</strong> These Terms, the Privacy Policy
          and your quotation, invoice or order confirmation form the entire
          agreement on the subject.
        </li>

        <li>
          <strong>Severability:</strong> If any provision is invalid, the rest
          remain in force.
        </li>

        <li>
          <strong>No waiver:</strong> Not enforcing a right is not a waiver of
          it.
        </li>

        <li>
          <strong>Assignment:</strong> You may not assign your rights under
          these Terms without our consent.
        </li>

        <li>
          <strong>Notices:</strong> Notices to you may be sent to the email or
          mobile number you provided.
        </li>
      </ul>
    ),
  },

  {
    id: 22,
    title: "Contact and Grievance Officer",
    content: (
      <>
        <p>
          <strong>MegaClick Enterprises</strong>
        </p>

        <p>
          4th Floor, Tristar Complex, Jehan Circle, Gangapur Road, above Canara
          Bank, beside Reliance Digital, D'souza Colony, Nashik, Maharashtra
          422005
        </p>

        <p>
          <strong>Phone:</strong> +91 99216 11911
        </p>

        <p>
          <strong>Email:</strong> megaclickofficial@gmail.com
        </p>

        <p>
          <strong>Website:</strong> www.megaclick.in
        </p>

        <p>
          <strong>Grievance Officer:</strong> [NAME], megaclickofficial@gmail.com
        </p>
      </>
    ),
  },
];

const heroSlides = [
  {
    id: 1,
    number: "01 / 04",
    label: "TERMS & CONDITIONS",
    title: "Service Overview",
    icon: "check",
    items: [
      {
        title: "Acceptance of Terms",
        description:
          "Using the MegaClick website or services means you agree to these terms.",
      },
      {
        title: "Eligibility",
        description:
          "Users must meet the applicable legal requirements to use our services.",
      },
      {
        title: "Your Responsibilities",
        description:
          "Accurate information, documents and timely cooperation are required.",
      },
    ],
  },

  {
    id: 2,
    number: "02 / 04",
    label: "TERMS & CONDITIONS",
    title: "Important Terms",
    icon: "check",
    items: [
      {
        title: "Service Terms",
        description:
          "Terms governing the use of MegaClick services and professional assistance.",
      },
      {
        title: "Payments & Refunds",
        description:
          "Important information regarding service fees, payments and cancellations.",
      },
      {
        title: "Responsibilities",
        description:
          "User responsibilities, service limitations and applicable conditions.",
      },
    ],
  },

  {
    id: 3,
    number: "03 / 04",
    label: "TERMS & CONDITIONS",
    title: "User & Service Rules",
    icon: "check",
    items: [
      {
        title: "Acceptable Use",
        description:
          "The website must not be used for unlawful, fraudulent or harmful activities.",
      },
      {
        title: "User Content",
        description:
          "Submitted information and feedback must be accurate and lawful.",
      },
      {
        title: "Service Timelines",
        description:
          "Quoted timelines are estimates and may depend on third parties and authorities.",
      },
    ],
  },

  {
    id: 4,
    number: "04 / 04",
    label: "TERMS & CONDITIONS",
    title: "Legal & Contact",
    icon: "check",
    items: [
      {
        title: "Privacy & Confidentiality",
        description:
          "Your information is handled according to our Privacy Policy.",
      },
      {
        title: "Liability",
        description:
          "Applicable limitations and responsibilities are defined in these terms.",
      },
      {
        title: "Contact & Grievance",
        description:
          "Contact MegaClick for questions, concerns or grievance-related matters.",
      },
    ],
  },
];

export default function TermsConditions() {
  const [openSection, setOpenSection] = useState(1);
  const [activeHeroIndex, setActiveHeroIndex] = useState(1);

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const activeHero = heroSlides[activeHeroIndex];

  const goToHero = (index) => {
    setActiveHeroIndex((index + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="terms-page bg-white overflow-x-hidden">

      {/* =========================================================
          RESPONSIVE CSS
          ========================================================= */}
      <style>{`
        .terms-page {
          width: 100%;
          overflow-x: hidden;
        }

        .terms-hero-section {
          width: 100%;
          padding: 2rem 1rem 2.5rem;
        }

        .terms-hero-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .terms-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 2rem;
          align-items: center;
        }

       .terms-hero-left {
  width: 100%;
  max-width: 680px;
}

@media (min-width: 1024px) {
  .terms-hero-left {
    transform: translateY(-70px);
  }
}

@media (min-width: 1536px) {
  .terms-hero-left {
    transform: translateY(-95px);
  }
}

@media (min-width: 2560px) {
  .terms-hero-left {
    transform: translateY(-80px);
  }
}

        .terms-hero-card-wrapper {
          width: 100%;
        }

        .terms-hero-card {
          width: 100%;
        }

        .terms-accordion-section {
          width: 100%;
        }

        .terms-accordion-container {
          width: 100%;
          max-width: 1060px;
          margin: 0 auto;
        }

        .terms-content p,
        .terms-content ul,
        .terms-content ol {
          margin-top: 0.9rem;
        }

        .terms-content p:first-child,
        .terms-content ul:first-child,
        .terms-content ol:first-child {
          margin-top: 0;
        }

        .terms-content ul,
        .terms-content ol {
          padding-left: 1.35rem;
        }

        .terms-content li {
          margin-bottom: 0.65rem;
        }

        .terms-content table {
          width: 100%;
        }

        /* =========================
           TABLET
           ========================= */

        @media (min-width: 640px) {
          .terms-hero-section {
            padding: 2.5rem 1.5rem 3rem;
          }

          .terms-content {
            font-size: 0.95rem;
          }
        }

        /* =========================
           LAPTOP
           ========================= */

        @media (min-width: 1024px) {
          .terms-hero-section {
            padding: 3rem 2rem 3.5rem;
          }

          .terms-hero-container {
            max-width: 1280px;
          }

          .terms-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(480px, 0.9fr);
            gap: 3rem;
          }

          .terms-hero-left {
            max-width: 700px;
          }

          .terms-accordion-container {
            max-width: 1100px;
          }
        }

        /* =========================
           STANDARD DESKTOP - 1440
           ========================= */

        @media (min-width: 1440px) {
          .terms-hero-section {
            padding: 3.5rem 2.5rem 4rem;
          }

          .terms-hero-container {
            max-width: 1380px;
          }

          .terms-hero-grid {
            grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
            gap: 4rem;
          }

          .terms-hero-left {
            max-width: 680px;
          }

          .terms-hero-card {
            border-radius: 30px;
            padding: 2.5rem;
          }

          .terms-accordion-section {
            padding-top: 4rem;
            padding-bottom: 5rem;
          }

          .terms-accordion-container {
            max-width: 1160px;
          }
        }

        /* =========================
           FULL HD - 1920
           ========================= */

        @media (min-width: 1920px) {
          .terms-hero-section {
            padding: 5rem 4rem 5.5rem;
          }

          .terms-hero-container {
            max-width: 1760px;
          }

          .terms-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(720px, 0.9fr);
            gap: 5rem;
          }

          .terms-hero-left {
            max-width: 820px;
          }

          .terms-hero-left > p:first-child {
            font-size: 1.1rem;
            letter-spacing: 0.25em;
          }

          .terms-hero-left h1 {
            font-size: 4rem !important;
          }

          .terms-hero-left > p:nth-of-type(2) {
            max-width: 780px;
            font-size: 1.2rem !important;
            line-height: 2rem !important;
          }

          .terms-hero-card {
            border-radius: 34px;
            padding: 3rem;
          }

          .terms-accordion-section {
            padding-top: 5rem;
            padding-bottom: 6rem;
          }

          .terms-accordion-container {
            max-width: 1500px;
          }

          .terms-accordion-container > div:first-child h2 {
            font-size: 2.4rem;
          }

          .terms-accordion-container > div:first-child p {
            font-size: 1rem;
          }

          .terms-content {
            font-size: 1.05rem;
            line-height: 1.9;
          }
        }

        /* =========================
           LARGE DESKTOP - 2560
           ========================= */

        @media (min-width: 2560px) {
          .terms-hero-section {
            padding: 6rem 5rem 6.5rem;
          }

          .terms-hero-container {
            max-width: 2200px;
          }

          .terms-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(900px, 0.95fr);
            gap: 6rem;
          }

          .terms-hero-left {
            max-width: 1000px;
          }

          .terms-hero-left > p:first-child {
            font-size: 1.35rem;
          }

          .terms-hero-left h1 {
            font-size: 5rem !important;
          }

          .terms-hero-left > p:nth-of-type(2) {
            max-width: 900px;
            font-size: 1.4rem !important;
            line-height: 2.3rem !important;
          }

          .terms-hero-card {
            border-radius: 42px;
            padding: 4rem;
          }

          .terms-accordion-section {
            padding-top: 6rem;
            padding-bottom: 7rem;
          }

          .terms-accordion-container {
            max-width: 1850px;
          }

          .terms-content {
            font-size: 1.2rem;
            line-height: 2rem;
          }
        }

        /* =========================
           4K - 3840 x 2160
           ========================= */

        @media (min-width: 3840px) {
          .terms-hero-section {
            padding: 7rem 6rem 8rem;
          }

          .terms-hero-container {
            max-width: 3200px;
          }

          .terms-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(1200px, 0.95fr);
            gap: 8rem;
          }

          .terms-hero-left {
            max-width: 1250px;
          }

          .terms-hero-left > p:first-child {
            font-size: 1.8rem;
            letter-spacing: 0.32em;
            margin-bottom: 2rem;
          }

          .terms-hero-left h1 {
            font-size: 6.5rem !important;
            line-height: 1.05 !important;
          }

          .terms-hero-left > p:nth-of-type(2) {
            max-width: 1150px;
            margin-top: 2.5rem !important;
            font-size: 1.75rem !important;
            line-height: 3rem !important;
          }

          .terms-hero-left .mt-7 {
            margin-top: 3rem;
          }

          .terms-hero-left a,
          .terms-hero-left .rounded-full {
            font-size: 1.35rem !important;
            padding: 1.25rem 2.5rem !important;
          }

          .terms-hero-card {
            min-height: 700px;
            border-radius: 48px;
            padding: 4.5rem !important;
            box-shadow: 0 25px 80px rgba(22, 55, 90, 0.08);
          }

          .terms-hero-card .h-11,
          .terms-hero-card .sm\\:h-12 {
            width: 78px !important;
            height: 78px !important;
            border-radius: 22px;
          }

          .terms-hero-card svg {
            width: 40px;
            height: 40px;
          }

          .terms-hero-card .text-\\[11px\\],
          .terms-hero-card .sm\\:text-sm {
            font-size: 1.45rem !important;
          }

          .terms-hero-card .text-xs {
            font-size: 1.25rem !important;
          }

          .terms-hero-card h2 {
            margin-top: 3rem !important;
            font-size: 3.5rem !important;
          }

          .terms-hero-card .mt-6 {
            margin-top: 2.5rem !important;
          }

          .terms-hero-card .space-y-5 > * + *,
          .terms-hero-card .sm\\:space-y-6 > * + * {
            margin-top: 2.5rem;
          }

          .terms-hero-card h3 {
            font-size: 1.55rem !important;
          }

          .terms-hero-card p {
            font-size: 1.3rem !important;
            line-height: 2.1rem !important;
          }

          .terms-hero-card .mt-7 {
            margin-top: 3rem !important;
          }

          .terms-hero-card button {
            height: 16px !important;
          }

          .terms-hero-card button.w-8 {
            width: 45px !important;
          }

          .terms-hero-card button.w-3 {
            width: 16px !important;
          }

          .terms-accordion-section {
            padding: 8rem 6rem 9rem;
          }

          .terms-accordion-container {
            max-width: 2600px;
          }

          .terms-accordion-container > div:first-child {
            margin-bottom: 2rem;
          }

          .terms-accordion-container > div:first-child h2 {
            font-size: 3.5rem;
          }

          .terms-accordion-container > div:first-child p {
            margin-top: 0.75rem;
            font-size: 1.35rem;
          }

          .terms-accordion-container > div:nth-child(2) {
            border-radius: 38px;
            border-width: 2px;
          }

          .terms-accordion-container button {
            min-height: 105px;
            padding: 2rem 3rem !important;
          }

          .terms-accordion-container button > div {
            gap: 1.5rem;
          }

          .terms-accordion-container button span:first-child {
            font-size: 1.3rem;
          }

          .terms-accordion-container button h3 {
            font-size: 1.55rem !important;
          }

          .terms-accordion-container button > span:last-child {
            width: 50px;
            height: 50px;
          }

          .terms-accordion-container button svg {
            width: 25px;
            height: 25px;
          }

          .terms-content-wrapper {
            padding: 0 3rem 3rem !important;
          }

          .terms-content {
            margin-left: 52px !important;
            max-width: 2200px;
            font-size: 1.35rem !important;
            line-height: 2.25 !important;
          }

          .terms-content p {
            margin-top: 1.5rem;
          }

          .terms-content li {
            margin-bottom: 1rem;
          }

          .terms-content table {
            font-size: 1.25rem;
          }

          .terms-content table th,
          .terms-content table td {
            padding: 1.25rem 1.5rem !important;
          }
        }

        /* =========================
           SMALL MOBILE
           ========================= */

        @media (max-width: 639px) {
          .terms-hero-section {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .terms-hero-card {
            border-radius: 22px;
            padding: 1.25rem !important;
          }

          .terms-hero-card h2 {
            font-size: 1.5rem !important;
          }

          .terms-hero-card p {
            font-size: 0.75rem !important;
            line-height: 1.35rem !important;
          }

          .terms-hero-left h1 {
            font-size: 2.25rem !important;
          }

          .terms-hero-left > p:nth-of-type(2) {
            font-size: 0.85rem !important;
            line-height: 1.55rem !important;
          }

          .terms-accordion-container {
            width: 100%;
          }

          .terms-accordion-container button {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .terms-accordion-container button h3 {
            font-size: 0.9rem !important;
            line-height: 1.3 !important;
          }

          .terms-content-wrapper {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .terms-content {
            margin-left: 0 !important;
            font-size: 0.85rem !important;
            line-height: 1.7 !important;
          }

          .terms-content table {
            min-width: 560px;
          }
        }
      `}</style>

      {/* =========================================================
          HERO
          ========================================================= */}
      <section className="terms-hero-section bg-white">

        <div className="terms-hero-container">

          <div className="terms-hero-grid">

            {/* ================= LEFT ================= */}
            <div className="terms-hero-left">

              <p
                className="mb-8 text-sm font-bold tracking-[0.22em] text-[#145DB5]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                MEGACLICK ENTERPRISES
              </p>

              <h1
                className="text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-[44px] lg:text-[48px]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Terms &{" "}
                <span className="text-[#1768C5]">
                  Conditions
                </span>
              </h1>

              <p
                className="mt-5 max-w-[680px] text-[14px] leading-8 text-[#526B85] sm:text-[15px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Please read these Terms and Conditions carefully before using
                the MegaClick website or any of our services. By accessing or
                using our services, you agree to be bound by these terms.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">

                <a
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#00A86B] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#008F5B]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Contact Us
                  <span className="text-lg leading-none">
                    →
                  </span>
                </a>

                <div
                  className="rounded-full border border-[#DCE5EE] bg-white px-7 py-4 text-sm text-[#60758C]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Effective Date: October 1, 2026
                </div>

              </div>
            </div>

            {/* ================= RIGHT CARD ================= */}
            <div className="terms-hero-card-wrapper">

              <div className="terms-hero-card relative rounded-[30px] border border-[#D7E4F2] bg-[#F6FAFE] px-6 py-7 shadow-[0_15px_45px_rgba(22,55,90,0.06)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#E5F0FF] text-[#1768C5] sm:h-12 sm:w-12">
                      <Check
                        size={25}
                        strokeWidth={2.5}
                      />
                    </div>

                    <p
                      className="truncate text-[11px] font-bold tracking-[0.18em] text-[#145DB5] sm:text-sm sm:tracking-[0.22em]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {activeHero.label}
                    </p>

                  </div>

                  <span
                    className="shrink-0 text-xs font-semibold text-[#8192A5] sm:text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {activeHero.number}
                  </span>

                </div>

                <div
                  key={activeHero.id}
                  className="transition-opacity duration-300"
                >

                  <h2
                    className="mt-7 text-[26px] font-bold text-[#111827] sm:mt-8 sm:text-[30px]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {activeHero.title}
                  </h2>

                  <div className="mt-6 space-y-5 sm:mt-7 sm:space-y-6">

                    {activeHero.items.map((item) => (
                      <div
                        key={item.title}
                        className="border-l-[3px] border-[#BCD9FA] pl-4"
                      >

                        <h3
                          className="text-[14px] font-bold text-[#111827] sm:text-base"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.title}
                        </h3>

                        <p
                          className="mt-1 text-[12px] leading-5 text-[#70849A] sm:text-sm sm:leading-6"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {item.description}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

                {/* SLIDER DOTS */}
                <div className="mt-7 flex items-center justify-center gap-2 sm:mt-8">

                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      onClick={() => goToHero(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        activeHeroIndex === index
                          ? "w-8 bg-[#1768C5]"
                          : "w-3 bg-[#C7D9ED] hover:bg-[#AFC7DF]"
                      }`}
                    />
                  ))}

                </div>

              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          ACCORDION
          ========================================================= */}
      <section className="terms-accordion-section bg-[#F4F8FC] px-4 py-12 sm:px-6 lg:px-8">

        <div className="terms-accordion-container">

          {/* TITLE */}
          <div className="mb-4 text-center">

            <h2
              className="text-2xl font-bold text-[#111827] sm:text-3xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Terms and Conditions
            </h2>

            <p
              className="mt-1 text-sm text-[#66778A]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Last updated: October 1, 2026
            </p>

          </div>

          {/* ACCORDION BOX */}
          <div className="overflow-hidden rounded-[22px] border border-[#DCE5EE] bg-white shadow-[0_10px_40px_rgba(22,55,90,0.07)]">

            {sections.map((section, index) => {

              const isOpen = openSection === section.id;

              return (
                <div
                  key={section.id}
                  className="border-b border-[#E5EAF0] last:border-b-0"
                >

                  {/* ACCORDION BUTTON */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-[#FAFCFE] sm:px-8"
                  >

                    <div className="flex min-w-0 items-center gap-5">

                      <span
                        className="shrink-0 text-[15px] font-semibold leading-none text-[#111827]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3
                        className="text-[17px] font-semibold leading-snug text-[#111827] sm:text-[18px]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {section.title}
                      </h3>

                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF8F4] text-[#00A86B]">

                      {isOpen ? (
                        <ChevronUp
                          size={17}
                          strokeWidth={2}
                        />
                      ) : (
                        <ChevronDown
                          size={17}
                          strokeWidth={2}
                        />
                      )}

                    </span>

                  </button>

                  {/* ACCORDION CONTENT */}
                  {isOpen && (
                    <div
                      className="terms-content-wrapper px-5 pb-7 pt-1 sm:px-8"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >

                      <div className="terms-content ml-0 text-[15px] leading-7 text-[#526B85] sm:ml-[34px]">

                        {section.content}

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </section>

    </main>
  );
}