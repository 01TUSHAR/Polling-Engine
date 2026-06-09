import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Share2, Check, Clock, Users } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { storage } from '../utils/storage';

const API_URL = 'http://localhost:5000/api';

const PollDetail = () => {
    const { pollId } = useParams();
    const navigate = useNavigate();
    
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [votedOption, setVotedOption] = useState(storage.getVotedOption(pollId));
    const [selectedOption, setSelectedOption] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

    const updatePollVotes = useCallback((results) => {
        setPoll(prev => {
            if (!prev) return prev;
            const updatedOptions = prev.options.map(option => {
                const voteData = results.find(v => v._id === option._id);
                return {
                    ...option,
                    voteCount: voteData ? voteData.count : (option.voteCount || 0)
                };
            });
            const total = updatedOptions.reduce((sum, opt) => sum + (opt.voteCount || 0), 0);
            return { ...prev, options: updatedOptions, totalVoteCount: total };
        });
    }, []);

    const fetchPollData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/polls/${pollId}`);
            if (response.data.success) {
                setPoll(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load poll');
        } finally {
            setLoading(false);
        }
    }, [pollId]);

    useEffect(() => {
        fetchPollData();
    }, [fetchPollData]);

    // Socket connection for real-time updates
    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.emit('join-poll', pollId);

        socket.on('poll:update', (results) => {
            updatePollVotes(results);
        });

        return () => socket.disconnect();
    }, [pollId, updatePollVotes]);

    const handleVote = async () => {
        if (!selectedOption || votedOption || isVoting) return;
        
        setIsVoting(true);
        try {
            const deviceToken = storage.getDeviceId();
            const response = await axios.post(`${API_URL}/votes/${pollId}`, {
                optionId: selectedOption,
                deviceToken
            });

            if (response.data.success) {
                storage.setVoted(pollId, selectedOption);
                setVotedOption(selectedOption);
                // The socket will handle the real-time update for results
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cast vote');
        } finally {
            setIsVoting(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // Simple elegant toast replacement
        const btn = document.getElementById('share-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="flex items-center gap-2"><Check size={18}/> Copied!</span>';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    };

    const calculatePercentage = (count = 0) => {
        if (!poll || !poll.totalVoteCount) return 0;
        return Math.round((count / poll.totalVoteCount) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-brand" size={48} />
                    <p className="text-slate-400 font-medium">Loading poll...</p>
                </div>
            </div>
        );
    }

    if (error || !poll) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
                    <p className="text-xl text-red-400 font-medium mb-4">{error || "Poll not found"}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const hasExpired = new Date() > new Date(poll.expiresAt);
    const isClosed = poll.status === 'CLOSED' || hasExpired;

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-3 glass glass-hover rounded-2xl text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button 
                        id="share-btn"
                        onClick={copyLink}
                        className="flex items-center gap-2 px-5 py-3 glass glass-hover text-slate-200 rounded-2xl"
                    >
                        <Share2 size={18} /> Share Poll
                    </button>
                </div>

                {/* Main Poll Card */}
                <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
                    {isClosed && (
                        <div className="absolute top-0 left-0 w-full bg-amber-500/10 border-b border-amber-500/20 py-2 text-center">
                            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
                                This poll is {poll.status === 'CLOSED' ? 'Closed' : 'Expired'}
                            </span>
                        </div>
                    )}

                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                            {poll.question}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Users size={14} /> {poll.totalVoteCount || 0} votes
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} /> {isClosed ? 'Ended' : `Ends ${new Date(poll.expiresAt).toLocaleDateString()}`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {poll.options.map((option) => {
                            const isSelected = (selectedOption === option._id) || (votedOption === option._id);
                            const percentage = calculatePercentage(option.voteCount);
                            const showResults = votedOption || isClosed;

                            return (
                                <div key={option._id} className="relative group">
                                    <button
                                        disabled={showResults || isVoting}
                                        onClick={() => setSelectedOption(option._id)}
                                        className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between relative overflow-hidden
                                            ${isSelected 
                                                ? 'border-brand bg-brand/5 ring-1 ring-brand/50' 
                                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                                            } ${showResults ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                                        `}
                                    >
                                        {/* Progress Bar Background */}
                                        {showResults && (
                                            <div 
                                                className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-out 
                                                    ${isSelected ? 'bg-brand/20' : 'bg-white/5'}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        )}

                                        <div className="flex items-center gap-4 z-10">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                ${isSelected ? 'border-brand bg-brand' : 'border-slate-600'}
                                                ${showResults && !isSelected ? 'opacity-50' : ''}
                                            `}>
                                                {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <span className={`font-semibold text-lg transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                {option.text}
                                            </span>
                                        </div>

                                        {showResults && (
                                            <div className="flex flex-col items-end z-10">
                                                <span className="text-xl font-bold text-white">{percentage}%</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{option.voteCount || 0} votes</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {!votedOption && !isClosed && (
                        <button
                            onClick={handleVote}
                            disabled={!selectedOption || isVoting}
                            className="w-full py-5 bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:hover:scale-100 text-white text-lg font-bold rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-brand/20 flex items-center justify-center gap-2"
                        >
                            {isVoting ? <Loader2 className="animate-spin" size={20} /> : 'Cast Your Vote'}
                        </button>
                    )}

                    {votedOption && (
                        <div className="text-center p-6 bg-brand/10 border border-brand/20 rounded-2xl animate-fade-in">
                            <p className="text-brand font-bold text-lg">Thank you for voting!</p>
                            <p className="text-slate-400 text-sm mt-1">Live results are updated in real-time.</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="flex flex-col items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium">
                    <p>Double voting restricted by {poll.duplicateCheck}</p>
                    <p>© 2026 Polling Engine • Enterprise Grade</p>
                </div>
            </div>
        </div>
    );
};

export default PollDetail;

