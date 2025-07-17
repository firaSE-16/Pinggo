import React, { useState } from 'react';
import { Search, Filter, Shuffle } from 'lucide-react';
import { Input } from './ui/input';

const SEARCH_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'username', label: 'Users' },
  { value: 'posts', label: 'Posts' },
  { value: 'reels', label: 'Reels' },
];

const FloatingActionBar = ({ onSearch }: { onSearch?: (query: string, type: string) => void }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2 && onSearch) {
      onSearch(searchQuery, searchType);
      setShowSearch(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 md:gap-6 items-end md:items-end">
      <button
        className="glassy-card rounded-full p-4 shadow-xl hover:scale-110 hover:shadow-2xl transition-all flex items-center justify-center text-primary bg-background/80 backdrop-blur border border-border/40"
        onClick={() => setShowSearch(true)}
        aria-label="Search"
      >
        <Search className="w-6 h-6" />
      </button>
      <button
        className="glassy-card rounded-full p-4 shadow-xl hover:scale-110 hover:shadow-2xl transition-all flex items-center justify-center text-primary bg-background/80 backdrop-blur border border-border/40"
        onClick={() => setShowFilter(true)}
        aria-label="Filter"
      >
        <Filter className="w-6 h-6" />
      </button>
      <button
        className="glassy-card rounded-full p-4 shadow-xl hover:scale-110 hover:shadow-2xl transition-all flex items-center justify-center text-primary bg-background/80 backdrop-blur border border-border/40"
        onClick={() => alert('Shuffle/Discover!')}
        aria-label="Shuffle"
      >
        <Shuffle className="w-6 h-6" />
      </button>
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowSearch(false)}>
          <form
            className="bg-background rounded-2xl p-8 shadow-2xl min-w-[320px] flex flex-col gap-4 w-full max-w-md"
            onClick={e => e.stopPropagation()}
            onSubmit={handleSearch}
          >
            <h2 className="text-xl font-bold mb-2">Search</h2>
            <Input
              autoFocus
              placeholder="Search users, posts, reels..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-12 text-lg rounded-xl shadow-md"
            />
            <div className="flex gap-2">
              {SEARCH_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${searchType === type.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/80 text-foreground border-border/40 hover:bg-primary/10'}`}
                  onClick={() => setSearchType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-base shadow hover:bg-primary/90 transition-colors"
              disabled={searchQuery.trim().length < 2}
            >
              <Search className="inline w-5 h-5 mr-1" /> Search
            </button>
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-lg bg-muted text-foreground font-semibold text-base shadow hover:bg-muted/80 transition-colors"
              onClick={() => setShowSearch(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {/* Filter Modal (placeholder) */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowFilter(false)}>
          <div className="bg-background rounded-2xl p-8 shadow-2xl min-w-[320px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Filter (Coming Soon)</h2>
            <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground" onClick={() => setShowFilter(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingActionBar; 