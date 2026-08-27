import React from 'react';

export default function Template03({ formData, paperSize }) {
    const change = Math.max(0, formData.cashGiven - formData.total);

    return (
        <div className="space-y-0.5 leading-none text-[10px]">
            <div className="text-center font-bold">SPBU {formData.spbuNo} - {formData.spbuCity}</div>
            <div className="text-center text-[9px]">{formData.spbuAddress}</div>
            <div className="border-b border-black my-1"></div>

            <div className="flex justify-between text-[9px]">
                <span>{formData.dateTime}</span>
                <span>P:{formData.pompaNo} | {formData.operator}</span>
            </div>

            <div className="border-b border-dotted border-black my-1"></div>

            <div className="font-bold">{formData.fuelType}</div>
            <div className="flex justify-between">
                <span>{Number(formData.volume).toFixed(2)}L @ {Number(formData.pricePerLiter).toLocaleString('id-ID')}</span>
                <span className="font-bold">Rp {Number(formData.total).toLocaleString('id-ID')}</span>
            </div>

            <div className="border-b border-dotted border-black my-1"></div>

            <div className="flex justify-between font-bold">
                <span>TOTAL: Rp {Number(formData.total).toLocaleString('id-ID')}</span>
                <span>KEMBALI: Rp {change.toLocaleString('id-ID')}</span>
            </div>

            <div className="border-b border-black my-1"></div>
            <div className="text-center text-[8.5px] pt-0.5 uppercase">{formData.thanksText}</div>
        </div>
    );
}