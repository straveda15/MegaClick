import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import AssociateWithUs from "./pages/AssociateWithUs";
import Contact from "./pages/Contact";
import ServiceDetails from "./pages/ServiceDetails";

// Components
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

// Layout
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      {/* ================= SCROLL TO TOP ================= */}
      <ScrollToTop />

      <Routes>
        {/* ================= LAYOUT ================= */}
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

        </Route>
      </Routes>

      {/* ================= FLOATING WHATSAPP ================= */}
      <WhatsAppButton />
    </>
  );
}

export default App;