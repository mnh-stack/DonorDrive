function createCTA(title, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, id = '') {
    const idAttribute = id ? `id="${id}"` : '';
    
    let secondaryButton = '';
    if (secondaryButtonText && secondaryButtonLink) {
        secondaryButton = `<a href="${secondaryButtonLink}" class="btn">${secondaryButtonText}</a>`;
    }
    
    const ctaHtml = `
    <div class="cta" ${idAttribute}>
        <h2>${title}</h2>
        <p>${description}</p>
        <a href="${primaryButtonLink}" class="btn">${primaryButtonText}</a>
        ${secondaryButton}
    </div>
    `;
    
    return ctaHtml;
}

export { createCTA }; 