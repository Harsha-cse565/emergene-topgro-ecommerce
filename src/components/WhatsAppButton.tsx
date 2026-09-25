import React from 'react';
import { MessageCircle } from 'lucide-react';
import fallbackSettings from '../data/settings.json';

interface WhatsAppButtonProps {
  productName: string;
  packSize?: string;
  whatsappNumber?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  packSize = 'Standard Pack',
  whatsappNumber,
  className = ''
}) => {
  const number = whatsappNumber || fallbackSettings.whatsappNumber || '919876543210';
  const cleanNumber = number.replace(/[^0-9]/g, '');

  const messageText = `Hello, I am interested in:\n\nProduct: ${productName}\nPack Size: ${packSize}\n\nPlease provide availability and purchase details.`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm ${className}`}
    >
      <MessageCircle className="w-4 h-4 text-emerald-100" />
      <span>Enquire on WhatsApp</span>
    </a>
  );
};
