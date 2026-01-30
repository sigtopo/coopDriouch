
import { Cooperative } from './types';

export const MOCK_COOPERATIVES: Cooperative[] = [
  {
    id: '1',
    name: 'تعاونية الخير للزيتون',
    description: 'تعاونية متخصصة في إنتاج وعصر زيت الزيتون البكر الممتاز وتسويقه محلياً ودولياً.',
    sector: 'زراعي',
    location: 'الجوف، السعودية',
    membersCount: 45,
    establishedDate: '2015-05-20',
    image: 'https://picsum.photos/seed/olive/600/400',
    rating: 4.8,
    tags: ['عضوي', 'تصدير', 'تمكين المزارعين']
  },
  {
    id: '2',
    name: 'جمعية أيادينا للحرف اليدوية',
    description: 'مجموعة من الحرفيات المبدعات في صناعة السجاد التقليدي والفخار اليدوي.',
    sector: 'حرفي',
    location: 'القاهرة، مصر',
    membersCount: 120,
    establishedDate: '2018-11-10',
    image: 'https://picsum.photos/seed/craft/600/400',
    rating: 4.5,
    tags: ['تراث', 'تمكين المرأة', 'شغل يدوي']
  },
  {
    id: '3',
    name: 'اتحاد مزارعي الحبوب الذهبية',
    description: 'تجمع تعاوني لإنتاج الحبوب النوعية وتوفير مستلزمات الإنتاج بأسعار عادلة.',
    sector: 'غذائي',
    location: 'إربد، الأردن',
    membersCount: 80,
    establishedDate: '2010-02-14',
    image: 'https://picsum.photos/seed/wheat/600/400',
    rating: 4.2,
    tags: ['أمن غذائي', 'تنمية ريفية']
  },
  {
    id: '4',
    name: 'تعاونية التقنية الرقمية',
    description: 'أول تعاونية برمجية تهدف لتقديم حلول تقنية مفتوحة المصدر ودعم الشباب في البرمجة.',
    sector: 'خدماتي',
    location: 'الدار البيضاء، المغرب',
    membersCount: 30,
    establishedDate: '2022-09-01',
    image: 'https://picsum.photos/seed/tech/600/400',
    rating: 4.9,
    tags: ['برمجة', 'ابتكار', 'تدريب']
  },
  {
    id: '5',
    name: 'جمعية النحل الأبيض',
    description: 'إنتاج العسل الطبيعي وتربية النحل بطرق حديثة ومستدامة.',
    sector: 'زراعي',
    location: 'أبها، السعودية',
    membersCount: 55,
    establishedDate: '2019-07-22',
    image: 'https://picsum.photos/seed/honey/600/400',
    rating: 4.7,
    tags: ['عسل سدر', 'طبيعي 100%']
  }
];

export const SECTORS = ['الكل', 'زراعي', 'صناعي', 'حرفي', 'خدماتي', 'غذائي', 'تعليمي'];
