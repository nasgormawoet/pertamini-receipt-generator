import React from 'react';
import { BBM_PRESETS } from '../../constants/fuel.js';

export default function Template02({ formData, paperSize }) {
    const is80 = paperSize === '80mm';
    const fuelConfig = BBM_PRESETS.find((p) => p.name === formData.fuelType) || {};
    const isSubsidized = fuelConfig.isSubsidized && fuelConfig.subsidy > 0;
    const totalSubsidy = isSubsidized ? Math.round(fuelConfig.subsidy * formData.volume) : 0;
    const change = Math.max(0, formData.cashGiven - formData.total);

    return (
        <div className="space-y-1.5 border border-black p-2 rounded-sm">
            {/* Header Minimalist */}
            <div className="text-center pb-1 border-b border-black">
                <div className="font-black text-sm tracking-wider uppercase">PERTAMINA RETAIL</div>
                <div className="text-[11px] font-bold">SPBU #{formData.spbuNo}</div>
                <div className="text-[9.5px] uppercase text-slate-700">{formData.spbuAddress}, {formData.spbuCity}</div>
            </div>

            {/* Info Ringkas 2 Kolom */}
            <div className="grid grid-cols-2 text-[9.5px] py-1 border-b border-black">
                <div>
                    <div>TRX: <span className="font-bold">{formData.trxId}</span></div>
                    <div>DATE: {formData.dateTime}</div>
                </div>
                <div className="text-right">
                    <div>PUMP / OP: <span className="font-bold">#{formData.pompaNo} / {formData.operator}</span></div>
                    <div>PLAT: <span className="font-bold">{formData.platNo || '-'}</span></div>
                </div>
            </div>

            {/* Product Highlight Box */}
            <div className="bg-black text-white p-1 text-center uppercase font-bold text-xs">
                {formData.fuelType}
            </div>

            <div className="flex justify-between py-1 text-[11px]">
                <span>{Number(formData.volume).toFixed(2)} L × Rp {Number(formData.pricePerLiter).toLocaleString('id-ID')}</span>
                <span className="font-bold">Rp {Number(formData.total).toLocaleString('id-ID')}</span>
            </div>

            {isSubsidized && (
                <div className="bg-slate-100 p-1 border border-dashed border-black text-[9px] space-y-0.5">
                    <div className="flex justify-between">
                        <span>Subsidi Pemerintah:</span>
                        <span>Rp {totalSubsidy.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            )}

            {/* Total Section */}
            <div className="border-t-2 border-black pt-1 space-y-0.5 font-bold">
                <div className="flex justify-between text-xs">
                    <span>TOTAL AKHIR</span>
                    <span>Rp {Number(formData.total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] font-normal">
                    <span>METODE: {formData.paymentMethod}</span>
                    <span>Rp {Number(formData.cashGiven).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] font-normal">
                    <span>KEMBALIAN</span>
                    <span>Rp {change.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Barcode Mock */}
            <div className="text-center pt-2">
                <div className="font-mono text-lg tracking-[0.25em] select-none font-bold">||| | |||| || ||| || ||||</div>
                <div className="text-[8.5px] mt-0.5 whitespace-pre-line uppercase">{formData.thanksText}</div>
            </div>
        </div>
    );
}