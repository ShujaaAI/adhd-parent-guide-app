import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { GroundingChunk, Provider } from '../types';

const FindScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError('');
      },
      (geoError) => {
        setError('Geolocation is required for this feature. Please enable it in your browser settings.');
        console.error(geoError);
      }
    );
  }, []);

  const parseResultsToProviders = (text: string): Provider[] => {
    if (!text) return [];
    const providersList: Provider[] = [];
    const providerBlocks = text.split('---').filter(block => block.trim() !== '');

    providerBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const provider: Partial<Provider> = {};
        lines.forEach(line => {
            if (line.startsWith('**Name:**')) {
                provider.name = line.replace('**Name:**', '').trim();
            } else if (line.startsWith('**Address:**')) {
                provider.address = line.replace('**Address:**', '').trim();
            } else if (line.startsWith('**Phone:**')) {
                provider.phone = line.replace('**Phone:**', '').trim();
            } else if (line.startsWith('**Specialization:**')) {
                provider.specialization = line.replace('**Specialization:**', '').trim();
            }
        });

        if (provider.name && provider.phone) {
            providersList.push({
                name: provider.name,
                address: provider.address || 'Not available',
                phone: provider.phone,
                specialization: provider.specialization || 'Not available',
            });
        }
    });
    return providersList;
  };


  const handleSearch = async (query: string) => {
    if (!location) {
      setError('Could not get your location. Please enable location services.');
      return;
    }
    setLoading(true);
    setSearchAttempted(true);
    setError('');
    setProviders([]);
    setSources([]);

    try {
        const response = await geminiService.findProviders(query, location);
        const parsedProviders = parseResultsToProviders(response.results);
        setProviders(parsedProviders);
        setSources(response.sources);
        if (parsedProviders.length === 0 && response.results) {
            setError("Sorry, I couldn't find any providers in a readable format. You can try again.");
        }
    } catch (err) {
        setError('An error occurred during the search. Please try again.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Find Local Support</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSearch('therapists')}
            disabled={loading || !location}
            className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-slate-400"
          >
            Find Therapists
          </button>
          <button
            onClick={() => handleSearch('ADHD-specialized schools')}
            disabled={loading || !location}
            className="w-full px-4 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-slate-400"
          >
            Find Schools
          </button>
        </div>
        {!location && !error && <p className="text-sm text-center text-slate-500 mt-2">Getting your location...</p>}
      </div>

      {loading && <LoadingSpinner className="py-8" />}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      
      {!loading && searchAttempted && providers.length === 0 && !error && (
        <div className="text-center text-slate-500 bg-slate-100 p-4 rounded-lg">
          <p>No providers found for your search.</p>
        </div>
      )}

      {providers.length > 0 && (
        <div className="space-y-4">
            {providers.map((provider, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
                    <h3 className="font-bold text-slate-800 text-lg">{provider.name}</h3>
                    <p className="text-sm text-slate-500 font-medium my-1">{provider.specialization}</p>
                    <p className="text-slate-600 mt-2">{provider.address}</p>
                    <p className="text-slate-600 font-semibold">{provider.phone}</p>
                    <div className="flex gap-2 mt-4">
                        <a href={`tel:${provider.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 text-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 text-sm">
                            Call
                        </a>
                        <a href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 text-sm">
                            WhatsApp
                        </a>
                    </div>
                </div>
            ))}
        </div>
      )}

      {sources.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow-sm mt-4">
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-slate-700">Sources & Links:</h4>
              <ul className="list-disc pl-5 mt-2 text-sm">
                {sources.map((source, index) => (
                  source.maps && <li key={index}><a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{source.maps.title}</a></li>
                ))}
              </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default FindScreen;