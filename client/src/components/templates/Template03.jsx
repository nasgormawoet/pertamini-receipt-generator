import React from 'react';
import { BBM_PRESETS } from '../../constants/fuel';
import ReceiptSeparator from "../ReceiptSeparator.jsx";

export default function Template03({ formData = {}, paperSize = '58mm' }) {
    const is80 = paperSize === '80mm';

    // 1. Pisahkan Tanggal & Jam
    let datePart = '01/10/2026';
    let timePart = '08:15:31';
    if (formData.dateTime) {
        const parts = formData.dateTime.split(' ');
        if (parts[0]) datePart = parts[0];
        if (parts[1]) timePart = parts[1];
    }

    // 2. Cari data BBM dari fuel.js berdasarkan pilihan di form
    const selectedFuel = BBM_PRESETS.find((item) => item.name === formData.fuelType) || {
        name: formData.fuelType || 'PERTALITE',
        originalPrice: 15892,
        subsidi: 5892,
        price: 10000,
    };

    // Bersihkan keterangan "(RON 90)" dsb agar tampil "PERTALITE" seperti di struk asli
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
                    {formData.spbuName}
                </div>
                <div className="uppercase text-[9.5px] leading-tight mt-0.5">
                    {formData.spbuAddress}
                </div>
            </div>


            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Detail Meta */}
            <div className="flex justify-between text-[10px] pt-2">
                <span>Shift: {formData.shift || '1'}</span>
                <span>No. Trans: {formData.trxId || '682477'}</span>
            </div>
            <div className="text-[10px] pb-1">
                Waktu: {datePart} {timePart}
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Detail Pompa, Operator, BBM & Volume */}
            <div className="space-y-0.5">
                <div className="flex">
                    <span className="w-28 shrink-0">Pulau/Pompa</span>
                    <span className="mr-1.5">:</span>
                    <span>{formData.pompaNo || '9'}</span>
                </div>
                <div className="flex">
                    <span className="w-28 shrink-0">Operator</span>
                    <span className="mr-1.5">:</span>
                    <span className="uppercase">{formData.operator || 'KRISTA'}</span>
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
                            <span className="w-36 shrink-0">Harga Non Subsidi</span>
                            <span>:</span>
                            <span className="w-16 text-right">{formatNum(nonSubsidiPerLiter)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 shrink-0">Subsidi Pemerintah</span>
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

            <div className="border-t border-dashed border-black/60 my-1.5"></div>

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
                            <span className="w-36 shrink-0">Subsidi Pemerintah</span>
                            <span>:</span>
                            <span className="w-20 text-right">{formatNum(totalSubsidi)}</span>
                        </div>
                        <div className="flex font-bold">
                            <span className="w-36 shrink-0">Dibayar Konsumen</span>
                            <span>:</span>
                            <span className="w-20 text-right">{formatNum(totalKonsumen)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex font-bold">
                        <span className="w-36 shrink-0">Dibayar Konsumen</span>
                        <span>:</span>
                        <span className="w-20 text-right">{formatNum(totalKonsumen)}</span>
                    </div>
                )}
            </div>

            <ReceiptSeparator style={formData.separatorStyle} paperSize={paperSize} />

            {/* Metode Pembayaran */}
            <div className="py-0.5">
                <div className="uppercase">{formData.paymentMethod || 'CASH'}</div>
                <div className="text-right font-bold">{formatNum(formData.cashGiven || totalKonsumen)}</div>
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
                        <span className="w-20 shrink-0">No. Plat</span>
                        <span className="mr-1.5">:</span>
                        <span className="uppercase">{formData.platNo}</span>
                    </div>
                    <div className="border-t border-dashed border-black/60 my-1.5"></div>
                </>
            )}

            {/* Pesan Footer Subsidi */}
            <div className="text-center text-[9.5px] pt-1 leading-snug">
                {isSubsidized ? (
                    <div>
                        <div>Anda mendapat subsidi dari</div>
                        <div>Pemerintah sebesar Rp {formatNum(totalSubsidi)}</div>
                        <div>(Perhitungan Subsidi Unaudited</div>
                        <div>atau Estimasi). Gunakan BBM</div>
                        <div>Subsidi secara bijak.</div>
                    </div>
                ) : (
                    <div className="whitespace-pre-line uppercase">
                        {formData.thanksText || 'TERIMA KASIH & SELAMAT JALAN'}
                    </div>
                )}
            </div>
        </div>
    );
}