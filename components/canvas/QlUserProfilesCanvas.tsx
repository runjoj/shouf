"use client";

// ─── QlUserProfilesCanvas ──────────────────────────────────────────────────
// Case study page for Qualiti User Profiles feature.
// Full-canvas, scrollable, no sidebar. Same template as other case studies.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { CaseStudyImage } from "./CaseStudyImage";

// ─── Shared typography ──────────────────────────────────────────────────────

const MONO = "var(--font-mono)";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "22px",
        fontWeight:    800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         "var(--shouf-text-faint)",
        marginBottom:  "10px",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize:      "28px",
        fontWeight:    600,
        color:         "var(--shouf-text)",
        margin:        "0 0 20px",
        letterSpacing: "-0.02em",
        lineHeight:    1.2,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize:   "16px",
        color:      "var(--shouf-text-muted)",
        lineHeight: 1.75,
        margin:     "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div
      style={{
        height:          "1px",
        backgroundColor: "var(--shouf-border-sub)",
        margin:          "0 0 48px",
      }}
    />
  );
}

// ─── QlUserProfilesCanvas ──────────────────────────────────────────────────

export function QlUserProfilesCanvas() {
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
        padding:       "40px 192px 80px",
      }}
    >
        {/* ── Back button ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px", maxWidth: "800px" }}>
          <button
            onClick={goToWork}
            style={{
              all:           "unset",
              cursor:        "pointer",
              fontSize:      "15px",
              fontFamily:    MONO,
              color:         "var(--shouf-text-faint)",
              letterSpacing: "0.02em",
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "8px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-faint)";
            }}
          >
            <span style={{ fontSize: "17px" }}>&larr;</span>
            <span>Back</span>
          </button>
        </div>

        {/* ── Hero — two-column overview ─────────────────────────────────── */}
        <section
          style={{
            marginBottom:        "48px",
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "64px",
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
              Qualiti
            </div>
            <h1
              style={{
                fontSize:      "58px",
                fontWeight:    600,
                color:         "var(--shouf-text)",
                margin:        0,
                letterSpacing: "-0.03em",
                lineHeight:    1.1,
              }}
            >
              User Profiles
            </h1>
          </div>

          {/* Right column — overview paragraph */}
          <div style={{ paddingTop: "36px" }}>
            <Body>
              Every time a customer wants to run a test or plan, they need to specify what options
              will be used by our automated platform on their product. They also need a clear way to
              see if the problem with a failed test is a set up issue or an actual test failure.
            </Body>
          </div>
        </section>

        <Divider />

        {/* ── Problems ──────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Problems</SectionLabel>
          <SectionHeading>Too many selections to run a test.</SectionHeading>
          <Body>
            To run a test — either in plan or run — or just for a single test run, a customer would
            have to click on a lot of different selections so that our application would know exactly
            how and where they wanted it to run.
          </Body>
          <Body>
            Choosing each of these selections takes time and can be a point of confusion for customers.
            The more options they had, the more overwhelmed they became and would drop-off in the flow.
            Additionally, a lot of the selections are often re-used and having to choose the same
            options every time slows down the customer unnecessarily.
          </Body>
        </section>

        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionHeading>Customer unaware when set up is broken.</SectionHeading>
          <Body>
            When a customer creates a credential for us to use to login to their application, and when
            they give us the environment to use with that credential, we are counting on that
            information to be correct. If it is broken for whatever reason, the tests we are generating
            will fail.
          </Body>
          <Body>
            This can result in a lot of failed tests being presented to the user without them
            understanding that the issue was just an issue with the way the tests were set up. We
            wanted a clear way to show them that those pieces were broken and how to fix them to get
            their tests passing again.
          </Body>
        </section>

        <Divider />

        {/* ── Solution ──────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>A User Profile object that can be reused.</SectionHeading>
          <Body>
            When new feature work slowed down, and resources were dedicated to update old code, the
            opportunity arose to remove the old structured tables and use custom components. I created
            designs that allows for both of the flows users can take to add tests — suggested and
            manual.
          </Body>
          <Body>
            If a user selects suggested tests, the Qualiti Intelligence AI will prepare 3 tests for the
            user, that they will then have the ability to add or remove. They are also able to generate
            similar tests to a suggested test, or they can manually edit that test instead. If a user
            just wants to add their own manual test, they have that option as well.
          </Body>
        </section>

        <Divider />

        {/* ── Research: Competitive Analysis ─────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>Competitive Analysis</SectionHeading>
          <Body>
            We wanted a way for a customer to be able to create a group of options that they can reuse
            for each run. A similar idea to this is common in the quality assurance testing space,
            however they are specific to manual testing. Using automated testing with AI is a very
            different and new experience. It was crucial to make our solution as clear as possible to
            the user as a new concept that was specific to our automated testing platform.
          </Body>
          <Body>
            With manual testing, a user would individually select different browsers, environments, and
            more and then manually run each of those configurations. In automated testing, we would run
            all of those at once for them and would need to clearly specify which result is which.
          </Body>
          <Body>
            In the manual testing platforms we researched, we saw that test runs had optional
            configurations you could add. A user would manually name their custom configuration (i.e.
            browsers) and then they would add all of the options that they wanted to include under that
            configuration (in the case of browsers, they could have Chrome, Firefox, etc. as options).
            We needed to preset the options they could select so our platform could automate the runs,
            and also combine them so they could be easier to use and reusable.
          </Body>
          <Body>
            In the automated testing platforms we researched, we saw that some were using the idea of
            configurations in a different way. They were including it as an area of their product
            similar to a settings page, where you could specify each option for the user&apos;s entire
            project.
          </Body>
        </section>

        <Divider />

        {/* ── Ideation: Flows and Wireframes ─────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Ideation</SectionLabel>
          <SectionHeading>Potential flows and wireframes.</SectionHeading>
          <Body>
            Some of the elements we wanted to include in these reusable objects were already located in
            our set up page, because they had to be made before our platform is able to generate tests
            for the customer. We explored different ideas to combine these pages and also make it clear
            both what is part of these objects and what they need to get started.
          </Body>
          <Body>
            I created several different flows and presented them to the team and we brainstormed off of
            those ideas to decide on the clearest option. We decided to create an object called a
            Configuration that would live on its own page in the left navigation sidebar. This would
            eventually take the place of our Set Up page and would allow users to create the necessary
            environments and credentials here, while also choosing other settings.
          </Body>
        </section>

        {/* Ideation image — full width */}
        <CaseStudyImage src="/ideation.jpg" alt="Ideation flows and wireframes" style={{ marginBottom: "56px" }} />

        <Divider />

        {/* ── Design: Building Components ────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Building Components</SectionHeading>
          <Body>
            I wanted the Configurations page to feel similar to our other application pages for
            consistency. While having forms in modals is not my preference, it matched the way our set
            up page had originally been built and required the least amount of lift for the engineering
            team. The tab views also kept a similar flow to our plans and runs pages.
          </Body>
        </section>

        {/* Early solution image — full width */}
        <CaseStudyImage src="/early_solution.jpg" alt="Early solution components" style={{ marginBottom: "56px" }} />

        <Divider />

        {/* ── Design: Problems ───────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Problems</SectionHeading>
          <Body>
            We quickly realized that configurations had a lot of options included in them, and that it
            was unlikely that a customer was going to remember everything they had selected in each of
            their configurations. They also would not be able to sort their test run results on the
            different pieces of a configuration and be able to understand the results unless we listed
            out all of those pieces.
          </Body>
          <Body>
            This resulted in cluttered pages and a lot of repeated information. It also resulted in
            increased stress and confusion for the customer because they were still overwhelmed by the
            different options, but now also had to remember what options they chose for each
            configuration they made.
          </Body>
        </section>

        <Divider />

        {/* ── Refinement: A Simpler Solution ─────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Refinement</SectionLabel>
          <SectionHeading>A simpler solution.</SectionHeading>
          <Body>
            With the help of the Product Manager, we took a step back and further defined exactly what
            the essential pieces of this reusable object needed to be, and how we could simplify what
            we were presenting to the user. We realized that the key pieces are just environments,
            credentials, and login steps. We removed a few of the other options we had originally
            added — resolution, build, and tags, that we realized were not necessary to the user
            experience. We also decided to combine some of the elements that would always be used
            together — environment with timeout and resolution.
          </Body>
          <Body>
            Due to lack of clarity around what a Configuration is and means, we decided to instead call
            these reusable objects User Profiles. This made it more clear that this is something that
            will be used by our platform to imitate a user logging in to their application to test as
            that user.
          </Body>
          <Body>
            This also reduced the need to specify exactly what is in each object everywhere it is used
            and as well as the cognitive load on a customer to remember what they had pre-selected. A
            User Profile was just essentially an environment and a credential grouped together (and if
            they chose a username and password type of credential, they would need associated login
            steps). These two things are also easy to remember, because the idea of a User Profile
            makes it clear that it the specific options you would need for that User to use your
            application, and those should always be the same.
          </Body>
        </section>

        <Divider />

        {/* ── Ideation: Wireframes and AI's ──────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Ideation</SectionLabel>
          <SectionHeading>Wireframes and AI&apos;s</SectionHeading>
          <Body>
            To combine these elements, but make it clear that they are all part of the one idea of a
            User Profile, I drafted out some new wireframes to help me visualize how these concepts
            might be relayed to our customers. I did some user research with our QA tester, and I also
            utilized the help of AI (Claude) to help me talk through some of the potential pitfalls
            with my ideas and to help me get unstuck in my workflow.
          </Body>
          <Body>
            To help customers understand that a User Profile is a group of pieces of elements that can
            be reused, I decided on having these separated at the top into a view where they could see
            all of their Users, and then a view where they can manage the components of a User.
          </Body>
        </section>

        {/* Claude wireframes image — full width */}
        <CaseStudyImage src="/claude_wireframes.jpg" alt="Wireframes and AI collaboration" style={{ marginBottom: "56px" }} />

        <Divider />

        {/* ── Design: Final Solution ─────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Final solution with embedded elements.</SectionHeading>
          <Body>
            When a customer creates a new User Profile, unless they are getting set up for the first
            time, they will commonly already have at least one environment and at least one credential
            to choose from. So creating a new User would be simplified to just a few dropdowns.
            However, if they wanted to create a new environment or a new credential, those options
            would have to now be presented in some way.
          </Body>
          <Body>
            In the past, we had been using modals for forms due to the way the old code was written and
            the goal to provide a consistent feel across the application. When I saw the issue of
            creating an element within an element either nesting modals, or creating a very large form
            within a modal, and due to knowing the engineering team would have extra time to work on
            this feature, I took this opportunity to embed the form for the elements into the page
            itself.
          </Body>
          <Body>
            Creating a new user would take you to a new page, and if you wanted to create a new
            environment, credential, or even login steps, those fields would appear in that same page
            in the area you are already working in. To create a consistent look and feel across pages,
            when you viewed your already made elements on those specific pages, creating a new one
            would embed into that page at the top in a similar way.
          </Body>
        </section>

        {/* Final solution images — 2x3 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "56px" }}>
          <CaseStudyImage src="/final_user_1.png" alt="Final solution — user profiles overview" />
          <CaseStudyImage src="/final_user_2.png" alt="Final solution — create user profile" />
          <CaseStudyImage src="/final_user_3.png" alt="Final solution — embedded environment" />
          <CaseStudyImage src="/final_user_4.png" alt="Final solution — embedded credential" />
          <CaseStudyImage src="/final_user_5.png" alt="Final solution — user detail view" />
          <CaseStudyImage src="/final_user_6.png" alt="Final solution — manage components" />
        </div>

        <Divider />

        {/* ── Takeaways: Learnings ───────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Takeaways</SectionLabel>
          <SectionHeading>Learnings</SectionHeading>
          <Body>
            My biggest learning here is to really take the time to understand the problem and the
            technical aspects of the feature before trying to come with ideas for how to solve it. I
            was really lucky to have the extra time to take a step back and look at the problem from
            another angle before the engineering team had started work on this feature. If I
            didn&apos;t have that, I would have created a solution that actually made the problem worse
            for users because I hadn&apos;t fully understood the problem the first time.
          </Body>
          <Body>
            To improve this process, the team is now ensuring there are always detailed Product
            Requirement Documents for each new feature that must be fully approved by all stakeholders
            before designs are started. This helps everyone get on the same page and understand the
            problem that we are trying to address before coming up with solutions that may not actually
            solve the problem.
          </Body>
        </section>

        <Divider />

        {/* ── Next Steps ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Next Steps</SectionLabel>
          <SectionHeading>Future improvements</SectionHeading>
          <Body>
            There were some blockers to conducting real user research for this feature within the
            company, but if I could improve or iterate on this feature, including more user research
            would be the first thing I would do. I tried to conduct user research with the QA engineer
            we have on our team, as she is the closest to how a user would experience our product, but
            I would love to conduct a lot more in the form of surveys and interviews. After collecting
            additional research, I would analyze and synthesize themes within the data to make
            conclusions on how I can iterate and improve this feature further in a way that best
            improves the user&apos;s experience.
          </Body>
        </section>
    </div>
  );
}
