import React from 'react';

export default function PrintStyles({ paperSize }) {
    const is80 = paperSize === '80mm';
    const widthVal = is80 ? '80mm' : '58mm';
    const padVal = is80 ? '5mm' : '2mm';

    return (
        <style>{`
      @media print {
        @page {
          size: ${widthVal} auto;
          margin: 0mm !important;
        }

        html, body {
          width: ${widthVal} !important;
          min-width: ${widthVal} !important;
          max-width: ${widthVal} !important;
          margin: 0 !important;
          padding: 0 !important;
          height: auto !important;
          min-height: auto !important;
          background: #fff !important;
          overflow: visible !important;
        }

        .no-print,
        header,
        form,
        button,
        input,
        select {
          display: none !important;
        }

        .min-h-screen,
        .max-w-6xl,
        .grid {
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: auto !important;
        }

        #receipt-area {
          display: block !important;
          font-family: 'Share Tech Mono', 'Courier Prime', 'Courier New', monospace !important;
          color: #000000 !important;
          text-rendering: optimizeLegibility;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          position: static !important;
          width: ${widthVal} !important;
          max-width: ${widthVal} !important;
          margin: 0 auto !important;
          padding: ${padVal} !important;
          box-shadow: none !important;
          border: none !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
        }
        #receipt-area * {
          color: #000000 !important;
        }
        
        img {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          filter: grayscale(100%) contrast(300%) !important;
        }
      }
    `}</style>
    );
}