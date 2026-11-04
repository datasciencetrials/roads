// Public static hosting has no trusted identity service. Do not collect
// credentials in a browser-only form or imply that client checks protect data.
export function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center',
      padding: 24, background: '#060a14', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ width: '100%', border: '1px solid #334155', borderRadius: 12,
        padding: 24, background: '#0c1220' }}>
        <h1 style={{ fontSize: 22, margin: '0 0 12px' }}>Data Science Trials</h1>
        <p style={{ margin: 0 }}>This data view is unavailable while its figures and access controls are being reviewed.</p>
        <p style={{ marginBottom: 0 }}>No sign-in details are collected on this public site.</p>
      </section>
    </main>
  );
}
