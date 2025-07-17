import React from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Film, FileText, XCircle } from 'lucide-react';

interface ExploreGridProps {
  items?: any[];
  loading?: boolean;
  error?: string | null;
  onClearSearch?: () => void;
  searchActive?: boolean;
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ items, loading, error, onClearSearch, searchActive }) => {
  // Show loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in w-full overflow-x-hidden">
        {[...Array(18)].map((_, i) => (
          <Card key={i} className="glassy-card rounded-2xl shadow-lg overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-10 h-3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <XCircle className="w-12 h-12 text-destructive" />
        <div className="text-lg font-semibold text-destructive">{error}</div>
        {searchActive && onClearSearch && (
          <button onClick={onClearSearch} className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold shadow hover:bg-muted/80 transition-colors">Clear Search</button>
        )}
      </div>
    );
  }

  // Show empty state
  if (items && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <FileText className="w-12 h-12 text-muted-foreground" />
        <div className="text-lg font-semibold text-muted-foreground">No results found.</div>
        {searchActive && onClearSearch && (
          <button onClick={onClearSearch} className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold shadow hover:bg-muted/80 transition-colors">Clear Search</button>
        )}
      </div>
    );
  }

  // Show search results if items provided
  if (items && items.length > 0) {
    return (
      <>
        {searchActive && onClearSearch && (
          <div className="flex justify-end mb-4">
            <button onClick={onClearSearch} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-semibold shadow hover:bg-muted/80 transition-colors">
              <XCircle className="w-5 h-5" /> Clear Search
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in w-full overflow-x-hidden">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <Card className="glassy-card rounded-2xl shadow-lg overflow-hidden group relative cursor-pointer hover:scale-[1.03] hover:shadow-2xl transition-all">
                {item.type === 'user' ? (
                  <div className="flex flex-col items-center justify-center p-6 gap-3">
                    <div className="relative">
                      <Image src={item.avatarUrl} alt={item.username} width={72} height={72} className="rounded-full object-cover border-4 border-primary shadow-lg" />
                      <span className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md"><User className="w-4 h-4" /></span>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-base text-foreground">{item.username}</div>
                      <div className="text-sm text-muted-foreground">{item.fullName}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.bio}</div>
                    </div>
                  </div>
                ) : item.type === 'post' ? (
                  <>
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image src={item.mediat?.[0]?.url || item.imageUrl || '/file.svg'} alt={item.caption || item.content || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-2 left-2 bg-background/80 rounded-full p-1 shadow"><FileText className="w-4 h-4 text-primary" /></span>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-sm text-foreground truncate">{item.caption || item.content}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Image src={item.user?.avatarUrl || '/default-avatar.png'} alt={item.user?.username || ''} width={24} height={24} className="rounded-full" />
                        <span className="text-xs text-muted-foreground">{item.user?.username}</span>
                        <span className="ml-auto text-xs text-primary font-bold">{item.likes?.length || item.likes || 0} ♥</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative aspect-square w-full overflow-hidden group">
                      <Image src={item.thumbnail || '/file.svg'} alt="Reel thumbnail" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-2 left-2 bg-background/80 rounded-full p-1 shadow"><Film className="w-4 h-4 text-primary" /></span>
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg"><Film className="w-6 h-6" /></span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-sm text-foreground truncate">{item.caption || item.caption || 'Reel'}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Image src={item.user?.avatarUrl || '/default-avatar.png'} alt={item.user?.username || ''} width={24} height={24} className="rounded-full" />
                        <span className="text-xs text-muted-foreground">{item.user?.username}</span>
                        <span className="ml-auto text-xs text-primary font-bold">{item.likes?.length || item.likes || 0} ♥</span>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </>
    );
  }

  // Default trending/discover content (could be replaced with real trending API)
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <Film className="w-12 h-12 text-primary" />
      <div className="text-lg font-semibold text-primary">Discover trending content!</div>
      <div className="text-base text-muted-foreground">Try searching for users, posts, or reels above.</div>
    </div>
  );
};

export default ExploreGrid; 