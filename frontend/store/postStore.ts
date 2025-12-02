import { create } from 'zustand';

export type PostProps = {
  id: number;
  author: number;
  author_username: string;
  title: string;
  content: string;
  found_item: string;
  image: string;
  created_at: string;
};

interface postState {
  posts: PostProps[];
  setPosts: (posts: PostProps[]) => void;
  clearPosts: () => void;
  addPost: (post: PostProps) => void;
  updatePost: (updatedPost: PostProps) => void;
  removePost: (id: number) => void;
  getProfilePosts: (user_id: number) => PostProps[];
  getFeedPosts: (user_id: number) => PostProps[];
}

export const usePostStore = create<postState>((set, get) => ({
  posts: [],
  setPosts: (posts) =>
    set({
      posts: [...posts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }),
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
  getProfilePosts: (user_id: number) => get().posts.filter((p) => p.author == user_id),
  getFeedPosts: (user_id: number) => get().posts.filter((p) => p.author != user_id),
}));
