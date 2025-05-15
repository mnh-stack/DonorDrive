import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import { initAllCounters } from '../utils/initCounters';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Initialize counters using the external library
    const counterController = initAllCounters();

    // Scroll event for navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      // Reset counters if needed
      if (counterController.reset) {
        counterController.reset();
      }
    };
  }, []);

  const toggleQuestion = (index: number) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const features = [
    {
      icon: <span role="img" aria-label="target">🎯</span>,
      title: "Integrated Campaign Planning",
      description: "Design and execute fundraising campaigns while promoting them simultaneously"
    },
    {
      icon: <span role="img" aria-label="credit card">💳</span>,
      title: "Digital Fundraising",
      description: "Manage online donation drives with secure payments and streamlined communications"
    },
    {
      icon: <span role="img" aria-label="smartphone">📱</span>,
      title: "Social Media Scheduling",
      description: "Boost visibility through planned marketing posts across platforms"
    },
    {
      icon: <span role="img" aria-label="bar chart">📊</span>,
      title: "Performance Tracking",
      description: "Test strategies, measure donations, and monitor engagement in real-time"
    },
    {
      icon: <span role="img" aria-label="briefcase">💼</span>,
      title: "Budget Management",
      description: "Control spending and generate comprehensive reports"
    }
  ];

  const stats = [
    { 
      number: 500, 
      suffix: "+", 
      label: "Organizations",
      icon: <span role="img" aria-label="building">🏢</span>,
      description: "Nonprofits using our platform",
      color: "#3b82f6"
    },
    { 
      number: 12, 
      prefix: "$", 
      suffix: "M", 
      label: "Funds Raised",
      icon: <span role="img" aria-label="money bag">💰</span>,
      description: "Total donations processed",
      color: "#8b5cf6"
    },
    { 
      number: 98, 
      suffix: "%", 
      label: "Success Rate",
      icon: <span role="img" aria-label="check mark">🎯</span>,
      description: "Campaigns reaching goals",
      color: "#ec4899"
    },
    { 
      number: 30, 
      suffix: "%", 
      label: "Growth in Donations",
      icon: <span role="img" aria-label="up arrow">📈</span>,
      description: "Average increase for users",
      color: "#10b981"
    }
  ];

  const testimonials = [
    {
      text: "DonorDrive transformed how we fundraise. The integrated approach helped us increase donations by 40% in just 3 months. The platform is intuitive and powerful.",
      name: "Sarah Johnson",
      position: "Executive Director, Hope Foundation",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      text: "We struggled with multiple platforms before finding DonorDrive. Now everything is in one place, and we can focus on our mission rather than juggling different tools.",
      name: "Michael Chen",
      position: "Campaign Manager, Global Relief",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg"
    }
  ];

  const faqs = [
    {
      question: "How does DonorDrive differ from other fundraising platforms?",
      answer: "DonorDrive uniquely combines fundraising and marketing in one integrated solution, eliminating the need for multiple disconnected tools. Our platform provides end-to-end campaign management with built-in marketing capabilities, real-time analytics, and automated donor engagement."
    },
    {
      question: "Is there a setup fee or long-term contract?",
      answer: "No, DonorDrive operates on a flexible subscription model with no setup fees or long-term contracts. You can choose monthly or annual billing, with the ability to upgrade or downgrade your plan as your needs change."
    },
    {
      question: "Can I migrate my existing donor data to DonorDrive?",
      answer: "Absolutely! We offer a comprehensive data migration service that makes transferring your existing donor information, campaign history, and engagement data simple and secure. Our team will guide you through the entire process."
    },
    {
      question: "How secure is the donation processing system?",
      answer: "DonorDrive uses bank-level security with PCI DSS Level 1 compliance for all financial transactions. We implement multi-layer encryption, secure authentication, and regular security audits to ensure your donors' information remains protected."
    },
    {
      question: "Do you offer integration with other platforms?",
      answer: "Yes, DonorDrive integrates seamlessly with popular CRM systems, email marketing platforms, social media channels, and accounting software. We also offer an API for custom integrations with your existing tools."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <span className="logo-icon">💙</span>
          DonorDrive
        </div>
        <ul className="nav-links">
          <li><button className="nav-link-btn" style={{pointerEvents: 'auto'}} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button></li>
          <li><button className="nav-link-btn" style={{pointerEvents: 'auto'}} onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}>Testimonials</button></li>
          <li><button className="nav-link-btn" style={{pointerEvents: 'auto'}} onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</button></li>
          <li><button className="nav-link-btn" style={{pointerEvents: 'auto'}} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</button></li>
          <li><Link to="/team" style={{pointerEvents: 'auto'}}>Our Team</Link></li>
          <li><Link to="/register" style={{pointerEvents: 'auto'}}>Register</Link></li>
          <li><Link to="/login" style={{pointerEvents: 'auto'}}>Login</Link></li>
          <li><Link to="/owner-login" style={{pointerEvents: 'auto', background: '#8b5cf6', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 600}}>Owner</Link></li>
        </ul>
        <button className="mobile-menu-btn">☰</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src="/assets/videos/donations.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">DonorDrive</span>
            <br />
            Unified Fundraising Platform
          </h1>
          <p className="hero-subtitle">
            Transform your fundraising with an integrated platform that unifies 
            campaign management, digital marketing, and donor engagement.
          </p>
          <div className="hero-cta" style={{pointerEvents: 'auto'}}>
            <Link to="/register" className="cta-primary" style={{pointerEvents: 'auto'}}>Start Your Campaign</Link>
            <Link to="/how-it-works" className="cta-secondary" style={{pointerEvents: 'auto'}}>Watch Demo</Link>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="challenge-section">
        <div className="container">
          <h2 className="challenge-title" data-aos="fade-up">The Challenge</h2>
          <h3 className="challenge-subtitle" data-aos="fade-up" data-aos-delay="100">
            Disconnected Tools, Scattered Results
          </h3>
          <p className="challenge-desc-main" data-aos="fade-up" data-aos-delay="200">
            Nonprofits and fundraisers struggle with multiple disconnected tools, leading to inefficient campaign management, scattered data tracking, and missed optimization opportunities.
          </p>
          <div className="challenge-grid">
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="300">
              <div className="challenge-icon">📧</div>
              <h3>Email</h3>
              <p className="challenge-desc">Campaigns and donor communication are siloed in email tools, making it hard to track engagement and results.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="400">
              <div className="challenge-icon">📱</div>
              <h3>Social Media</h3>
              <p className="challenge-desc">Social outreach is disconnected from donation data, leading to missed optimization opportunities.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="500">
              <div className="challenge-icon">💸</div>
              <h3>Donations</h3>
              <p className="challenge-desc">Donation platforms are isolated, making it difficult to see the full picture of campaign performance.</p>
            </div>
            <div className="challenge-card" data-aos="fade-up" data-aos-delay="600">
              <div className="challenge-icon">📊</div>
              <h3>Analytics</h3>
              <p className="challenge-desc">Analytics are scattered, so teams struggle to measure, compare, and improve their fundraising efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} id="stats" className="stats-section animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card animate-on-scroll"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: `linear-gradient(135deg, white, ${stat.color}10)`
                }}
                data-value={stat.number}
                data-prefix={stat.prefix || ''}
                data-suffix={stat.suffix || ''}
                data-duration="2500"
                data-delay={index * 150}
                data-easing="easeOutCubic"
              >
                <div className="stat-icon-wrapper" style={{ background: `${stat.color}20` }}>
                  <div className="stat-icon">{stat.icon}</div>
                </div>
                <div 
                  className="stat-number counter" 
                  style={{ color: stat.color }}
                >
                  {stat.prefix || ''}{stat.number}{stat.suffix || ''}
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-bar" 
                    style={{ 
                      width: '0%',
                      background: `linear-gradient(90deg, ${stat.color}40, ${stat.color})` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section id="features" className="features-section" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title animate-on-scroll">Complete Solution</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section animate-on-scroll">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card animate-on-scroll">
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div 
                  className={`faq-question ${activeQuestion === index ? 'active' : ''}`}
                  onClick={() => toggleQuestion(index)}
                >
                  {faq.question}
                  <span>+</span>
                </div>
                {activeQuestion === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="cta-section animate-on-scroll">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Fundraising?</h2>
            <p>Join thousands of organizations already using DonorDrive</p>
            <button className="cta-large" onClick={() => window.location.href='/register'}>Get Started Today</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <div className="footer-logo">DonorDrive</div>
              <p>
                The all-in-one platform that streamlines fundraising campaigns and maximizes 
                impact through integrated digital marketing and engagement solutions.
              </p>
              <div className="social-links">
                <a href="https://facebook.com/donordrive" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://twitter.com/donordrive" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.627 1.956 2.444 3.379 4.6 3.419A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.721 14.307-14.417 0-.22-.005-.439-.015-.657A10.243 10.243 0 0 0 24 4.557z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://instagram.com/donordrive" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/donordrive" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h3>Product</h3>
              <ul>
                <li><a href="/features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/case-studies">Case Studies</a></li>
                <li><a href="/resources">Resources</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h3>Company</h3>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h3>Support</h3>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/docs">Documentation</a></li>
                <li><a href="/api">API</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} DonorDrive. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${20 + Math.random() * 20}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage; 