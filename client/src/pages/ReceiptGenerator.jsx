import React, { useState, useEffect } from 'react';
import PrintStyles from '../components/PrintStyles.jsx';
import ReceiptForm from '../components/ReceiptForm.jsx';
import ReceiptPreview from '../components/ReceiptPreview.jsx';
import MasterDataManagerModal from '../components/MasterDataManagerModal.jsx';
import { BBM_PRESETS } from '../constants/fuel.js';
import { fetchData } from '../services/api.js';

const getAutoDateTime = () => {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0'); // Menambah angka 0 di depan jika di bawah 10

    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return `${date} ${time}`;
};

const getAutoTrxId = () => {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0');
    const yyyymmdd = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

    const randomNum = Math.floor(1000 + Math.random() * 9000); // Menghasilkan angka acak 1000 - 9999

    return `TRX-${yyyymmdd}-${randomNum}`;
}

export default function ReceiptGenerator() {
    const [paperSize, setPaperSize] = useState('58mm');
    const [activeTemplate, setActiveTemplate] = useState('T1');
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const [spbuList, setSpbuList] = useState([]);
    const [operatorList, setOperatorList] = useState([]);
    const [footerList, setFooterList] = useState([]);

    const [formData, setFormData] = useState({
        spbuNo: '',
        spbuName: '',
        spbuAddress: '',
        spbuCity: '',
        spbuPhone: '',
        trxId: getAutoTrxId(),
        dateTime: getAutoDateTime(),
        shift: '1',
        pompaNo: '01',
        operator: '',
        platNo: '',
        fuelType: 'PERTAMAX (RON 92)',
        pricePerLiter: 12950,
        volume: 15.44,
        total: 200000,
        paymentMethod: 'CASH',
        cashGiven: 200000,
        thanksText: 'TERIMA KASIH & SELAMAT JALAN\nPASTIKAN DISPLAY POMPA DI ANGKA NOL',
    });

    const loadMasterData = async () => {
        try {
            // Menggunakan fetchData dari Axios agar format data dan URL tepat
            const dataSpbu = (await fetchData('spbu')) || [];
            const dataOp = (await fetchData('operators')) || [];
            const dataFooter = (await fetchData('footers')) || [];

            setSpbuList(dataSpbu);
            setOperatorList(dataOp);
            setFooterList(dataFooter);

            // Setel nilai default di form jika data tersedia di database
            if (dataSpbu.length > 0 && !formData.spbuNo) {
                setFormData((prev) => ({
                    ...prev,
                    spbuNo: dataSpbu[0].spbuNo,
                    spbuName: dataSpbu[0].spbuName,
                    spbuAddress: dataSpbu[0].spbuAddress,
                    spbuCity: dataSpbu[0].spbuCity,
                    spbuPhone: dataSpbu[0].spbuPhone || '',
                }));
            }

            if (dataOp.length > 0 && !formData.operator) {
                setFormData((prev) => ({
                    ...prev,
                    operator: dataOp[0].name,
                    shift: dataOp[0].defaultShift || '1',
                }));
            }
        } catch (err) {
            console.error('Gagal mengambil master data:', err);
        }
    };

    useEffect(() => {
        loadMasterData();
    }, []);

    const handlePriceOrVolumeChange = (field, value) => {
        const numericVal = parseFloat(value) || 0;
        if (field === 'fuelType') {
            const selected = BBM_PRESETS.find((p) => p.name === value);
            const newPrice = selected ? selected.price : formData.pricePerLiter;
            setFormData((prev) => ({
                ...prev,
                fuelType: value,
                pricePerLiter: newPrice,
                total: Math.round(prev.volume * newPrice),
            }));
            return;
        }
        if (field === 'volume') {
            setFormData((prev) => ({
                ...prev,
                volume: numericVal,
                total: Math.round(numericVal * prev.pricePerLiter),
            }));
        }
        if (field === 'total') {
            setFormData((prev) => ({
                ...prev,
                total: numericVal,
                volume: Number((numericVal / (prev.pricePerLiter || 1)).toFixed(2)),
            }));
        }
    };
    const handleReset = () => {
        if (window.confirm('Bersihkan form untuk transaksi baru?')) {
            setFormData((prev) => ({
                ...prev,
                trxId: getAutoTrxId(),
                dateTime: getAutoDateTime(),
                volume: 0,
                total: 0,
                cashGiven: 0,
                platNo: '',
            }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
            <PrintStyles paperSize={paperSize} />

            <div className="max-w-6xl mx-auto">
                <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 no-print">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Pertamini Receipt Generator</h1>
                        <p className="text-sm text-slate-500">Tools untuk mencetak ulang transaksi di Pertamini</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsManagerOpen(true)}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition"
                        >
                            Kelola Master Data
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg text-sm transition"
                        >
                            Reset Form
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition"
                        >
                            Cetak Struk
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 no-print">
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block no-print">Ukuran Kertas Thermal</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setPaperSize('58mm')} className={`py-2 px-3 text-xs font-semibold rounded-md border ${paperSize === '58mm' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'}`}>
                                58 mm (Standar)
                            </button>
                            <button type="button" onClick={() => setPaperSize('80mm')} className={`py-2 px-3 text-xs font-semibold rounded-md border ${paperSize === '80mm' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'}`}>
                                80 mm (Lebar)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block no-print">Model Desain Nota</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map((template) => (
                                <button
                                    key={template}
                                    type="button"
                                    onClick={() => setActiveTemplate(template)}
                                    className={`py-2 px-3 text-xs font-semibold rounded-md border ${activeTemplate === template ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'}`}
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 no-print">
                        {/* Memastikan formData disalurkan kembali */}
                        <ReceiptForm
                            formData={formData}
                            setFormData={setFormData}
                            onPriceOrVolumeChange={handlePriceOrVolumeChange}
                            spbuList={spbuList}
                            operatorList={operatorList}
                            footerList={footerList}
                        />
                    </div>
                    <div className="lg:col-span-5 flex justify-center sticky top-8">
                        <ReceiptPreview
                            formData={formData}
                            paperSize={paperSize}
                            activeTemplate={activeTemplate}
                        />
                    </div>
                </div>
            </div>

            {/* Modal Master Data dengan props onReload agar form merespon data baru */}
            <MasterDataManagerModal
                isOpen={isManagerOpen}
                onClose={() => {
                    setIsManagerOpen(false);
                    loadMasterData();
                }}
            />
        </div>
    );
}