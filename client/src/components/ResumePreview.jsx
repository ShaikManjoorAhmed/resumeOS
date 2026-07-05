const Section = ({ title, accent, font, children }) => (
  <div style={{ paddingTop: "20px" }}>
    <p
      style={{
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: accent,
        marginBottom: "10px",
        marginTop: 0,
        fontFamily: font,
        borderBottom: `1px solid ${accent}33`,
        paddingBottom: "5px",
        lineHeight: 1.4,
      }}
    >
      {title}
    </p>
    <div>{children}</div>
  </div>
);

const ExperienceList = ({ items, accent }) =>
  items?.length > 0 &&
  items.map((exp, i) => (
    <div key={i} style={{ marginBottom: "10px" }}>
      <p style={{ fontSize: "13px",  lineHeight: 1.4, fontWeight: 600, color: "#1f2937", margin: 0 }}>
        {exp.role || "Role"} {exp.company && `· ${exp.company}`}
      </p>
      <p style={{ fontSize: "11px", color: accent, margin: 0,  lineHeight: 1.4 }}>
        {exp.startDate} {exp.startDate && "–"} {exp.current ? "Present" : exp.endDate}
      </p>
      {exp.description && (
        <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "3px",  lineHeight: 1.4 }}>{exp.description}</p>
      )}
    </div>
  ));

const EducationList = ({ items, accent }) =>
  items?.length > 0 &&
  items.map((edu, i) => (
    <div key={i} style={{ marginBottom: "10px" }}>
      <p style={{ fontSize: "13px", lineHeight: 1.4, fontWeight: 600, color: "#1f2937", margin: 0 }}>
        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
      </p>
      <p style={{ fontSize: "12px", lineHeight: 1.4, color: "#6b7280", margin: 0 }}>{edu.institution}</p>
      <p style={{ fontSize: "11px", lineHeight: 1.4,  color: accent, margin: 0 }}>
        {edu.startDate} {edu.startDate && "–"} {edu.endDate}
      </p>
    </div>
  ));

const ProjectsList = ({ items, accent }) =>
  items?.length > 0 &&
  items.map((proj, i) => (
    <div key={i} style={{ marginBottom: "10px" }}>
      <p style={{ fontSize: "13px", lineHeight: 1.4, fontWeight: 600, color: "#1f2937", margin: 0 }}>{proj.title}</p>
      {proj.techStack?.length > 0 && (
        <p style={{ fontSize: "11px", lineHeight: 1.4, color: accent, margin: 0 }}>{proj.techStack.join(", ")}</p>
      )}
      {proj.description && (
        <p style={{ fontSize: "12px", lineHeight: 1.4, color: "#4b5563", marginTop: "3px" }}>{proj.description}</p>
      )}
    </div>
  ));

const ResumePreview = ({ resume, config, previewRef }) => {
  const { accent, headingFont, bodyFont, layout, headerAlign, compact } = config;
  const info = resume?.personalInfo || {};
  const pad = compact ? "18px" : "28px";

  const contactItems = [info.email, info.phone, info.location].filter(Boolean);

  const HeaderBlock = (
    <div style={{ textAlign: headerAlign }}>
      <p style={{ fontSize: compact ? "18px" : "22px", fontWeight: 700, color: accent, margin: 0, fontFamily: headingFont }}>
        {info.fullName || "Your Name"}
      </p>
      {layout === "sidebar" ? (
        <div style={{ marginTop: "6px" }}>
          {contactItems.map((item, i) => (
            <p key={i} style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0", wordBreak: "break-word" }}>
              {item}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0" }}>
          {contactItems.join(" · ")}
        </p>
      )}
      {info.linkedin && (
        <p style={{ fontSize: "12px", color: accent, margin: "4px 0 0", wordBreak: "break-word" }}>
          {info.linkedin}
        </p>
      )}
    </div>
  );

  const MainSections = (
    <>
      {info.summary && (
        <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginTop: "12px" }}>
          {info.summary}
        </p>
      )}
      {resume?.experience?.length > 0 && (
        <Section title="Experience" accent={accent} font={headingFont}>
          <ExperienceList items={resume.experience} accent={accent} />
        </Section>
      )}
      {resume?.projects?.length > 0 && (
        <Section title="Projects" accent={accent} font={headingFont}>
          <ProjectsList items={resume.projects} accent={accent} />
        </Section>
      )}
    </>
  );

  const SideSections = (
    <>
      {resume?.education?.length > 0 && (
        <Section title="Education" accent={accent} font={headingFont}>
          <EducationList items={resume.education} accent={accent} />
        </Section>
      )}
      {resume?.skills?.length > 0 && (
        <Section title="Skills" accent={accent} font={headingFont}>
          <p style={{ fontSize: "12px", color: "#374151" }}>{resume.skills.join(" · ")}</p>
        </Section>
      )}
    </>
  );

  if (layout === "sidebar") {
    return (
      <div ref={previewRef} style={{ display: "flex", background: "#fff", minHeight: "500px", borderRadius: "8px", overflow: "hidden", fontFamily: bodyFont }}>
        <div style={{ width: "34%", background: `${accent}10`, padding: pad }}>
          {HeaderBlock}
          {SideSections}
        </div>
        <div style={{ width: "66%", padding: pad }}>{MainSections}</div>
      </div>
    );
  }

  if (layout === "banner") {
    return (
      <div ref={previewRef} style={{ background: "#fff", minHeight: "500px", borderRadius: "8px", overflow: "hidden", fontFamily: bodyFont }}>
        <div style={{ background: accent, padding: pad, color: "#fff" }}>
          <p style={{ fontSize: compact ? "18px" : "24px", fontWeight: 700, margin: 0, fontFamily: headingFont, textAlign: headerAlign }}>
            {info.fullName || "Your Name"}
          </p>
          <p style={{ fontSize: "12px", opacity: 0.85, margin: "4px 0 0", textAlign: headerAlign }}>
            {[info.email, info.phone, info.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div style={{ padding: pad }}>
          {MainSections}
          {SideSections}
        </div>
      </div>
    );
  }

  // default: single column
  return (
    <div ref={previewRef} style={{ background: "#fff", minHeight: "500px", borderRadius: "8px", padding: pad, fontFamily: bodyFont, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
      {HeaderBlock}
      <div style={{ marginTop: "12px", height: "1px", background: "#e5e7eb" }} />
      {MainSections}
      {SideSections}
    </div>
  );
};

export default ResumePreview;