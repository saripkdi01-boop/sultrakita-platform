export const FEED_FILTERS = ['recommended', 'following', 'latest', 'property', 'video'] as const;
export type FeedFilter = (typeof FEED_FILTERS)[number];

export type FeedItemType =
  | 'post'
  | 'reel'
  | 'property'
  | 'marketplace_listing'
  | 'group_activity'
  | 'profile_activity'
  | 'partner_activity'
  | 'referral_milestone'
  | 'public_chat_activity'
  | 'platform_announcement';

export type FeedVisibility = 'public' | 'followers' | 'group' | 'private';

export type FeedAuthor = {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl: string | null;
};

export type FeedMedia = {
  url: string;
  kind: 'image' | 'video';
};

export type FeedEngagement = {
  likeCount: number | null;
  commentCount: number | null;
  shareCount: number | null;
  saveCount: number | null;
};

export type FeedViewerState = {
  liked: boolean | null;
  saved: boolean | null;
  followingActor: boolean | null;
};

export type FeedRecommendation = {
  reason: 'following' | 'nearby' | 'group' | 'category' | 'popular' | 'fresh';
} | null;

export type FeedItem = {
  id: string;
  type: FeedItemType;
  actor: FeedAuthor;
  content: string;
  media: FeedMedia[];
  createdAt: string;
  location: string | null;
  mood: string | null;
  taggedUserCount: number;
  visibility: FeedVisibility;
  engagement: FeedEngagement;
  viewer: FeedViewerState;
  recommendation: FeedRecommendation;
};

export type FeedPageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

export type FeedPage = {
  data: FeedItem[];
  pageInfo: FeedPageInfo;
  rankingVersion: 'baseline-v1';
  filter: FeedFilter;
  contractVersion: 'suki-feed-v1';
};

export type FeedError = {
  error: string;
};

export type FeedCursor = {
  v: 1;
  filter: FeedFilter;
  createdAt: string;
  id: string;
};
