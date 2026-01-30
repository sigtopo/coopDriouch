
export type Sector = 'زراعي' | 'صناعي' | 'حرفي' | 'خدماتي' | 'غذائي' | 'تعليمي';

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  location: string;
  membersCount: number;
  establishedDate: string;
  image: string;
  rating: number;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
