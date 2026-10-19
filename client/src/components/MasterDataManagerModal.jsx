// client/src/components/MasterDataManagerModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchData, addData, updateData, deleteData } from '../services/api';

export default function MasterDataManagerModal({ isOpen, onClose, onDataChanged }) {
    const [activeTab, setActiveTab] = useState('spbu'); // 'spbu' | 'operator' | 'fuel' | 'footer'

    // State untuk menyimpan daftar data dari database
    const [spbuList, setSpbuList] = useState([]);
    const [operatorList, setOperatorList] = useState([]);
    const [fuelList, setFuelList] = useState([]);
    const [footerList, setFooterList] = useState([]);

    // State untuk form input
    const [spbuForm, setSpbuForm] = useState({ spbuNo: '', spbuName: '', spbuAddress: '', spbuCity: '' });
    const [opForm, setOpForm] = useState({ name: '', defaultShift: '1' });
    const [footerForm, setFooterForm] = useState({ title: '', content: '' });

    // State khusus form BBM (mendukung Tambah & Edit)
    const [editingFuelId, setEditingFuelId] = useState(null);
    const [fuelForm, setFuelForm] = useState({
        name: '',
        originalPrice: '',
        subsidi: 0,
        price: '',
    });

    // Load semua data setiap kali modal dibuka
    useEffect(() => {
        if (isOpen) {
            loadAllData();
        }
    }, [isOpen]);

    const loadAllData = async () => {
        try {
            setSpbuList((await fetchData('spbu')) || []);
            setOperatorList((await fetchData('operators')) || []);
            setFuelList((await fetchData('fuels')) || []);
            setFooterList((await fetchData('footers')) || []);
            if (onDataChanged) onDataChanged();
        } catch (error) {
            console.error('Gagal memuat data master:', error);
        }
    };

    if (!isOpen) return null;

    // --- KALKULASI OTOMATIS FORM BBM ---
    const handleFuelFieldChange = (field, value) => {
        if (field === 'name') {
            setFuelForm((prev) => ({ ...prev, name: value }));
            return;
        }

        const numVal = parseInt(value, 10) || 0;
        setFuelForm((prev) => {
            const updated = { ...prev, [field]: numVal };
            if (field === 'originalPrice' || field === 'subsidi') {
                const orig = field === 'originalPrice' ? numVal : Number(prev.originalPrice) || 0;
                const sub = field === 'subsidi' ? numVal : Number(prev.subsidi) || 0;
                updated.price = Math.max(0, orig - sub);
            } else if (field === 'price') {
                const sub = Number(prev.subsidi) || 0;
                updated.originalPrice = numVal + sub;
            }
            return updated;
        });
    };

    // --- HANDLERS ---
    const handleSaveSpbu = async (e) => {
        e.preventDefault();
        await addData('spbu', spbuForm);
        setSpbuForm({ spbuNo: '', spbuName: '', spbuAddress: '', spbuCity: '' });
        loadAllData();
    };

    const handleSaveOperator = async (e) => {
        e.preventDefault();
        await addData('operators', opForm);
        setOpForm({ name: '', defaultShift: '1' });
        loadAllData();
    };

    const handleSaveFuel = async (e) => {
        e.preventDefault();
        const payload = {
            name: fuelForm.name.toUpperCase().trim(),
            originalPrice: Number(fuelForm.originalPrice) || 0,
            subsidi: Number(fuelForm.subsidi) || 0,
            price: Number(fuelForm.price) || 0,
        };

        if (editingFuelId) {
            await updateData('fuels', editingFuelId, payload);
        } else {
            await addData('fuels', payload);
        }

        setEditingFuelId(null);
        setFuelForm({ name: '', originalPrice: '', subsidi: 0, price: '' });
        loadAllData();
    };

    const handleEditFuel = (fuel) => {
        setEditingFuelId(fuel.id);
        setFuelForm({
            name: fuel.name,
            originalPrice: fuel.originalPrice,
            subsidi: fuel.subsidi,
            price: fuel.price,
        });
    };

    const handleCancelEditFuel = () => {
        setEditingFuelId(null);
        setFuelForm({ name: '', originalPrice: '', subsidi: 0, price: '' });
    };

    const handleSaveFooter = async (e) => {
        e.preventDefault();
        await addData('footers', footerForm);
        setFooterForm({ title: '', content: '' });
        loadAllData();
    };

    const handleDelete = async (endpoint, id) => {
        if (!window.confirm('Hapus item ini?')) return;
        try {
            await deleteData(endpoint, id);
            if (endpoint === 'fuels' && editingFuelId === id) {
                handleCancelEditFuel();
            }
            loadAllData();
        } catch (error) {
            alert('Gagal menghapus data.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header Tab Selector */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex gap-4 items-center flex-wrap">
                        <h2 className="text-lg font-bold text-slate-800">Master Data Management</h2>
                        <div className="flex bg-slate-200 p-1 rounded-lg text-xs font-semibold gap-1 flex-wrap">
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
                                onClick={() => setActiveTab('fuel')}
                                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'fuel' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                            >
                                BBM & Subsidi ({fuelList.length})
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
                    {/* TAB SPBU */}
                    {activeTab === 'spbu' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveSpbu} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Nomor SPBU</label>
                                    <input
                                        type="text" required placeholder="34.XXXXX"
                                        value={spbuForm.spbuNo}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuNo: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Nama Lokasi</label>
                                    <input
                                        type="text" required placeholder="SPBU MT Haryono"
                                        value={spbuForm.spbuName}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuName: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Kota / Wilayah</label>
                                    <input
                                        type="text" required value={spbuForm.spbuCity}
                                        onChange={(e) => setSpbuForm({ ...spbuForm, spbuCity: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-slate-600">Alamat Lengkap</label>
                                    <input
                                        type="text" required value={spbuForm.spbuAddress}
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

                    {/* TAB OPERATOR */}
                    {activeTab === 'operator' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveOperator} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-600">Nama Petugas</label>
                                    <input
                                        type="text" required placeholder="Contoh: EKO S."
                                        value={opForm.name}
                                        onChange={(e) => setOpForm({ ...opForm, name: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-slate-600">Default Shift</label>
                                    <input
                                        type="text" value={opForm.defaultShift}
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

                    {/* TAB BBM & SUBSIDI */}
                    {activeTab === 'fuel' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveFuel} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {editingFuelId ? 'Edit Data Harga & Subsidi BBM' : 'Tambah Jenis BBM Baru'}
                                    </span>
                                    {editingFuelId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEditFuel}
                                            className="text-xs text-slate-500 hover:text-slate-800 underline"
                                        >
                                            Batal Edit
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-600">Nama Produk BBM</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="PERTALITE (RON 90)"
                                            value={fuelForm.name}
                                            onChange={(e) => handleFuelFieldChange('name', e.target.value)}
                                            className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-600">Harga Non-Subsidi (Rp/L)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="15892"
                                            value={fuelForm.originalPrice}
                                            onChange={(e) => handleFuelFieldChange('originalPrice', e.target.value)}
                                            className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-600">Subsidi Pemerintah (Rp/L)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="5892"
                                            value={fuelForm.subsidi}
                                            onChange={(e) => handleFuelFieldChange('subsidi', e.target.value)}
                                            className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-600">Harga Jual Konsumen (Rp/L)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="10000"
                                            value={fuelForm.price}
                                            onChange={(e) => handleFuelFieldChange('price', e.target.value)}
                                            className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs font-semibold text-emerald-700 bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 text-white rounded-md text-xs font-semibold transition ${
                                            editingFuelId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        {editingFuelId ? 'Simpan Perubahan BBM' : 'Tambah BBM'}
                                    </button>
                                </div>
                            </form>

                            <table className="w-full text-left border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="p-3">Nama BBM</th>
                                    <th className="p-3 text-right">Harga Non-Subsidi</th>
                                    <th className="p-3 text-right">Subsidi / Liter</th>
                                    <th className="p-3 text-right">Harga Jual</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {fuelList.map((f) => (
                                    <tr key={f.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-semibold text-slate-900">{f.name}</td>
                                        <td className="p-3 text-right text-slate-600">
                                            Rp {Number(f.originalPrice).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 text-right">
                                            {Number(f.subsidi) > 0 ? (
                                                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                                                    Rp {Number(f.subsidi).toLocaleString('id-ID')}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-right font-bold text-emerald-700">
                                            Rp {Number(f.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 text-right space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => handleEditFuel(f)}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete('fuels', f.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB FOOTER */}
                    {activeTab === 'footer' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveFooter} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Judul / Alias Template Footer</label>
                                    <input
                                        type="text" required placeholder="Contoh: Pesan Promo BBM"
                                        value={footerForm.title}
                                        onChange={(e) => setFooterForm({ ...footerForm, title: e.target.value })}
                                        className="w-full mt-1 px-3 py-1.5 border rounded-md text-xs bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">Isi Teks Footer (Gunakan Enter untuk Baris Baru)</label>
                                    <textarea
                                        rows={3} required placeholder="TERIMA KASIH & SELAMAT JALAN&#10;PASTIKAN DISPLAY DI ANGKA NOL"
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