function createTestimonial(quote, image, name, organization) {
    const testimonialHtml = `
    <div class="testimonial">
        <p>"${quote}"</p>
        <div class="testimonial-author">
            <img src="${image}" alt="${name}">
            <div>
                <strong>${name}</strong><br>
                ${organization}
            </div>
        </div>
    </div>
    `;
    
    return testimonialHtml;
}

export { createTestimonial }; 