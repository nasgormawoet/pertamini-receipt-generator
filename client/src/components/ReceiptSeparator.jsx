import React from 'react';

export default function ReceiptSeparator({ style = 'dashed', paperSize = '58mm' }) {
    let baseCount = paperSize === '80mm' ? 42 : 32;
    let symbol = '-';
    let customClasses = 'my-1.5'; // Margin default
    switch (style) {
        case 'equals':
            symbol = '=';
            baseCount = paperSize === '80mm' ? 40 : 26; // Simbol '=' sedikit lebih lebar
            break;
        case 'stars':
            symbol = '* ';
            baseCount = paperSize === '80mm' ? 21 : 16; // Bintang berpasangan dengan spasi
            break;
        case 'tilde':
            symbol = '~';
            break;
        case 'solid':
            symbol = '—';
            baseCount = paperSize === '80mm' ? 36 : 24; // Karakter em-dash lebih panjang
            break;
        case 'dots':
            symbol = '. ';
            baseCount = paperSize === '80mm' ? 21 : 16;
            break;
        case 'dashed':
        default:
            symbol = '-';
            baseCount = paperSize === '80mm' ? 36 : 26;
            break;
    }

    const renderText = symbol.repeat(baseCount);

    return (
        <div className={`text-center font-mono text-xs overflow-hidden tracking-widest text-black select-none ${customClasses}`}>
            {renderText}
        </div>
    );
}