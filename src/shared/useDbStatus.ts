// Public dashboards currently use a reviewed static export. A verified
// read-only database adapter has not yet been configured for this site.
// Do not probe a private endpoint with an unusable browser key or call a
// response from it proof of a live database connection.
export type DbStatus = 'unconfigured';

export function useDbStatus(): DbStatus {
  return 'unconfigured';
}
