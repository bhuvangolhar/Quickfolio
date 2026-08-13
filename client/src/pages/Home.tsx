import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import EducationSection from "../components/Education";
import Socials from "../components/Socials";

interface HomeProps {
  adminMode?: boolean;
}

export default function Home({ adminMode = false }: HomeProps) {
  // Ensure adminMode is strictly coerced to a boolean to prevent unexpected truthy objects
  const isAdmin = Boolean(adminMode);

  return (
    <main id="main-content" role="main" className="w-full">
      <Hero adminMode={isAdmin} />
      <About adminMode={isAdmin} />
      <Experience adminMode={isAdmin} />
      <Projects adminMode={isAdmin} />
      <Skills adminMode={isAdmin} />
      <EducationSection adminMode={isAdmin} />
      <Certifications adminMode={isAdmin} />
      <Socials adminMode={isAdmin} />
    </main>
  );
}