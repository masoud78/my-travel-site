export interface MediaItem {
  id: string;
  filename: string;
  originalName?: string | null;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
}
