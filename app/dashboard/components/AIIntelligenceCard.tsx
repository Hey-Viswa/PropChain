import { Sparkles, Zap, TrendingUp } from "lucide-react";

export default function AIIntelligenceCard() {
  return (
    <div className="lg:col-span-1 bg-primary rounded-2xl p-6 text-on_primary shadow-floating flex flex-col relative overflow-hidden h-full min-h-[320px]">
      {/* Decorative stars */}
      <div className="absolute top-4 right-4 text-primary_fixed opacity-30 select-none">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
        </svg>
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-on_primary/20 flex items-center justify-center backdrop-blur-sm">
          <Sparkles size={14} className="text-on_primary" />
        </div>
        <h3 className="text-lg font-bold font-display tracking-tight">AI Audit Intelligence</h3>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        {/* optimization alert */}
        <div className="bg-primary_container/30 border border-primary_fixed/20 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-[#facc15]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#fbd38d]">Optimization Alert</span>
          </div>
          <p className="text-sm leading-relaxed text-primary_fixed">
            System-wide verification times can be reduced by <strong className="text-white">14%</strong> by automating the deed verification nodes in the APAC region.
          </p>
        </div>

        {/* forecast */}
        <div className="bg-primary_container/30 border border-primary_fixed/20 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={12} className="text-primary_fixed" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary_fixed">Forecast</span>
          </div>
          <p className="text-sm leading-relaxed text-primary_fixed">
            Predicting a <strong className="text-white">22.5% increase</strong> in tokenized industrial assets over the next financial quarter.
          </p>
        </div>
      </div>

      <button className="w-full mt-6 bg-[#d6e3ff] text-[#001a43] hover:bg-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-md transition-colors relative z-10 shadow-sm">
        Initialize Node Optimization
      </button>
    </div>
  );
}
