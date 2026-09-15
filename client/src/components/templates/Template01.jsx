import React from 'react';
import { BBM_PRESETS } from '../../constants/fuel.js';

export default function Template01({ formData, paperSize }) {
    const is80 = paperSize === '80mm';
    const [datePart, timePart] = (formData.dateTime || '').split(' ');
    const fuelConfig = BBM_PRESETS.find((p) => p.name === formData.fuelType) || {};
    const isSubsidized = fuelConfig.isSubsidized && fuelConfig.subsidy > 0;
    const totalSubsidy = isSubsidized ? Math.round(fuelConfig.subsidy * formData.volume) : 0;
    const change = Math.max(0, formData.cashGiven - formData.total);

    return (
        <div className="space-y-0.5">
            {/* Header */}
            <div className="text-center space-y-0.5">
                <img
                    src="/logo.png"
                    alt="Logo Pertamina"
                    className="mx-auto block object-contain"
                    style={{ width: is80 ? '140px' : '120px', height: 'auto', maxHeight: '42px' }}
                />
                <div className={`font-bold tracking-tight ${is80 ? 'text-base' : 'text-sm'}`}>SPBU PERTAMINA</div>
                <div>NO. SPBU : {formData.spbuNo}</div>
                <div className="uppercase">{formData.spbuAddress}</div>
                <div className="uppercase">{formData.spbuCity}</div>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            {/* Detail Meta */}
            <table className="w-full border-collapse">
                <tbody>
                <tr>
                    <td className={is80 ? 'w-36 align-top' : 'w-28 align-top'}>No. Transaksi</td>
                    <td className="w-2 align-top">:</td>
                    <td>{formData.trxId}</td>
                </tr>
                <tr>
                    <td className="align-top">Waktu</td>
                    <td className="align-top">:</td>
                    <td className="align-top">
                        <div>{datePart}</div>
                        <div>{timePart}</div>
                    </td>
                </tr>
                <tr>
                    <td className="align-top">No. Pompa</td>
                    <td className="align-top">:</td>
                    <td>{formData.pompaNo}</td>
                </tr>
                {formData.platNo && (
                    <tr>
                        <td className="align-top">No. Plat</td>
                        <td className="align-top">:</td>
                        <td>{formData.platNo}</td>
                    </tr>
                )}
                <tr>
                    <td className="align-top">Operator / Shift</td>
                    <td className="align-top">:</td>
                    <td>{formData.operator} / {formData.shift}</td>
                </tr>
                </tbody>
            </table>

            <div className="border-t border-dashed border-black my-2"></div>

            {/* Item Transaksi */}
            <div className="space-y-0.5">
                <div className="font-bold uppercase">{formData.fuelType}</div>
                <div className="flex justify-between">
                    <span>Volume</span>
                    <span>{Number(formData.volume).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                    <span>Harga / Liter</span>
                    <span>Rp {Number(formData.pricePerLiter).toLocaleString('id-ID')}</span>
                </div>

                {isSubsidized && (
                    <div className="pt-1 text-[9.5px] border-t border-dotted border-black/50 mt-1 space-y-0.5">
                        <div className="flex justify-between">
                            <span>Harga Keekonomian</span>
                            <span>Rp {fuelConfig.basePrice.toLocaleString('id-ID')} /L</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Subsidi Pemerintah</span>
                            <span>-Rp {fuelConfig.subsidy.toLocaleString('id-ID')} /L</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total Subsidi Negara</span>
                            <span>Rp {totalSubsidy.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            {/* Pembayaran */}
            <div className="space-y-0.5">
                <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>Rp {Number(formData.total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                    <span>BAYAR ({formData.paymentMethod})</span>
                    <span>Rp {Number(formData.cashGiven).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                    <span>KEMBALI</span>
                    <span>Rp {change.toLocaleString('id-ID')}</span>
                </div>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            {/* Footer */}
            <div className={`text-center space-y-0.5 pt-1 ${is80 ? 'text-[10px]' : 'text-[9px]'}`}>
                <div className="whitespace-pre-line font-bold">{formData.thanksText || 'TERIMA KASIH & SELAMAT JALAN'}</div>
            </div>
        </div>
    );
}