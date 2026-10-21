import React from 'react';

export default function ReceiptSeparator({ style = 'dashed', paperSize = '58mm' }) {
    let baseCount = paperSize === '80mm' ? 42 : 32;

    let symbol = '-';
    let customClasses = 'my-1.5';

    switch (style) {
        case 'equals':
            symbol = '=';
            baseCount = paperSize === '80mm' ? 40 : 30; // Simbol '=' sedikit lebih lebar
            break;
        case 'stars':
            symbol = '* ';
            baseCount = paperSize === '80mm' ? 21 : 12; // Bintang berpasangan dengan spasi
            break;
        case 'tilde':
            symbol = '~';
            break;
        case 'solid':
            symbol = '—';
            baseCount = paperSize === '80mm' ? 36 : 18;
            break;
        case 'dots':
            symbol = '. ';
            baseCount = paperSize === '80mm' ? 21 : 16;
            break;
        case 'dashed':
        default:
            symbol = '-';
            baseCount = paperSize === '80mm' ? 36 : 25;
            break;
    }

    // Generate string berulang secara dinamis
    const renderText = symbol.repeat(baseCount);

    return (
        <div className={`text-center font-mono text-xs overflow-hidden tracking-widest text-black select-none ${customClasses}`}>
            {renderText}
        </div>
    );
}