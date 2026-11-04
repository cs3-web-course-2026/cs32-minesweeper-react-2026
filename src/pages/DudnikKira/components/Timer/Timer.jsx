import React from 'react';

export default function Timer({ time }) {
    return (
        <div style={{ background: '#161822', padding: '6px 12px', borderRadius: '8px', color: '#61afef', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px' }}>
            ⏱️ {String(time).padStart(3, '0')}
        </div>
    );
}