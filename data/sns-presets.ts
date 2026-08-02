export interface SnsPreset {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
}

export const snsPresets: SnsPreset[] = [
  { id: "instagram-1-1", platform: "Instagram", label: "正方形（1:1）", width: 1080, height: 1080 },
  { id: "instagram-4-5", platform: "Instagram", label: "縦型（4:5）", width: 1080, height: 1350 },
  { id: "instagram-story", platform: "Instagram", label: "ストーリー", width: 1080, height: 1920 },
  { id: "tiktok", platform: "TikTok", label: "動画カバー", width: 1080, height: 1920 },
  { id: "youtube", platform: "YouTube", label: "サムネイル", width: 1280, height: 720 },
  { id: "x-post", platform: "X", label: "投稿画像", width: 1600, height: 900 },
  { id: "line", platform: "LINE", label: "トーク背景", width: 1080, height: 1920 },
];
