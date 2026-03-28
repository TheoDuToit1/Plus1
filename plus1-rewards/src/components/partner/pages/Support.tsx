// src/components/partner/pages/Support.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const topics = [
    { value: 'invoice', label: 'Invoice Help', icon: 'receipt' },
    { value: 'payment', label: 'Proof of Payment', icon: 'payment' },
    { value: 'suspension', label: 'Activation After Suspension', icon: 'lock_open' },
    { value: 'transaction', label: 'Transaction Problems', icon: 'error' },
    { value: 'other', label: 'Other', icon: 'help' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedTopic('');
      setMessage('');
      setFile(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Support</h1>
          <p className="text-gray-600">Get help with invoices, payments, and more</p>
        </div>
        <button
          onClick={() => navigate('/partner/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm flex items-start gap-4">
          <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
          <div>
            <h3 className="font-bold text-green-900 mb-1">Message Sent!</h3>
            <p className="text-sm text-green-700">
              An admin will review your request and respond shortly.
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl mb-2 block">call</span>
            <p className="font-bold text-gray-900 text-sm mb-1">Request Call</p>
            <p className="text-xs text-gray-600">Get a callback from admin</p>
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl mb-2 block">account_balance</span>
            <p className="font-bold text-gray-900 text-sm mb-1">Do Instant EFT</p>
            <p className="text-xs text-gray-600">Make a payment</p>
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl mb-2 block">info</span>
            <p className="font-bold text-gray-900 text-sm mb-1">View FAQs</p>
            <p className="text-xs text-gray-600">Common questions</p>
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Send Message to Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What do you need help with?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topics.map((topic) => (
                <button
                  key={topic.value}
                  type="button"
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    selectedTopic === topic.value
                      ? 'border-[#1a558b] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`material-symbols-outlined ${
                    selectedTopic === topic.value ? 'text-[#1a558b]' : 'text-gray-400'
                  }`}>
                    {topic.icon}
                  </span>
                  <span className={`font-semibold text-sm ${
                    selectedTopic === topic.value ? 'text-[#1a558b]' : 'text-gray-700'
                  }`}>
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1a558b] focus:outline-none resize-none"
              rows={6}
              placeholder="Describe your issue or question in detail..."
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Proof of Payment (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1a558b] transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="material-symbols-outlined text-gray-400 text-4xl mb-2 block">upload_file</span>
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedTopic || !message}
            className="w-full bg-[#1a558b] hover:bg-[#1a558b]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">send</span>
            Send Message
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Help?</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">phone</span>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-bold text-gray-900">+27 (0) 123 456 789</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">email</span>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-bold text-gray-900">support@plus1rewards.co.za</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">schedule</span>
            <div>
              <p className="text-sm text-gray-600">Business Hours</p>
              <p className="font-bold text-gray-900">Mon-Fri: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
