import React from 'react';
import { Github, Linkedin, ShoppingCart, Shield, Smartphone, Layout, Database, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  return (
    <div className="card p-4 sm:p-6 hover:shadow-lg transition-base hover:-translate-y-1">
      <div className={`${color} w-8 h-8 mb-3 sm:mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-base sm:text-lg mb-2 text-[rgb(var(--fg))]">
        {title}
      </h3>
      <p className="text-[rgb(var(--muted))] text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

interface TechBadgeProps {
  name: string;
  color: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, color }) => {
  return (
    <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md ${color} font-medium text-xs sm:text-sm whitespace-nowrap transition-base`}>
      {name}
    </span>
  );
};

const AboutPage: React.FC = () => {

  const navigate=useNavigate();
  const features = [
    {
      icon: <Code className="w-full h-full" />,
      title: "User Authentication",
      description: "Secure login/registration with JWT tokens and password hashing",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <ShoppingCart className="w-full h-full" />,
      title: "Cart Functionality",
      description: "Full shopping cart with persistent storage and checkout",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: <Layout className="w-full h-full" />,
      title: "Admin Dashboard",
      description: "Comprehensive admin interface for product/user management",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Shield className="w-full h-full" />,
      title: "Secure Payments",
      description: "Payment processing with validation and security measures",
      color: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: <Smartphone className="w-full h-full" />,
      title: "Responsive Design",
      description: "Mobile-first approach for all devices and screen sizes",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Database className="w-full h-full" />,
      title: "RESTful API",
      description: "Well-structured backend following REST principles",
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

const techStack = [
  // --- Frameworks / Libraries ---
  { name: "React", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "Next.js", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  { name: "Redux Toolkit", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { name: "Zustand", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
  { name: "TanStack Query", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { name: "Node.js", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Express.js", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  { name: "Prisma", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  { name: "Vite", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },

  // --- Databases ---
  { name: "MongoDB", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { name: "PostgreSQL", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300" },

  // --- Languages ---
  { name: "JavaScript", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { name: "TypeScript", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "C", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  { name: "C++", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },

  // --- Developer Tools ---
  { name: "VS Code", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "Postman", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { name: "Git", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { name: "GitHub", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },

  ];


  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
            About ShopNest
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 px-4 max-w-3xl mx-auto">
            A full-stack e-commerce showcase built with modern technologies
          </p>
        </div>
      </div>

      {/* Developer Card */}
      <div className="app-container -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16">
        <div className="card p-5 sm:p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className='border border-[rgb(var(--border))] rounded-full p-1.5 w-fit h-fit'>
              <img
                src="https://res.cloudinary.com/dmkggx64g/image/upload/v1761769955/ShopNest/avatars/qvqpu4ocaod0iqi9jepa.jpg"
                alt="Praveen Singh"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full object-cover shadow-md flex-shrink-0 ring-4 ring-[rgb(var(--border))]"
              />
            </div>
            <div className="text-center sm:text-left flex-1 w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(var(--fg))]">
                Praveen Singh
              </h2>
              <p className="text-orange-500 dark:text-orange-400 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                Full-Stack Developer
              </p>
              <p className="text-[rgb(var(--muted))] mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                Passionate about building modern web applications with clean code and great user experiences.
              </p>
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <a 
                  href="https://github.com/singhpraveen77" 
                  
                  className="text-[rgb(var(--muted))] hover:text-[rgb(var(--ring))] transition-base p-2 hover:bg-[rgb(var(--card))] rounded-full"
                  aria-label="GitHub Profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/praveen-singh-004539286/" 
                  className="text-[rgb(var(--muted))] hover:text-[rgb(var(--ring))] transition-base p-2 hover:bg-[rgb(var(--card))] rounded-full"
                  aria-label="LinkedIn Profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Key Features */}
      <div className="section-y app-container">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-[rgb(var(--fg))] px-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Technology Stack */}
        <div className="bg-[rgb(var(--card))] section-y overflow-hidden">
          <div className="app-container ">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-[rgb(var(--fg))] px-4">
              Technology Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="animate-float-random"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationDuration: `${3 + (index % 4) * 8}s`,
                    '--float-y': `${-8 - (index % 3) * 4}px`,
                    '--float-x': `${(index % 2 === 0 ? 1 : -1) * (index % 3) * 2}px`
                  } as React.CSSProperties}
                >
                  <TechBadge {...tech} />
                </div>
              ))}
            </div>
          </div>
        </div>


      {/* CTA Section */}
      <div className="bg-transparent text-white section-y">
        <div className="app-container text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Ready to Explore?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4 max-w-2xl mx-auto">
            Check out the full functionality of this e-commerce showcase
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button 
            onClick={()=>navigate("/")} 
             className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-base hover:shadow-lg text-sm sm:text-base">
              View Live Demo
            </button>
            <a
            target="_blank"
            rel="noopener noreferrer"
             href="https://github.com/singhpraveen77" className="w-full sm:w-auto bg-orange-500 dark:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-base hover:shadow-lg text-sm sm:text-base">
              Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
