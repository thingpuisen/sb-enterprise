import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="mt-auto bg-white border-t border-gray-100 px-8 py-6 flex flex-col lg:flex-row justify-between items-center gap-6 text-black">
      <div className="flex items-center gap-4 text-left w-full lg:w-auto justify-center lg:justify-start">
        <div className="w-16 h-12 bg-gray-100 rounded-sm relative overflow-hidden shrink-0 border border-gray-200">
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
        <div className="text-xs">
          <span className="font-bold uppercase tracking-wider mr-2">Showroom:</span>
          <span className="text-gray-500">{settings.location.split('\n').join(', ')}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-gray-500 text-center lg:text-right">
        <div>
          <span className="font-bold uppercase tracking-wider text-black mr-2">Support:</span>
          {settings.contactNumber}
        </div>
        <div className="text-[10px] text-gray-400 flex items-center gap-2 flex-wrap justify-center">
          <span>SB Enterprise © {new Date().getFullYear()}</span>
          <span className="hidden md:inline">•</span>
          <span>Furniture store of your choice</span>
          <span className="hidden md:inline">•</span>
          <Link to="/admin" className="hover:text-black transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
