export const Enums = Object.freeze({
    ProjectStatus: {
        PLANNING: 'PLANNING',
        IN_PROGRESS: 'IN_PROGRESS',
        ON_HOLD: 'ON_HOLD', 
        COMPLETED: 'COMPLETED',
        CANCELLED: 'CANCELLED'
    },

    PriorityLabel: {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        URGENT: 'URGENT'
    },

    TagCategory: {
        FEATURE: 'FEATURE',
        BUG: 'BUG',
        DOCUMENTATION: 'DOCUMENTATION',
        ENHANCEMENT: 'ENHANCEMENT',
        TESTING: 'TESTING'
    },

    UserPermission: {
        VIEWER: 'VIEWER',           // Can only view
        MEMBER: 'MEMBER',          // Can view and update
        MANAGER: 'MANAGER',        // Can manage project and members
        ADMIN: 'ADMIN'            // Full access including user management
    }
});

export default Enums;


