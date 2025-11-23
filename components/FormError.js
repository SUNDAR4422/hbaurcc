    import React from 'react';

    // This is a "Pure Component" that only re-renders when the message changes.
    // It helps prevent the error from flickering due to unrelated parent updates.
    const FormError = ({ message }) => {
    if (!message) return null;

    return (
        <div className="alert-box">
        <span className="alert-icon">!</span>
        <span>{message}</span>
        <style>{`
            .alert-box {
            background-color: #fef2f2;
            border: 1px solid #fca5a5;
            color: #991b1b;
            padding: 10px 12px;
            border-radius: 10px;
            font-size: 0.85rem;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 16px;
            animation: slideDown 0.3s ease-out;
            }
            .alert-icon {
            font-weight: bold;
            font-size: 1rem;
            flex-shrink: 0;
            line-height: 1.5;
            }
            @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); max-height: 0; }
            to { opacity: 1; transform: translateY(0); max-height: 100px; }
            }
        `}</style>
        </div>
    );
    };

    export default React.memo(FormError);