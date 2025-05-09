// Simple state management for the application
const state = {
    // The actual state data
    data: {
        // User state
        user: {
            isLoggedIn: false,
            name: '',
            email: ''
        },
        // Notification state
        notifications: {
            messages: [],
            hasUnread: false
        },
        // UI state
        ui: {
            darkMode: false,
            menuOpen: false
        },
        // Feature flags
        features: {
            donationProgress: true,
            socialSharing: true
        }
    },
    
    // Subscribers that will be notified of state changes
    subscribers: [],
    
    // Get the entire state or a specific path
    get: function(path) {
        if (!path) {
            return this.data;
        }
        
        const keys = path.split('.');
        let value = this.data;
        
        for (const key of keys) {
            if (value[key] === undefined) {
                return undefined;
            }
            value = value[key];
        }
        
        return value;
    },
    
    // Set a value in the state
    set: function(path, value) {
        const keys = path.split('.');
        let current = this.data;
        
        // Navigate to the nested object
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) {
                current[key] = {};
            }
            current = current[key];
        }
        
        // Set the value
        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;
        
        // Notify subscribers
        this.notify(path, value);
    },
    
    // Subscribe to state changes
    subscribe: function(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    },
    
    // Notify subscribers of state changes
    notify: function(path, value) {
        for (const callback of this.subscribers) {
            callback(path, value);
        }
    }
};

export default state; 