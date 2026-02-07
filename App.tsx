import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserSettings, RetrievalData } from './types';
import { SettingsModal } from './components/SettingsModal';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Car, Clock, Calendar, Send, Copy, Settings as SettingsIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [settings, setSettings] = useLocalStorage<UserSettings>('valet-connect-settings', {
    phoneNumber: '',
    spotNumber: '',
  });

  const [retrievalData, setRetrievalData] = useState<RetrievalData>({
    date: '',
    time: '',
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  // Initialize date/time on mount (client-side only to match timezone)
  useEffect(() => {
    const now = new Date();
    // Round up to next 15 minutes
    const ms = 1000 * 60 * 15;
    const rounded = new Date(Math.ceil(now.getTime() / ms) * ms);
    
    // Format for HTML inputs
    const dateStr = rounded.toISOString().split('T')[0];
    const timeStr = rounded.toTimeString().split(' ')[0].substring(0, 5);

    setRetrievalData({
      date: dateStr,
      time: timeStr
    });
  }, []);

  // --- Helpers ---
  const isConfigured = Boolean(settings.phoneNumber && settings.spotNumber);

  const formattedMessage = useMemo(() => {
    if (!retrievalData.date || !retrievalData.time) return '';

    try {
        // Create a date object from the inputs to format it nicely
        const [y, m, d] = retrievalData.date.split('-').map(Number);
        const [hours, mins] = retrievalData.time.split(':').map(Number);
        const selectedDate = new Date(y, m - 1, d, hours, mins);

        // Calculate "today" and "tomorrow" for comparison
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Normalize selected date to midnight for date comparison
        const selectedDateMidnight = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        const niceTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(selectedDate);

        if (selectedDateMidnight.getTime() === today.getTime()) {
           // Today
           return `Hello, I would like to get my car (spot # ${settings.spotNumber}) at ${niceTime}. Thanks!`;
        } else if (selectedDateMidnight.getTime() === tomorrow.getTime()) {
           // Tomorrow
           return `Hello, I would like to get my car (spot # ${settings.spotNumber}) tomorrow at ${niceTime}. Thanks!`;
        } else {
           // Other dates
           const niceDate = new Intl.DateTimeFormat('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
           }).format(selectedDate);
           
           return `Hello, I would like to get my car (spot # ${settings.spotNumber}) on ${niceDate} at ${niceTime}. Thanks!`;
        }

    } catch (e) {
        return '';
    }
  }, [retrievalData, settings.spotNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetrievalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendSMS = () => {
    if (!isConfigured) {
      setIsSettingsOpen(true);
      return;
    }
    
    // Simple cleaning of phone number
    const cleanPhone = settings.phoneNumber.replace(/[^\d+]/g, '');
    const encodedBody = encodeURIComponent(formattedMessage);
    
    // Use generic sms: scheme. 
    // iOS and Android modern versions generally support `?body=`
    window.location.href = `sms:${cleanPhone}?body=${encodedBody}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage).then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    });
  };

  // Open settings immediately if not configured
  useEffect(() => {
    if (!isConfigured) {
      // Small delay for animation smoothness
      const timer = setTimeout(() => setIsSettingsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isConfigured]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Valet Connect</h1>
              </div>
              <p className="text-primary-100 text-sm font-medium">Request vehicle retrieval instantly</p>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-md"
              aria-label="Settings"
            >
              <SettingsIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Configuration Warning Banner */}
        {!isConfigured && !isSettingsOpen && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-3 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium">Setup Required</p>
              <p className="text-xs text-yellow-700 mt-1">Please configure your spot and phone number to continue.</p>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs font-bold text-yellow-800 underline hover:text-yellow-900"
            >
              Configure
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label="Retrieval Date"
                name="date"
                type="date"
                className="pl-7" /* Adjust padding for icon via style if needed, or simple wrapping */
                style={{ paddingLeft: '2.5rem' }} // Simple inline override for icon space
                value={retrievalData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label="Retrieval Time"
                name="time"
                type="time"
                style={{ paddingLeft: '2.5rem' }}
                value={retrievalData.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Message Preview
            </label>
            {isConfigured ? (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-800 font-medium font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {formattedMessage}
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                Configure settings to see preview
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 pt-2">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleSendSMS}
              disabled={!isConfigured || !retrievalData.date || !retrievalData.time}
              icon={<Send className="w-4 h-4" />}
            >
              Prepare Text Message
            </Button>
            
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={handleCopy}
              disabled={!isConfigured}
              icon={justCopied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            >
              {justCopied ? "Copied to Clipboard!" : "Copy Text Only"}
            </Button>
          </div>

        </div>
        
        {/* Footer info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Spot #{settings.spotNumber || '???'}</span>
          <span>{settings.phoneNumber || 'No phone set'}</span>
        </div>

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />
      </div>
    </div>
  );
};

export default App;