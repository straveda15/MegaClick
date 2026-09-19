"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Eye, Target } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VisionMission = () => {
  const sectionRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const vision = visionRef.current;
      const mission = missionRef.current;

      if (!vision || !mission) return;

      // Initial position
      gsap.set(vision, {
        y: 180,
        rotation: -5,
        scale: 0.97,
        zIndex: 10,
      });

      gsap.set(mission, {
        y: 180,
        rotation: 5,
        scale: 0.97,
        zIndex: 11,
      });

      // Cards come UP only while scrolling
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 35%",
          scrub: 1,
          invalidateOnRefresh: true,

         onUpdate: (self) => {
  if (self.progress < 0.5) {
    vision.style.zIndex = "10";
    mission.style.zIndex = "11";
  } else {
    sectionRef.current
      ?.querySelector(".vm-cards")
      ?.style.setProperty("z-index", "60");
  }
},
        },
      });

      timeline
        .to(
          vision,
          {
            y:-100,
            rotation: -5,
            scale: 1,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          mission,
          {
            y: -100,
            rotation: 5,
            scale: 1,
            ease: "none",
            duration: 1,
          },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="vision-mission-section"
    >
      {/* =========================================
          HEADING
      ========================================= */}

      <div className="vm-heading">
        <h2>
          <span style={{ color: "#0B4EA2" }}>Vision</span>{" "}
          <span style={{ color: "#08A957" }}>Mission</span>
        </h2>
      </div>

      {/* =========================================
          SCENE
      ========================================= */}

      <div className="vm-scene">

        {/* Soft background glow */}
        <div className="vm-glow" />

        {/* =========================================
            OPEN ENVELOPE BACK
        ========================================= */}

        <div className="vm-open-envelope">
          <div className="vm-open-flap" />
        </div>

        {/* =========================================
            CARDS
        ========================================= */}

        <div className="vm-cards">

          {/* VISION CARD */}

          <div
            ref={visionRef}
            className="vm-card vm-vision"
          >
            <div className="vm-card-icon">
              <Eye
                size={23}
                strokeWidth={2}
              />
            </div>

            <div className="vm-card-content">

              <span className="vm-label">
                OUR
              </span>

              <h3>
                Vision
              </h3>

              <p>
                To become India's most trusted platform
                for legal, business and financial services.
              </p>

            </div>
          </div>


          {/* MISSION CARD */}

          <div
            ref={missionRef}
            className="vm-card vm-mission"
          >
            <div className="vm-card-icon">
              <Target
                size={23}
                strokeWidth={2}
              />
            </div>

            <div className="vm-card-content">

              <span className="vm-label">
                OUR
              </span>

              <h3>
                Mission
              </h3>

              <p>
                Deliver affordable, reliable technology-driven
                legal and compliance services with transparency.
              </p>

            </div>
          </div>

        </div>


        {/* =========================================
            MAIN ENVELOPE
        ========================================= */}

        <div className="vm-envelope">

          <div className="vm-envelope-body">

            <div className="vm-left-fold" />

            <div className="vm-right-fold" />

          </div>

          {/* Front V flap */}
          <div className="vm-front-flap" />

        </div>

      </div>


      <style>{`

/* =========================================
   RESET
========================================= */

.vision-mission-section,
.vision-mission-section * {
  box-sizing: border-box;
}


/* =========================================
   SECTION
========================================= */

.vision-mission-section {
  position: relative;
  width: 100%;
  height: 760px;

  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  background:
    radial-gradient(
      ellipse at center,
      #eef6ff 0%,
      #f5faff 45%,
      #fbfdff 75%,
      #ffffff 100%
    );
}


/* =========================================
   HEADING
========================================= */

.vm-heading {
  position: absolute;

  top: 125px;
  left: 7%;

  z-index: 10;

  margin: 0;
  padding: 0;
}

.vm-heading h2 {
  margin: 0;
  padding: 0;

  white-space: nowrap;

  font-family: "Poppins", sans-serif;

  font-size: 2.5rem;
  line-height: 1.18;
  font-weight: 700;
}


/* =========================================
   SCENE
========================================= */

.vm-scene {
  position: sticky;
  top: 176px;

  width: 900px;
  height: 620px;

  z-index: 1;

  margin: 0 auto;
}


/* =========================================
   SOFT GLOW
========================================= */

.vm-glow {
  position: absolute;

  left: 50%;
  top: 55%;

  width: 850px;
  height: 520px;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse at center,
      rgba(198, 222, 255, 0.60) 0%,
      rgba(220, 237, 255, 0.38) 40%,
      rgba(240, 248, 255, 0.14) 65%,
      transparent 80%
    );

  filter: blur(30px);

  z-index: 0;

  pointer-events: none;
}


/* =========================================
   OPEN ENVELOPE BACK
========================================= */

.vm-open-envelope {
  position: absolute;

  left: 50%;
  top: 125px;

  width: 720px;
  height: 410px;

  transform: translateX(-50%);

  z-index: 2;

  pointer-events: none;
}

.vm-open-flap {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 400px;

  background:
    linear-gradient(
      145deg,
      rgba(248, 251, 255, 0.98) 0%,
      rgba(229, 239, 255, 0.97) 48%,
      rgba(208, 226, 252, 0.95) 100%
    );

  clip-path:
    polygon(
      0 100%,
      50% 0,
      100% 100%
    );

  border-radius:
    40px
    40px
    0
    0;

  box-shadow:
    0 10px 30px
    rgba(80, 110, 150, 0.08);

  opacity: 0.95;
}


/* =========================================
   CARDS AREA
========================================= */

.vm-cards {
  position: absolute;

  left: 50%;
  top: 265px;

  width: 700px;
  height: 260px;

  transform: translateX(-50%);

  z-index: 20;

  pointer-events: none;
}


/* =========================================
   COMMON CARD
========================================= */

.vm-card {
  position: absolute;

  width: 330px;
  height: 175px;

  padding: 19px 20px;

  display: flex;
  align-items: flex-start;

  gap: 13px;

  border-radius: 17px;

  border:
    1px solid
    rgba(255, 255, 255, 0.96);

  box-shadow:
    0 25px 45px
    rgba(40, 64, 98, 0.16),

    0 8px 18px
    rgba(40, 64, 98, 0.08);

  overflow: hidden;

  will-change: transform;

  font-family: "Inter", sans-serif;
}


/* =========================================
   VISION CARD
========================================= */

.vm-vision {
  left: 0;
  top: 0;

  background:
    linear-gradient(
      135deg,
      #f9fcff 0%,
      #e9f3ff 100%
    );

  transform: rotate(-5deg);

  z-index: 20;
}


/* =========================================
   MISSION CARD
========================================= */

.vm-mission {
  right: 0;
  top: 12px;

  background:
    linear-gradient(
      135deg,
      #fbfffc 0%,
      #eaf9f0 100%
    );

  transform: rotate(5deg);

  z-index: 21;
}


/* =========================================
   ICON
========================================= */

.vm-card-icon {
  width: 50px;
  height: 50px;

  min-width: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #ffffff;

  box-shadow:
    0 7px 15px
    rgba(30, 50, 75, 0.10);

  color: #1763b5;
}

.vm-mission .vm-card-icon {
  color: #08A957;
}


/* =========================================
   CARD CONTENT
========================================= */

.vm-card-content {
  min-width: 0;
  padding-top: 1px;
}


/* =========================================
   OUR
========================================= */

.vm-label {
  display: block;

  margin-bottom: 5px;

  font-family: "Inter", sans-serif;

  font-size: 8px;

  line-height: 1;

  font-weight: 600;

  letter-spacing: 0.18em;

  color: #737d8b;
}


/* =========================================
   CARD TITLE
========================================= */

.vm-card h3 {
  margin: 0;

  font-family: "Poppins", sans-serif;

  font-size: 25px;

  line-height: 1.1;

  font-weight: 700;
}

.vm-vision h3 {
  color: #125daa;
}

.vm-mission h3 {
  color: #079c4d;
}


/* =========================================
   DESCRIPTION
========================================= */

.vm-card p {
  margin: 12px 0 0;

  max-width: 225px;

  font-family: "Inter", sans-serif;

  font-size: 10.5px;

  line-height: 1.5;

  font-weight: 400;

  color: #475569;
}


/* =========================================
   MAIN ENVELOPE
========================================= */

.vm-envelope {
  position: absolute;

  left: 50%;
  bottom: 45px;

  width: 720px;
  height: 245px;

  transform: translateX(-50%);

  z-index: 50;

  filter:
    drop-shadow(
      0 24px 32px
      rgba(55, 88, 130, 0.17)
    );
}


/* =========================================
   ENVELOPE BODY
========================================= */

.vm-envelope-body {
  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 100%;

  overflow: hidden;

  border-radius:
    0
    0
    30px
    30px;

  background:
    linear-gradient(
      145deg,
      rgba(238, 245, 255, 0.82) 0%,
      rgba(223, 235, 255, 0.66) 48%,
      rgba(205, 223, 249, 0.55) 100%
    );

  backdrop-filter: blur(11px);
  -webkit-backdrop-filter: blur(11px);

  border:
    1px solid
    rgba(155, 184, 222, 0.30);

  box-shadow:
    inset 0 1px 0
    rgba(255, 255, 255, 0.65),

    inset 0 -20px 38px
    rgba(126, 165, 220, 0.07);
}


/* =========================================
   LEFT FOLD
========================================= */

.vm-left-fold {
  position: absolute;

  left: 0;
  bottom: 0;

  width: 54%;
  height: 100%;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.65),
      rgba(220, 235, 255, 0.38)
    );

  mix-blend-mode: soft-light;

  clip-path:
    polygon(
      0 0,
      100% 100%,
      0 100%
    );
}


/* =========================================
   RIGHT FOLD
========================================= */

.vm-right-fold {
  position: absolute;

  right: 0;
  bottom: 0;

  width: 54%;
  height: 100%;

  background:
    linear-gradient(
      215deg,
      rgba(244, 249, 255, 0.65),
      rgba(198, 220, 251, 0.40)
    );

  mix-blend-mode: soft-light;

  clip-path:
    polygon(
      100% 0,
      100% 100%,
      0 100%
    );
}


/* =========================================
   FRONT FLAP
========================================= */

.vm-front-flap {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 175px;

  background:
    linear-gradient(
      145deg,
      rgba(247, 250, 255, 0.88) 0%,
      rgba(229, 239, 255, 0.72) 50%,
      rgba(211, 228, 252, 0.62) 100%
    );

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow:
    inset 0 1px 0
    rgba(255, 255, 255, 0.65),

    inset 0 -14px 28px
    rgba(126, 165, 220, 0.09);

  clip-path:
    polygon(
      0 0,
      50% 78%,
      100% 0,
      100% 100%,
      0 100%
    );

  border-radius:
    0
    0
    30px
    30px;

  z-index: 60;

  pointer-events: none;
}


/* =========================================
   FRONT FLAP HIGHLIGHT
========================================= */

.vm-front-flap::after {
  content: "";

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.40) 0%,
      rgba(255, 255, 255, 0.14) 45%,
      rgba(180, 210, 248, 0.10) 100%
    );

  opacity: 0.85;

  pointer-events: none;
}


/* =========================================
   LARGE DESKTOP
========================================= */

@media (min-width: 1440px) {

  .vision-mission-section {
    height: 800px;
  }

  .vm-heading {
    top: 75px;
    left: 7%;
  }

  .vm-heading h2 {
    font-size: 2.5rem;
  }

  .vm-scene {
    width: 1200px;
    height: 680px;

    margin-top: 80px;
  }

  .vm-open-envelope {
    width: 820px;
    height: 450px;

    top: 125px;
  }

  .vm-open-flap {
    height: 440px;
  }

  .vm-cards {
    width: 850px;

    top: 275px;
  }

  .vm-card {
    width: 370px;
    height: 185px;

    padding: 21px 22px;
  }

  .vm-card-icon {
    width: 52px;
    height: 52px;
    min-width: 52px;
  }

  .vm-card h3 {
    font-size: 28px;
  }

  .vm-card p {
    max-width: 260px;
    font-size: 11px;
  }

  .vm-envelope {
    width: 820px;
    height: 260px;

    bottom: 45px;
  }

  .vm-front-flap {
    height: 160px;
  }
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 1023px) {

  .vision-mission-section {
    height: 650px;
  }

  .vm-heading {
    top: 45px;
    left: 6%;
  }

  .vm-heading h2 {
    font-size: 2.25rem;
  }

  .vm-scene {
    width: 760px;
    height: 560px;

    margin-top: 50px;
  }

  .vm-open-envelope {
    width: 620px;
    height: 340px;

    top: 135px;
  }

  .vm-open-flap {
    height: 330px;
  }

  .vm-cards {
    width: 650px;

    top: 260px;
  }

  .vm-card {
    width: 290px;
    height: 150px;

    padding: 15px;

    gap: 10px;
  }

  .vm-card-icon {
    width: 43px;
    height: 43px;
    min-width: 43px;
  }

  .vm-card h3 {
    font-size: 22px;
  }

  .vm-card p {
    margin-top: 9px;
    max-width: 205px;
    font-size: 9.5px;
  }

  .vm-envelope {
    width: 620px;
    height: 200px;

    bottom: 45px;
  }

  .vm-front-flap {
    height: 125px;
  }
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 640px) {

  .vision-mission-section {
    height: 540px;
  }

  .vm-heading {
    top: 28px;
    left: 5%;
  }

  .vm-heading h2 {
    font-size: 1.75rem;
  }

  .vm-scene {
    width: 390px;
    height: 450px;

    margin-top: 45px;
  }

  .vm-glow {
    width: 500px;
    height: 340px;
  }

  .vm-open-envelope {
    width: 350px;
    height: 225px;

    top: 120px;
  }

  .vm-open-flap {
    height: 215px;
  }

  .vm-cards {
    width: 365px;

    top: 220px;
  }

  .vm-card {
    width: 170px;
    height: 120px;

    padding: 11px;

    gap: 7px;

    border-radius: 12px;
  }

  .vm-card-icon {
    width: 35px;
    height: 35px;

    min-width: 35px;

    border-radius: 9px;
  }

  .vm-card-icon svg {
    width: 18px;
    height: 18px;
  }

  .vm-label {
    font-size: 6px;
    margin-bottom: 3px;
  }

  .vm-card h3 {
    font-size: 17px;
  }

  .vm-card p {
    margin-top: 6px;

    max-width: 118px;

    font-size: 7.3px;

    line-height: 1.4;
  }

  .vm-envelope {
    width: 350px;
    height: 150px;

    bottom: 45px;
  }

  .vm-front-flap {
    height: 100px;
  }
}


/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 380px) {

  .vm-scene {
    transform: scale(0.90);
  }

  .vm-heading h2 {
    font-size: 1.6rem;
  }
}

      `}</style>
    </section>
  );
};

export default VisionMission;