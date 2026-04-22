"use client";

// ─── EsCaseStudyCanvas ──────────────────────────────────────────────────────
// Case study page for eSpecialty Insurance.
// Full-canvas, scrollable, no sidebar. Same template as other case studies.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { CaseStudyImage } from "./CaseStudyImage";
import { MONO, SectionLabel, SectionHeading, Body, Divider, BackButton, ScrollReveal } from "./CaseStudyShared";

// ─── EsCaseStudyCanvas ──────────────────────────────────────────────────────

export function EsCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  const goToWork = useCallback(() => {
    selectComponent(null);
    selectSection("work");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  return (
    <div
      style={{
        flex:          1,
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
        padding:       "40px clamp(20px, 10vw, 192px) 80px",
        boxSizing:     "border-box",
      }}
    >
        {/* ── Back button ──────────────────────────────────────────────── */}
        <BackButton onClick={goToWork} />

        {/* ── Hero — two-column overview (stacks on mobile) ──────────────── */}
        <section
          style={{
            marginBottom:        "48px",
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap:                 "32px",
            alignItems:          "start",
          }}
        >
          {/* Left column — label + display headline */}
          <div>
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "12px",
                fontWeight:    800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "var(--shouf-accent)",
                marginBottom:  "18px",
              }}
            >
              eSpecialty Insurance
            </div>
            <h1
              style={{
                fontSize:      "58px",
                fontWeight:    600,
                color:         "var(--shouf-text)",
                margin:        "0 0 12px",
                letterSpacing: "-0.03em",
                lineHeight:    1.1,
              }}
            >
              eSpecialty Insurance
            </h1>
            <div
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "6px",
                marginTop:    "16px",
                fontSize:     "12px",
                fontFamily:   MONO,
                letterSpacing: "0.06em",
                color:        "var(--shouf-accent)",
                padding:      "5px 10px",
                borderRadius: "6px",
                border:       "1px solid var(--shouf-accent)",
              }}
            >
              Designed &amp; built in code
            </div>
          </div>

          {/* Right column — overview paragraph */}
          <div>
            <Body>
              A full redesign and rebuild of eSpecialty&apos;s insurance quoting platform — from a
              bare-bones MVP to a polished, scalable product with form validation, guided navigation,
              and a dynamic multi-coverage architecture.
            </Body>
          </div>
        </section>

        <Divider />

        {/* ── Problem ────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>The original build was just a draft.</SectionHeading>
          <Body>
            The original build was created as a quick iteration before a front end developer or
            designer was hired. It was intended to get a minimum viable product live and convey key
            information. The goal was to match the marketing site in a basic sense and show users
            that the form was simple and short.
          </Body>
          <Body>
            This product achieved these basic goals but had shortcomings. There was no error
            validation (users could click through the entire form and submit without filling out any
            information) and the product was not able to scale. The form was difficult to access from
            the main site and did not feel connected to eSpecialty. The quotes page did not actually
            display any information when the user did not have quotes ready but was always accessible.
            The account page did not lead to anything.
          </Body>
        </section>
        </ScrollReveal>

        {/* ── Before ──────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px" }}>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows:    "1fr 1fr",
              gap:                 "16px",
            }}
          >
            {/* Tall image spans both rows on the left */}
            <CaseStudyImage
              src="/especialty_old_1.png"
              alt="Original eSpecialty form — full page view"
              style={{ height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--shouf-border-sub)", gridRow: "1 / 3" }}
            />
            {/* Two landscape images stacked on the right */}
            <CaseStudyImage
              src="/especialty_old_2.png"
              alt="Original eSpecialty quotes page"
              style={{ height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }}
            />
            <CaseStudyImage
              src="/especialty_old_3.png"
              alt="Original eSpecialty account page"
              style={{ height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }}
            />
          </div>
        </section>
        </ScrollReveal>

        <Divider />

        {/* ── Solution ───────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>The introduction of embedding manual and suggested test creation.</SectionHeading>
          <Body>
            When new feature work slowed down, and resources were dedicated to updating old code, the
            opportunity arose to remove the old structured tables and use custom components. I created
            designs that allow for both of the flows users can take to add tests — suggested and
            manual.
          </Body>
          <Body>
            If a user selects suggested tests, the Qualiti Intelligence AI will prepare 3 tests for the
            user, that they will then have the ability to add or remove. They are also able to generate
            similar tests to a suggested test, or they can manually edit that test instead. If a user
            just wants to add their own manual test, they have that option as well.
          </Body>
        </section>
        </ScrollReveal>

        {/* ── After ───────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px", display: "flex", flexDirection: "column", gap: "40px" }}>
          <CaseStudyImage src="/especialty_new_2.png" alt="Redesigned eSpecialty form with stepper navigation" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }} />
          <CaseStudyImage src="/especialty_new_1.png" alt="Redesigned eSpecialty landing page" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }} />
          <CaseStudyImage src="/especialty_new_3.png" alt="Redesigned eSpecialty quotes page" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }} />
        </section>
        </ScrollReveal>

        <Divider />

        {/* ── Research ───────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>User Testing &amp; Competitive Analysis</SectionHeading>
          <Body>
            In order to better understand the intentions of our product and what our target audience
            would want to expect, in collaboration with the product manager, we conducted both user
            and competitor research. We wanted to create a product that felt similar to flows that
            users expect to establish trust in our product, but that also highlighted the strengths
            of our product — how simple and quick it is to view and purchase.
          </Body>
        </section>
        </ScrollReveal>

        <Divider />

        {/* ── Design ─────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Process and Highlights</SectionHeading>
          <Body>
            The critical starting point in the redesign was creating a landing page for users as well
            as deciding where to add in authentication. The goal was to create a space for users to
            understand the product instead of just starting them immediately into a form. Setting
            expectations about the ease of the product and that it is a quick and easy form was
            important.
          </Body>
          <Body>
            We also wanted to ensure we captured leads through the form without losing them through
            having to create an account. After several versions, we decided on having a short
            &ldquo;Getting Started&rdquo; form with basic information that would capture that lead
            and feed that information forward into our authentication page (using Auth0) as well as
            into later parts of the form to minimize duplicate fields. This would also allow us to
            provide specific recommendations for each user.
          </Body>
          <Body>
            Creating a left navigation stepper allows the user to see where they are in the form and
            see how much more there is to come. Using different sizes per step shows the user how much
            is left to complete. Users are able to navigate backward through the form once a step is
            completed but must navigate forward through the form in order to show error validation for
            each field — however, these errors can be skipped and returned to at the end to allow
            users to see the entire form.
          </Body>
          <Body>
            Tool tips were intentionally redesigned so that a user does not have to go out of their
            way to look for the little question mark for more information and feel like they should
            have known that information. Rather, the tool tips appear automatically as users progress
            in the form giving them helpful information and enabling them to progress rapidly.
          </Body>
          <Body>
            The review page was created to allow users a quick view of all of the information in a
            concise format as well as the final opportunity to edit the form on any page prior to
            submission. This review page also would show any missing information or errors in one
            place.
          </Body>
          <Body>
            Due to the way the application binder is designed, quotes and applications will only
            appear once they have been opened. This way, the only way a user can access their quotes
            is if they exist, and can only edit open applications if they are available. This allows
            for better control over the user flow and restricts information they should not have
            access to. I also created an admin view where users that have admin privileges can search
            for applications from any user.
          </Body>
          <Body>
            The quotes page allows users to quickly view all of the quotes they have available to
            them and compare the pros and cons of each. It shows them the expert recommendation for
            them and allows the options of viewing even more details via a modal or selecting the
            quote for purchase. If they have multiple policy limits available, they are able to toggle
            between screens showing those additional quotes.
          </Body>
        </section>
        </ScrollReveal>

        <Divider />

        {/* ── The Code ───────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>The Code</SectionLabel>
          <SectionHeading>Technical Architecture</SectionHeading>
          <Body>
            This application was built using React and functional components. It uses the Zustand
            library for state management and Tanstack Query (React Query) for connecting with the API.
            The form is built using React Hook Form and utilizes validation through Zod. The components
            are styled with Styled Components and use reusable components and styles with a theme as
            much as possible. Future versions of the site will be responsive — this was not prioritized
            as the majority of users are using the site on desktop. However, basic styling for the left
            sidebar to adjust to a top bar on mobile was included.
          </Body>
          <Body>
            The architecture was designed to be dynamic. This application is only built for Cyber forms
            (the other forms are currently using a third party) but will grow to include the other
            coverages offered over time. Each form will be a part of the same longer form but have
            specific pages for its questions added to the form or switched out. This way, if the user
            selects multiple coverages, the user experience will feel like just one long form instead
            of several forms for each coverage type.
          </Body>
          <Body>
            This product is live at account.especialty.com. The designs may not match the final product
            exactly as changes may have been made since I left the project. At the time, I was the sole
            front end engineer and UI/UX designer working with a back end engineer and company
            co-founder (also acting as the product manager).
          </Body>
        </section>
        </ScrollReveal>

        <Divider />

        {/* ── End navigation ─────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            justifyContent: "flex-start",
            alignItems:     "center",
            maxWidth:       "800px",
          }}
        >
          <button
            onClick={goToWork}
            style={{
              all:           "unset",
              cursor:        "pointer",
              fontSize:      "14px",
              fontFamily:    MONO,
              color:         "var(--shouf-text-muted)",
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "6px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-muted)";
            }}
          >
            <span>&larr;</span>
            <span>Back to Work</span>
          </button>
        </div>
    </div>
  );
}
