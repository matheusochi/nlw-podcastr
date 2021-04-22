export interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  file: {
    duration: number;
    durationAsString: string;
  }
  url: string;
  published_at: string;
}
