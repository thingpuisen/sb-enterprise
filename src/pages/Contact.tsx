import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you shortly.');
  };

  return (
    <div className="animate-in fade-in duration-500 bg-paper min-h-screen">
      
      {/* Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-black">Get in Touch</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">We're here to help you find the perfect pieces for your home. Visit our showroom or drop us a line.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Details & Map */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-black">Contact Information</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="text-gray-400 mt-1 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold mb-1 text-black">Showroom Location</h3>
                  <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{settings.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-gray-400 mt-1 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold mb-1 text-black">Phone Numbers</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{settings.contactNumber}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-80 overflow-hidden bg-gray-100 relative rounded-sm border border-gray-200">
               <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.location.replace(/\n/g, ' '))}&output=embed`}
                  title="Google Map location"
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
            </div>
          </div>

          {/* Contact Form Replacement - WhatsApp */}
          <div className="bg-white p-8 md:p-10 rounded-sm border border-gray-100 shadow-sm flex flex-col justify-center text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">Chat with Us</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">This website serves as our product catalogue. For any inquiries, pricing, or to place an order, please chat with us directly on WhatsApp.</p>
            
            <a 
              href={`https://wa.me/${settings.contactNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 px-8 rounded-sm text-sm font-bold tracking-wide hover:bg-[#128C7E] transition-colors shadow-sm mx-auto w-full md:w-auto"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Message on WhatsApp
            </a>
            
            <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">Typically replies within a few hours</p>
          </div>

        </div>
      </div>
    </div>
  );
}
