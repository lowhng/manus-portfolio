import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Camera,
  Code,
  Palette,
  Brain,
  Users,
  Award,
} from "lucide-react";
import "./App.css";
import profilePhoto from "@/assets/profile.jpg";
import physiomedScreenshot from "@/assets/physiomed-screenshot.png";
import nzecScreenshot from "@/assets/nzec.png";
import shareShareScreenshot from "@/assets/shareshare.png";

function PortfolioContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "services", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const softSkills = [
    { name: "Project Management", icon: Award },
    { name: "Research & Analysis", icon: Users },
  ];

  const technicalSkills = [
    { name: "Web Development", icon: Code },
    { name: "AR/VR Development", icon: Brain },
  ];

  const designSkills = [
    { name: "UX/UI Design", icon: Palette },
    { name: "Photography", icon: Camera },
  ];

  const experiences = [
    {
      title: "Senior Consultant",
      company: "Mettle International",
      period: "Oct 2024 - Present",
      description:
        "At Mettle, I lead consulting engagements in the utilities sector, with a focus on digital transformation and service delivery optimisation. My primary project involves a medium-sized Electricity Distribution Business (EDB), where I’m driving the design and rollout of a new Service Request Portal on Microsoft Power Platform. I also manage a few other projects within the same client.",
      technologies: ["Consulting", "Development", "Technology"],
    },
    {
      title: "IT Business Analyst",
      company: "SPICAE",
      period: "Feb 2024 - Sep 2024",
      description:
        "I worked with a medium-sized electricity distribution company (different from my current client), supporting the rollout of an Asset Management System and improving the end-to-end service request process. My role combined business analysis, UX consulting, and project delivery across multiple streams.",
      technologies: ["UX Research", "Business Analysis", "Prototyping"],
    },
    {
      title: "UX Consultant",
      company: "SPICAE",
      period: "Feb 2023 - Feb 2024",
      description:
        "I was contracted as a UX Consultant for SPICAE for a specific project managing power outage notifications to customers for an Electricity Distribution Business. I conducted a brainstorming workshop and developed user personas, user journey maps, requirements, and suggested actions to be taken for current and future iterations of the product.",
      technologies: ["UX Design", "User Research", "Workshops"],
    },
    {
      title: "Research Assistant",
      company: "University of Otago",
      period: "Jul 2022 - Apr 2024",
      description:
        "Worked as a Research Assistant on multiple projects, including my PhD project regarding using Augmented Reality in on-site sports spectating scenario. My job is to revamp and reorganise work done by other PhD students and bring it to a usable state on-site. Concurrently, I was also working on widget placement strategy for AR head-mounted displays for pervasive AR. I was tasked to design a user study to evaluate various placement strategies.",
      technologies: ["AR/VR", "Unity", "User Studies", "Research"],
    },
  ];

  const projects = [
    {
      title: "ShareShare",
      description:
        "AI-powered receipt scanning and bill splitting app that automatically extracts items and prices, assigns them to friends, and calculates splits instantly.",
      technologies: ["AI", "Web Development", "PWA", "NextJS"],
      link: "https://getshareshare.app",
      image: shareShareScreenshot,
    },
    {
      title: "NZ Electricity Calculator",
      description:
        "A web application to calculate electricity costs depending of appliances usage for New Zealand households.",
      technologies: ["React", "Tailwind CSS", "Vercel"],
      link: "https://nzec.vercel.app",
      image: nzecScreenshot,
    },
    {
      title: "PhysioMed Otago",
      description:
        "Professional physiotherapy practice website featuring modern aesthetics, service information, and patient resources.",
      technologies: ["Web Development", "HTML", "SEO", "Responsive Design"],
      link: "https://physiomedotago.co.nz",
      image: physiomedScreenshot,
      tag: "Client Project",
    },

  ];

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-white">Wei Hong Lo</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["About", "Skills", "Experience", "Projects", "Services", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 cursor-pointer ${
                    activeSection === item.toLowerCase()
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-2 space-y-2">
              {["About", "Skills", "Experience", "Projects", "Services", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Wei Hong Lo
              </span>
            </h1>
            {/* <p className="text-xl md:text-2xl text-gray-300 mb-4">
              PhD | AR/VR Specialist | Digital Product Creator
            </p> */}
             <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Tech Consultant | Photographer | AI Enthusiast
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Passionate about using technology to solve challenges and help
              communities. Exploring web development technologies,
              AI-driven tools, and creating innovative SaaS solutions with a focus on
              user experiences. Under my business brand Wei Hong Innovations, I help small 
              businesses solve day-to-day problems with technology and create simple websites too!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer"
            >
              View My Work
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg cursor-pointer"
            >
              Get in Touch
            </Button>
          </div>

          <div className="animate-bounce">
            <ChevronDown
              size={32}
              className="text-gray-400 mx-auto cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => scrollToSection("about")}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-2xl mb-6 w-80 h-96 mx-auto">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={profilePhoto}
                    alt="Wei Hong Lo"
                    className="object-cover w-full h-full"
                  />
                </div>
                 <p className="text-gray-100 text-lg font-bold p-8 text-center">Wei Hong</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                I'm a digital product creator and technology enthusiast focused
                on building innovative SaaS solutions. With a PhD in Mixed
                Reality (AR/VR) Visualization and User Experience, I bring deep
                technical expertise combined with user-centered design thinking.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                Recently, I've been exploring advanced web development
                technologies, including Next.js, Tailwind CSS, Vercel, and
                Netlify, to create intuitive, responsive, and scalable web
                applications. My interest lies in harnessing AI-driven tools and
                integrations to enhance user experiences and streamline business
                processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Skills & Expertise
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Technical Skills */}
            <div>
              <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">Technical Skills</h3>
              <div className="space-y-4">
                {technicalSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-4 rounded-lg border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <skill.icon size={20} className="text-purple-400 mr-3" />
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-400 mb-6 text-center">Soft Skills</h3>
              <div className="space-y-4">
                {softSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-4 rounded-lg border-2 border-blue-400/50 hover:border-blue-400 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <skill.icon size={20} className="text-blue-400 mr-3" />
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Skills */}
            <div>
              <h3 className="text-2xl font-semibold text-pink-400 mb-6 text-center">Design Skills</h3>
              <div className="space-y-4">
                {designSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-4 rounded-lg border-2 border-pink-400/50 hover:border-pink-400 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <skill.icon size={20} className="text-pink-400 mr-3" />
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Experience
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-blue-400 font-medium">{exp.company}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-gray-300 mt-2 md:mt-0"
                    >
                      {exp.period}
                    </Badge>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group h-full flex flex-col cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30"
                onClick={() => window.open(project.link, "_blank")}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top rounded-lg"
                      />
                    ) : (
                      <Code size={48} className="text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {project.title}
                      </h3>
                      {project.tag && (
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30 text-xs">
                          {project.tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="bg-gray-700 text-gray-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Pricing Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Services & Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Website Design & Development */}
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Code size={24} className="text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Website Development</h3>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  I build simple responsive websites and bring you along the journey. Fast turnaround time and affordable pricing.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-300">Basic Website (Single Page)</span>
                    <span className="text-blue-400 font-semibold">1,299 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-300">SEO Starter Pack</span>
                    <span className="text-blue-400 font-semibold">199 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-300">Multipage Website</span>
                    <span className="text-blue-400 font-semibold">From 1,999 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Website Edits</span>
                    <span className="text-blue-400 font-semibold">From 100 NZD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photography */}
            <Card className="bg-gray-800/30 border-gray-600 opacity-60 relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Camera size={24} className="text-gray-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-400">Photography</h3>
                </div>
                <p className="text-gray-500 mb-4 leading-relaxed">
                  Professional photography services for events, portraits, and commercial use. 
                  High-quality images that tell your story.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">Portrait Session (1hr)</span>
                    <span className="text-gray-500 font-semibold">350 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">Event Photography (3hrs)</span>
                    <span className="text-gray-500 font-semibold">800 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">Property Photography</span>
                    <span className="text-gray-500 font-semibold">500 NZD</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">All Other Photography</span>
                    <span className="text-gray-500 font-semibold">POA</span>
                  </div>
                </div>
              </CardContent>
              {/* Portfolio Button - Centered Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={() => window.open("https://weihongphotography.myportfolio.com/", "_blank")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold cursor-pointer shadow-lg border-2 border-purple-500"
                >
                  View My Portfolio
                </Button>
              </div>
              {/* Contact for Enquiry Stamp */}
              <div className="absolute top-4 right-4 transform rotate-12">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-red-500">
                  Contact for Enquiry
                </div>
              </div>
            </Card>

            {/* Consulting & Prototyping */}
            <Card className="bg-gray-800/30 border-gray-600 opacity-60 relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Brain size={24} className="text-gray-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-400">Consulting & Prototyping</h3>
                </div>
                <p className="text-gray-500 mb-4 leading-relaxed">
                  Strategic technology consulting and rapid prototyping services. 
                  Turn your ideas into actionable solutions.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">Tech Consultation</span>
                    <span className="text-gray-500 font-semibold">120 NZD/hr</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">UX Research & Analysis</span>
                    <span className="text-gray-500 font-semibold">140 NZD/hr</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-500">Rapid Prototyping</span>
                    <span className="text-gray-500 font-semibold">160 NZD/hr</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Process Mapping</span>
                    <span className="text-gray-500 font-semibold">160 NZD/hr</span>
                  </div>
                </div>
              </CardContent>
              {/* Not Currently Offered Stamp */}
              <div className="absolute top-4 right-4 transform rotate-12">
                <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-gray-500">
                  Not Currently Offered
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            I'm always interested in new opportunities and collaborations.
            Whether you have a project in mind or just want to connect, feel
            free to reach out!
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div 
              className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => window.open("mailto:hello@weihong.dev", "_blank")}
            >
              <Mail size={32} className="text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-300">hello@weihong.dev</p>
            </div>

            <div 
              className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => window.open("https://linkedin.com/in/weihonglo", "_blank")}
            >
              <Linkedin size={32} className="text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-300">linkedin.com/in/weihonglo</p>
            </div>

            <div 
              className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => window.open("https://maps.google.com/?q=Dunedin,New+Zealand", "_blank")}
            >
              <MapPin size={32} className="text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-300">Dunedin, New Zealand</p>
            </div>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer"
            onClick={() =>
              window.open("mailto:hello@weihong.dev", "_blank")
            }
          >
            Send Me an Email
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Wei Hong Lo. Built with React, Tailwind CSS, and lots of ☕
          </p>
        </div>
      </footer>
    </div>
  );
}

function AppContent() {
  const [routes, setRoutes] = useState([]);
  const [routesLoaded, setRoutesLoaded] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_TEMPO) {
      // Dynamically import tempo routes only when needed
      import("tempo-routes")
        .then((tempoRoutes) => {
          setRoutes(tempoRoutes.default || tempoRoutes);
          setRoutesLoaded(true);
        })
        .catch(() => {
          // Tempo routes not available
          setRoutesLoaded(true);
        });
    } else {
      setRoutesLoaded(true);
    }
  }, []);

  // Show loading state while routes are being loaded in Tempo environment
  if (import.meta.env.VITE_TEMPO && !routesLoaded) {
    return <div>Loading...</div>;
  }

  const tempoRoutes = import.meta.env.VITE_TEMPO && useRoutes(routes);

  if (tempoRoutes) {
    return tempoRoutes;
  }

  return (
    <Routes>
      <Route path="/*" element={<PortfolioContent />} />
      {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
