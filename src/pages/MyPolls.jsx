import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    ArrowLeft,
    Plus,
    BarChart2,
    Clock,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Users,
} from 'lucide-react';
import axios from 'axios';
import { storage } from '../utils/storage';
import { API_URL } from '../config/api';

const statusConfig = {
    ACTIVE: {
        label: 'Active',
        icon: CheckCircle2,
        classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
    CLOSED: {
        label: 'Closed',
        icon: XCircle,
        classes: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    },
};

const timeLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending absolute soon';
};

const MyPolls = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClosing, setIsClosing] = useState(null); // Track which poll is being closed

    const fetchMyPolls = async () => {
        const userToken = storage.getCreatorUserToken();

        try {
            const response = await axios.post(`${API_URL}/polls/my-polls`, {
                creatorTokens: [userToken]
            });
            if (response.data.success) {
                setPolls(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load your polls');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPolls();
    }, []);

    const handleClosePoll = async (e, pollId) => {
        e.stopPropagation(); // Don't navigate to poll detail
        
        if (!window.confirm("Are you sure you want to close this poll? This action cannot be undone.")) {
            return;
        }

        setIsClosing(pollId);
        try {
            const userToken = storage.getCreatorUserToken();
            const response = await axios.put(`${API_URL}/polls/${pollId}/close`, {
                creatorToken: userToken
            });

            if (response.data.success) {
                // Refresh local state to show CLOSED status
                setPolls(prev => prev.map(p => p._id === pollId ? { ...p, status: 'CLOSED' } : p));
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to close poll");
        } finally {
            setIsClosing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-brand" size={48} />
                    <p className="text-slate-400 font-medium">Retrieving your polls...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/')}
                            className="p-4 glass glass-hover rounded-3xl text-slate-400 hover:text-white"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Your Dashboard</h1>
                            <p className="text-slate-500 font-medium">{polls.length} poll{polls.length !== 1 ? 's' : ''} linked to your secure token</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-2xl shadow-brand/20 active:scale-[0.98]"
                    >
                        <Plus size={20} /> Create New Poll
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && polls.length === 0 && (
                    <div className="glass rounded-[2.5rem] py-24 flex flex-col items-center justify-center space-y-6 text-center border-dashed">
                        <div className="p-8 bg-brand/5 rounded-full border border-brand/10">
                            <BarChart2 size={48} className="text-brand" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">No active polls found</h2>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                You haven't created any polls yet. Start engaging your audience now.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-10 py-4 glass glass-hover text-brand font-bold rounded-2xl transition-all"
                        >
                            Start First Poll
                        </button>
                    </div>
                )}

                {/* Polls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {polls.map((poll) => {
                        const expired = new Date(poll.expiresAt) < new Date();
                        const status = (poll.status === 'CLOSED' || expired) ? statusConfig.CLOSED : statusConfig.ACTIVE;
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={poll._id}
                                onClick={() => navigate(`/poll/${poll._id}`)}
                                className="glass rounded-4xl p-8 border-white/5 hover:border-brand/30 transition-all group flex flex-col cursor-pointer glass-hover"
                            >
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h2 className="text-xl font-bold text-white leading-tight flex-1 group-hover:text-brand transition-colors">
                                        {poll.question}
                                    </h2>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase tracking-tighter font-bold whitespace-nowrap ${status.classes}`}>
                                        <StatusIcon size={12} strokeWidth={3} />
                                        {expired ? 'Expired' : status.label}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {poll.options.slice(0, 3).map((opt) => (
                                        <span
                                            key={opt._id}
                                            className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[11px] font-medium border border-white/5"
                                        >
                                            {opt.text}
                                        </span>
                                    ))}
                                    {poll.options.length > 3 && (
                                        <span className="text-[11px] text-slate-600 self-center">+{poll.options.length - 3} more</span>
                                    )}
                                </div>

                                <div className="mt-auto flex flex-col gap-4">
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Users size={14} className="text-slate-400" />
                                                {poll.totalVoteCount || 0} votes
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-400" />
                                                {timeLeft(poll.expiresAt)}
                                            </span>
                                        </div>
                                        <div className="p-2 transition-transform group-hover:translate-x-1 text-brand">
                                            <ExternalLink size={18} />
                                        </div>
                                    </div>
                                    
                                    {poll.status === 'ACTIVE' && !expired && (
                                        <button
                                            disabled={isClosing === poll._id}
                                            onClick={(e) => handleClosePoll(e, poll._id)}
                                            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isClosing === poll._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                            Close Poll Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold pb-10">
                    Enterprise Polling Engine v1.0
                </p>
            </div>
        </div>
    );
};

export default MyPolls;
