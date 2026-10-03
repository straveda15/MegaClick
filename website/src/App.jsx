import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import AssociateWithUs from "./pages/AssociateWithUs";
import Contact from "./pages/Contact";
import ServiceDetails from "./pages/ServiceDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Components
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";

// Layout
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      {/* ================= SCROLL TO TOP ================= */}
      <ScrollToTop />

      <Routes>
        {/* ================= MAIN LAYOUT ================= */}
        <Route element={<MainLayout />}>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* ================= ABOUT ================= */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* ================= SERVICES ================= */}
          <Route
            path="/services"
            element={<Services />}
          />

          {/* ================= SERVICE DETAILS ================= */}
          <Route
            path="/services/:slug"
            element={<ServiceDetails />}
          />

          {/* ================= ASSOCIATE WITH US ================= */}
          <Route
            path="/associate-with-us"
            element={<AssociateWithUs />}
          />

          {/* ================= CONTACT ================= */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ================= PRIVACY POLICY ================= */}
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          {/* ================= TERMS AND CONDITIONS ================= */}
<Route
  path="/terms-and-conditions"
  element={<TermsConditions />}
/>

        </Route>
      
      </Routes>

      {/* ================= FLOATING BACK TO TOP ================= */}
      <BackToTop />

      {/* ================= FLOATING WHATSAPP ================= */}
      <WhatsAppButton />
    </>
  );
}

export default App;