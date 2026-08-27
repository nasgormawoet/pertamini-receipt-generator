import React, { useState, useEffect } from 'react';
import PrintStyles from './components/PrintStyles';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import MasterDataManagerModal from './components/MasterDataManagerModal';
import { BBM_PRESETS } from './constants/fuel';

export default function ReceiptGenerator() {
    const [paperSize, setPaperSize] = useState('58mm');
    const [activeTemplate, setActiveTemplate] = useState('classic');
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
        trxId: 'TRX-20260827-0102',
        dateTime: '27/08/2026 08:35:10',
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
            const [resSpbu, resOp, resFooter] = await Promise.all([
                fetch('/api/spbu'),
                fetch('/api/operators'),
                fetch('/api/footers'),
            ]);
            const dataSpbu = await resSpbu.json();
            const dataOp = await resOp.json();
            const dataFooter = await resFooter.json();

            setSpbuList(dataSpbu);
            setOperatorList(dataOp);
            setFooterList(dataFooter);

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
                            onClick={() => window.print()}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition"
                        >
                            Cetak Struk
                        </button>
                    </div>
                </header>

                {/* Switcher Ukuran Kertas & Desain Nota */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 no-print">
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block no-print">Ukuran Kertas Thermal</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setPaperSize('58mm')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    paperSize === '58mm' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'
                                }`}
                            >
                                58 mm (Standar)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaperSize('80mm')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    paperSize === '80mm' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'
                                }`}
                            >
                                80 mm (Lebar)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block no-print">Model Desain Nota</label>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T1')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T1' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 1
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T2')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T2' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 2
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T3')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T3' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 3
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T4')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T4' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 4
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T5')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T5' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 5
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T6')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T6' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 6
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T7')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T7' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 7
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplate('T8')}
                                className={`py-2 px-3 text-xs font-semibold rounded-md border ${
                                    activeTemplate === 'T8' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700'
                                }`}
                            >
                                Template 8
                            </button>
                        </div>
                    </div>
                </div>

                {/* Layout Form & Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 no-print">
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

            <MasterDataManagerModal
                isOpen={isManagerOpen}
                onClose={() => setIsManagerOpen(false)}
                spbuList={spbuList}
                operatorList={operatorList}
                footerList={footerList}
                onReload={loadMasterData}
            />
        </div>
    );
}