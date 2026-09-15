import React from 'react';
import Template01 from './templates/Template01';
import Template02 from './templates/Template02';
import Template03 from './templates/Template03';
import Template04 from './templates/Template04';
import Template05 from './templates/Template05';
import Template06 from './templates/Template06';
import Template07 from './templates/Template07';
import Template08 from './templates/Template08';

const TEMPLATE_MAP = {
    T1: Template01,
    T2: Template02,
    T3: Template03,
    T4: Template04,
    T5: Template05,
    T6: Template06,
    T7: Template07,
    T8: Template08,
};

export default function ReceiptPreview({ formData, paperSize, activeTemplate }) {
    const is80 = paperSize === '80mm';
    const SelectedComponent = TEMPLATE_MAP[activeTemplate] || Template01;

    return (
        <div
            id="receipt-area"
            className={`bg-white shadow-md rounded-sm font-mono text-black transition-all ${
                is80 ? 'w-[380px] p-5 text-[12px] leading-normal' : 'w-[290px] p-3 text-[10.5px] leading-tight'
            }`}
        >
            <SelectedComponent formData={formData} paperSize={paperSize} />
        </div>
    );
}