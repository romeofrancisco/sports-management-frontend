# useRolePermissions Hook Documentation

## Overview

The `useRolePermissions` hook provides a centralized and reusable way to handle role-based permissions throughout the application. It encapsulates all permission logic and provides both granular permission checks and higher-level utility functions.

## Basic Usage

```jsx
import { useRolePermissions } from '../hooks/useRolePermissions';

const MyComponent = () => {
  const { 
    user, 
    isAdmin, 
    isCoach, 
    canModifyMetricUnit, 
    permissions 
  } = useRolePermissions();

  // Simple role checks
  if (isAdmin()) {
    // Show admin-only content
  }

  // Permission checks for specific actions
  const canEdit = canModifyMetricUnit(unit);
  
  return (
    <Button 
      disabled={!canEdit}
      onClick={() => handleEdit(unit)}
    >
      Edit Unit
    </Button>
  );
};
```

## Available Functions

### Role Checks
- `isAdmin()` - Returns true if user is an Admin
- `isCoach()` - Returns true if user is a Coach  
- `hasRole(role)` - Check for specific role

### Metric Units Permissions
- `canCreateMetricUnits()` - Check if user can create metric units
- `canModifyMetricUnit(unit)` - Check if user can edit/delete a specific unit
- `canEditMetricUnit(unit)` - Check if user can edit a specific unit
- `canDeleteMetricUnit(unit)` - Check if user can delete a specific unit
- `getMetricUnitTooltip(unit, action)` - Get appropriate tooltip message

### Structured Permissions Object

The `permissions` object provides organized access to all permission checks:

```jsx
const { permissions } = useRolePermissions();

// Metric Units
permissions.metricUnits.create          // boolean
permissions.metricUnits.modify(unit)    // function
permissions.metricUnits.getTooltip(unit, 'edit') // function

// Teams
permissions.teams.create               // boolean
permissions.teams.edit(team)          // function
permissions.teams.delete(team)        // function

// Games
permissions.games.create              // boolean
permissions.games.recordStats(game)  // function

// System
permissions.system.manageUsers       // boolean
permissions.system.viewAnalytics     // boolean
```

## Role-Based Permission Rules

### Admin Users
- ✅ Can create, edit, and delete any metric units (including system defaults)
- ✅ Can manage teams, games, and users
- ✅ Can access system administration features
- ✅ Full access to all features

### Coach Users
- ✅ Can create metric units (marked as custom, not system default)
- ✅ Can edit/delete only metric units they created
- ❌ Cannot modify system default units
- ✅ Can manage teams they coach
- ✅ Can create and manage games for their teams
- ✅ Can view analytics for their teams
- ❌ Cannot access system administration

### Other Users (Players, etc.)
- ❌ Cannot create, edit, or delete metric units
- ✅ Can view public data (games, teams, etc.)
- ❌ Cannot access administrative features

## Examples

### Basic Permission Check
```jsx
const EditButton = ({ unit }) => {
  const { canModifyMetricUnit, getMetricUnitTooltip } = useRolePermissions();
  
  return (
    <Button
      disabled={!canModifyMetricUnit(unit)}
      title={getMetricUnitTooltip(unit, 'edit')}
      onClick={() => handleEdit(unit)}
    >
      Edit
    </Button>
  );
};
```

### Conditional Rendering
```jsx
const AdminPanel = () => {
  const { isAdmin, permissions } = useRolePermissions();
  
  if (!isAdmin()) {
    return <div>Access denied</div>;
  }
  
  return (
    <div>
      {permissions.system.manageUsers && (
        <UserManagementSection />
      )}
      {permissions.system.manageSettings && (
        <SettingsSection />
      )}
    </div>
  );
};
```

### Complex Permission Logic
```jsx
const GameManager = ({ game }) => {
  const { permissions, user } = useRolePermissions();
  
  const canEditGame = permissions.games.edit(game);
  const canRecordStats = permissions.games.recordStats(game);
  const canDeleteGame = permissions.games.delete(game);
  
  return (
    <div>
      {canEditGame && (
        <Button onClick={() => handleEdit(game)}>
          Edit Game
        </Button>
      )}
      
      {canRecordStats && (
        <Button onClick={() => handleRecordStats(game)}>
          Record Stats
        </Button>
      )}
      
      {canDeleteGame && (
        <Button variant="destructive" onClick={() => handleDelete(game)}>
          Delete Game
        </Button>
      )}
    </div>
  );
};
```

## Benefits

1. **Centralized Logic**: All permission rules are in one place
2. **Reusable**: Use across any component that needs permission checks
3. **Type Safety**: Clear function signatures and return types
4. **Maintainable**: Easy to update permission rules
5. **Consistent**: Same permission logic everywhere
6. **Extensible**: Easy to add new permission types

## Adding New Permissions

To add permissions for a new feature:

1. Add the permission logic functions:
```jsx
const canCreateNewFeature = () => {
  return isAdmin() || isCoach();
};

const canModifyNewFeature = (item) => {
  if (!user || !item) return false;
  return isAdmin() || (isCoach() && item.created_by === user.id);
};
```

2. Add to the permissions object:
```jsx
permissions: {
  // ...existing permissions...
  newFeature: {
    create: canCreateNewFeature(),
    modify: canModifyNewFeature,
    // ...other permissions...
  },
}
```

3. Export the functions:
```jsx
return {
  // ...existing exports...
  canCreateNewFeature,
  canModifyNewFeature,
};
```

This hook makes implementing role-based permissions consistent, maintainable, and easy to use throughout the application.
