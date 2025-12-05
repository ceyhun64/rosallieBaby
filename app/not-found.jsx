// app/not-found.js

import Link from 'next/link';

export default function NotFound() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fafafa',
      }}
    >
      <h1 
        style={{
          fontSize: '56px',
          color: '#222',
          marginBottom: '8px',
          fontWeight: '700',
        }}
      >
        404
      </h1>

      <h2 
        style={{
          fontSize: '28px',
          color: '#444',
          marginBottom: '16px',
        }}
      >
        Page Not Found
      </h2>

      <p 
        style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '28px',
          maxWidth: '500px',
          lineHeight: '1.6',
        }}
      >
        The page you are looking for doesn’t exist. It may have been moved or the URL might be incorrect.
      </p>

      <Link
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          transition: 'opacity 0.2s ease',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
