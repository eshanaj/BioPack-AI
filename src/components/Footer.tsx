import React from 'react';
import { Sparkles, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useI18n } from '../locales/i18n.tsx';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { t, language } = useI18n();

  return (
    <footer className="bg-slate-50 dark:bg-[#041610] text-slate-600 dark:text-emerald-200/70 text-xs border-t border-slate-200 dark:border-[#103e2e] transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>BioPack AI</span>
            </div>
            <p className="text-slate-600 dark:text-emerald-200/70 text-xs leading-relaxed">
              {t.app.positioning}. {language === 'hi' ? 'खाद्य प्रसंस्करणकर्ताओं और पैकेजिंग तकनीकविदों को अनुमान के स्थान पर ठोस वैज्ञानिक नियमों से सही निर्णय लेने में सहायता।' : language === 'mr' ? 'अन्न प्रक्रियादार आणि पॅकेजिंग तज्ज्ञांना केवळ अंदाजाऐवजी अचूक वैज्ञानिक नियमांनुसार योग्य निर्णय घेण्यास मदत.' : 'Helping food processors, MSMEs, and packaging technologists replace guesswork with deterministic biophysical rules.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ASTM Standards & FSSAI Grounded</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              {language === 'hi' ? 'मुख्य क्षमताएं' : language === 'mr' ? 'प्रमुख क्षमता' : 'Core Capabilities'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentTab('analyze')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.analyze}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('audit')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.audit}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('compare')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.compare}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('fresh_produce')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.freshProduce}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('validation')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.validation}
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Modules */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              {language === 'hi' ? 'वैज्ञानिक उपकरण' : language === 'mr' ? 'वैज्ञानिक साधने' : 'Scientific Tools'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentTab('what_if')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.whatIf}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('spec')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.spec}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('reports')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.reports}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('benchmarks')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.benchmarks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('status')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.status}
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer & Standards */}
          <div className="space-y-2">
            <h4 className="text-slate-900 dark:text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              {language === 'hi' ? 'मानक एवं सत्यनिष्ठा' : language === 'mr' ? 'मानके आणि पारदर्शकता' : 'Standards & Integrity'}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-emerald-200/70 leading-normal">
              {language === 'hi'
                ? 'बैरियर मान ASTM D3985 (OTR), ASTM F1249 (WVTR) और IS 9845 प्रवासन सीमाओं पर आधारित हैं। बायोपैक एआई निर्णय समर्थन प्रदान करता है और सत्यापन प्रोटोकॉल सुझाता है; यह व्यावसायिक रिलीज से पहले प्रमाणित लैब परीक्षण की आवश्यकता को समाप्त नहीं करता।'
                : language === 'mr'
                ? 'बॅरियर मूल्ये ASTM D3985 (OTR), ASTM F1249 (WVTR) आणि IS 9845 मानकांवर आधारित आहेत. बायोपॅक एआई योग्य निर्णय घेण्यास मदत करते; परंतु व्यावसायिक प्रकाशनापूर्वी प्रत्यक्ष लॅब चाचणी आवश्यक आहे.'
                : 'Barrier values reference ASTM D3985 (OTR), ASTM F1249 (WVTR), and IS 9845 migration thresholds. BioPack AI provides decision support and suggests validation protocols; it does not replace certified laboratory testing prior to commercial release.'}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-emerald-400/80 font-mono">
              Dataset Manifest: v1.4.0 (SHA-256 Verified)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#103e2e] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-emerald-300/60">
          <div>
            © {new Date().getFullYear()} BioPack AI. {language === 'hi' ? 'प्रमाण-आधारित खाद्य पैकेजिंग इंटेलिजेंस।' : language === 'mr' ? 'पुरावा-आधारित अन्न पॅकेजिंग इंटेलिजन्स.' : 'Evidence-Grounded Food Packaging Intelligence.'}
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <button
              onClick={() => setCurrentTab('knowledge')}
              className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.knowledge}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('status')}
              className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'सिस्टम स्वास्थ्य एवं एमएल गेट' : language === 'mr' ? 'प्रणाली आरोग्य व एमएल गेट' : 'System Health & ML Gate'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
