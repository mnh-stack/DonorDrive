import React, { useEffect, useRef, useState, useMemo } from 'react';
import './TeamPage.css';
import initAnimations from '../utils/initAnimations';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  image: string;
  details: {
    experience: string;
    expertise: string[];
    education?: string;
    projects?: string[];
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
    portfolio?: string;
    dribbble?: string;
    medium?: string;
  };
}

const TeamPage: React.FC = () => {
  useEffect(() => {
    // Initialize animations
    const animations = initAnimations();
    
    // Cleanup on unmount
    return () => {
      if (animations.cleanup) {
        animations.cleanup();
      }
    };
  }, []);

  // State for card tilt effect
  const [tiltAngles, setTiltAngles] = useState<{x: number, y: number}[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Use useMemo to prevent recreation of teamMembers array on each render
  const teamMembers = useMemo<TeamMember[]>(() => [
    {
      name: "Nouman",
      role: "Lead Full Stack Developer",
      bio: "Experienced lead developer with expertise in full-stack development, architecture design, and team leadership. Passionate about creating scalable, user-friendly applications.",
      skills: ["React", "Node.js", "TypeScript", "System Architecture", "Team Leadership"],
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      details: {
        experience: "8+ years",
        expertise: [
          "Front-end architecture using React and TypeScript",
          "Back-end development with Node.js and Express",
          "Database design and optimization",
          "Team leadership and project management"
        ],
        education: "Master's in Computer Science, Stanford University",
        projects: [
          "Redesigned payment gateway increasing conversion by 30%",
          "Implemented real-time donation tracking dashboard",
          "Led team of 6 developers for platform migration"
        ]
      },
      socialLinks: {
        linkedin: "https://linkedin.com/company/donordrive",
        github: "https://github.com/donordrive",
        twitter: "https://twitter.com/donordrive",
        email: "mailto:nouman@donordrive.com",
        portfolio: "https://donordrive.com/team/nouman",
        dribbble: "https://dribbble.com/donordrive"
      }
    },
    {
      name: "Zain",
      role: "Backend Developer & Testing",
      bio: "Backend specialist with a focus on robust API development and quality assurance. Ensures our platform maintains high reliability and performance standards.",
      skills: ["Java", "Python", "API Development", "Unit Testing", "CI/CD"],
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      details: {
        experience: "6+ years",
        expertise: [
          "RESTful API design and implementation",
          "Test-driven development methodology",
          "Continuous integration/deployment pipelines",
          "Performance optimization and load testing"
        ],
        education: "Bachelor's in Software Engineering, MIT",
        projects: [
          "Rebuilt API infrastructure improving response time by 40%",
          "Implemented comprehensive test suite with 95% coverage",
          "Created automated deployment pipeline reducing release time by 60%"
        ]
      },
      socialLinks: {
        linkedin: "https://linkedin.com/company/donordrive",
        github: "https://github.com/donordrive",
        email: "mailto:zain@donordrive.com",
        portfolio: "https://donordrive.com/team/zain",
        medium: "https://medium.com/@zaindeveloper"
      }
    },
    {
      name: "Abdullah Omer",
      role: "React Developer",
      bio: "Frontend expert specializing in React development. Creates elegant, responsive user interfaces with a focus on performance and accessibility.",
      skills: ["React", "Redux", "JavaScript", "CSS/SASS", "UI/UX"],
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      details: {
        experience: "5+ years",
        expertise: [
          "React component architecture and state management",
          "Responsive design and mobile-first approach",
          "Performance optimization for React applications",
          "Accessibility compliance (WCAG 2.1)"
        ],
        education: "BS Computer Science, UC Berkeley",
        projects: [
          "Developed donor engagement dashboard increasing retention by 25%",
          "Created responsive donation form with 99% completion rate on mobile",
          "Built reusable component library reducing development time by 40%"
        ]
      },
      socialLinks: {
        linkedin: "https://linkedin.com/company/donordrive",
        github: "https://github.com/donordrive",
        twitter: "https://twitter.com/donordrive",
        email: "mailto:abdullah@donordrive.com",
        portfolio: "https://donordrive.com/team/abdullah",
        dribbble: "https://dribbble.com/abdullahdesigns"
      }
    },
    {
      name: "Shayan",
      role: "Database Engineer",
      bio: "Database architecture expert focusing on data modeling, optimization, and security. Ensures our platform's data layer is robust, scalable, and efficient.",
      skills: ["SQL", "NoSQL", "Data Modeling", "Performance Tuning", "Data Security"],
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      details: {
        experience: "7+ years",
        expertise: [
          "Database architecture design and implementation",
          "Performance optimization for high-traffic applications",
          "Data migration and ETL processes",
          "Security implementation for sensitive donor data"
        ],
        education: "MS in Database Systems, Carnegie Mellon University",
        projects: [
          "Redesigned database architecture reducing query time by 60%",
          "Implemented data sharding strategy for scaling to 10M+ users",
          "Created automated backup and disaster recovery system"
        ]
      },
      socialLinks: {
        linkedin: "https://linkedin.com/company/donordrive",
        github: "https://github.com/donordrive",
        email: "mailto:shayan@donordrive.com",
        portfolio: "https://donordrive.com/team/shayan",
        medium: "https://medium.com/@shayandata"
      }
    }
  ], []);

  // Initialize tilt angles
  useEffect(() => {
    const currentCardRefs = cardRefs.current;
    setTiltAngles(teamMembers.map(() => ({ x: 0, y: 0 })));
    
    // Setup card tilt effect
    const handleMouseMove = (event: MouseEvent, index: number) => {
      const card = currentCardRefs[index];
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left; 
      const y = event.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 20; // Tilt based on mouse Y position
      const tiltY = (centerX - x) / 20; // Tilt based on mouse X position
      
      setTiltAngles(prev => {
        const newAngles = [...prev];
        newAngles[index] = { x: tiltX, y: tiltY };
        return newAngles;
      });
    };
    
    const handleMouseLeave = (index: number) => {
      setTiltAngles(prev => {
        const newAngles = [...prev];
        newAngles[index] = { x: 0, y: 0 };
        return newAngles;
      });
    };
    
    // Add event listeners to each card
    currentCardRefs.forEach((card, index) => {
      if (!card) return;
      
      const boundMouseMove = (e: MouseEvent) => handleMouseMove(e, index);
      const boundMouseLeave = () => handleMouseLeave(index);
      
      card.addEventListener('mousemove', boundMouseMove);
      card.addEventListener('mouseleave', boundMouseLeave);
      
      // Store the bound functions for cleanup
      card._mouseMoveHandler = boundMouseMove;
      card._mouseLeaveHandler = boundMouseLeave;
    });
    
    // Cleanup event listeners
    return () => {
      currentCardRefs.forEach((card) => {
        if (!card) return;
        
        if (card._mouseMoveHandler) {
          card.removeEventListener('mousemove', card._mouseMoveHandler);
        }
        if (card._mouseLeaveHandler) {
          card.removeEventListener('mouseleave', card._mouseLeaveHandler);
        }
      });
    };
  }, [teamMembers]);

  // Animated particles for background effect
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 5 + 2;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 10;
      
      particles.push(
        <div 
          key={i}
          className="team-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return particles;
  };

  // Get icon for social links
  const getSocialIcon = (type: string): JSX.Element => {
    switch(type) {
      case 'linkedin':
        return (
          <>
            <span role="img" aria-label="linkedin">💼</span>
          </>
        );
      case 'github':
        return (
          <>
            <span role="img" aria-label="github">🐙</span>
          </>
        );
      case 'twitter':
        return (
          <>
            <span role="img" aria-label="twitter">🐦</span>
          </>
        );
      case 'email':
        return (
          <>
            <span role="img" aria-label="email">📧</span>
          </>
        );
      case 'portfolio':
        return (
          <>
            <span role="img" aria-label="portfolio">🌐</span>
          </>
        );
      case 'dribbble':
        return (
          <>
            <span role="img" aria-label="dribbble">🏀</span>
          </>
        );
      case 'medium':
        return (
          <>
            <span role="img" aria-label="medium">✍️</span>
          </>
        );
      default:
        return (
          <>
            <span role="img" aria-label="link">🔗</span>
          </>
        );
    }
  };

  return (
    <div className="team-page">
      <nav className="team-navbar">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">💙</span>
            DonorDrive
          </div>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
          </ul>
        </div>
      </nav>
      
      <header className="team-header">
        <div className="container">
          <h1 className="team-title" data-aos="fade-up">Meet Our Team</h1>
          <p className="team-subtitle" data-aos="fade-up" data-aos-delay="100">
            The talented developers behind DonorDrive who make it all possible.
          </p>
        </div>
        {renderParticles()}
      </header>

      <section className="team-section">
        <div className="container">
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                ref={el => cardRefs.current[index] = el}
              >
                <div 
                  className="team-card-inner"
                  style={{
                    transform: `perspective(1000px) rotateX(${tiltAngles[index]?.x || 0}deg) rotateY(${tiltAngles[index]?.y || 0}deg)`
                  }}
                >
                  <div className="team-card-front">
                    <div className="member-image">
                      <img src={member.image} alt={member.name} />
                    </div>
                    <div className="member-info">
                      <h2 className="member-name">{member.name}</h2>
                      <p className="member-role">{member.role}</p>
                      <div className="member-experience">
                        <span>{member.details.experience} experience</span>
                      </div>
                    </div>
                    {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
                      <div className="card-social-container">
                        <div className="member-social">
                          {Object.entries(member.socialLinks).map(([key, value], i) => {
                            let emoji = '';
                            switch (key) {
                              case 'linkedin': emoji = '💼'; break;
                              case 'github': emoji = '🐙'; break;
                              case 'twitter': emoji = '🐦'; break;
                              case 'email': emoji = '📧'; break;
                              case 'portfolio': emoji = '🌐'; break;
                              case 'dribbble': emoji = '🏀'; break;
                              case 'medium': emoji = '✍️'; break;
                              default: emoji = '🔗';
                            }
                            return (
                              <a
                                key={key}
                                href={value}
                                className="social-link"
                                data-type={key}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={key.charAt(0).toUpperCase() + key.slice(1)}
                              >
                                <span role="img" aria-label={key}>{emoji}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="team-card-back">
                    <h2 className="member-name">{member.name}</h2>
                    <p className="member-bio">{member.bio}</p>
                    
                    <div className="member-details">
                      <h3>Expertise</h3>
                      <ul className="expertise-list">
                        {member.details.expertise.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      
                      {member.details.projects && (
                        <div className="member-projects">
                          <h3>Key Projects</h3>
                          <ul className="project-list">
                            {member.details.projects.map((project, i) => (
                              <li key={i}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="member-skills">
                      {member.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag" style={{"--index": skillIndex} as React.CSSProperties}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="challenge-section">
        <div className="container">
          <h2 className="challenge-title" data-aos="fade-up">The Challenge</h2>
          <p className="challenge-subtitle" data-aos="fade-up" data-aos-delay="100">
            Disconnected Tools, Scattered Results
          </p>
          <div className="challenge-grid">
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="200">
              <div className="challenge-icon">📧</div>
              <h3>Email</h3>
              <p className="challenge-desc">Campaigns and donor communication are siloed in email tools, making it hard to track engagement and results.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="300">
              <div className="challenge-icon">📱</div>
              <h3>Social Media</h3>
              <p className="challenge-desc">Social outreach is disconnected from donation data, leading to missed optimization opportunities.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="400">
              <div className="challenge-icon">💸</div>
              <h3>Donations</h3>
              <p className="challenge-desc">Donation platforms are isolated, making it difficult to see the full picture of campaign performance.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="500">
              <div className="challenge-icon">📊</div>
              <h3>Analytics</h3>
              <p className="challenge-desc">Analytics are scattered, so teams struggle to measure, compare, and improve their fundraising efforts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-values">
        <div className="container">
          <h2 className="values-title" data-aos="fade-up">Our Values</h2>
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We constantly push boundaries to create cutting-edge solutions for fundraising challenges.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>We work closely as a team and with our clients to ensure the best possible outcomes.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">🛡️</div>
              <h3>Reliability</h3>
              <p>We build secure, stable, and dependable systems that organizations can rely on.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="300">
              <div className="value-icon">♻️</div>
              <h3>Sustainability</h3>
              <p>We create solutions designed to evolve and grow with changing technology and needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="join-team">
        <div className="container">
          <div className="join-content">
            <h2 data-aos="fade-up">Join Our Team</h2>
            <p data-aos="fade-up" data-aos-delay="100">
              Passionate about technology and making a difference? We're always looking for talented 
              developers to join our mission of transforming fundraising through technology.
            </p>
            <button className="join-button" data-aos="fade-up" data-aos-delay="200">View Open Positions</button>
            <a
              href="https://www.fiverr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fiverr-button"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Find Us on Fiverr
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add TypeScript interface extension for the DOM element to handle event handlers
declare global {
  interface HTMLDivElement {
    _mouseMoveHandler?: (e: MouseEvent) => void;
    _mouseLeaveHandler?: () => void;
  }
}

export default TeamPage; 