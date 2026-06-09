import { useState } from 'react'
import CreatePollModal from '../components/CreatePollModal'

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Polling <span className="text-brand">Engine</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto">
            Create, share, and track polls in real-time with zero friction. Premium experience for modern teams.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 bg-brand hover:bg-brand/90 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-brand/20 active:scale-95"
          >
            Create a Poll
          </button>
          <button className="px-10 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl transition-all border border-slate-700">
            View Live Polls
          </button>
        </div>

        {/* Decorative elements */}
        <div className="pt-20 grid grid-cols-3 gap-8 opacity-50">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">10k+</div>
            <div className="text-sm text-slate-500">Polls Created</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">50k+</div>
            <div className="text-sm text-slate-500">Active Users</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">0.1s</div>
            <div className="text-sm text-slate-500">Real-time Sync</div>
          </div>
        </div>
      </div>

      <CreatePollModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default Home