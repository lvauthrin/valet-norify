import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [errors, setErrors] = useState<{phoneNumber?: string, spotNumber?: string}>({});

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setErrors({});
    }
  }, [isOpen, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!localSettings.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!localSettings.spotNumber.trim()) newErrors.spotNumber = "Spot number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2 text-gray-800">
            <SettingsIcon className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold">Configuration</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter the valet service phone number and your assigned parking spot. These will be saved on your device.
          </p>

          <Input
            label="Valet Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="e.g. 555-0123"
            value={localSettings.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />

          <Input
            label="Parking Spot Number"
            name="spotNumber"
            type="text"
            placeholder="e.g. 42B"
            value={localSettings.spotNumber}
            onChange={handleChange}
            error={errors.spotNumber}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};