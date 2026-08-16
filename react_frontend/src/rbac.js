/**
 * WildCare Role-Based Access Control (RBAC) System
 * Defines roles, granular permissions, and route authorization rules.
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  FOREST_OFFICER: 'FOREST_OFFICER',
  CITIZEN: 'CITIZEN',
  GUEST: 'GUEST'
};

export const PERMISSIONS = {
  VIEW_COMMAND_CENTRE: 'VIEW_COMMAND_CENTRE',
  RUN_EDGE_AI_DETECTION: 'RUN_EDGE_AI_DETECTION',
  VIEW_GIS_MAP: 'VIEW_GIS_MAP',
  MANAGE_ALERTS: 'MANAGE_ALERTS',
  DISPATCH_SMS_BROADCAST: 'DISPATCH_SMS_BROADCAST',
  VERIFY_COMMUNITY_REPORTS: 'VERIFY_COMMUNITY_REPORTS',
  SUBMIT_SIGHTING: 'SUBMIT_SIGHTING',
  VIEW_CITIZEN_PORTAL: 'VIEW_CITIZEN_PORTAL',
  VIEW_ANALYTICS_LOGS: 'VIEW_ANALYTICS_LOGS',
  MANAGE_USERS: 'MANAGE_USERS',
  SYSTEM_ADMIN_PANEL: 'SYSTEM_ADMIN_PANEL'
};

// Role-to-Permissions Mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_COMMAND_CENTRE,
    PERMISSIONS.RUN_EDGE_AI_DETECTION,
    PERMISSIONS.VIEW_GIS_MAP,
    PERMISSIONS.MANAGE_ALERTS,
    PERMISSIONS.DISPATCH_SMS_BROADCAST,
    PERMISSIONS.VERIFY_COMMUNITY_REPORTS,
    PERMISSIONS.SUBMIT_SIGHTING,
    PERMISSIONS.VIEW_CITIZEN_PORTAL,
    PERMISSIONS.VIEW_ANALYTICS_LOGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SYSTEM_ADMIN_PANEL
  ],
  [ROLES.FOREST_OFFICER]: [
    PERMISSIONS.VIEW_COMMAND_CENTRE,
    PERMISSIONS.RUN_EDGE_AI_DETECTION,
    PERMISSIONS.VIEW_GIS_MAP,
    PERMISSIONS.MANAGE_ALERTS,
    PERMISSIONS.DISPATCH_SMS_BROADCAST,
    PERMISSIONS.VERIFY_COMMUNITY_REPORTS,
    PERMISSIONS.SUBMIT_SIGHTING,
    PERMISSIONS.VIEW_CITIZEN_PORTAL,
    PERMISSIONS.VIEW_ANALYTICS_LOGS
  ],
  [ROLES.CITIZEN]: [
    PERMISSIONS.VIEW_CITIZEN_PORTAL,
    PERMISSIONS.VIEW_GIS_MAP,
    PERMISSIONS.SUBMIT_SIGHTING
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_CITIZEN_PORTAL,
    PERMISSIONS.VIEW_GIS_MAP
  ]
};

/**
 * Checks if a user has a specific permission
 */
export function hasPermission(user, permission) {
  const role = user?.role ? user.role.toUpperCase() : ROLES.GUEST;
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.GUEST];
  return perms.includes(permission);
}

/**
 * Resolves the default landing tab based on user role
 */
export function getDefaultTabForRole(role) {
  switch ((role || '').toUpperCase()) {
    case ROLES.ADMIN:
      return 'command';
    case ROLES.FOREST_OFFICER:
      return 'command';
    case ROLES.CITIZEN:
      return 'citizen';
    default:
      return 'citizen';
  }
}

/**
 * Navigation Tabs metadata with required permissions
 */
export const DASHBOARD_TABS = [
  {
    id: 'command',
    label: 'Command Centre',
    description: 'Tactical telemetry, risk scores, and live alerts',
    permission: PERMISSIONS.VIEW_COMMAND_CENTRE,
    badge: 'Officer / Admin'
  },
  {
    id: 'detection',
    label: 'Detection Console',
    description: 'YOLOv8 neural inference and camera traps',
    permission: PERMISSIONS.RUN_EDGE_AI_DETECTION,
    badge: 'Edge AI'
  },
  {
    id: 'map',
    label: 'Movement Map',
    description: 'Interactive GIS corridor paths and safe zones',
    permission: PERMISSIONS.VIEW_GIS_MAP,
    badge: 'GIS Live'
  },
  {
    id: 'community',
    label: 'Community Reports',
    description: 'Crowdsourced sightings and verification queue',
    permission: PERMISSIONS.VERIFY_COMMUNITY_REPORTS,
    badge: 'Verification'
  },
  {
    id: 'citizen',
    label: 'Citizen Safety',
    description: 'Rural advisory, 1-tap alerts, and hotline directory',
    permission: PERMISSIONS.VIEW_CITIZEN_PORTAL,
    badge: 'Public'
  },
  {
    id: 'analytics',
    label: 'Analytics & Logs',
    description: 'Species frequency charts, 24-hr activity, CSV export',
    permission: PERMISSIONS.VIEW_ANALYTICS_LOGS,
    badge: 'Reports'
  },
  {
    id: 'admin',
    label: 'System Admin',
    description: 'User access approval and fleet diagnostics',
    permission: PERMISSIONS.SYSTEM_ADMIN_PANEL,
    badge: 'Admin Only'
  }
];

/**
 * Filters tabs based on current user permissions
 */
export function getAuthorizedTabs(user) {
  return DASHBOARD_TABS.filter(tab => hasPermission(user, tab.permission));
}
