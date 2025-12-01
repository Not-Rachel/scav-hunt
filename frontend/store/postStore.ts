import { create } from 'zustand';

export type PostProps = {
  id: number;
  author: number;
  author_username: string;
  title: string;
  content: string;
  found_item: string;
  image: Blob;
};

interface postState {
  posts: PostProps[];
  setPosts: (posts: PostProps[]) => void;
  clearPosts: () => void;
  addPost: (post: PostProps) => void;
  updatePost: (updatedPost: PostProps) => void;
  removePost: (id: number) => void;
}

export const usePostStore = create<postState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts: posts }),
  clearPosts: () => set({ posts: [] }),
  addPost: (post: PostProps) => set((state) => ({ posts: [...state.posts, post] })),

  updatePost: (updatedPost: PostProps) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    })),

  removePost: (id: number) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
}));
