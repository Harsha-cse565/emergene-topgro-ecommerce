import React from 'react';
import { AlertCircle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const AgroNoticePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2 border-b border-stone-200 pb-4">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-4 h-4" />
          Statutory Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          Agricultural Product Notice &amp; Safe Usage Guidelines
        </h1>
        <p className="text-xs text-stone-500">
          Important instructions for buyers, agricultural dealers, and end-user farmers.
        </p>
      </div>

      <div className="prose prose-stone text-xs leading-relaxed space-y-6 text-stone-700">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Label Instruction Adherence
          </h2>
          <p>
            All products supplied by Emergene &amp; Topgro—including fungicides, insecticides, herbicides, fertilizers, micronutrients, and plant growth regulators—must be utilized strictly in compliance with the printed instructions, cautionary symbols, and guidelines printed on the original manufacturer packaging.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            2. Dosage and Agronomic Advisory
          </h2>
          <p>
            Field application rates depend on specific agro-climatic conditions, soil test analyses, standing crop growth stage, and local weather patterns. We do not invent arbitrary dosages. Farmers are encouraged to consult local state agricultural extension officers, Krishi Vigyan Kendras (KVK), or authorized agronomists before applying concentrated compounds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            3. Safe Handling, Storage &amp; Protective Gear
          </h2>
          <p>
            Store all agrochemical formulations in original sealed containers in a cool, dry, well-ventilated location inaccessible to children, unauthorized persons, and domestic animals. Use appropriate personal protective equipment (gloves, masks, eye protection) during tank mixing and field spraying operations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            4. Disposal of Empty Packaging
          </h2>
          <p>
            Empty bags, bottles, and pouches must be triple-rinsed (adding rinsate to the spray tank) and disposed of safely in accordance with applicable environmental regulations and pesticide management rules. Never reuse packaging containers for household water or food storage.
          </p>
        </section>
      </div>
    </div>
  );
};
