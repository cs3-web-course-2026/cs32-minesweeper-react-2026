import React from 'react';

export default function RestartButton({ status, onClick }) {
    const getEmoji = () => {
        if (status === 'won') return '😎';
        if (status === 'lost') return '😵';
        return '😊';
    };

    return (
        <button
            onClick={onClick}
            style={{
                background: '#2a2d3e',
                border: 'none',
                borderRadius: '8px',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '6px 14px',
                transition: 'transform 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        >
            {getEmoji()}
        </button>
    );
}