
import { PortfolioItem, BlogPost, SiteConfig } from './types';

export const APP_NAME = "Tzarina Paula";
export const APP_TAGLINE = "Clinical Precision. Creative Soul.";

export const DEFAULT_CONFIG: SiteConfig = {
  general: {
    appName: "Tzarina Paula",
    logoUrl: "https://res.cloudinary.com/df40kvhb7/image/upload/v1769307093/logo_bw_dudxeh.png",
    tagline: "Where logic meets motion.",
    availableForHire: true,
    availabilityStatus: 'limited',
    availableSlots: 2,
    totalSlots: 5
  },
  seo: {
    metaTitle: "Tzarina Paula | Multimedia Artist & IT Specialist",
    metaDescription: "A hybrid professional merging 13+ years of medical documentation precision with modern multimedia art and web development. BS IT graduate.",
    keywords: "After Effects Artist, Motion Designer, Illustrator, React Developer, BS IT Graduate, Multimedia Artist Philippines",
    "ogImage": "https://res.cloudinary.com/df40kvhb7/image/upload/v1769277564/girlandhercatfishing_withlogo_xrc50e.png",
    aiKnowledgeContext: "Tzarina Paula is a 37-year-old hybrid professional who is strictly against AI-generated art, believing that true art requires a human soul. She specializes in being a 'Vision Bridge'—helping non-technical clients translate their abstract ideas into high-fidelity digital art. She has 13+ years of clinical documentation experience and served as a Project Lead for various initiatives during her BSIT studies. She is known for high-frequency communication and clinical-grade attention to detail."
  },
  cloudinary: {
    cloudName: "df40kvhb7",
    uploadPreset: "portfolio_unsigned_preset" 
  },
  hero: {
    headlineWord1: "Logic.",
    headlineWord2: "Motion.",
    headlineWord3: "Art.",
    backgroundImage: "https://res.cloudinary.com/df40kvhb7/image/upload/v1769277564/girlandhercatfishing_withlogo_xrc50e.png",
    backgroundType: 'image',
    mobileBackgroundImage: "",
    mobileBackgroundType: 'image'
  },
  bio: {
    headline: "The Vision Bridge.",
    subHeadline: "Where Medical Precision Meets Motion Mastery",
    description: `<p>Imagine a world where a <strong>misplaced comma</strong> can change a medical diagnosis. That was my reality for 13 years in healthcare documentation. It taught me that <strong>perfect precision isn't optional—it's the baseline.</strong><br><br></p>
    <p>I am a <strong>Vision Bridge</strong>. I understand that many clients have a brilliant vision but lack the technical vocabulary to build it. My process is deeply collaborative and highly communicative—I act as the technical liaison that turns your abstract ideas into high-fidelity digital reality, ensuring every detail captures your intent with surgical accuracy.<br><br></p>
    <p>During my BSIT studies, I frequently stepped into <strong>Project Lead roles</strong>, coordinating teams to ensure that complex logic met beautiful execution. I carry this leadership and discipline into every artistic commission, ensuring project timelines are respected as much as the artistic integrity.<br><br></p>
    <p><strong>A Note on Integrity:</strong> I believe art is a projection of the human soul. Every piece in this portfolio is crafted by hand and heart. I stand firmly against generative AI art, prioritizing the inimitable spark of human creation that no algorithm can replicate.<br><br></p>`,
    profileImage: "https://res.cloudinary.com/df40kvhb7/image/upload/v1770135513/profile-tzarina_wkfcai.jpg",
    skillsTitle1: "Technical Logic",
    skillsText1: "React.js, PostgreSQL, PHP, System Architecture, UI/UX Logic",
    skillsTitle2: "Creative Motion",
    skillsText2: "After Effects, Frame-by-Frame Animation, Photoshop, Digital Illustration"
  },
  testimonial: {
    quote: "Tzarina brings a level of discipline to her creative work that is rarely seen. Her background in high-accuracy fields makes her a dream to work with on complex projects.",
    author: "Sarah Jenkins",
    role: "Creative Director"
  },
  story: {
    title: "The Pivot.",
    synopsis: "A case study in precision. This project showcases the full-cycle production of a cinematic narrative, blending initial digital painting with final motion sequencing.",
    frontCoverUrl: "https://res.cloudinary.com/df40kvhb7/image/upload/v1769277564/girlandhercatfishing_withlogo_xrc50e.png",
    backCoverUrl: "https://res.cloudinary.com/df40kvhb7/image/upload/v1769277564/girlandhercatfishing_withlogo_xrc50e.png",
    animations: [
      {
        title: "Precision Motion Showcase",
        videoUrl: "https://res.cloudinary.com/df40kvhb7/video/upload/v1769277564/trailer_sample.mp4",
        thumbnailUrl: "https://res.cloudinary.com/df40kvhb7/image/upload/v1769277564/girlandhercatfishing_withlogo_xrc50e.png"
      }
    ]
  },
  journal: {
    sectionTitle: "Production Log",
    headline: "Thoughts & Motion."
  },
  theme: {
    fontHeading: "Italiana",
    fontBody: "Manrope",
    colorBackground: "#f4f1ea",
    colorText: "#292524", 
    colorAccent: "#fa8c96"
  },
  contact: {
    email: "tzarinapaula.s@gmail.com",
    formspreeId: "", 
    location: "Koronadal, Soccsksargen, Philippines",
    footerText: "13+ Years of Professional Discipline. Infinite Creativity.",
    signatureUrl: "",
    socials: {
      facebook: "https://facebook.com/goddessyui/",
      instagram: "https://instagram.com/tzarinapaula/",
      tiktok: "https://tiktok.com/goddessyui",
      linkedin: "https://linkedin.com/in/tzarinapaula",
      youtube: "https://www.youtube.com/@TzarinaPaula",
      deviantart: "https://www.deviantart.com/swordyui",
      artstation: "https://www.artstation.com/tzarinapaula",
      shutterstock: "https://www.shutterstock.com/g/tzarinapaula"
    }
  }
};
