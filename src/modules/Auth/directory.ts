import type { UserRole } from './authTypes';

export type AccessStatus = 'active' | 'pending' | 'revoked' | 'rejected' | 'new';
export interface DirEntry {
  email: string;
  name?: string;
  role?: UserRole | string;
  status: Exclude<AccessStatus, 'new'>;
  requestedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
  region?: string;
  department?: string;
}

// No public client-side staff roster or authorisation decisions. Directory
// administration needs a trusted backend and is disabled on static hosting.
export async function getStatus(_email: string): Promise<AccessStatus> { return 'new'; }
export async function requestAccess(_user: { email: string; name?: string; role?: string }): Promise<void> {}
export async function listDirectory(): Promise<DirEntry[]> { return []; }
export async function decide(
  _email: string, _action: 'approve' | 'reject' | 'revoke' | 'restore',
  _by: string, _role?: string,
): Promise<void> {}
