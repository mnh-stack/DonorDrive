function createFooter() {
    const year = new Date().getFullYear();
    
    const footerHtml = `
    <footer>
        <div class="container">
            <p>&copy; ${year} DonorDrive. All rights reserved.</p>
            <p>Contact: info@donordrive.com | (555) 123-4567</p>
        </div>
    </footer>
    `;
    
    return footerHtml;
}

export { createFooter }; 