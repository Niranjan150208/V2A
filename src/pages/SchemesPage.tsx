import React, { useState } from 'react';
import { Landmark, ShieldCheck, CheckSquare, ExternalLink, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const SchemesPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    'doc-aadhaar': true,
    'doc-patta': true,
    'doc-bank': true,
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs({ ...checkedDocs, [id]: !checkedDocs[id] });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Landmark className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'அரசு மானியங்கள் & திட்டங்கள்' : 'Government Subsidies & Farmer Welfare Schemes'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'வேளாண் நலத்திட்டங்கள் & ஆவண சரிபார்ப்பு பட்டியல்' : 'Agri Schemes & Document Readiness Checklist'}
          </h1>
          <p className="text-xs text-ink-500">
            Direct DBT subsidies from Tamil Nadu Department of Agriculture and Ministry of Agriculture & Farmers Welfare
          </p>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'விவசாயி KYC சுயவிவரம்' : 'Farmer KYC Profile'}
        </button>
      </div>

      {/* Mandatory Regulatory Transparency Notice (Phase 5) */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 space-y-1 shadow-sm">
        <p className="font-bold">
          {language === 'ta' ? 'அரசு திட்ட விண்ணப்ப வெளிப்படைத்தன்மை:' : 'Official Scheme Application Notice:'}
        </p>
        <p className="text-ink-600">
          {language === 'ta'
            ? 'V2A தளம் அதிகாரப்பூர்வ அரசு ஆவண சரிபார்ப்பை மட்டுமே வழங்குகிறது. இறுதி விண்ணப்பங்கள் உழவன் செயலி அல்லது மத்திய அரசு வலைத்தளத்தில் மட்டுமே சமர்ப்பிக்கப்பட வேண்டும்.'
            : 'V2A prepares your eligibility credentials and document package. Formal DBT disbursements require authenticated submission via the official government portal links provided.'}
        </p>
      </div>

      {/* Universal Document Readiness Checklist (Requirement I) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === 'ta' ? 'அரசு மானியங்களுக்கான கட்டாய ஆவண சரிபார்ப்பு' : 'Universal Farmer Scheme Document Checklist'}
        </h3>
        <p className="text-xs text-ink-600">
          Check off your physical documents to ensure seamless verification at the block agriculture depot:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'doc-aadhaar', title: 'Aadhaar Card (Aadhaar Seeded)', status: 'Verified ✓' },
            { id: 'doc-patta', title: 'Land Patta & Chitta (e-Adangal)', status: 'Verified ✓' },
            { id: 'doc-bank', title: 'Nationalized Bank Passbook Copy', status: 'Linked ✓' },
            { id: 'doc-ration', title: 'Family Smart Ration Card', status: 'Required' },
          ].map((doc) => (
            <div
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                checkedDocs[doc.id]
                  ? 'bg-paddy-50 border-paddy-500 text-forest-900'
                  : 'bg-white border-sage-300 text-ink-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className={`w-5 h-5 ${checkedDocs[doc.id] ? 'text-paddy-700' : 'text-ink-400'}`} />
                <span className="text-xs font-bold">{doc.title}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200">
                {checkedDocs[doc.id] ? 'Ready' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schemes Directory */}
      <div className="space-y-4">
        {state.schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
                    {scheme.sponsoredBy}
                  </span>
                  <span className="text-xs font-mono font-bold bg-cream-200 text-ink-700 px-2 py-0.5 rounded">
                    {scheme.code}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-forest-900 mt-1">
                  {language === 'ta' ? scheme.tamilName : scheme.name}
                </h3>
              </div>

              <a
                href={scheme.applicationPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors shrink-0"
              >
                <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தளம்' : 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-harvest-400" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                <span className="text-ink-500 font-bold block uppercase text-[10px]">Subsidy Benefit</span>
                <p className="font-bold text-forest-900">{scheme.subsidyAmountOrBenefit}</p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                <span className="text-ink-500 font-bold block uppercase text-[10px]">Target Beneficiary</span>
                <p className="font-semibold text-forest-900">{scheme.targetGroup}</p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                <span className="text-ink-500 font-bold block uppercase text-[10px]">Application Window</span>
                <p className="font-semibold text-paddy-700">{scheme.deadlineText}</p>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <span className="font-bold text-forest-900 block mb-1">Required Document Checklist:</span>
              <div className="flex flex-wrap gap-2">
                {scheme.requiredDocuments.map((doc, i) => (
                  <span
                    key={i}
                    className="bg-cream-100 text-forest-900 font-semibold px-2.5 py-1 rounded-lg border border-sage-300 flex items-center gap-1"
                  >
                    ✓ {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
