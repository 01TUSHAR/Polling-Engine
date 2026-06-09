import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, BarChart3, Zap, Shield, ChevronRight } from 'lucide-react'
import CreatePollModal from '../components/CreatePollModal'

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center space-y-12 relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5 mb-4">
           <Sparkles size={16} className="text-brand" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Enterprise Polling Engine</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            Instant Feedback <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand to-violet-400">Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Deploy professional-grade polls in seconds. Track real-time responses with sub-millisecond latency and advanced duplicate protection.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group px-10 py-5 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all transform hover:scale-[1.03] shadow-[0_0_40px_-12px_rgba(99,102,241,0.5)] active:scale-[0.98] flex items-center gap-2"
          >
            Create A Poll <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/my-polls')}
            className="px-10 py-5 glass glass-hover text-slate-200 font-bold rounded-2xl transition-all border border-white/5 flex items-center gap-2"
          >
            Manage Dashboard
          </button>
        </div>

        {/* Features / Stats */}
        <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-4xl border-white/5 space-y-3 glass-hover text-left">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-2">
                <Zap size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Real-time Sync</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Socket-powered updates ensure every vote is reflected instantly across all devices.</p>
          </div>
          
          <div className="glass p-8 rounded-4xl border-white/5 space-y-3 glass-hover text-left">
             <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-2">
                <Shield size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Fraud Protection</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Advanced device fingerprinting and IP restriction to maintain data integrity.</p>
          </div>

          <div className="glass p-8 rounded-4xl border-white/5 space-y-3 glass-hover text-left">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
                <BarChart3 size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Deep Analytics</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Visualize trends and participation rates with automated result aggregation.</p>
          </div>
        </div>
      </div>

      <CreatePollModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Footer Branding */}
      <div className="mt-20 opacity-20 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
        © 2026 POLLING ENGINE
      </div>
    </div>
  )
}

export default Home