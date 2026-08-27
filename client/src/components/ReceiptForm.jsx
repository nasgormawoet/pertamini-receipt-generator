import React from 'react';
import { BBM_PRESETS } from '../constants/fuel';

export default function ReceiptForm({
                                        formData,
                                        setFormData,
                                        onPriceOrVolumeChange,
                                        spbuList = [],
                                        operatorList = [],
                                        footerList = []
                                    }) {
    const handleSelectSpbu = (e) => {
        const selectedSpbuNo = e.target.value;
        const target = spbuList.find((s) => s.spbuNo === selectedSpbuNo);
        if (target) {
            setFormData((prev) => ({
                ...prev,
                spbuNo: target.spbuNo,
                spbuName: target.spbuName,
                spbuAddress: target.spbuAddress,
                spbuCity: target.spbuCity,
                spbuPhone: target.spbuPhone,
            }));
        }
    };

    const handleSelectOperator = (e) => {
        const opName = e.target.value;
        const target = operatorList.find((o) => o.name === opName);
        if (target) {
            setFormData((prev) => ({
                ...prev,
                operator: target.name,
                shift: target.defaultShift || prev.shift,
            }));
        } else {
            setFormData((prev) => ({ ...prev, operator: opName }));
        }
    };

    const handleSelectFooter = (e) => {
        const footerId = e.target.value;
        const target = footerList.find((f) => f.id === footerId);
        if (target) {
            setFormData((prev) => ({ ...prev, thanksText: target.content }));
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {/* Profil SPBU */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Pilih SPBU</h2>
                <select
                    value={formData.spbuNo}
                    onChange={handleSelectSpbu}
                    className="w-full px-3 py-2 border rounded-md text-sm font-semibold bg-slate-50 focus:outline-none"
                >
                    {spbuList.map((s) => (
                        <option key={s.id} value={s.spbuNo}>
                            {s.spbuNo} - {s.spbuName} ({s.spbuCity})
                        </option>
                    ))}
                </select>
            </div>

            <hr className="border-slate-100" />

            {/* Detail Transaksi */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Detail Transaksi</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Petugas / Kasir</label>
                        <select
                            value={formData.operator}
                            onChange={handleSelectOperator}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white focus:outline-none"
                        >
                            {operatorList.map((op) => (
                                <option key={op.id} value={op.name}>{op.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Shift</label>
                        <input
                            type="text"
                            value={formData.shift}
                            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Nomor Pompa</label>
                        <input
                            type="text"
                            value={formData.pompaNo}
                            onChange={(e) => setFormData({ ...formData, pompaNo: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">No. Transaksi</label>
                        <input
                            type="text"
                            value={formData.trxId}
                            onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Waktu</label>
                        <input
                            type="text"
                            value={formData.dateTime}
                            onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Plat Nomor (Opsional)</label>
                        <input
                            type="text"
                            value={formData.platNo}
                            onChange={(e) => setFormData({ ...formData, platNo: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Produk BBM */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Produk & Pembayaran</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Jenis BBM</label>
                        <select
                            value={formData.fuelType}
                            onChange={(e) => onPriceOrVolumeChange('fuelType', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white focus:outline-none"
                        >
                            {BBM_PRESETS.map((p) => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Harga / Liter (Rp)</label>
                        <input
                            type="number"
                            value={formData.pricePerLiter}
                            onChange={(e) => onPriceOrVolumeChange('pricePerLiter', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Volume (Liter)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.volume}
                            onChange={(e) => onPriceOrVolumeChange('volume', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Total Harga (Rp)</label>
                        <input
                            type="number"
                            value={formData.total}
                            onChange={(e) => onPriceOrVolumeChange('total', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm font-bold text-emerald-700 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Pilihan Template Footer Mandiri */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Template Footer Struk</h2>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Pilih Preset Footer</label>
                        <select
                            onChange={handleSelectFooter}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-slate-50 focus:outline-none"
                        >
                            <option value="">-- Pilih Template Footer --</option>
                            {footerList.map((f) => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600">Teks Footer Aktif (Dapat Diedit Manual)</label>
                        <textarea
                            rows={3}
                            value={formData.thanksText}
                            onChange={(e) => setFormData({ ...formData, thanksText: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-xs font-mono bg-white focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}