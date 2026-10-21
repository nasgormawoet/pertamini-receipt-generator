import React from 'react';
import ReceiptSeparator from "../ReceiptSeparator.jsx";
export default function Template02({ formData = {}, paperSize = '58mm', fuels= [] }) {
    const is80 = paperSize === '80mm';
    let datePart = '01/10/2026';
    let timePart = '08:15:31';
    if (formData.dateTime) {
        const parts = formData.dateTime.split(' ');
        if (parts[0]) datePart = parts[0];
        if (parts[1]) timePart = parts[1];
    }

    const selectedFuel = fuels.find((item) => item.name === formData.fuelType) || {
        name: formData.fuelType || 'PERTALITE',
        originalPrice: 15892,
        subsidi: 5892,
        price: 10000,
    };

    const cleanBBMName = (selectedFuel.name || 'PERTALITE')
        .replace(/\s*\(.*?\)/g, '')
        .toUpperCase()
        .trim();

    // 3. Kalkulasi Harga & Subsidi dari variabel fuel.js
    const subsidiPerLiter = Number(selectedFuel.subsidi) || 0;
    const isSubsidized = subsidiPerLiter > 0;

    // Gunakan harga dari formData (jika diedit manual) atau dari preset fuel.js
    const jualPerLiter = Number(formData.pricePerLiter) || Number(selectedFuel.price) || 10000;
    const nonSubsidiPerLiter = jualPerLiter + subsidiPerLiter;

    // 4. Kalkulasi Total Penjualan (Rp)
    const displayVolume = Number(formData.volume) || 0;
    const totalKonsumen = Number(formData.total) || Math.round(displayVolume * jualPerLiter);
    const totalSubsidi = Math.round(displayVolume * subsidiPerLiter);
    const totalTanpaSubsidi = totalKonsumen + totalSubsidi;

    // Format angka ribuan (menggunakan pemisah koma/titik sesuai struk)
    const formatNum = (num) => Math.round(num).toLocaleString('en-US');

    return (
        <div className="space-y-0.5">
            {/* Header */}
            <div className="text-center space-y-0.5">
                <div className="flex flex-col items-center justify-center text-center">
                    <img
                        src="/logo.png"
                        alt="Logo Pertamina"
                        className="mx-auto block object-contain grayscale contrast-200 mb-1"
                        style={{ width: '120px', height: 'auto', maxHeight: '40px' }}
                    />
                    <div className="font-bold text-[11px] tracking-widest">
                        {formData.spbuNo}
                    </div>
                    <div className="font-bold uppercase text-[11px] leading-tight mt-0.5">
                        {formData.spbuName || `SPBU ${formData.spbuCity}`}
                    </div>
                    <div className="uppercase text-[9.5px] leading-tight mt-0.5">
                        {formData.spbuAddress}
                    </div>
                </div>

            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            <div className="space-y-0.5">
                <div className="flex">
                    <span className="w-28 shrink-0">Shift</span>
                    <span className="mr-1.5">:</span>
                    <span>{formData.shift}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">No. Transaksi</span>
                    <span className="mr-1.5">:</span>
                    <span className="uppercase">{formData.trxId}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">Waktu</span>
                    <span className="mr-1.5">:</span>
                    <span className="uppercase">{datePart}<br/>{timePart}</span>
                </div>
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Detail Pompa, Operator, BBM & Volume */}
            <div className="space-y-0.5">
                <div className="flex">
                    <span className="w-28 shrink-0">Pompa</span>
                    <span className="mr-1.5">:</span>
                    <span>{formData.pompaNo || '9'}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">Operator</span>
                    <span className="mr-1.5">:</span>
                    <span className="uppercase">{formData.operator}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">Jenis BBM</span>
                    <span className="mr-1.5">:</span>
                    <span className="uppercase">{cleanBBMName}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">Volume</span>
                    <span className="mr-1.5">:</span>
                    <span>{displayVolume.toFixed(2)} liter</span>
                </div>
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Blok Informasi Harga BBM (Rp/Liter) */}
            <div className="space-y-0.5">
                <div className="mb-0.5">Informasi Harga BBM (Rp/Liter)</div>
                {isSubsidized ? (
                    <>
                        <div className="flex">
                            <span className="w-36 shrink-0">Harga Non-Subsidi</span>
                            <span>:</span>
                            <span className="w-16 text-right">{formatNum(nonSubsidiPerLiter)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 shrink-0">Subsidi</span>
                            <span>:</span>
                            <span className="w-16 text-right">{formatNum(subsidiPerLiter)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 shrink-0">Harga Jual</span>
                            <span>:</span>
                            <span className="w-16 text-right">{formatNum(jualPerLiter)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex">
                        <span className="w-36 shrink-0">Harga Jual</span>
                        <span>:</span>
                        <span className="w-16 text-right">{formatNum(jualPerLiter)}</span>
                    </div>
                )}
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Blok Total Penjualan (Rp) */}
            <div className="space-y-0.5">
                <div className="mb-0.5">Total Penjualan (Rp)</div>
                {isSubsidized ? (
                    <>
                        <div className="flex">
                            <span className="w-36 shrink-0">Tanpa Subsidi</span>
                            <span>:</span>
                            <span className="w-20 text-right">{formatNum(totalTanpaSubsidi)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 shrink-0">Subsidi</span>
                            <span>:</span>
                            <span className="w-20 text-right">{formatNum(totalSubsidi)}</span>
                        </div>
                        <div className="flex font-bold">
                            <span className="w-36 shrink-0">Dibayar</span>
                            <span>:</span>
                            <span className="w-20 text-right">{formatNum(totalKonsumen)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex font-bold">
                        <span className="w-36 shrink-0">Dibayar</span>
                        <span>:</span>
                        <span className="w-20 text-right">{formatNum(totalKonsumen)}</span>
                    </div>
                )}
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Metode Pembayaran */}
            <div className="py-0.5">
                <div className="uppercase flex justify-between">
                    <span className="text-left">{formData.paymentMethod || 'CASH'}</span>
                    <span className="text-right font-bold">{formatNum(formData.cashGiven || totalKonsumen)}</span>
                </div>
                {formData.cashGiven > totalKonsumen && (
                    <div className="flex justify-between mt-0.5">
                        <span>KEMBALI</span>
                        <span>{formatNum(formData.cashGiven - totalKonsumen)}</span>
                    </div>
                )}
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Nomor Plat */}
            {formData.platNo && (
                <>
                    <div className="flex py-0.5">
                        <span className="w-20 shrink-0">No. PLAT</span>
                        <span className="mr-1.5">:</span>
                        <span className="uppercase">{formData.platNo}</span>
                    </div>
                    <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />
                </>
            )}

            {/* Pesan Footer Subsidi */}
            <div className="text-center text-[10px] pt-1 leading-snug">
                {isSubsidized ? (
                    <div>
                        <div>Anda menggunakan subsidi dari Negara sebesar Rp {formatNum(totalSubsidi)}</div>
                        <div>(Perhitungan Subsidi Estimasi)</div>
                        <div>Gunakan BBM Subsidi secara bijak.</div>
                        <div>{formData.thanksText}</div>
                    </div>
                ) : (
                    <div className="whitespace-pre-line uppercase">
                        {formData.thanksText}
                    </div>
                )}
            </div>
        </div>
    );
}