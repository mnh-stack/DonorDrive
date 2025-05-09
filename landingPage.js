function createLandingPage() {
    const landingPageHtml = `
    <div class="landing-page">
        <video autoplay muted loop class="landing-video">
            <source src="assets/savelife.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        
        <div class="landing-overlay"></div>
        
        <div class="landing-content">
            <div class="logo-container">
                <h1 class="landing-logo">DonorDrive</h1>
            </div>
            
            <div class="tagline-container">
                <p class="landing-tagline">Unite. Donate. Transform.</p>
            </div>
            
            <div class="cta-container">
                <a href="#" id="enter-site-btn" class="landing-cta-btn">Enter Site</a>
            </div>
        </div>
    </div>
    `;
    
    return landingPageHtml;
}

// Function to handle landing page animations and transition
function initLandingPage() {
    const enterSiteBtn = document.getElementById('enter-site-btn');
    
    if (enterSiteBtn) {
        enterSiteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add exit animation class
            document.querySelector('.landing-page').classList.add('exit');
            
            // Wait for animation to complete then remove landing page
            setTimeout(() => {
                document.querySelector('.landing-page').remove();
                
                // Trigger main site content to appear
                document.body.classList.add('site-loaded');
                
                // Animate in the main content
                const appContent = document.getElementById('main-content');
                if (appContent) {
                    appContent.style.opacity = '1';
                    appContent.style.transform = 'translateY(0)';
                }
            }, 1000);
        });
    }
    
    // Animate in the landing page elements
    setTimeout(() => {
        document.querySelector('.logo-container').classList.add('reveal');
    }, 500);
    
    setTimeout(() => {
        document.querySelector('.tagline-container').classList.add('reveal');
    }, 1200);
    
    setTimeout(() => {
        document.querySelector('.cta-container').classList.add('reveal');
    }, 1800);
}

export { createLandingPage, initLandingPage }; 