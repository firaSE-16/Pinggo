import { create } from "zustand";

type StoryState = {
  currentIndex: number;
  liked: string;
  next: () => void;
  prev: () => void;
  setLiked: (id: string) => void;
  setCurrentIndex: (index: number) => void;
};

export const useStoryStore = create<StoryState>((set) => ({
  currentIndex: 0,
  liked: '',

  next: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),

  prev: () =>
    set((state) => ({
      currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : 0,
    })),

  setLiked: (id: string) => set({ liked: id }),

  setCurrentIndex: (index: number) => set({ currentIndex: index }),
}));
