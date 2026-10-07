/* Single source of truth. Every string below comes from Bade_Nandini_Resume.pdf. */

export const PROFILE = {
  name: "Bade Nandini",
  firstName: "Nandini",
  initials: "BN",
  role: "AI & ML Student",
  degreeShort: "B.Tech CSE (AI & ML)",
  status: "Fresher 2027",
  email: "nandinibadenandu@gmail.com",
  phone: "7842683313",
  phoneHref: "tel:7842683313",
  location: "Guntur, Andhra Pradesh",
  // Résumé lines used verbatim (the résumé has no separate summary paragraph)
  resumeSummary:
    "Seeking opportunities to apply programming, Artificial Intelligence, problem-solving, and communication skills in practical engineering environments",
  resumeLine2: "Developing a foundation in Java, HTML, CSS, Artificial Intelligence tools, and prompt engineering",
  quote: "Looking to apply programming, AI and communication skills in practical engineering work.", // paraphrase of the summary line
  github: "https://github.com/NANDU1156",
  githubLabel: "github.com/NANDU1156",
  linkedin: "https://linkedin.com/in/bade-nandini",
  linkedinLabel: "linkedin.com/in/bade-nandini",
  resume: "/Bade_Nandini_Resume.pdf",
  college: "Chalapathi Institute of Engineering & Technology",
  cgpa: "8.03/10",
  validTill: "2027",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type Skill = { name: string; symbol: string; family: string; usedIn: string[] };

export const FAMILIES = ["Languages", "Artificial Intelligence", "Tools", "Languages Spoken"] as const;

// Résumé lists "AI Tools" under both Artificial Intelligence and Tools; it appears once here.
export const SKILL_GROUPS: { family: (typeof FAMILIES)[number]; skills: Skill[] }[] = [
  {
    family: "Languages",
    skills: [
      { name: "Java", symbol: "Ja", family: "Languages", usedIn: ["Relevant area in B.Tech coursework"] },
      { name: "MERN", symbol: "Me", family: "Languages", usedIn: ["ApexStore"] },
      { name: "HTML", symbol: "Ht", family: "Languages", usedIn: ["Personal Portfolio Website"] },
      { name: "CSS", symbol: "Cs", family: "Languages", usedIn: ["Personal Portfolio Website"] },
      { name: "JavaScript", symbol: "Js", family: "Languages", usedIn: ["Personal Portfolio Website"] },
    ],
  },
  {
    family: "Artificial Intelligence",
    skills: [
      { name: "AI Tools", symbol: "Ai", family: "Artificial Intelligence", usedIn: ["Certification: AI Tools Prompt Engineer"] },
      { name: "Prompt Engineering", symbol: "Pe", family: "Artificial Intelligence", usedIn: ["Certification: AI Tools Prompt Engineer"] },
    ],
  },
  { family: "Tools", skills: [{ name: "GitHub", symbol: "Gh", family: "Tools", usedIn: ["Personal Portfolio Website (GitHub Pages)"] }] },
  {
    family: "Languages Spoken",
    skills: [
      { name: "English", symbol: "En", family: "Languages Spoken", usedIn: [] },
      { name: "Telugu", symbol: "Te", family: "Languages Spoken", usedIn: [] },
    ],
  },
];

export type Project = {
  id: string; index: string; title: string; kicker: string; description: string;
  features: string[]; tech: string[]; github?: string; ui: "store" | "site";
};

export const PROJECTS: Project[] = [
  {
    id: "apexstore", index: "01", title: "ApexStore", kicker: "E-Commerce Web Application",
    description:
      "Built a full-stack e-commerce application with product browsing, search, cart, checkout, and order management. Implemented JWT authentication, role-based admin access, product CRUD, and MongoDB integration.",
    features: ["Product browsing", "Search", "Cart", "Checkout", "Order management", "JWT authentication", "Role-based admin access", "Product CRUD", "MongoDB integration"],
    tech: ["MERN", "JWT", "MongoDB"], ui: "store",
  },
  {
    id: "portfolio", index: "02", title: "Personal Portfolio Website", kicker: "Portfolio Website",
    description:
      "Built a responsive portfolio website showcasing skills, education, projects, and professional interests. Implemented interactive navigation and responsive UI using HTML, CSS, and JavaScript.",
    features: ["Responsive layout", "Skills", "Education", "Projects", "Professional interests", "Interactive navigation"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"], ui: "site",
  },
];

export const CERTIFICATIONS = [
  { title: "AI Tools Prompt Engineer", issuer: "Freedom With AI", year: "2025" },
  { title: "MERN Stack Workshop Programme", issuer: "Chalapathi Institute of Engineering and Technology", year: "" },
];

export type Stop = { period: string; title: string; place: string; kind: string; details: string[] };

// Education + experience in chronological order
export const TIMELINE: Stop[] = [
  {
    period: "2023 – 2027", kind: "Education",
    title: "Bachelor of Technology in Computer Science and Engineering – AI & ML",
    place: "Chalapathi Institute of Engineering & Technology, Guntur, Andhra Pradesh",
    details: ["CGPA: 8.03/10", "Specialization: Artificial Intelligence and Machine Learning", "Relevant Areas: Java, Artificial Intelligence, HTML, CSS, Prompt Engineering"],
  },
  {
    period: "2027", kind: "Experience",
    title: "Fresher 2027 – Computer Science and Engineering, AI & ML Student",
    place: "Guntur, Andhra Pradesh",
    details: [
      "Currently pursuing a Bachelor of Technology in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning",
      "Developing a foundation in Java, HTML, CSS, Artificial Intelligence tools, and prompt engineering",
      "Seeking opportunities to apply programming, Artificial Intelligence, problem-solving, and communication skills in practical engineering environments",
    ],
  },
];
