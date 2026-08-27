import React, { useState } from 'react';

export default function MasterDataManagerModal({ isOpen, onClose, spbuList, operatorList, footerList = [], onReload }) {
    const [activeTab, setActiveTab] = useState('spbu'); // 'spbu' | 'operator' | 'footer'

    const [spbuForm, setSpbuForm] = useState({ id: '', spbuNo: '', spbuName: '', spbuAddress: '', spbuCity: '', spbuPhone: '' });
    const [opForm, setOpForm] = useState({ id: '', name: '', defaultShift: '1' });
    const [footerForm, setFooterForm] = useState({ id: '', title: '', content: '' });

    if (!isOpen) return null;

    const handleSaveSpbu = async (e) => {
        e.preventDefault();
        await fetch('/api/spbu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spbuForm),
        });
        setSpbuForm({ id: '', spbuNo: '', spbuName: '', spbuAddress: '', spbuCity: '', spbuPhone: '' });
        onReload();
    };

    const handleSaveOperator = async (e) => {
        e.preventDefault();
        await fetch('/api/operators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opForm),
        });
        setOpForm({ id: '', name: '', defaultShift: '1' });
        onReload();
    };

    const handleSaveFooter = async (e) => {
        e.preventDefault();
        await fetch('/api/footers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(footerForm),
        });
        setFooterForm({ id: '', title: '', content: '' });
        onReload();
    };

    const handleDelete = async (endpoint, id) => {
        if (!window.confirm('Hapus item ini?')) return;
        await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
        onReload();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header Tab Selector */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex gap-4 items-center flex-wrap">
                        <h2 className="text-lg font-bold text-slate-800">Master Data Management</h2>
                        <div className="flex bg-slate-200 p-1 rounded-lg text-xs font-semibold gap-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('spbu')}
                                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'spbu' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                            >
                                SPBU ({spbuList.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('operator')}
                                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'operator' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                            >
                                Operator ({operatorList.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('footer')}
                                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'footer' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                            >
                                Template Footer ({footerList.length})
                            </button>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {activeTab === 'spbu' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveSpbu} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Nomor SPBU</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="34.XXXXX"
                                        value={spbuForm.spbuNo}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuNo: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Nama Lokasi</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="SPBU MT Haryono"
                                        value={spbuForm.spbuName}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuName: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Kota / Wilayah</label>
                                    <input
                                        type="text"
                                        required
                                        value={spbuForm.spbuCity}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuCity: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-slate-600">Alamat Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={spbuForm.spbuAddress}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuAddress: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-3 flex justify-end">
                                    <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold">
                                        Simpan Master SPBU
                                    </button>
                                </div>
                            </form>

                            <table className="w-full text-left border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="p-3">No. SPBU</th>
                                    <th className="p-3">Nama & Alamat</th>
                                    <th className="p-3">Kota</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {spbuList.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-semibold text-slate-900">{s.spbuNo}</td>
                                        <td className="p-3">
                                            <div className="font-medium text-slate-800">{s.spbuName}</div>
                                            <div className="text-[11px] text-slate-500">{s.spbuAddress}</div>
                                        </td>
                                        <td className="p-3 text-slate-600">{s.spbuCity}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleDelete('spbu', s.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'operator' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveOperator} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-600">Nama Petugas</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: EKO S."
                                        value={opForm.name}
                                        onChange={(e) => setOpForm({ ...opForm, name: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-slate-600">Default Shift</label>
                                    <input
                                        type="text"
                                        value={opForm.defaultShift}
                                        onChange={(e) => setOpForm({ ...opForm, defaultShift: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold">
                                    Tambah Petugas
                                </button>
                            </form>

                            <table className="w-full text-left border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="p-3">Nama Petugas</th>
                                    <th className="p-3">Default Shift</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {operatorList.map((op) => (
                                    <tr key={op.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-medium text-slate-900">{op.name}</td>
                                        <td className="p-3 text-slate-600">Shift {op.defaultShift}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleDelete('operators', op.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'footer' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveFooter} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Judul / Alias Template Footer</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Pesan Promo BBM"
                                        value={footerForm.title}
                                        onChange={(e) => setFooterForm({ ...footerForm, title: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Isi Teks Footer (Gunakan Enter untuk Baris Baru)</label>
                                    <textarea
                                        rows={3}
                                        required
                                        placeholder="TERIMA KASIH & SELAMAT JALAN&#10;PASTIKAN DISPLAY DI ANGKA NOL"
                                        value={footerForm.content}
                                        onChange={(e) => setFooterForm({ ...footerForm, content: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white font-mono focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold">
                                        Simpan Template Footer
                                    </button>
                                </div>
                            </form>

                            <table className="w-full text-left border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="p-3 w-48">Judul Template</th>
                                    <th className="p-3">Isi Footer</th>
                                    <th className="p-3 text-right w-20">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {footerList.map((ft) => (
                                    <tr key={ft.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-semibold text-slate-900 align-top">{ft.title}</td>
                                        <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-pre-line align-top">{ft.content}</td>
                                        <td className="p-3 text-right align-top">
                                            <button onClick={() => handleDelete('footers', ft.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}