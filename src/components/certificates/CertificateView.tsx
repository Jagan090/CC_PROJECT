import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
  User,
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Certificate } from '../../types';

interface CertificateViewProps {
  selectedCertificate?: Certificate | null;
  onBack?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  selectedCertificate,
  onBack
}) => {
  const { currentUser, dataVersion } = useAuth();
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [activeCert, setActiveCert] = React.useState<Certificate | null>(null);

  React.useEffect(() => {
    const list = dataService.getUserCertificates(currentUser.id);
    setCertificates(list);
    if (selectedCertificate) {
      setActiveCert(selectedCertificate);
    } else if (list.length > 0 && !activeCert) {
      setActiveCert(list[0]);
    }
  }, [currentUser.id, selectedCertificate, dataVersion]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Action Header */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden print:hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white mb-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Accreditation Records</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Verified Enterprise Certifications
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Tamper-proof credential records backed by enterprise assessment benchmarks and technical competency assessments.
            </p>
          </div>

          {activeCert && (
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                id="print-certificate-btn"
                onClick={handlePrint}
                className="px-6 py-3.5 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition flex items-center gap-2 shadow-lg shadow-lime-500/20 cursor-pointer macos-button"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {certificates.length === 0 ? (
        <div className="bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-12 text-center shadow-2xl">
          <Award className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-white mb-1">
            No certificates earned yet
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4 leading-relaxed">
            Complete course modules and pass the certification quiz with 70%+ to unlock verified credentials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Certificate Selector List (Hidden on print) */}
          <div className="lg:col-span-4 space-y-3 print:hidden">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-1">
              Your Earned Credentials ({certificates.length})
            </div>
            {certificates.map((cert) => {
              const isSelected = activeCert?.id === cert.id;
              return (
                <motion.button
                  key={cert.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  onClick={() => setActiveCert(cert)}
                  className={`w-full text-left p-4 rounded-[22px] border transition flex items-start gap-3.5 cursor-pointer macos-card ${
                    isSelected
                      ? 'border-[#c2f866] bg-[#1a1c22] shadow-lg shadow-lime-500/10'
                      : 'border-white/5 hover:border-white/20 bg-[#121318]'
                  }`}
                >
                  <div className="p-2.5 rounded-2xl bg-amber-400/10 text-amber-400 mt-0.5 border border-amber-400/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono text-zinc-500">
                      {cert.certificateNumber}
                    </div>
                    <div className={`font-display text-sm font-bold truncate mt-0.5 ${isSelected ? 'text-[#c2f866]' : 'text-white'}`}>
                      {cert.courseTitle}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                      <span>Issued: {cert.issueDate}</span>
                      <span className="font-bold text-[#c2f866]">Score: {cert.finalScore}%</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Printable / Realistic Certificate Canvas */}
          <div className="lg:col-span-8">
            {activeCert && (
              <div 
                id="printable-certificate-document"
                className="relative bg-gradient-to-br from-[#faf8f4] via-[#ffffff] to-[#f4f0e6] border-8 border-double border-amber-900/30 rounded-[32px] p-8 sm:p-12 shadow-2xl text-center space-y-6 overflow-hidden print:border-8 print:p-8 print:shadow-none print:m-0 print:text-black"
              >
                {/* Decorative Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-700/60" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-700/60" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-700/60" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-700/60" />

                {/* Issuer Seal & Header */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    <Award className="w-9 h-9" />
                  </div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-900 font-sans">
                    Capacity Connect Enterprise Academy
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tracking-tight">
                    Certificate of Completion
                  </h2>
                  <p className="text-xs text-zinc-600 max-w-md">
                    This document certifies that the individual named below has successfully satisfied all rigorous curriculum requirements and passed the comprehensive technical examination with honors.
                  </p>
                </div>

                {/* Recipient Name */}
                <div className="py-2 border-y border-amber-300/60 max-w-md mx-auto">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                    Presented with Distinction to
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-serif tracking-wide">
                    {activeCert.userName}
                  </div>
                </div>

                {/* Curriculum Description */}
                <div className="space-y-1.5 max-w-lg mx-auto">
                  <p className="text-xs text-zinc-600">
                    For successfully demonstrating verified competency in:
                  </p>
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-950 leading-snug">
                    {activeCert.courseTitle}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passing Grade: {activeCert.finalScore}%
                  </div>
                </div>

                {/* Signatures & Security Validation Footer */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs text-zinc-700 border-t border-zinc-200">
                  {/* Instructor Signature */}
                  <div className="space-y-1 text-center">
                    <div className="font-serif italic text-lg text-zinc-900 font-semibold border-b border-zinc-400 pb-1 mx-auto max-w-[140px]">
                      {activeCert.instructorName}
                    </div>
                    <div className="font-bold text-zinc-950 text-[11px]">Master Instructor</div>
                    <div className="text-[10px] text-zinc-500">Technical Enablement</div>
                  </div>

                  {/* Security Verification QR Mock */}
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="p-2 bg-white border border-zinc-300 rounded-xl shadow-xs">
                      <div className="w-14 h-14 bg-zinc-950 flex items-center justify-center text-white text-[9px] font-mono text-center p-1 leading-tight rounded-lg">
                        QR VERIFIED SECURE
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {activeCert.certificateNumber}
                    </span>
                  </div>

                  {/* Date & Accreditation */}
                  <div className="space-y-1 text-center">
                    <div className="font-medium text-zinc-900 border-b border-zinc-400 pb-1 mx-auto max-w-[140px]">
                      {activeCert.issueDate}
                    </div>
                    <div className="font-bold text-zinc-950 text-[11px]">Date of Certification</div>
                    <div className="text-[10px] text-zinc-500">Official Issuance</div>
                  </div>
                </div>

                {/* Tamper-proof hash line */}
                <div className="pt-2 text-[10px] font-mono text-zinc-400 truncate">
                  SHA-256 Verification Hash: {activeCert.verificationHash}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
