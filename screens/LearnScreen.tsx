import React, { useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { GroundingChunk } from '../types';

type AgeGroup = 'Toddler (2-4)' | 'Child (5-8)' | 'Pre-teen (9-12)' | 'Teen (13-17)';

const LearnScreen: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [customAge, setCustomAge] = useState<string>('');
  const [content, setContent] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ageGroups: AgeGroup[] = ['Toddler (2-4)', 'Child (5-8)', 'Pre-teen (9-12)', 'Teen (13-17)'];

  const fetchContent = useCallback(async (ageIdentifier: string) => {
    setLoading(true);
    setError('');
    setContent('');
    setSources([]);
    try {
      const result = await geminiService.getEducationalContent(ageIdentifier);
      setContent(result.content);
      setSources(result.sources);
    } catch (err) {
      setError('Failed to fetch content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAgeGroupClick = (ageGroup: AgeGroup) => {
    setCustomAge('');
    setSelectedAgeGroup(ageGroup);
    fetchContent(ageGroup);
  };
  
  const handleCustomAgeSearch = () => {
      const ageNum = parseInt(customAge, 10);
      if (!customAge || isNaN(ageNum) || ageNum <= 0 || ageNum > 100) {
          setError("Please enter a valid age.");
          return;
      }
      setSelectedAgeGroup(null);
      fetchContent(`${customAge} years old`);
  };

  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-slate-700">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-slate-900">{line.substring(2)}</h1>;
        if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        return <p key={index} className="my-2 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-2">Select an Age Group</h3>
        <div className="flex flex-wrap gap-2">
          {ageGroups.map((ageGroup) => (
            <button
              key={ageGroup}
              onClick={() => handleAgeGroupClick(ageGroup)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedAgeGroup === ageGroup
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {ageGroup}
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2">Or enter a specific age:</h4>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={customAge}
                    onChange={(e) => {
                        setCustomAge(e.target.value);
                        if (selectedAgeGroup) setSelectedAgeGroup(null);
                    }}
                    placeholder="e.g., 7"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Enter a specific age for your child"
                />
                <button
                    onClick={handleCustomAgeSearch}
                    disabled={loading || !customAge}
                    className="px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:bg-slate-400"
                >
                    Get Info
                </button>
            </div>
        </div>
      </div>

      {loading && <LoadingSpinner className="py-8" />}
      {error && !loading && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      
      {content && (
        <div className="bg-white p-5 rounded-xl shadow-sm prose prose-slate max-w-none">
          <div className="text-slate-600">{formatContent(content)}</div>
          
          {sources.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-slate-700">Sources:</h4>
              <ul className="list-disc pl-5 mt-2 text-sm">
                {sources.map((source, index) => (
                  source.web && <li key={index}><a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{source.web.title}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnScreen;