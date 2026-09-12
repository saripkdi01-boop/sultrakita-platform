export type VisibilityLevel = 'public' | 'followers' | 'private';
export type VisibilitySettings = Record<string, VisibilityLevel>;

export const defaultVisibilitySettings: VisibilitySettings = {
  full_name: 'public',
  username: 'public',
  bio: 'public',
  phone: 'followers',
  email: 'private',
  location: 'public',
  interests: 'public',
  online_status: 'followers',
  avatar: 'public',
};
