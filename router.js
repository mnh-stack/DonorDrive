// Simple router for handling page navigation
const router = {
    routes: {},
    
    // Initialize the router
    init: function() {
        // Handle the initial route
        this.handleRoute(window.location.pathname);
        
        // Listen for changes to the URL
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Intercept link clicks to use the router instead of full page reloads
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && 
                !e.target.getAttribute('href').startsWith('http') &&
                !e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigateTo(path);
            }
        });
    },
    
    // Add a route to the router
    addRoute: function(path, callback) {
        // Normalize the path to remove leading slash
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        this.routes[normalizedPath] = callback;
    },
    
    // Navigate to a specific route
    navigateTo: function(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    },
    
    // Handle the current route
    handleRoute: function(path) {
        // Extract just the filename from the path
        const filename = path.split('/').pop() || 'index.html';
        
        // Find matching route
        const route = this.routes[filename] || this.routes['*'];
        
        if (route) {
            route();
        } else {
            // Fallback to 404 if no route matches
            if (this.routes['*']) {
                this.routes['*']();
            }
        }
    }
};

export default router; 