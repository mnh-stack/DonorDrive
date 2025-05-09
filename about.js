import { createHeader } from '../components/header.js';
import { createNavigation } from '../components/navigation.js';
import { createFooter } from '../components/footer.js';
import { createFeatureCard } from '../components/featureCard.js';
import { createCTA } from '../components/cta.js';
import state from '../js/state.js';

// Render the about page
function renderAboutPage() {
    const mainContent = document.getElementById('main-content');
    
    // Create the header
    const header = createHeader(
        'about',
        'DonorDrive',
        'Empowering fundraisers with an integrated platform for maximum impact',
        false
    );
    
    // Create the navigation
    const navigation = createNavigation();
    
    // Create feature cards
    const campaignPlanningCard = createFeatureCard(
        '📋',
        'Integrated Campaign Planning',
        'A unified interface for designing and executing fundraising campaigns with streamlined workflow from planning to execution. Manage promotion and fundraising simultaneously, eliminating the need to switch between multiple tools.'
    );
    
    const donationManagementCard = createFeatureCard(
        '💰',
        'Digital Fundraising Management',
        'Secure payment processing, contribution tracking, and streamlined donor communications. Support for multiple payment methods with instant donation confirmation to keep donors engaged and informed.'
    );
    
    const socialIntegrationCard = createFeatureCard(
        '📱',
        'Social Media Integration',
        'Direct integration with major social media platforms allows for scheduled marketing posts to boost campaign visibility. Coordinate messaging across different channels for maximum impact and reach.'
    );
    
    const campaignTrackingCard = createFeatureCard(
        '📊',
        'Campaign Simulation & Tracking',
        'Test strategies before full deployment with real-time donation tracking and engagement monitoring. Comprehensive analytics provide insights for continuous campaign optimization.'
    );
    
    const budgetManagementCard = createFeatureCard(
        '📝',
        'Budget Management & Reporting',
        'Powerful spending control tools and comprehensive reporting that combines donation data with marketing performance metrics. Make data-driven decisions to improve ROI on your fundraising efforts.'
    );
    
    // Create CTA
    const cta = createCTA(
        'Ready to Transform Your Fundraising?',
        'Join thousands of organizations that have simplified their fundraising process and increased their donation success with DonorDrive.',
        'Get Started Today',
        '#'
    );
    
    // Create the footer
    const footer = createFooter();
    
    // Combine everything
    mainContent.innerHTML = `
        ${header}
        ${navigation}
        <div class="container">
            <section class="hero">
                <div class="hero-text">
                    <h1>About DonorDrive</h1>
                    <p>DonorDrive is an integrated platform designed to address the challenges that nonprofits, charities, and individual fundraisers face when managing online fundraising campaigns. We unify previously disconnected tools into a single, comprehensive solution.</p>
                    <p>Our mission is to simplify the fundraising process, maximize donor engagement, and help worthy causes reach their goals more efficiently than ever before.</p>
                </div>
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="People working together on fundraising">
                </div>
            </section>
            
            <section>
                <h2>The Problem We're Solving</h2>
                <p>Currently, organizations and individuals conducting fundraising campaigns struggle with:</p>
                <ul>
                    <li>Using multiple disconnected tools for campaign management</li>
                    <li>Scattered data tracking across different platforms</li>
                    <li>Inconsistent donor engagement</li>
                    <li>Inefficient marketing efforts</li>
                    <li>Missed opportunities for campaign optimization</li>
                </ul>
                <p>DonorDrive brings all these elements together, creating a seamless experience for fundraisers and donors alike.</p>
            </section>
            
            <section>
                <h2>Our Solution</h2>
                <div class="features">
                    ${campaignPlanningCard}
                    ${donationManagementCard}
                    ${socialIntegrationCard}
                    ${campaignTrackingCard}
                    ${budgetManagementCard}
                </div>
            </section>
            
            ${cta}
            
            <section>
                <h2>Our Story</h2>
                <p>DonorDrive was founded in 2022 by a team of technology and nonprofit professionals who recognized the fragmented nature of fundraising tools available to charitable organizations.</p>
                <p>After years of working with nonprofits that struggled to coordinate their fundraising campaigns across multiple platforms, our founders set out to create a solution that would unify these efforts into a single, powerful platform.</p>
                <p>Today, DonorDrive serves thousands of organizations worldwide, from small grassroots initiatives to large international charities, all with the shared goal of making a positive impact in their communities and beyond.</p>
            </section>
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

export { renderAboutPage }; 