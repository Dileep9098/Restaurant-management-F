export const hasPermission = (user, permission) => {
  if (!user) return false;
  if (!user.role || !user.role.permissions) return false;
  return user.role.permissions.includes(permission);
};
