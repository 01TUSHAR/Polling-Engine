import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Trash2, Clock, Lock, Globe, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = 'http://localhost:5000/api';

const CreatePollModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [privacy, setPrivacy] = useState('DEVICE');
  const [duration, setDuration] = useState('24');
  const [isCreating, setIsCreating] = useState(false);

  const MAX_OPTIONS = 6;

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setPrivacy('DEVICE');
    setDuration('24');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(o => o !== '');
    
    if (validOptions.length < 2) {
        alert('Please provide at least 2 valid options.');
        return;
    }

    setIsCreating(true);
    try {
      const expiresAt = new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000);

      const payload = {
        question: question.trim(),
        options: validOptions,
        duplicateCheck: privacy,
        expiresAt: expiresAt,
        creatorToken: storage.getCreatorUserToken()
      };

      const response = await axios.post(`${API_URL}/polls`, payload);

      if (response.data.success) {
        const { pollId } = response.data.data;

        resetForm();
        onClose();
        navigate(`/poll/${pollId}`);
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert(error.response?.data?.message || 'Something went wrong while creating the poll.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] overflow-hidden scale-in-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles size={24} className="text-brand" /> Create New Poll
            </h2>
            <p className="text-slate-400 text-sm mt-1">Get real-time feedback in seconds</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 glass-hover rounded-2xl text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form id="poll-form" onSubmit={handleSubmit} className="p-8 pt-4 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Question */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Question</label>
            <textarea
              required
              disabled={isCreating}
              placeholder="What do you want to ask?"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/40 transition-all resize-none h-28 disabled:opacity-50 font-medium"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center justify-between">
              Options
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{options.length}/{MAX_OPTIONS} MAX</span>
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3 animate-fade-in group">
                  <div className="flex-1 relative">
                    <input
                      required
                      disabled={isCreating}
                      placeholder={`Option ${index + 1}`}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/40 transition-all disabled:opacity-50 font-medium pl-10"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-600" />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      disabled={isCreating}
                      onClick={() => removeOption(index)}
                      className="p-3 text-slate-500 hover:text-red-400 glass-hover rounded-xl transition-all disabled:opacity-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < MAX_OPTIONS && (
              <button
                type="button"
                disabled={isCreating}
                onClick={addOption}
                className="w-full py-3.5 border-2 border-dashed border-white/5 rounded-xl text-slate-400 hover:text-brand hover:border-brand/30 hover:bg-brand/5 transition-all flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50"
              >
                <Plus size={18} /> Add Another Option
              </button>
            )}
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Restriction</label>
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setPrivacy('DEVICE')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${privacy === 'DEVICE' ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'text-slate-500 hover:text-slate-300'
                    } disabled:opacity-50`}
                >
                  <Lock size={14} /> Device
                </button>
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setPrivacy('IP')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${privacy === 'IP' ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'text-slate-500 hover:text-slate-300'
                    } disabled:opacity-50`}
                >
                  <Globe size={14} /> IP Address
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Duration</label>
              <div className="relative">
                <select
                  disabled={isCreating}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/40 transition-all text-sm font-bold disabled:opacity-50"
                >
                  <option value="1">1 Hour</option>
                  <option value="6">6 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">2 Days</option>
                  <option value="168">7 Days</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Clock size={16} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-4">
          <button
            type="button"
            disabled={isCreating}
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl glass glass-hover text-slate-300 font-bold text-sm disabled:opacity-50 transition-all"
          >
            Go Back
          </button>
          <button
            type="submit"
            form="poll-form"
            disabled={isCreating}
            className="flex-[2] py-4 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold shadow-2xl shadow-brand/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <><Loader2 className="animate-spin" size={20} /> Deploying...</>
            ) : (
              'Launch Poll Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;

