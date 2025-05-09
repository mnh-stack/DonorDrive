import { createHeader } from '../components/header.js';
import { createNavigation } from '../components/navigation.js';
import { createFooter } from '../components/footer.js';
import { createFeatureCard } from '../components/featureCard.js';
import { createTestimonial } from '../components/testimonial.js';
import { createCTA } from '../components/cta.js';
import state from '../js/state.js';

// Render the home page
function renderHomePage() {
    const mainContent = document.getElementById('main-content');
    
    // Create the header
    const header = createHeader(
        'home', 
        'DonorDrive', 
        'The all-in-one platform that unifies fundraising, campaign management, and donor engagement'
    );
    
    // Create the navigation
    const navigation = createNavigation();
    
    // Create feature cards
    const campaignPlanningCard = createFeatureCard(
        '📋', 
        'Campaign Planning', 
        'Design and execute fundraising campaigns with our unified interface and streamlined workflow.',
        true
    );
    
    const donationManagementCard = createFeatureCard(
        '💰', 
        'Donation Management', 
        'Process payments securely, track contributions, and communicate with donors effortlessly.',
        true
    );
    
    const socialIntegrationCard = createFeatureCard(
        '📱', 
        'Social Integration', 
        'Connect with major social platforms to schedule posts and coordinate your messaging.',
        true
    );
    
    // Create testimonials
    const testimonial1 = createTestimonial(
        'DonorDrive transformed how we manage our annual charity gala. We\'ve seen a 40% increase in donations since switching to this platform.',
        'https://randomuser.me/api/portraits/women/45.jpg',
        'Sarah Johnson',
        'Charity Foundation'
    );
    
    const testimonial2 = createTestimonial(
        'The integrated social media tools alone saved us countless hours of work. Now we can focus on our mission instead of juggling multiple platforms.',
        'https://randomuser.me/api/portraits/men/32.jpg',
        'Michael Chen',
        'Environmental Nonprofit'
    );
    
    const testimonial3 = createTestimonial(
        'As an individual fundraiser, I needed something simple yet powerful. DonorDrive delivered exactly that, helping me raise over $20,000 for cancer research.',
        'https://randomuser.me/api/portraits/women/68.jpg',
        'Emma Rodriguez',
        'Individual Fundraiser'
    );
    
    // Create CTA
    const cta = createCTA(
        'Ready to Transform Your Fundraising?',
        'Join thousands of organizations that have simplified their fundraising process and increased their donation success with DonorDrive.',
        'Sign Up Free',
        '#',
        'Learn More',
        'about.html',
        'get-started'
    );
    
    // Create the footer
    const footer = createFooter();
    
    // Combine everything
    mainContent.innerHTML = `
        ${header}
        ${navigation}
        <div class="container">
            <section>
                <h2>Simplify Your Fundraising Journey</h2>
                <p style="text-align: center; max-width: 800px; margin: 0 auto 3rem;">DonorDrive brings together all the tools you need for successful fundraising campaigns in one powerful, easy-to-use platform.</p>
                
                <div class="features">
                    ${campaignPlanningCard}
                    ${donationManagementCard}
                    ${socialIntegrationCard}
                </div>
            </section>
        </div>
        
        <section class="testimonials">
            <div class="container">
                <h2>Trusted by Fundraisers Worldwide</h2>
                <div class="testimonial-grid">
                    ${testimonial1}
                    ${testimonial2}
                    ${testimonial3}
                </div>
            </div>
        </section>
        
        <div class="container">
            ${cta}
        </div>
        
        ${footer}
    `;
    
    // Apply the current state
    updateUIFromState();
}

// Helper function to update UI based on current state
function updateUIFromState() {
    // Update dark mode
    if (state.get('ui.darkMode')) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Update mobile menu state
    const mobileMenu = document.querySelector('nav ul');
    if (mobileMenu && state.get('ui.menuOpen')) {
        mobileMenu.classList.add('open');
    }
}

export { renderHomePage }; 