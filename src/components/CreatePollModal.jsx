import React, { useState } from 'react';
import { X, Plus, Trash2, Clock, Lock, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';

const CreatePollModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [privacy, setPrivacy] = useState('DEVICE');
  const [duration, setDuration] = useState('24');
  const [isCreating, setIsCreating] = useState(false);

  const MAX_OPTIONS = 5;

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
    setIsCreating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const expiresAt = new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000);

      const payload = {
        question: question.trim(),
        options: options.filter(o => o.trim() !== ''),
        duplicateCheck: privacy,
        expiresAt: expiresAt
      };

      const response = await axios.post('http://localhost:5000/api/polls', payload);

      if (response.data.success) {
        console.log('Poll Created Successfully:', response.data.data);
        resetForm();
        onClose();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-semibold text-white">Create New Poll</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form id="poll-form" onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Question */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Poll Question</label>
            <textarea
              required
              disabled={isCreating}
              placeholder="What's on your mind?"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all resize-none h-24 disabled:opacity-50"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 flex items-center justify-between">
              Options
              <span className="text-xs text-slate-500">{options.length}/{MAX_OPTIONS} options</span>
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 group">
                  <input
                    required
                    disabled={isCreating}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all disabled:opacity-50"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      disabled={isCreating}
                      onClick={() => removeOption(index)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                    >
                      <Trash2 size={18} />
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
                className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                <Plus size={16} /> Add Option
              </button>
            )}
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Privacy */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Vote Restriction</label>
              <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setPrivacy('IP')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs transition-all ${privacy === 'IP' ? 'bg-brand text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                    } disabled:opacity-50`}
                  title="One vote per IP address"
                >
                  <Globe size={13} /> IP-Level
                </button>
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setPrivacy('DEVICE')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs transition-all ${privacy === 'DEVICE' ? 'bg-brand text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                    } disabled:opacity-50`}
                  title="One vote per device (browser session)"
                >
                  <Lock size={13} /> Device-Level
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Duration</label>
              <div className="relative">
                <select
                  disabled={isCreating}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all text-sm disabled:opacity-50"
                >
                  <option value="1">1 Hour</option>
                  <option value="6">6 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">2 Days</option>
                  <option value="168">7 Days</option>
                </select>
                <Clock className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-3">
          <button
            type="button"
            disabled={isCreating}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="poll-form"
            disabled={isCreating}
            className="flex-1 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-white font-semibold shadow-lg shadow-brand/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <><Loader2 className="animate-spin" size={18} /> Launching...</>
            ) : (
              'Launch Poll'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;
