import { Platform } from '../services/video-downloader.service';

export interface PlatformConfig {
  label: string;
  color: string;
  pattern?: RegExp;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  tiktok:    { label: 'TikTok',    color: '#ff0050', pattern: /tiktok\.com|vm\.tiktok/i },
  youtube:   { label: 'YouTube',   color: '#ff0000', pattern: /youtube\.com|youtu\.be/i },
  instagram: { label: 'Instagram', color: '#e1306c', pattern: /instagram\.com/i },
  snapchat:  { label: 'Snapchat',  color: '#f5c518', pattern: /snapchat\.com/i },
  pinterest: { label: 'Pinterest', color: '#e60023', pattern: /pinterest\.com|pin\.it/i },
  unknown:   { label: 'Unknown',   color: '#8b5cf6' },
};
