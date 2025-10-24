import React from 'react';

const MouldingPage1 = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      color: '#333'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px',
        color: '#2c3e50',
        fontWeight: 'bold'
      }}>
        MOULDING PAGE 1
      </h1>
      <p style={{ 
        fontSize: '1.2rem',
        color: '#7f8c8d'
      }}>
        This is the Moulding Page 1 content area.
      </p>
    </div>
  );
};

export default MouldingPage1;
