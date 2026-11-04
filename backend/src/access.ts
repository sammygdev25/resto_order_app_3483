// Roles and what each may do with each model, from the app's plan (generated). The server reads a user's role
// from the database on every request; a role never comes from a request body or a token.
export const ROLES = ['customer', 'admin'] as const;
export type Role = (typeof ROLES)[number];
export type Level = 'manage' | 'read' | 'own' | 'read_own' | 'create' | 'none';
export const DEFAULT_ROLE: Role = 'customer';
export const STAFF_ROLES: readonly Role[] = ['admin'];
export const ACCESS: Record<string, Partial<Record<Role, Level>>> = {
  Category: { customer: 'read', admin: 'manage' },
  Dish: { customer: 'read', admin: 'manage' },
  Order: { customer: 'own', admin: 'manage' },
  OrderItem: { customer: 'own', admin: 'manage' },
  Reservation: { customer: 'own', admin: 'manage' },
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function isStaffRole(value: unknown): boolean {
  return isRole(value) && STAFF_ROLES.includes(value);
}

// What a role may do with a model; an unknown role or model gets 'none'.
export function levelFor(role: unknown, model: string): Level {
  return isRole(role) ? ACCESS[model]?.[role] ?? 'none' : 'none';
}
