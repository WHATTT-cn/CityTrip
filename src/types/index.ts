export type Interest =
  | "展览"
  | "市集"
  | "演出"
  | "徒步"
  | "美食"
  | "手作"
  | "骑行"
  | "夜景";

export type Weather = "晴" | "阴" | "雨";

export interface Activity {
  id: string;
  title: string;
  category: Interest;
  /** 图片位：替换 src 即可更换配图（详见交付说明） */
  image: string;
  desc: string;
  location: string;
  distanceKm: number;
  price: number; // 人均，0 = 免费
  durationH: number;
  indoor: boolean;
  bestWeather: Weather[]; // 适合的天气
  groupFit: number[]; // 适合的同行人数区间 [min, max]
  tags: string[];
  rating: number;
  openTime: string;
}

export interface Prefs {
  interests: Interest[];
  budget: number; // 人均预算上限
  groupSize: number; // 同行人数（含自己）
  weather: Weather;
}

export interface TeamPost {
  id: string;
  activityId: string;
  creator: string;
  date: string;
  meetPoint: string;
  capacity: number;
  joined: number;
  note: string;
  members: string[];
  createdAt: number;
}

export interface CheckIn {
  id: string;
  activityId: string;
  date: string;
  rating: number;
  note: string;
  weather: Weather;
  createdAt: number;
}

export interface Guide {
  id: string;
  activityId: string;
  title: string;
  author: string;
  content: string;
  tips: string[];
  likes: number;
  likedByMe?: boolean;
  createdAt: number;
}
