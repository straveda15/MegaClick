
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";
import Team from "../components/Team";
import Services from "../components/Services";
import WhyChoose from "../components/WhyChoose";

import Testimonials from "../components/Testimonials";


import FAQ from "../components/FAQ";
import CTA from "../components/CTA";

import Partners from "../components/Partners";


function Home() {

  return (

    <>

  


      <Hero />
      <HowItWorks />

      <section id="about">
        <About />
      </section>

  <Team />

      <section id="services">
  <Services />
</section>


      <WhyChoose />





      <Testimonials />
      <Partners />



      <FAQ />






      <section id="contact">
        <CTA />
      </section>




    </>

  );

}


export default Home;