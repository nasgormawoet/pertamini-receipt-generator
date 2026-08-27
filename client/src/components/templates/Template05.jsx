import React from 'react';

export default function Template05({ formData, paperSize }) {
    const is80 = paperSize === '80mm';

    const formatRupiah = (num) => `Rp${Number(num || 0).toLocaleString('id-ID')}`;
    const formatBbmName = (name = '') => name.split('(')[0].trim();

    return (
        <div className={`space-y-1 font-mono text-black leading-tight ${is80 ? 'text-[12px]' : 'text-[10.5px]'}`}>
            {/* 1. Header Logo & Info SPBU */}
            <div className="text-center space-y-0.5">
                <img
                    src="/logo.png"
                    alt="Logo Pertamina"
                    className="mx-auto block object-contain grayscale contrast-200"
                    style={{ width: is80 ? '140px' : '120px', height: 'auto', maxHeight: '42px' }}
                />
                <div className="font-bold text-sm tracking-wider">{formData.spbuNo}</div>
                <div className="font-bold uppercase tracking-tight">{formData.spbuName || `SPBU ${formData.spbuNo}`}</div>
                <div className="uppercase text-[9.5px]">{formData.spbuAddress}</div>
                <div className="text-[9.5px]">{formData.spbuCity}</div>
            </div>

            {/* Pembatas Garis Putus-putus */}
            <div className="text-center overflow-hidden whitespace-nowrap tracking-tighter text-[9px] my-1">
                -----------------------------------------------------
            </div>

            {/* 2. Rincian Transaksi */}
            <table className="w-full border-collapse">
                <tbody>
                <tr>
                    <td className="w-24 align-top">No. Nota</td>
                    <td className="w-3 align-top">:</td>
                    <td className="font-medium">{formData.trxId}</td>
                </tr>
                <tr>
                    <td className="align-top">No. Pompa</td>
                    <td className="align-top">:</td>
                    <td>
                        {formData.pompaNo || '1'} / {formData.selangNo || '2'} {formatBbmName(formData.fuelType)}
                    </td>
                </tr>
                <tr>
                    <td className="align-top">Harga</td>
                    <td className="align-top">:</td>
                    <td className="text-right">{formatRupiah(formData.pricePerLiter)}</td>
                </tr>
                <tr>
                    <td className="align-top">Volume</td>
                    <td className="align-top">:</td>
                    <td className="text-right font-medium">(L) {Number(formData.volume || 0)}</td>
                </tr>
                <tr>
                    <td className="align-middle font-bold text-sm pt-1">Total</td>
                    <td className="align-middle font-bold text-sm pt-1">:</td>
                    <td className="text-right font-bold text-base pt-1">{formatRupiah(formData.total)}</td>
                </tr>
                </tbody>
            </table>

            {/* Pembatas Garis Ganda */}
            <div className="text-center overflow-hidden whitespace-nowrap tracking-tighter text-[9px] my-1">
                =====================================================
            </div>

            {/* 3. Operator, Customer & No. Plat */}
            <table className="w-full border-collapse">
                <tbody>
                <tr>
                    <td className="w-24 align-top">Operator</td>
                    <td className="w-3 align-top">:</td>
                    <td>{formData.operator || '-'}</td>
                </tr>
                {formData.customer && (
                    <tr>
                        <td className="align-top">Customer</td>
                        <td className="align-top">:</td>
                        <td>{formData.customer}</td>
                    </tr>
                )}
                {formData.platNo && (
                    <tr>
                        <td className="align-top">No. Plat</td>
                        <td className="align-top">:</td>
                        <td>{formData.platNo}</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 4. Footer Pesan Dinamis */}
            {formData.thanksText && (
                <>
                    <div className="text-center overflow-hidden whitespace-nowrap tracking-tighter text-[9px] my-1">
                        -----------------------------------------------------
                    </div>
                    <div className="text-center text-[9px] whitespace-pre-line pt-0.5 uppercase font-medium">
                        {formData.thanksText}
                    </div>
                </>
            )}
        </div>
    );
}