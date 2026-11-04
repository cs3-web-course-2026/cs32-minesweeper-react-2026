import React from 'react';

export default function Counter({ value }) {
    return (
        <div style={{ background: '#161822', padding: '6px 12px', borderRadius: '8px', color: '#e06c75', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px' }}>
            🚩 {String(value).padStart(2, '0')}
        </div>
    );
}