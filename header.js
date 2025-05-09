function createHeader(type, title, subtitle, showButtons = true) {
    let headerClass = '';
    let backgroundSection = '';
    
    if (type === 'home') {
        headerClass = 'header-home';
    }
    
    let buttonSection = '';
    if (showButtons) {
        buttonSection = `
            <a href="#get-started" class="btn">Get Started</a>
            <a href="about.html" class="btn btn-primary">Learn More</a>
        `;
    }
    
    const headerHtml = `
    <header class="${headerClass}">
        <div class="container">
            <h1>${title || 'DonorDrive'}</h1>
            <p>${subtitle || 'Empowering fundraisers with an integrated platform for maximum impact'}</p>
            ${buttonSection}
        </div>
    </header>
    `;
    
    return headerHtml;
}

export { createHeader }; 