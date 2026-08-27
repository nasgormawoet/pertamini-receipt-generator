import React from 'react';

export default function PrintStyles({ paperSize }) {
    const is80 = paperSize === '80mm';
    const widthVal = is80 ? '80mm' : '58mm';
    const padVal = is80 ? '5mm' : '2mm';

    return (
        <style>{`
      @media print {
        /* 1. Hilangkan margin bawaan browser/kertas */
        @page {
          size: ${widthVal} auto;
          margin: 0mm !important;
        }

        /* 2. Reset flow dokumen agar tidak membuat halaman kosong */
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

        /* 3. Hapus seluruh elemen UI selain receipt dari layout (bukan visibility hidden) */
        .no-print,
        header,
        form,
        button,
        input,
        select {
          display: none !important;
        }

        /* 4. Reset container utama React */
        .min-h-screen,
        .max-w-6xl,
        .grid {
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: auto !important;
        }

        /* 5. Target area struk: 1 lembar utuh tanpa terpotong */
        #receipt-area {
          display: block !important;
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

        /* 6. Optimasi kontras tinta & gambar thermal */
        img {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          filter: grayscale(100%) contrast(300%) !important;
        }
      }
    `}</style>
    );
}