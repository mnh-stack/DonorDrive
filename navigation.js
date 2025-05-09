function createNavigation() {
    // Get the current page path to highlight the active link
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    const navigationHtml = `
    <nav>
        <ul>
            <li><a href="index.html" class="${pageName === 'index.html' || pageName === '' ? 'active' : ''}">Home</a></li>
            <li><a href="about.html" class="${pageName === 'about.html' ? 'active' : ''}">About</a></li>
            <li><a href="#" class="${pageName === 'features.html' ? 'active' : ''}">Features</a></li>
            <li><a href="#" class="${pageName === 'solutions.html' ? 'active' : ''}">Solutions</a></li>
            <li><a href="#" class="${pageName === 'pricing.html' ? 'active' : ''}">Pricing</a></li>
            <li><a href="#" class="${pageName === 'contact.html' ? 'active' : ''}">Contact</a></li>
        </ul>
    </nav>
    `;
    
    return navigationHtml;
}

export { createNavigation }; 