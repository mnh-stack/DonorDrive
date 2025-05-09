function createFeatureCard(icon, title, description, isHomeCard = false) {
    const iconClass = isHomeCard ? 'feature-icon home-feature-icon' : 'feature-icon';
    const cardClass = isHomeCard ? 'feature-card text-center' : 'feature-card';
    
    const featureCardHtml = `
    <div class="${cardClass}">
        <div class="${iconClass}">${icon}</div>
        <h3>${title}</h3>
        <p>${description}</p>
    </div>
    `;
    
    return featureCardHtml;
}

export { createFeatureCard }; 