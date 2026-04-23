import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '8rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '0.5rem',
      }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary" id="go-home-btn">
        <HiOutlineHome size={18} />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
