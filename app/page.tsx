"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Map,
  Store,
  Calendar,
  Search,
  MapPin,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  Radio,
  Car,
  Clock,
  Navigation,
  Info,
  Globe,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ticket,
  Image as ImageIcon,
} from "lucide-react";

// --- 統一マップ記号コンポーネント ---

// トイレアイコン（男女共用）
const ToiletIcon = () => (
  <div className="bg-slate-50 border-2 border-slate-700 px-1 py-0.5 rounded-md flex items-center justify-center gap-1 shadow-sm w-[42px] h-[36px] select-none shrink-0">
    <svg className="w-3.5 h-4 fill-blue-600" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M9 8h6v7h-1.5v6h-3v-6H9V8z" />
    </svg>
    <div className="w-[1px] h-4 bg-slate-300" />
    <svg className="w-3.5 h-4 fill-rose-500" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M12 8c-2 0-3.5 1-4 3l-1.5 5h3v5h5v-5h3l-1.5-5c-.5-2-2-3-4-3z" />
    </svg>
  </div>
);

// 女子専用トイレアイコン
const FemaleToiletIcon = () => (
  <div className="bg-slate-50 border-2 border-slate-700 px-1.5 py-0.5 rounded-md flex items-center justify-center shadow-sm w-[32px] h-[36px] select-none shrink-0">
    <svg className="w-4 h-4 fill-rose-500" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M12 8c-2 0-3.5 1-4 3l-1.5 5h3v5h5v-5h3l-1.5-5c-.5-2-2-3-4-3z" />
    </svg>
  </div>
);

// 男子専用トイレアイコン
const MaleToiletIcon = () => (
  <div className="bg-slate-50 border-2 border-slate-700 px-1.5 py-0.5 rounded-md flex items-center justify-center shadow-sm w-[32px] h-[36px] select-none shrink-0">
    <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M9 8h6v7h-1.5v6h-3v-6H9V8z" />
    </svg>
  </div>
);

// 階段アイコン
const StairsIcon = () => (
  <div className="bg-slate-50 border-2 border-slate-700 rounded-md p-1 flex items-center justify-center w-[36px] h-[36px] shadow-sm select-none shrink-0">
    <svg
      className="w-6 h-6 text-slate-800"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19h4v-4h4v-4h4V7h4" />
    </svg>
  </div>
);

const RedTriangle = () => (
  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-red-600 drop-shadow-sm select-none" />
);

// 通行禁止（車両進入禁止）標識アイコン
const NoEntrySign = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} select-none shrink-0`}>
    <circle cx="50" cy="50" r="48" fill="#E53935" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" strokeWidth="3" />
    <rect x="10" y="41" width="80" height="18" fill="#FFFFFF" rx="1" />
  </svg>
);

// 順路矢印アイコン
const PathArrow = ({
  direction = "up",
  className = "w-9 h-9",
}: {
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}) => {
  const rotation = {
    up: "rotate-0",
    right: "rotate-90",
    down: "rotate-180",
    left: "-rotate-90",
  }[direction];

  return (
    <svg
      className={`${className} ${rotation} filter drop-shadow-sm select-none shrink-0`}
      viewBox="0 0 24 32"
      fill="none"
      stroke="#e11d48"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="30" x2="12" y2="3" />
      <polyline points="4 11 12 3 20 11" />
    </svg>
  );
};

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// 出店・企画・施設データ型
interface StallItem {
  id: number;
  title: string;
  category: "模擬店" | "クラス企画" | "部活動企画" | "実行委員会企画" | "キッチンカー" | "校内施設・その他";
  grade: string;
  dept: string;
  location: string;
  zoneId: string;
  floor?: "1階" | "2階" | "3階";
  roomNo?: string;
  price?: string;
  description: string;
  icon: string;
  instagram?: string;
  menu?: string[];
  imageUrl?: string;
  bannerTitle?: string;
  bannerSub?: string;
  bannerColor?: string;
}

// イベントスケジュールデータ型
interface ScheduleItem {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  title: string;
  org: string;
  desc: string;
  tag: string;
  icon: string;
  imageUrl?: string;
}

interface StageItem {
  stageId: string;
  stageName: string;
  location: string;
  locationZoneId: string;
  schedule: ScheduleItem[];
}

interface EventDayData {
  day: number;
  dateLabel: string;
  dateStr: string;
  month: number;
  dayOfMonth: number;
  stages: StageItem[];
}

// 全出店・企画・施設データ
const STALLS_DATA: StallItem[] = [
  // --- 1号館 (bldg1) 1階 ---
  {
    id: 1,
    title: "ほっとサンド",
    category: "模擬店",
    grade: "1-1",
    dept: "1年1組",
    location: "1号館 1階 111教室",
    zoneId: "bldg1",
    floor: "1階",
    roomNo: "111教室",
    price: "200円",
    description: "1-1による熱々で外はサクッ、中はジュワッ！香ばしい絶品ほっとサンド！（各200円）",
    icon: "🥪",
    imageUrl: "/1-1.png",
    menu: ["チョコ (200円)", "ハムサンド (200円)", "ピザ (200円)"],
    bannerTitle: "1-1 ホットサンド",
    bannerSub: "単価 200円！MENU: チョコ・ハムサンド・ピザ",
    bannerColor: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    title: "ドリンク",
    category: "模擬店",
    grade: "1-2",
    dept: "1年2組",
    location: "1号館 1階 112教室",
    zoneId: "bldg1",
    floor: "1階",
    roomNo: "112教室",
    price: "200円",
    description: "平成カフェ♡ タピオカ＆1-2がお届けする冷たくてシュワっと美味しい各種ソフトドリンク！（200円）",
    icon: "🍹",
    imageUrl: "/1-2.png",
    menu: ["タピオカ (200円)", "ソフトドリンク各種 (200円)"],
    bannerTitle: "1年2組 平成カフェ",
    bannerSub: "単価 200円！タピオカ＆ドリンク カワイイょ♡",
    bannerColor: "from-pink-400 to-rose-500",
  },
  {
    id: 13,
    title: "ホスト (CLUB CROWN)",
    category: "クラス企画",
    grade: "4M",
    dept: "4年 機械コース (4M)",
    location: "1号館 1階 113教室",
    zoneId: "bldg1",
    floor: "1階",
    roomNo: "113教室",
    price: "100円",
    description: "CLUB CROWNへようこそ！ハマりすぎ注意！？沼る覚悟でお越しください･･･（100円）",
    icon: "🌹",
    imageUrl: "/4M.png",
    menu: ["ブルーハワイソーダ (100円)", "メロンソーダ (100円)", "いちごソーダ (100円)", "カルピス (100円)"],
    bannerTitle: "CLUB CROWN (4M)",
    bannerSub: "単価 100円！ハマりすぎ注意!? 沼る覚悟でお越しください･･･",
    bannerColor: "from-slate-900 via-purple-950 to-slate-900",
  },

  // --- 1号館 (bldg1) 2階 ---
  {
    id: 3,
    title: "わたあめ",
    category: "模擬店",
    grade: "1-3",
    dept: "1年3組",
    location: "1号館 2階 121教室",
    zoneId: "bldg1",
    floor: "2階",
    roomNo: "121教室",
    price: "100円",
    description: "1-3作！フワフワ甘くて可愛いビッグわたあめ♡（100円）",
    icon: "🍥",
    imageUrl: "/1-3.png",
    menu: ["わたあめ (100円)"],
    bannerTitle: "1-3 わたあめ♡",
    bannerSub: "単価 100円！フワフワ甘くて可愛いビッグわたあめ！",
    bannerColor: "from-pink-300 to-purple-400",
  },
  {
    id: 4,
    title: "クレープ",
    category: "模擬店",
    grade: "1-4",
    dept: "1年4組",
    location: "1号館 2階 122教室",
    zoneId: "bldg1",
    floor: "2階",
    roomNo: "122教室",
    price: "200円",
    description: "1の4が新しい風吹かすッ！極上のクレープを味わいたい方は1号館122教室へ･･･（200円）",
    icon: "🥞",
    imageUrl: "/1-4.png",
    menu: ["手作りクレープ (200円)"],
    bannerTitle: "1-4 クレープ",
    bannerSub: "単価 200円！1の4が新しい風吹かすッ！極上のクレープ！",
    bannerColor: "from-amber-400 to-yellow-500",
  },
  {
    id: 15,
    title: "カジノ (CASINO)",
    category: "クラス企画",
    grade: "4I",
    dept: "4年 情報コース (4I)",
    location: "1号館 2階 123教室",
    zoneId: "bldg1",
    floor: "2階",
    roomNo: "123教室",
    price: "100円",
    description: "4I特製カジノ！トランプ、UNO、ダーツ、人狼など本格的なゲームでスリリングな心理戦を楽しもう！（100円）",
    icon: "🎲",
    imageUrl: "/4I.png",
    menu: ["トランプ", "UNO", "ダーツ", "人狼ゲーム"],
    bannerTitle: "4I CASINO",
    bannerSub: "単価 100円！TRUMP / UNO / DARTS / WERE WOLF",
    bannerColor: "from-red-700 to-slate-900",
  },
  {
    id: 302,
    title: "美術写真部（作品展示・看板展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "美術写真部",
    location: "1号館 2階 12Fゼミ室",
    zoneId: "bldg1",
    floor: "2階",
    roomNo: "12Fゼミ室",
    description: "絵画・写真作品や高専祭を彩る各種看板作品の展示。",
    icon: "🖼️",
    imageUrl: "/美術写真.png",
    bannerTitle: "美術写真部 展示",
    bannerSub: "絵画・写真作品＆高専祭看板展示",
    bannerColor: "from-indigo-500 to-purple-600",
  },

  // --- 1号館 (bldg1) 3階 ---
  {
    id: 10,
    title: "ゲームカフェ",
    category: "クラス企画",
    grade: "3E",
    dept: "3年 電気・電子コース (3E)",
    location: "1号館 3階 131教室",
    zoneId: "bldg1",
    floor: "3階",
    roomNo: "131教室",
    price: "200円",
    description: "ゲームカフェへようこそ！対戦ゲームを楽しみながら冷たいドリンクでリフレッシュ！（200円）",
    icon: "🎮",
    imageUrl: "/3E.png",
    menu: ["ジュース各種 (200円)"],
    bannerTitle: "3E ゲームカフェ",
    bannerSub: "単価 200円！ゲームカフェへようこそ！",
    bannerColor: "from-cyan-500 to-blue-600",
  },
  {
    id: 12,
    title: "喫茶店 (3B)",
    category: "クラス企画",
    grade: "3B",
    dept: "3年 生物・化学コース (3B)",
    location: "1号館 3階 132教室",
    zoneId: "bldg1",
    floor: "3階",
    roomNo: "132教室",
    price: "200円",
    description: "3B喫茶店✿ たくさんのご来店お待ちしております！ゆったり寛げる空間でおもてなし。（200円）",
    icon: "☕",
    imageUrl: "/3B.png",
    bannerTitle: "3B 喫茶店 ✿",
    bannerSub: "単価 200円！たくさんのご来店お待ちしております✿",
    bannerColor: "from-emerald-500 to-teal-700",
  },
  {
    id: 11,
    title: "バー (3I Bar)",
    category: "クラス企画",
    grade: "3I",
    dept: "3年 情報コース (3I)",
    location: "1号館 3階 133教室",
    zoneId: "bldg1",
    floor: "3階",
    roomNo: "133教室",
    price: "200円",
    description: "喉が渇いたときや休憩したいときにはぜひ来てください！おしゃれな雰囲気が魅力のノンアルコールバー！（200円）",
    icon: "🍸",
    imageUrl: "/3I.png",
    bannerTitle: "3I Bar",
    bannerSub: "単価 200円！喉が渇いたときや休憩したいときにぜひ！",
    bannerColor: "from-amber-700 to-yellow-900",
  },
  {
    id: 301,
    title: "天文部（写真展示・プラネタリウム）",
    category: "部活動企画",
    grade: "部活",
    dept: "天文部",
    location: "1号館 3階 13Fゼミ室・小会議室",
    zoneId: "bldg1",
    floor: "3階",
    roomNo: "13Fゼミ室",
    description: "プラネタリウム（13Fゼミ室）で星空を体験！小会議室では天体写真の展示＆パンフレット配布を実施中！",
    icon: "🌌",
    imageUrl: "/天文部.png",
    bannerTitle: "天文部 Astronomy Club",
    bannerSub: "プラネタリウム & 天体写真展示",
    bannerColor: "from-slate-900 via-indigo-950 to-blue-900",
  },
  {
    id: 310,
    title: "ボードゲームブース（ボードゲームサークル有志）",
    category: "部活動企画",
    grade: "有志",
    dept: "ボードゲームサークル有志",
    location: "1号館 3階 中会議室",
    zoneId: "bldg1",
    floor: "3階",
    roomNo: "中会議室",
    description: "個人から提供のボードゲームをはじめ、トランプ・将棋・チンチロ・なんじゃもんじゃ・ダーツ等を多数用意！休憩がてら気軽に遊びに来てください！",
    icon: "🎲",
    menu: ["ボードゲーム", "トランプ", "将棋", "チンチロ", "なんじゃもんじゃ", "ダーツ"],
    bannerTitle: "ボードゲームブース",
    bannerSub: "休憩がてらにボードゲームはどうですか?",
    bannerColor: "from-indigo-600 to-blue-800",
  },

  // --- 合同講義室（1号館内） ---
  {
    id: 401,
    title: "今日、ゲームになりました。",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "1号館 2階 合同講義室",
    zoneId: "bldg1",
    floor: "2階",
    roomNo: "合同講義室",
    description: "大画面での白熱ゲームトーナメント＆対戦アトラクション！（※10/23(金)開催）",
    icon: "🎮",
  },

  // --- 第一体育館 (gym1) ---
  {
    id: 5,
    title: "餃子 (餃子 木村屋)",
    category: "模擬店",
    grade: "2M",
    dept: "2年 機械コース (2M)",
    location: "第一体育館",
    zoneId: "gym1",
    price: "100円",
    description: "2M特製！餃子 木村屋 100円！鉄板で一気に焼き上げるパリッとジューシーな絶品焼き餃子！",
    icon: "🥟",
    imageUrl: "/2M.png",
    menu: ["特製焼き餃子 (100円)"],
    bannerTitle: "餃子 木村屋 (2M)",
    bannerSub: "100円！鉄板で一気に焼き上げる絶品餃子！",
    bannerColor: "from-red-600 to-amber-600",
  },
  {
    id: 6,
    title: "ポップコーン (2-E)",
    category: "模擬店",
    grade: "2E",
    dept: "2年 電気・電子コース (2E)",
    location: "第一体育館",
    zoneId: "gym1",
    price: "100円",
    description: "2-E はじめました ポップコーン！これ食べて高専祭、はじけてみない？おいしい間食にどうぞ！（100円）",
    icon: "🍿",
    imageUrl: "/2E.png",
    menu: ["フレーバーポップコーン (100円)"],
    bannerTitle: "2-E ポップコーン",
    bannerSub: "単価 100円！これ食べて高専祭、はじけてみない？",
    bannerColor: "from-yellow-400 to-orange-500",
  },
  {
    id: 7,
    title: "玉こん (2I)",
    category: "模擬店",
    grade: "2I",
    dept: "2年 情報コース (2I)",
    location: "第一体育館",
    zoneId: "gym1",
    price: "100円",
    description: "小腹が空いたら2I玉こん！秘伝の出汁がしっかり染み込んだ熱々の山形名物・玉こんにゃく！（100円）",
    icon: "🍡",
    imageUrl: "/2I.png",
    menu: ["山形名物 玉こんにゃく (100円)"],
    bannerTitle: "2I 玉こん",
    bannerSub: "単価 100円！小腹が空いたら出汁の染みたあつあつ玉こん！",
    bannerColor: "from-amber-600 to-orange-700",
  },
  {
    id: 8,
    title: "焼き鳥 (2B)",
    category: "模擬店",
    grade: "2B",
    dept: "2年 生物・化学コース (2B)",
    location: "第一体育館",
    zoneId: "gym1",
    price: "200円",
    description: "2B香ばしく焼き上げる秘伝タレ＆塩のやみつき焼き鳥！2本200円！（串もも・つくね・とりかわ）",
    icon: "🍢",
    imageUrl: "/2B.png",
    menu: ["串もも (2本200円)", "つくね (2本200円)", "とりかわ (2本200円)"],
    bannerTitle: "2B やきとり",
    bannerSub: "単価 2本200円！串もも・つくね・とりかわ 香ばしいやみつき味！",
    bannerColor: "from-orange-600 to-red-700",
  },

  // --- ステージ企画 ---
  {
    id: 402,
    title: "2026 KOSEN 歌謡祭 秋",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "青春の1ページに、忘れられない思い出を。心を込めた歌声で、最高の瞬間を刻もう!",
    icon: "🎤",
    imageUrl: "/歌謡祭.png",
  },
  {
    id: 403,
    title: "あつまれ きんにくの森 (腕立て選手権)",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "試されるのは、筋力と精神力。己の限界に挑み、最後まで立ち向かえ!",
    icon: "💪",
    imageUrl: "/あつまれきんにくの森.png",
  },
  {
    id: 404,
    title: "カリモノ競争",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館周辺",
    zoneId: "gym1",
    description: "勝負を決めるのは、走力とひらめき。仲間とつなぐバトン、最後に笑うのはどのクラスか?",
    icon: "🏃",
    imageUrl: "/カリモノ競争.png",
  },
  {
    id: 405,
    title: "鶴専-1グランプリ",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "高専祭史上初の漫才企画! 笑いの準備はできているか? 個性豊かなコンビたちが繰り広げる!",
    icon: "🎙️",
    imageUrl: "/鶴専-1グランプリ.png",
  },
  {
    id: 406,
    title: "DoKa Project",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "高専祭の最後を締めくくるダンス企画! 音楽にのせて最高のパフォーマンスを!",
    icon: "💃",
    imageUrl: "/DoKa Project.png",
  },

  // --- 音楽部プレハブ (prefab) ---
  {
    id: 303,
    title: "音部ライブ（音楽部）",
    category: "部活動企画",
    grade: "部活",
    dept: "音楽部",
    location: "音楽部プレハブ / 第一体育館",
    zoneId: "prefab",
    description: "色が重なれば、楽しさも広がる。軽音部ならではの生演奏をお楽しみください!（YOUTH RIOT FES VOL.4）",
    icon: "🎸",
    imageUrl: "/音楽部.png",
    bannerTitle: "YOUTH RIOT FES VOL.4",
    bannerSub: "色が重なれば、楽しさも広がる。音楽部ライブ!",
    bannerColor: "from-red-600 via-purple-700 to-slate-900",
  },

  // --- 7号館 (bldg7) ---
  {
    id: 9,
    title: "お化け屋敷 (3M)",
    category: "クラス企画",
    grade: "3M",
    dept: "3年 機械コース (3M)",
    location: "7号館 (711・712教室)",
    zoneId: "bldg7",
    roomNo: "711",
    price: "100円",
    description: "その教室に入ってはいけなかった。呪われた教室。教室から、逃げられるか。3M教室で恐怖の扉を、開け。（100円）",
    icon: "👻",
    imageUrl: "/3M.png",
    bannerTitle: "呪われた教室 お化け屋敷 (3M)",
    bannerSub: "単価 100円！その教室に入ってはいけなかった。恐怖の扉を開け。",
    bannerColor: "from-purple-900 via-slate-900 to-red-950",
  },
  {
    id: 14,
    title: "キッキングスナイパー (4E)",
    category: "クラス企画",
    grade: "4E",
    dept: "4年 電気・電子コース (4E)",
    location: "7号館 722教室",
    zoneId: "bldg7",
    roomNo: "722",
    price: "100円",
    description: "4E動くターゲットを狙って力強くシュート！高得点を狙って豪華景品をゲット！（100円）",
    icon: "⚽",
    imageUrl: "/4E.png",
    bannerTitle: "キッキングスナイパー (4E)",
    bannerSub: "単価 100円！動くターゲットを狙ってシュート！豪華景品をゲット！",
    bannerColor: "from-emerald-600 to-green-700",
  },
  {
    id: 304,
    title: "AMデザイン部（3Dプリンタ体験・展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "AMデザイン部",
    location: "7号館 731教室",
    zoneId: "bldg7",
    roomNo: "731教室",
    description: "AM DESIGN CLUB TRIAL SESSION！デザコン出場歴代作品展示、3DCAD＆3Dプリンタ体験！ミニオブジェのプレゼントも！",
    icon: "𖤤",
    imageUrl: "/AMデザイン.png",
    bannerTitle: "AM DESIGN CLUB",
    bannerSub: "3DCAD & 3Dプリンタ体験！ミニオブジェプレゼント！",
    bannerColor: "from-sky-600 to-blue-700",
  },
  {
    id: 305,
    title: "5B 研究発表（ポスター）",
    category: "部活動企画",
    grade: "5B",
    dept: "5年 生物・化学コース",
    location: "7号館 721教室",
    zoneId: "bldg7",
    roomNo: "721教室",
    description: "5Bによる先進的な研究成果のポスター発表展示。",
    icon: "🔬",
  },
  {
    id: 306,
    title: "E.S.S. (Little World)",
    category: "部活動企画",
    grade: "部活",
    dept: "E.S.S.",
    location: "7号館 732教室",
    zoneId: "bldg7",
    roomNo: "732教室",
    description: "ESS Little World！留学生紹介ポスター、世界のことを知るポスター、海外紹介Vlogで世界の学生生活をのぞいてみよう！",
    icon: "𔢤",
    imageUrl: "/ESS.png",
    bannerTitle: "E.S.S. Little World",
    bannerSub: "留学生紹介ポスター & 海外生活Vlog展示",
    bannerColor: "from-sky-500 to-teal-600",
  },

  // --- 8号館 (bldg8) ---
  {
    id: 308,
    title: "吹奏楽部 ミニコンサート",
    category: "部活動企画",
    grade: "部活",
    dept: "吹奏楽部",
    location: "8号館 2階 大講義室",
    zoneId: "bldg8",
    floor: "2階",
    roomNo: "大講義室",
    description: "吹奏楽部によるオープニング演奏（感電等）＆ミニコンサート（嵐メドレー等）！素敵な演奏をお楽しみください！（10時〜11時）",
    icon: "🎷",
    imageUrl: "/吹奏楽部.png",
    bannerTitle: "吹奏楽部 ミニコンサート",
    bannerSub: "感電 / 嵐メドレー等 素敵な演奏をお届け！",
    bannerColor: "from-amber-500 to-yellow-600",
  },
  {
    id: 503,
    title: "学校説明会",
    category: "校内施設・その他",
    grade: "案内",
    dept: "広報・入試",
    location: "8号館 2階 大講義室",
    zoneId: "bldg8",
    floor: "2階",
    roomNo: "大講義室",
    description: "中学生・保護者の皆様に向けた学校説明会（10/24 13時受付開始、13時30分〜15時）。高専生活や入試など何でもご相談ください。",
    icon: "🏫",
  },

  // --- 4号館 (bldg4) ---
  {
    id: 307,
    title: "競技かるた体験会（畳の上の格闘技）",
    category: "部活動企画",
    grade: "有志",
    dept: "競技かるた体験会",
    location: "4号館 411教室",
    zoneId: "bldg4",
    roomNo: "411",
    description: "「畳の上の格闘技」と呼ばれる競技かるた！午前の部(10:00~11:15)ガチ試合観戦、午後の部(13:15~14:30)体験会開催！初心者歓迎！",
    icon: "",
    imageUrl: "/カルタ.png",
    bannerTitle: "競技かるた体験会",
    bannerSub: "畳の上の格闘技！ガチ試合見学 & 初心者体験会",
    bannerColor: "from-emerald-700 to-green-900",
  },

  // --- 総合メディアセンター (media_center) ---
  {
    id: 16,
    title: "格付けチェック (4B)",
    category: "クラス企画",
    grade: "4B",
    dept: "4年 生物・化学コース (4B)",
    location: "総合メディアセンター 2階 マルチメディア教室",
    zoneId: "media_center",
    floor: "2階",
    roomNo: "マルチメディア教室",
    price: "200円",
    description: "4B格付けチェック！あなたは本物をみぬけるか？一流！味覚・視覚・知識に挑戦！（200円）",
    icon: "🍷",
    imageUrl: "/4B.png",
    bannerTitle: "4B 格付けチェック",
    bannerSub: "単価 200円！あなたは本物を見抜けるか？一流を目指せ！",
    bannerColor: "from-purple-800 to-amber-600",
  },
  {
    id: 309,
    title: "ロボット技術研究部（高専ロボコン展示＆体験）",
    category: "部活動企画",
    grade: "部活",
    dept: "ロボット技術研究部",
    location: "総合メディアセンター 1階 多目的交流室",
    zoneId: "media_center",
    floor: "1階",
    roomNo: "多目的交流室",
    description: "高専ロボコン「ぞうきんとうてきせんしゅけん」出場ロボット展示！さらにスイカ割りミニゲームロボットの操作体験もあります！",
    icon: "🤖",
    imageUrl: "/ロボコン.png",
    bannerTitle: "高専ロボコン ロボ展示 & 操作体験",
    bannerSub: "NHK高専ロボコン出場機展示 & スイカ割り体験",
    bannerColor: "from-green-600 to-emerald-800",
  },
  {
    id: 204,
    title: "デジタルサロン",
    category: "校内施設・その他",
    grade: "施設",
    dept: "情報基盤",
    location: "総合メディアセンター 1階",
    zoneId: "media_center",
    floor: "1階",
    roomNo: "デジタルサロン",
    description: "デジタルコンテンツ展示およびフリー閲覧スペースです。",
    icon: "💻",
  },
  {
    id: 205,
    title: "図書館",
    category: "校内施設・その他",
    grade: "施設",
    dept: "図書",
    location: "総合メディアセンター 2階",
    zoneId: "media_center",
    floor: "2階",
    roomNo: "図書館",
    description: "図書閲覧・学習スペースです。",
    icon: "📚",
  },

  // --- 学生昇降口・広場 (entrance) ---
  {
    id: 407,
    title: "高専生の主張",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "学生昇降口",
    zoneId: "entrance",
    description: "胸に秘めた思いを、ここで大放出! 普段は言えない熱い思いを、今こそ叫べ",
    icon: "📢",
    imageUrl: "/高専生の主張.png",
  },

  // --- キッチンカー (entrance) ---
  {
    id: 101,
    title: "中華そば雲ノ糸 / ラーメンもっけだの",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "山形で行列ができる人気ラーメン店2台が同時出店！「雲ノ糸」の煮干しラーメン＆「もっけだの」のこだわりラーメンをお楽しみください！",
    icon: "🍜",
    instagram: "https://www.instagram.com/mokkedanonoodle/",
    menu: ["煮干しラーメン", "こだわりラーメン"],
  },
  {
    id: 102,
    title: "祇園はんなりCafé",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "ゆめかわで世界一可愛い♡ユニコーンベビーカステラ「coco Claire」登場！山形県産つや姫米粉使用で冷めても“ふわっふわ＆もちもち”！",
    icon: "🧁",
    instagram: "https://www.instagram.com/gion_hannari_cafe/",
    menu: ["ユニコーンベビーカステラ", "本わらび餅"],
  },
  {
    id: 103,
    title: "フェリチタプラス",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "「腸活」テーマのヘルシーメニュー！白砂糖・無添加濃厚スムージー、大豆ミート本格ガパオライス、罪悪感なし人気スイーツ！",
    icon: "🥤",
    instagram: "https://www.instagram.com/felicitaplus.sakata/",
    menu: ["濃厚スムージー", "ガパオライス", "スイーツ"],
  },

  // --- 金券販売 (ticket) ---
  {
    id: 501,
    title: "金券販売（高専銀行券）",
    category: "校内施設・その他",
    grade: "本部",
    dept: "実行委員会",
    location: "1号館 1階 交流ラウンジ",
    zoneId: "ticket",
    floor: "1階",
    roomNo: "金券販売",
    description: "模擬店等で使用できる100円金券の販売を行っています（1回上限3000円分）。払い戻しは10/24 15:00まで！",
    icon: "🎟️",
    imageUrl: "/金券.png",
  },
  {
    id: 502,
    title: "交流ラウンジ",
    category: "校内施設・その他",
    grade: "本部",
    dept: "実行委員会",
    location: "1号館 1階 交流ラウンジ",
    zoneId: "ticket",
    floor: "1階",
    roomNo: "交流ラウンジ",
    description: "高専祭実行委員会本部・案内所及び交流スペースです。",
    icon: "🏫",
  },
  {
    id: 504,
    title: "本部",
    category: "校内施設・その他",
    grade: "本部",
    dept: "実行委員会",
    location: "1号館 1階 本部",
    zoneId: "bldg1",
    floor: "1階",
    roomNo: "本部",
    description: "高専祭実行委員会本部です。落とし物やご案内はこちらまでお越しください。",
    icon: "🏫",
  },
  {
    id: 201,
    title: "総合メディアセンター",
    category: "校内施設・その他",
    grade: "施設",
    dept: "図書・情報基盤",
    location: "第一体育館 西側",
    zoneId: "media_center",
    description: "図書館やマルチメディア教室、デジタルサロン等が設置された総合メディアセンターです。",
    icon: "📚",
  },
  {
    id: 202,
    title: "ヤマザキショップ 鶴岡高専店",
    category: "校内施設・その他",
    grade: "店舗",
    dept: "学内購買",
    location: "総合メディアセンター 西側隣接",
    zoneId: "yamazaki",
    description: "パン、お菓子、飲料、文房具などを販売している校内売店です。",
    icon: "🏪",
  },
  {
    id: 203,
    title: "駐車場",
    category: "校内施設・その他",
    grade: "施設",
    dept: "構内施設",
    location: "東側 構内駐車場",
    zoneId: "parking",
    description: "ご来場者様用の構内駐車場です。台数に限りがございますので公共交通機関の利用にご協力ください。",
    icon: "🅿",
  },
];

// ステージ・タイムスケジュールデータ
const EVENTS_DATA: EventDayData[] = [
  {
    day: 1,
    dateLabel: "1日目：10/23（金）",
    dateStr: "10/23",
    month: 10,
    dayOfMonth: 23,
    stages: [
      {
        stageId: "gym1",
        stageName: "第一体育館",
        location: "第一体育館",
        locationZoneId: "gym1",
        schedule: [
          {
            id: "d1_g1_1",
            time: "10:00 - 10:30",
            startTime: "10:00",
            endTime: "10:30",
            title: "オープニング",
            org: "実行委員会",
            desc: "吹奏楽部の演奏で高専祭の幕が上がる! OPムービーで何かが起きるかも!?",
            tag: "セレモニー",
            icon: "🎉",
            imageUrl: "/OP.png",
          },
          {
            id: "d1_g1_2",
            time: "11:00 - 12:30",
            startTime: "11:00",
            endTime: "12:30",
            title: "2026 KOSEN 歌謡祭 秋",
            org: "実行委員会",
            desc: "青春の1ページに、忘れられない思い出を。心を込めた歌声で、最高の瞬間を刻もう!",
            tag: "歌謡祭",
            icon: "🎤",
            imageUrl: "/歌謡祭.png",
          },
          {
            id: "d1_g1_3",
            time: "13:30 - 15:00",
            startTime: "13:30",
            endTime: "15:00",
            title: "音部ライブ",
            org: "音楽部",
            desc: "色が重なれば、楽しさも広がる。軽音部ならではの生演奏をお楽しみください!",
            tag: "ライブ",
            icon: "🎸",
            imageUrl: "/音楽部.png",
          },
        ],
      },
      {
        stageId: "gym_out",
        stageName: "第一体育館（外）",
        location: "第一体育館 周辺",
        locationZoneId: "gym1",
        schedule: [
          {
            id: "d1_go_1",
            time: "13:00 - 15:00",
            startTime: "13:00",
            endTime: "15:00",
            title: "カリモノ競争",
            org: "実行委員会",
            desc: "勝負を決めるのは、走力とひらめき。仲間とつなぐバトン、最後に笑うのはどのクラスか?",
            tag: "競技・企画",
            icon: "🏃",
            imageUrl: "/カリモノ競争.png",
          },
        ],
      },
      {
        stageId: "entrance",
        stageName: "学生昇降口前",
        location: "学生昇降口",
        locationZoneId: "entrance",
        schedule: [
          {
            id: "d1_en_1",
            time: "11:00 - 12:00",
            startTime: "11:00",
            endTime: "12:00",
            title: "高専生の主張",
            org: "実行委員会",
            desc: "胸に秘めた思いを、ここで大放出! 普段は言えない熱い思いを、今こそ叫べ",
            tag: "ステージ企画",
            icon: "📢",
            imageUrl: "/高専生の主張.png",
          },
        ],
      },
      {
        stageId: "joint",
        stageName: "合同講義室",
        location: "1号館 2階",
        locationZoneId: "bldg1",
        schedule: [
          {
            id: "d1_j_1",
            time: "10:30 - 15:00",
            startTime: "10:30",
            endTime: "15:00",
            title: "ゲーム企画 今日、ゲームになりました。",
            org: "実行委員会",
            desc: "大画面での白熱ゲームトーナメント＆対戦アトラクション！",
            tag: "eスポーツ",
            icon: "🎮",
          },
        ],
      },
    ],
  },
  {
    day: 2,
    dateLabel: "2日目：10/24（土）",
    dateStr: "10/24",
    month: 10,
    dayOfMonth: 24,
    stages: [
      {
        stageId: "gym1",
        stageName: "第一体育館",
        location: "第一体育館",
        locationZoneId: "gym1",
        schedule: [
          {
            id: "d2_g1_1",
            time: "10:00 - 11:00",
            startTime: "10:00",
            endTime: "11:00",
            title: "腕立て選手権 あつまれ きんにくの森",
            org: "実行委員会",
            desc: "試されるのは、筋力と精神力。己の限界に挑み、最後まで立ち向かえ!",
            tag: "競技・企画",
            icon: "💪",
            imageUrl: "/あつまれきんにくの森.png",
          },
          {
            id: "d2_g1_2",
            time: "12:00 - 13:00",
            startTime: "12:00",
            endTime: "13:00",
            title: "鶴専-1グランプリ",
            org: "有志企画",
            desc: "高専祭史上初の漫才企画! 笑いの準備はできているか? 個性豊かなコンビたちが繰り広げる!",
            tag: "お笑い",
            icon: "🎙",
            imageUrl: "/鶴専-1グランプリ.png",
          },
          {
            id: "d2_g1_3",
            time: "13:30 - 14:30",
            startTime: "13:30",
            endTime: "14:30",
            title: "DoKa Project",
            org: "ダンス部・有志",
            desc: "高専祭の最後を締めくくるダンス企画! 音楽にのせて最高のパフォーマンスを!",
            tag: "ダンス",
            icon: "💃",
            imageUrl: "/DoKa Project.png",
          },
          {
            id: "d2_g1_4",
            time: "14:30 - 15:30",
            startTime: "14:30",
            endTime: "15:30",
            title: "エンディング",
            org: "全校・実行委員会",
            desc: "EDムービーでOPの謎が明らかに! 最高の文化祭を締めくくろう!",
            tag: "セレモニー",
            icon: "🎆",
            imageUrl: "/ED.png",
          },
        ],
      },
      {
        stageId: "joint",
        stageName: "合同講義室",
        location: "1号館 2階",
        locationZoneId: "bldg1",
        schedule: [
          {
            id: "d2_j_1",
            time: "10:00 - 15:00",
            startTime: "10:00",
            endTime: "15:00",
            title: "休憩室",
            org: "実行委員会",
            desc: "ご自由にお休みいただける休憩スペースです。ほっと一息つきたい時にどうぞご利用ください。",
            tag: "休憩",
            icon: "☕",
          },
        ],
      },
      {
        stageId: "bldg8",
        stageName: "大講義室",
        location: "8号館 2階",
        locationZoneId: "bldg8",
        schedule: [
          {
            id: "d2_b8_1",
            time: "10:00 - 11:00",
            startTime: "10:00",
            endTime: "11:00",
            title: "吹奏楽部 ミニコンサート",
            org: "吹奏楽部",
            desc: "吹奏楽部によるミニコンサート（嵐メドレー等）を開催します！（10時〜11時）素敵な演奏をお楽しみください！",
            tag: "演奏",
            icon: "🎷",
            imageUrl: "/吹奏楽部.png",
          },
          {
            id: "d2_b8_2",
            time: "13:00 - 15:00",
            startTime: "13:00",
            endTime: "15:00",
            title: "学校説明会",
            org: "広報・入試",
            desc: "中学生・保護者の皆様に向けた学校説明会（13時受付開始、13時30分〜15時まで）。高専生活や入試など何でもご相談ください。",
            tag: "案内",
            icon: "🏫",
          },
        ],
      },
      {
        stageId: "prefab",
        stageName: "音楽部プレハブ",
        location: "音楽部プレハブ",
        locationZoneId: "prefab",
        schedule: [
          {
            id: "d2_g2_1",
            time: "10:00 - 15:00",
            startTime: "10:00",
            endTime: "15:00",
            title: "音部ライブ（音楽部）",
            org: "音楽部",
            desc: "色が重なれば、楽しさも広がる。軽音部ならではの生演奏をお楽しみください! (YOUTH RIOT FES VOL.4)",
            tag: "ライブ",
            icon: "🎸",
            imageUrl: "/音楽部.png",
          },
        ],
      },
    ],
  },
];

// 校内マップのピン座標
const CAMPUS_ZONES = [
  {
    id: "prefab",
    name: "音楽部プレハブ",
    subName: "音楽部ライブ会場 (10:00〜15:00)",
    pinLabel: "音楽部プレハブ",
    lightBg: "bg-purple-50 border-purple-300 text-purple-900",
    icon: "🎸",
    top: "76.0%",
    left: "9.4%",
    desc: "音楽部による熱いロック＆ポップスサウンドのライブステージ（10:00～15:00）を開催！",
  },
  {
    id: "yamazaki",
    name: "ヤマザキショップ 鶴岡高専店",
    subName: "学内売店",
    pinLabel: "ヤマザキショップ 鶴岡高専店",
    lightBg: "bg-orange-50 border-orange-300 text-orange-900",
    icon: "🏪",
    top: "45.0%",
    left: "44.6%",
    desc: "総合メディアセンター西側に隣接する学内売店です。",
  },
  {
    id: "media_center",
    name: "総合メディアセンター",
    subName: "図書室・マルチメディア",
    pinLabel: "総合メディアセンター",
    lightBg: "bg-indigo-50 border-indigo-300 text-indigo-900",
    icon: "📚",
    top: "48.0%",
    left: "52.2%",
    desc: "4B格付けチェック（2階マルチメディア教室）およびロボット技術研究部（1階多目的交流室）を開催！",
  },
  {
    id: "gym1",
    name: "第一体育館",
    subName: "メインステージ・2年模擬店",
    pinLabel: "第一体育館",
    lightBg: "bg-rose-50 border-rose-300 text-rose-900",
    icon: "🏟️",
    top: "62.0%",
    left: "63.0%",
    desc: "第一体育館（ステージ企画・歌謡祭・2年模擬店（餃子・ポップコーン・玉こん・焼き鳥））の会場です。",
  },
  {
    id: "bldg1",
    name: "1号館",
    subName: "一般教室棟・文化部展示",
    pinLabel: "1号館",
    lightBg: "bg-blue-50 border-blue-300 text-blue-900",
    icon: "🏫",
    top: "30.4%",
    left: "69.8%",
    desc: "1階〜3階のクラス企画・模擬店をはじめ、2階合同講義室でのゲーム企画/休憩室、13Fゼミ室（天文部）、12Fゼミ室（美術写真部）、中会議室（ボードゲーム有志）が実施されています。",
  },
  {
    id: "bldg4",
    name: "4号館",
    subName: "展示・体験棟",
    pinLabel: "4号館",
    lightBg: "bg-teal-50 border-teal-300 text-teal-900",
    icon: "",
    top: "9.0%",
    left: "89.9%",
    desc: "411教室（かるた体験）を開催！",
  },
  {
    id: "ticket",
    name: "高専祭本部（交流ラウンジ）",
    subName: "金券本部・案内",
    pinLabel: "高専祭本部\n（交流ラウンジ）",
    lightBg: "bg-amber-50 border-amber-300 text-amber-900",
    icon: "🎟️",
    top: "40.6%",
    left: "76.5%",
    desc: "1号館1階交流ラウンジに位置し、模擬店等で使用できる金券の販売を行っています。",
  },
  {
    id: "bldg7",
    name: "7号館",
    subName: "アトラクション・展示棟",
    pinLabel: "7号館",
    lightBg: "bg-purple-50 border-purple-300 text-purple-900",
    icon: "👻",
    top: "40.6%",
    left: "83.6%",
    desc: "3Mお化け屋敷、4Eキッキングスナイパー、AMデザイン部、E.S.S.、5B研究発表を開催！",
  },
  {
    id: "bldg8",
    name: "8号館（大講義室）",
    subName: "ミニコンサート・学校説明会",
    pinLabel: "8号館",
    lightBg: "bg-emerald-50 border-emerald-300 text-emerald-900",
    icon: "🎷",
    top: "21.5%",
    left: "91.5%",
    desc: "2階の大講義室にて吹奏楽部ミニコンサート（10時〜11時）および学校説明会（13時受付開始、13時30分〜15時）を開催！",
  },
  {
    id: "entrance",
    name: "学生昇降口前広場",
    subName: "高専生の主張・キッチンカー",
    pinLabel: "学生昇降口前広場",
    lightBg: "bg-amber-50 border-amber-300 text-amber-900",
    icon: "🚚",
    top: "55.1%",
    left: "77.4%",
    desc: "高専生の主張、および昇降口前ロータリーのキッチンカー3店が集結！",
  },
  {
    id: "parking",
    name: "駐車場",
    subName: "来場者用駐車場",
    pinLabel: "駐車場",
    lightBg: "bg-slate-50 border-slate-300 text-slate-900",
    icon: "🅿️",
    top: "84.6%",
    left: "80.6%",
    desc: "構内駐車場です。台数に限りがございます。",
  },
];

// 工学モチーフ浮遊アニメーションデータ
const TECH_FLOATING_ITEMS = [
  { icon: "⚙️", top: "8%", left: "10%", size: "text-3xl", delay: "0s", duration: "10s" },
  { icon: "🤖", top: "16%", right: "8%", size: "text-4xl", delay: "0.8s", duration: "9.5s" },
  { icon: "🔩", top: "25%", left: "6%", size: "text-2xl", delay: "1.5s", duration: "11s" },
  { icon: "⚡", top: "35%", right: "12%", size: "text-3xl", delay: "0.5s", duration: "8.5s" },
  { icon: "🔧", top: "45%", left: "12%", size: "text-3xl", delay: "1.8s", duration: "10s" },
  { icon: "💻", top: "52%", right: "6%", size: "text-3xl", delay: "1.2s", duration: "11s" },
  { icon: "🔌", top: "66%", left: "8%", size: "text-2xl", delay: "2s", duration: "9s" },
  { icon: "⚙️", top: "75%", right: "10%", size: "text-5xl", delay: "0.4s", duration: "12s" },
  { icon: "🤖", top: "84%", left: "18%", size: "text-3xl", delay: "1.6s", duration: "10.5s" },
];

export default function Page() {
  const [isEntered, setIsEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "stalls" | "events" | "other">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>("ticket");
  const [modalItem, setModalItem] = useState<StallItem | null>(null);

  const [eventModalItem, setEventModalItem] = useState<
    (ScheduleItem & { stageName?: string; location?: string; locationZoneId?: string }) | null
  >(null);

  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(3.0);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  const [detailMapBuilding, setDetailMapBuilding] = useState<"bldg1" | "bldg7" | "bldg8" | "media_center" | null>(null);
  const [detailMapFloor, setDetailMapFloor] = useState<"1階" | "2階" | "3階">("1階");

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now);

    const month = now.getMonth() + 1;
    const date = now.getDate();
    if (month === 10 && date === 24) {
      setSelectedDay(2);
    } else {
      setSelectedDay(1);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const centerZonePin = (zoneId: string, smooth = true) => {
    const zone = CAMPUS_ZONES.find((z) => z.id === zoneId);
    if (!zone || !mapContainerRef.current) return;

    const container = mapContainerRef.current;
    const leftPercent = parseFloat(zone.left) / 100;
    const topPercent = parseFloat(zone.top) / 100;

    const targetX = container.scrollWidth * leftPercent - container.clientWidth / 2;
    const targetY = container.scrollHeight * topPercent - container.clientHeight / 2;

    container.scrollTo({
      left: Math.max(0, targetX),
      top: Math.max(0, targetY),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleGoToMapPin = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setActiveTab("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      centerZonePin(zoneId, true);
    }, 120);
  };

  const scrollToRightSide = (smooth = false) => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;

    const targetX = container.scrollWidth * 0.80 - container.clientWidth / 2;
    const targetY = container.scrollHeight * 0.40 - container.clientHeight / 2;

    container.scrollTo({
      left: Math.max(0, targetX),
      top: Math.max(0, targetY),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (isEntered && activeTab === "map") {
      setIsMapReady(false);
      const timer = setTimeout(() => {
        if (selectedZoneId) {
          centerZonePin(selectedZoneId, false);
        } else {
          scrollToRightSide(false);
        }
        requestAnimationFrame(() => {
          setIsMapReady(true);
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isEntered, activeTab]);

  const zoomLevelRef = useRef(zoomLevel);
  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

  // ピンチ操作判定
  useEffect(() => {
    if (!isEntered || activeTab !== "map") return;

    const container = mapContainerRef.current;
    if (!container) return;

    let startDist = 0;
    let startZoom = 3.0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    let startMidX = 0;
    let startMidY = 0;
    let rafId: number | null = null;

    const isInsideContainer = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (
          touch.clientX < rect.left ||
          touch.clientX > rect.right ||
          touch.clientY < rect.top ||
          touch.clientY > rect.bottom
        ) {
          return false;
        }
      }
      return true;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        if (!isInsideContainer(e)) return;
        if (e.cancelable) e.preventDefault();

        startDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        startZoom = zoomLevelRef.current;

        const rect = container.getBoundingClientRect();
        startMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        startMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        startScrollLeft = container.scrollLeft;
        startScrollTop = container.scrollTop;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && startDist > 0) {
        if (!isInsideContainer(e)) return;
        if (e.cancelable) e.preventDefault();

        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const rect = container.getBoundingClientRect();
        const currentMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const currentMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

        const scale = currentDist / startDist;
        const newZoom = Math.min(Math.max(startZoom * scale, 1.0), 4.0);

        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          if (mapContentRef.current) {
            mapContentRef.current.style.width = `${newZoom * 100}%`;
          }
          const ratio = newZoom / startZoom;
          container.scrollLeft = (startScrollLeft + startMidX) * ratio - currentMidX;
          container.scrollTop = (startScrollTop + startMidY) * ratio - currentMidY;
          setZoomLevel(newZoom);
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        startDist = 0;
        if (rafId) cancelAnimationFrame(rafId);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isEntered, activeTab]);

  const handleZoomIn = () => {
    const container = mapContainerRef.current;
    const content = mapContentRef.current;
    if (!container || !content) return;

    const prev = zoomLevelRef.current;
    const next = Math.min(Math.round((prev + 0.25) * 100) / 100, 4.0);
    if (prev === next) return;

    const ratio = next / prev;
    const midX = container.clientWidth / 2;
    const midY = container.clientHeight / 2;

    content.style.width = `${next * 100}%`;
    container.scrollLeft = (container.scrollLeft + midX) * ratio - midX;
    container.scrollTop = (container.scrollTop + midY) * ratio - midY;
    setZoomLevel(next);
  };

  const handleZoomOut = () => {
    const container = mapContainerRef.current;
    const content = mapContentRef.current;
    if (!container || !content) return;

    const prev = zoomLevelRef.current;
    const next = Math.max(Math.round((prev - 0.25) * 100) / 100, 1.0);
    if (prev === next) return;

    const ratio = next / prev;
    const midX = container.clientWidth / 2;
    const midY = container.clientHeight / 2;

    content.style.width = `${next * 100}%`;
    container.scrollLeft = (container.scrollLeft + midX) * ratio - midX;
    container.scrollTop = (container.scrollTop + midY) * ratio - midY;
    setZoomLevel(next);
  };

  const handleResetZoom = () => {
    if (mapContentRef.current) {
      mapContentRef.current.style.width = "300%";
    }
    setZoomLevel(3.0);
    setTimeout(() => {
      if (selectedZoneId) {
        centerZonePin(selectedZoneId, true);
      } else {
        scrollToRightSide(true);
      }
    }, 50);
  };

  const liveEvents = useMemo(() => {
    if (!currentTime) return [];

    const currentMonth = currentTime.getMonth() + 1;
    const currentDate = currentTime.getDate();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    let activeDayNumber: number | null = null;
    if (currentMonth === 10 && currentDate === 23) {
      activeDayNumber = 1;
    } else if (currentMonth === 10 && currentDate === 24) {
      activeDayNumber = 2;
    }

    if (!activeDayNumber) return [];

    const dayData = EVENTS_DATA.find((d) => d.day === activeDayNumber);
    if (!dayData) return [];

    const list: Array<any> = [];

    for (const stage of dayData.stages) {
      for (const event of stage.schedule) {
        const [startHour, startMin] = event.startTime.split(":").map(Number);
        const [endHour, endMin] = event.endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;

        if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {
          list.push({
            ...event,
            stageName: stage.stageName,
            locationZoneId: stage.locationZoneId,
            day: dayData.day,
            dateStr: dayData.dateStr,
          });
        }
      }
    }
    return list;
  }, [currentTime]);

  const primaryLiveEvent = liveEvents[0] || null;

  const filteredStalls = useMemo(() => {
    return STALLS_DATA.filter((stall) => {
      const matchesSearch =
        stall.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stall.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stall.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stall.grade.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "すべて" || stall.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const zoneStalls = useMemo(() => {
    if (!selectedZoneId) return [];
    return STALLS_DATA.filter((s) => s.zoneId === selectedZoneId);
  }, [selectedZoneId]);

  const currentZone = CAMPUS_ZONES.find((z) => z.id === selectedZoneId);

  const getRoomStall = (roomKey: string) => {
    return STALLS_DATA.find(
      (s) =>
        s.roomNo === roomKey ||
        s.title.includes(roomKey) ||
        s.location.includes(roomKey)
    );
  };

  const overlayScale = zoomLevel / 3.0;

  const titlePart1 = ["熱", "狂", "の"];
  const titlePart2 = ["カ", "ー", "ニ", "バ", "ル"];
  const titlePart3 = ["高", "専", "祭"];

  if (!isEntered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden select-none font-sans">
        <style>{`
          @keyframes floatTech {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-18px) rotate(180deg) scale(1.1); }
            100% { transform: translateY(0px) rotate(360deg) scale(1); }
          }
          @keyframes dropChar {
            0% { transform: translateY(-80px) scale(0.2); opacity: 0; }
            65% { transform: translateY(12px) scale(1.1); opacity: 1; }
            85% { transform: translateY(-3px) scale(0.98); }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          .animate-float-tech {
            animation: floatTech linear infinite;
          }
          .animate-drop-char {
            display: inline-block;
            animation: dropChar 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}</style>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {TECH_FLOATING_ITEMS.map((item, idx) => (
            <div
              key={idx}
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                animationDuration: item.duration,
                animationDelay: item.delay,
              }}
              className={`absolute ${item.size} opacity-70 animate-float-tech filter drop-shadow-sm`}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div />

        <div className="w-full max-w-md flex flex-col items-center text-center z-10 my-auto space-y-6">
          <div className="text-teal-600 font-extrabold text-xs sm:text-sm tracking-[0.25em] font-sans">
            TSURUOKA KOSEN FESTIVAL 2026
          </div>

          <div className="flex flex-col items-center justify-center font-black tracking-tight font-sans scale-110 sm:scale-125 my-2">
            <div className="flex items-baseline justify-center text-[#E53935] drop-shadow-md">
              <div className="text-5xl sm:text-7xl flex">
                {titlePart1.map((char, index) => (
                  <span
                    key={index}
                    className="animate-drop-char"
                    style={{ animationDelay: `${index * 0.18}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <div className="relative inline-block ml-2">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-black text-rose-500 tracking-widest whitespace-nowrap flex">
                  {titlePart2.map((char, index) => (
                    <span
                      key={index}
                      className="animate-drop-char"
                      style={{ animationDelay: `${0.6 + index * 0.15}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>

                <div className="text-6xl sm:text-8xl flex">
                  {titlePart3.map((char, index) => (
                    <span
                      key={index}
                      className="animate-drop-char"
                      style={{ animationDelay: `${1.3 + index * 0.18}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 border border-slate-200/80 shadow-md rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-xs font-extrabold text-slate-700">
            <span className="text-rose-600">高専祭</span>
            <span className="text-slate-300">|</span>
            <span>10/23(金)・10/24(土)</span>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 z-10 w-full">
            <a
              href="https://www.tsuruoka-nct.ac.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="鶴岡高専 公式HPを開く"
            >
              <img
                src="/高専QR.png"
                alt="鶴岡高専 公式HP QRコード"
                className="w-22 h-22 object-contain shadow-md rounded-xl border border-slate-200 bg-white p-1 group-hover:border-teal-500 group-hover:shadow-lg transition-all"
              />
              <div className="text-[11px] font-bold text-slate-600 group-hover:text-teal-600 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>鶴岡高専HP</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
              </div>
            </a>

            <a
              href="https://www.instagram.com/nittc_kosensai2026?stkn=cjgxeW1rbW5hbjBn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="高専祭公式 Instagramを開く"
            >
              <img
                src="/インスタQR.png"
                alt="高専祭公式 Instagram QRコード"
                className="w-22 h-22 object-contain shadow-md rounded-xl border border-slate-200 bg-white p-1 group-hover:border-pink-500 group-hover:shadow-lg transition-all"
              />
              <div className="text-[11px] font-bold text-slate-600 group-hover:text-pink-600 flex items-center gap-1">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                <span>公式インスタ</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-pink-600" />
              </div>
            </a>
          </div>

          <div className="pt-2 w-full flex flex-col items-center space-y-3">
            <button
              onClick={() => setIsEntered(true)}
              className="w-full max-w-[260px] py-4 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white text-base font-black tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 border border-white/30"
            >
              <span>プログラムを見る</span>
              <span className="text-lg">⚙️</span>
            </button>

            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              高専祭をお楽しみください！
            </p>
          </div>
        </div>

        <div />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans relative">
      <style>{`
        .custom-map-scrollbar {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          will-change: scroll-position;
        }
        .custom-map-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .map-container-scrollbar {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          will-change: scroll-position;
        }
        .map-container-scrollbar::-webkit-scrollbar {
          display: block !important;
          width: 8px;
          height: 8px;
        }
        .map-container-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.6);
          border-radius: 4px;
        }
        .map-container-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(226, 232, 240, 0.6);
        }
      `}</style>

      {/* リアルタイムLIVEバナー */}
      {primaryLiveEvent && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white border-b border-white/20 shadow-xl overflow-hidden">
          <style>{`
            @keyframes liveFade {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
            @keyframes liveWave {
              0% { transform: scaleY(0.4); }
              50% { transform: scaleY(1); }
              100% { transform: scaleY(1); }
            }
            .animate-live-fade { animation: liveFade 1.5s ease-in-out infinite; }
            .animate-live-wave { animation: liveWave 0.8s ease-in-out infinite; transform-origin: bottom; }
          `}</style>

          <div className="max-w-2xl mx-auto p-4 flex items-center justify-between gap-4 relative">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase mb-1 opacity-90">
                <Radio className="w-4 h-4 animate-live-fade" />
                <span>ただいま実施中の企画 ({liveEvents.length}件 - {primaryLiveEvent.dateStr})</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 text-[13px] sm:text-base font-bold">
                <span className="flex items-center gap-1 truncate">
                  <span className="text-xl">{primaryLiveEvent.icon}</span>
                  <span className="truncate">
                    {primaryLiveEvent.stageName}: {primaryLiveEvent.title}
                  </span>
                </span>
                <span className="text-xs sm:text-sm font-black bg-white/20 px-2 py-0.5 rounded flex items-center gap-1.5 shrink-0 w-fit">
                  <span>{primaryLiveEvent.time}</span>
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 h-full bg-white animate-live-wave" style={{ animationDelay: "0s" }} />
                    <div className="w-0.5 h-full bg-white animate-live-wave" style={{ animationDelay: "0.2s" }} />
                    <div className="w-0.5 h-full bg-white animate-live-wave" style={{ animationDelay: "0.1s" }} />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-amber-100">LIVE</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (primaryLiveEvent.day) {
                  setSelectedDay(primaryLiveEvent.day);
                }
                setActiveTab("events");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white/95 text-red-700 px-3 py-1.5 rounded-full text-xs font-black shadow hover:bg-white hover:scale-105 transition flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>全プログラム</span>
            </button>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header
        className={`sticky ${
          primaryLiveEvent ? "top-[76px] sm:top-[72px]" : "top-0"
        } z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all`}
      >
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <button onClick={() => setIsEntered(false)} className="flex items-center gap-2.5 text-left shrink-0">
            <img src="/高専ロゴ.jpg" alt="高専ロゴ" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-black text-base text-slate-800 leading-tight">高専祭</span>
              <span className="text-[10px] font-extrabold text-orange-600">10/23(金)・10/24(土)</span>
            </div>
          </button>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === "map"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Map className="w-4 h-4" />
              {activeTab === "map" && <span>マップ</span>}
            </button>
            <button
              onClick={() => setActiveTab("stalls")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === "stalls"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Store className="w-4 h-4" />
              {activeTab === "stalls" && <span>企画一覧</span>}
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {activeTab === "events" && <span>スケジュール</span>}
            </button>
            <button
              onClick={() => setActiveTab("other")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === "other"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Info className="w-4 h-4" />
              {activeTab === "other" && <span>その他</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* メインエリア */}
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-12 space-y-4">
        {/* タブ 1: 校内マップ */}
        {activeTab === "map" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 gap-2">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <Move className="w-3.5 h-3.5 text-orange-500 animate-pulse shrink-0" />
                <span className="truncate">指2本で拡大縮小、ドラッグで移動</span>
              </span>

              {/* ズーム操作バー */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1 shadow-sm shrink-0">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1.0}
                  className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition"
                  title="縮小"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-black min-w-[36px] text-center text-slate-700 select-none">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 4.0}
                  className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition"
                  title="拡大"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 3.0 && (
                  <button
                    onClick={handleResetZoom}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition ml-0.5 border-l border-slate-200"
                    title="標準位置に戻す"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div
              ref={mapContainerRef}
              style={{
                aspectRatio: `${2.37 / Math.min(zoomLevel, 2.0)}`,
              }}
              className={`w-full overflow-auto rounded-3xl border-2 border-slate-200 shadow-md bg-slate-200 cursor-grab active:cursor-grabbing map-container-scrollbar relative select-none transition-opacity duration-200 touch-pan-x touch-pan-y ${
                isMapReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                ref={mapContentRef}
                style={{
                  width: `${zoomLevel * 100}%`,
                  minWidth: "100%",
                }}
                className="relative aspect-[2.37/1] select-none"
              >
                <img
                  src="/校内図.jpeg"
                  alt="校内図"
                  onLoad={() => {
                    if (selectedZoneId) {
                      centerZonePin(selectedZoneId, false);
                    } else {
                      scrollToRightSide(false);
                    }
                    setIsMapReady(true);
                  }}
                  className="w-full h-full object-contain pointer-events-none rounded-2xl"
                />

                {/* 通行禁止標識 */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  <div
                    style={{
                      top: "70%",
                      left: "13.5%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute drop-shadow-md"
                  >
                    <NoEntrySign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div
                    style={{
                      top: "70%",
                      left: "20.5%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute bg-white/95 text-slate-900 text-[12px] sm:text-[14px] font-black px-2 py-0.5 rounded-lg shadow-lg border border-red-500 flex items-center justify-center whitespace-nowrap select-none"
                  >
                    <span className="text-red-600 font-extrabold tracking-tight">通行禁止</span>
                  </div>

                  {/* 一番右下のアイコン：0.5%上（69.5%）、0.1%左（27.4%）に調整済み */}
                  <div
                    style={{
                      top: "69.5%",
                      left: "27.4%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute drop-shadow-md"
                  >
                    <NoEntrySign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div
                    style={{
                      top: "52%",
                      left: "12.5%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute drop-shadow-md"
                  >
                    <NoEntrySign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div
                    style={{
                      top: "52%",
                      left: "19.5%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute bg-white/95 text-slate-900 text-[12px] sm:text-[14px] font-black px-2 py-0.5 rounded-lg shadow-lg border border-red-500 flex items-center justify-center whitespace-nowrap select-none"
                  >
                    <span className="text-red-600 font-extrabold tracking-tight">通行禁止</span>
                  </div>

                  <div
                    style={{
                      top: "52%",
                      left: "26.5%",
                      transform: `translate(-50%, -50%) scale(${overlayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="absolute drop-shadow-md"
                  >
                    <NoEntrySign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* プレハブへの順路矢印（左方向の左端矢印の高さを21.7%へ調整済み） */}
                {selectedZoneId === "prefab" && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {[
                      { top: "38.0%", left: "57.0%", dir: "up" },
                      { top: "30.0%", left: "57.0%", dir: "up" },
                      { top: "26.0%", left: "49.0%", dir: "left" },
                      { top: "21.5%", left: "37.0%", dir: "left" },
                      { top: "21.5%", left: "27.0%", dir: "left" },
                      { top: "21.7%", left: "15.0%", dir: "left" },
                      { top: "36.0%", left: "11.5%", dir: "down" },
                      { top: "54.0%", left: "11.5%", dir: "down" },
                    ].map((arrow, idx) => (
                      <div
                        key={idx}
                        style={{
                          top: arrow.top,
                          left: arrow.left,
                          transform: `translate(-50%, -50%) scale(${overlayScale})`,
                          transformOrigin: "center center",
                        }}
                        className="absolute"
                      >
                        <PathArrow direction={arrow.dir as any} className="w-9 h-9" />
                      </div>
                    ))}
                  </div>
                )}

                {CAMPUS_ZONES.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const isLiveStageZone = liveEvents.some((e) => e.locationZoneId === zone.id);
                  const showLabel = isSelected || (selectedZoneId === null && zone.id === "ticket");

                  return (
                    <div
                      key={zone.id}
                      style={{ top: zone.top, left: zone.left }}
                      className={`absolute transition-all duration-200 ${
                        isSelected ? "z-30" : "z-10"
                      }`}
                    >
                      <button
                        onClick={() => {
                          const newZoneId = selectedZoneId === zone.id ? null : zone.id;
                          setSelectedZoneId(newZoneId);
                          if (newZoneId) {
                            centerZonePin(newZoneId, true);
                          }
                        }}
                        className={`relative -translate-x-1/2 -translate-y-full flex items-center justify-center cursor-pointer group transition-transform duration-200 ${
                          isSelected ? "scale-110" : "hover:scale-105"
                        }`}
                      >
                        <div className="relative flex items-center justify-center shrink-0">
                          {isLiveStageZone && (
                            <span className="absolute w-7 h-7 rounded-full bg-rose-500/50 animate-ping" />
                          )}
                          {zone.id === "parking" ? (
                            <div
                              className={`w-6 h-6 bg-blue-600 rounded border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs leading-none shrink-0 ${
                                isSelected ? "ring-2 ring-rose-500" : ""
                              }`}
                            >
                              P
                            </div>
                          ) : (
                            <div
                              className={`w-5 h-5 bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 rounded-t-full rounded-bl-full rotate-45 border-2 border-white shadow-md flex items-center justify-center shrink-0 ${
                                isSelected ? "ring-2 ring-rose-500" : ""
                              }`}
                            >
                              <div className="w-2 h-2 bg-white rounded-full -rotate-45 shadow-inner" />
                            </div>
                          )}
                        </div>

                        {showLabel && (
                          <div
                            className={`absolute bg-slate-900/85 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg text-[10px] font-black tracking-wider text-center leading-tight flex flex-col items-center whitespace-nowrap px-2.5 py-1 ${
                              zone.id === "bldg4"
                                ? "left-full top-1/2 -translate-y-1/2 ml-2"
                                : zone.id === "prefab"
                                ? "top-full left-1/2 -translate-x-1/2 mt-1.5"
                                : "bottom-full left-1/2 -translate-x-1/2 mb-1.5"
                            }`}
                          >
                            {zone.pinLabel.split("\n").map((line, idx) => (
                              <span key={idx}>{line}</span>
                            ))}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {currentZone ? (
              <div className={`rounded-3xl p-5 border shadow-sm space-y-4 transition-all ${currentZone.lightBg}`}>
                <div className="flex items-start justify-between gap-2 border-b border-current/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-white/80 rounded-2xl shadow-sm">{currentZone.icon}</span>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{currentZone.name}</h3>
                      <p className="text-xs font-bold opacity-80">{currentZone.subName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-white/90 rounded-full shadow-sm">
                    対象リスト ({zoneStalls.length}件)
                  </span>
                </div>

                <p className="text-xs leading-relaxed font-medium opacity-90">{currentZone.desc}</p>

                {(selectedZoneId === "bldg1" ||
                  selectedZoneId === "bldg7" ||
                  selectedZoneId === "bldg8" ||
                  selectedZoneId === "media_center") && (
                  <button
                    onClick={() => {
                      setDetailMapBuilding(selectedZoneId as any);
                      setDetailMapFloor(selectedZoneId === "bldg8" ? "2階" : "1階");
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{currentZone.name} の詳細フロアマップを開く</span>
                  </button>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    <span>📍 {currentZone.name} の出展・施設一覧</span>
                  </h4>

                  {zoneStalls.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {zoneStalls.map((stall) => (
                        <div
                          key={stall.id}
                          onClick={() => setModalItem(stall)}
                          className="bg-white text-slate-800 p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {stall.imageUrl ? (
                              <img
                                src={stall.imageUrl}
                                alt={stall.title}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                              />
                            ) : (
                              <span className="text-2xl p-2 bg-slate-50 rounded-xl shrink-0">{stall.icon}</span>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black px-2 py-0.2 bg-orange-100 text-orange-700 rounded">
                                  {stall.grade}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">{stall.category}</span>
                              </div>
                              <h5 className="font-black text-sm text-slate-900 mt-0.5">{stall.title}</h5>
                              <p className="text-[11px] text-slate-500 font-medium">{stall.location}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/60 p-4 rounded-2xl text-center text-xs text-slate-500 font-bold border border-slate-200">
                      このエリアに関する個別のアトラクションリストは以上です。
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center text-slate-500 font-bold text-xs space-y-1 shadow-sm">
                <p className="text-xl">📍</p>
                <p>マップ上のピンをタップすると場所の詳細が表示されます</p>
              </div>
            )}
          </div>
        )}

        {/* タブ 2: 企画一覧 */}
        {activeTab === "stalls" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="企画名・出し物・クラス・場所で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  "すべて",
                  "模擬店",
                  "クラス企画",
                  "部活動企画",
                  "実行委員会企画",
                  "キッチンカー",
                  "校内施設・その他",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-extrabold text-slate-500 px-1">
                該当件数: {filteredStalls.length}件 （開催日程: 10/23[金]・10/24[土]）
              </p>

              {filteredStalls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredStalls.map((stall) => (
                    <div
                      key={stall.id}
                      onClick={() => setModalItem(stall)}
                      className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-3 group"
                    >
                      {stall.imageUrl ? (
                        <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                          <img
                            src={stall.imageUrl}
                            alt={stall.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>{stall.grade}</span>
                            {stall.price && (
                              <span className="text-amber-300 ml-1">・ {stall.price}</span>
                            )}
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {!stall.imageUrl && (
                            <span className="text-3xl p-2.5 bg-orange-50 rounded-2xl group-hover:scale-110 transition shrink-0">
                              {stall.icon}
                            </span>
                          )}
                          <div>
                            {!stall.imageUrl && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                                  {stall.grade}
                                </span>
                                <span className="text-[10px] font-extrabold text-slate-400">
                                  {stall.category}
                                </span>
                                {stall.price && (
                                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                    {stall.price}
                                  </span>
                                )}
                              </div>
                            )}
                            <h3 className="font-black text-base text-slate-900 mt-0.5 line-clamp-1">
                              {stall.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {stall.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-[80%]">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{stall.location}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-400 font-bold space-y-2">
                  <p className="text-2xl">🔍</p>
                  <p className="text-xs">条件に該当する出店・企画が見つかりませんでした</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* タブ 3: タイムスケジュール */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex bg-slate-200 p-1 rounded-2xl gap-1 shadow-inner">
              <button
                onClick={() => setSelectedDay(1)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  selectedDay === 1
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow"
                    : "text-slate-700 hover:bg-slate-300"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>1日目：10/23（金）</span>
              </button>
              <button
                onClick={() => setSelectedDay(2)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  selectedDay === 2
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow"
                    : "text-slate-700 hover:bg-slate-300"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>2日目：10/24（土）</span>
              </button>
            </div>

            {EVENTS_DATA.find((d) => d.day === selectedDay)?.stages.map((stage) => (
              <div key={stage.stageId} className="space-y-3">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-3xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎭</span>
                    <div>
                      <h2 className="font-black text-base">{stage.stageName}</h2>
                      <p className="text-xs opacity-80 font-medium">場所: {stage.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGoToMapPin(stage.locationZoneId)}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>マップ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {stage.schedule.map((event) => {
                    const isLive = liveEvents.some((e) => e.id === event.id);

                    return (
                      <div
                        key={event.id}
                        onClick={() =>
                          setEventModalItem({
                            ...event,
                            stageName: stage.stageName,
                            location: stage.location,
                            locationZoneId: stage.locationZoneId,
                          })
                        }
                        className={`p-4 rounded-3xl border transition relative overflow-hidden cursor-pointer hover:shadow-md ${
                          isLive
                            ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 border-orange-500 ring-2 ring-orange-400/50 shadow-md"
                            : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        {isLive && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 z-10">
                            <Radio className="w-3 h-3 animate-pulse" />
                            <span>LIVE 実施中</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start gap-3">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full sm:w-28 h-28 object-cover rounded-2xl border border-slate-200 shrink-0"
                            />
                          ) : (
                            <span className="text-3xl p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-1">
                              {event.icon}
                            </span>
                          )}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-orange-600 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {event.time}
                              </span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {event.tag}
                              </span>
                            </div>

                            <h3 className="font-black text-base text-slate-900">{event.title}</h3>
                            <p className="text-xs text-slate-500 font-bold">主催・担当: {event.org}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1 font-medium">{event.desc}</p>
                          </div>
                        </div>

                        <div className="pt-2 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1 truncate max-w-[75%]">
                            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="truncate">{stage.stageName} ({stage.location})</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoToMapPin(stage.locationZoneId);
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 px-2.5 py-1 rounded-full font-extrabold transition flex items-center gap-1 shrink-0"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>マップ</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* タブ 4: その他 */}
        {activeTab === "other" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-3xl p-2.5 bg-amber-50 rounded-2xl text-amber-600">⚠️</span>
                <div>
                  <h2 className="font-black text-lg text-slate-900">ご来場にあたってのお願い</h2>
                  <p className="text-xs text-slate-500 font-bold">快適・安全にご参加いただくための注意事項</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-bold">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Info className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>校内での注意事項</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                    <li>校内は<strong className="font-black underline">全面禁煙</strong>です。</li>
                    <li><strong className="font-black underline">酒類の持ち込み・飲酒は厳禁</strong>となっております。</li>
                  </ul>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Car className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ご来場時のお車のご利用について</span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    校内の指定駐車場は駐車台数に大変限りがございます。ご来校の際は可能な限り公共交通機関（路線バス等）のご利用にご協力をお願いいたします。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-3xl p-2.5 bg-amber-50 rounded-2xl text-amber-600">🎟️</span>
                <div>
                  <h2 className="font-black text-lg text-slate-900">金券について</h2>
                  <p className="text-xs text-slate-500 font-bold">模擬店・各種企画での支払い案内</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Ticket className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>支払い・購入ルール</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-amber-900/90 font-medium">
                    <li>模擬店や企画での支払い方法は<strong className="text-amber-950 underline">金券のみ</strong>です。</li>
                    <li>キッチンカーでは<strong className="text-amber-950">金券の使用は不可</strong>となります。</li>
                    <li className="text-amber-900 font-black">※1度につき金券の購入上限は3000円分です。</li>
                    <li>1号館玄関付近の交流ラウンジで購入可能です。</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <RotateCcw className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>払い戻しについて</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    使いきれなかった金券は下記の有効期限内に払い戻し手続きをよろしくお願いします。
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-slate-800 font-extrabold text-[11px]">
                    <p>・一般来場者：10/24(土) 15:00まで</p>
                    <p>・学生・教職員：後日昼休み</p>
                  </div>
                  <p className="text-[11px] text-rose-600 font-black">※以降の払い戻しはできません。</p>
                </div>
              </div>

              <button
                onClick={() => handleGoToMapPin("ticket")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>金券販売（高専祭本部 交流ラウンジ）の場所をマップで確認</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-3xl p-2.5 bg-sky-50 rounded-2xl text-sky-600">🏫</span>
                <div>
                  <h2 className="font-black text-lg text-slate-900">鶴岡高専へのアクセス</h2>
                  <p className="text-xs text-slate-500 font-bold">〒997-8511 山形県鶴岡市井岡字沢田104</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <iframe
                    title="鶴岡工業高等専門学校 Google Map"
                    src="https://maps.google.com/maps?q=38.70950241993693,139.79776942224186&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p className="text-[11px] text-center font-bold text-slate-400">
                  ※ 指やマウス操作で自由な移動・拡大・縮小が可能です
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Navigation className="w-4 h-4 text-sky-600" />
                    <span>JR鶴岡駅から路線バス</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    JR鶴岡駅より庄内交通バス「湯野浜温泉行き（加茂経由）」乗車（約20分）、「高専前」バス停下車すぐ。
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span>お車でお越しの場合</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    山形自動車道「鶴岡IC」より約10分。構内駐車場の誘導に従って駐車してください。
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=38.70950241993693,139.79776942224186"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-xs shadow transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Google マップアプリで開く</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* モーダル1: 出店・施設詳細ダイアログ */}
      {modalItem && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 space-y-4 overflow-y-auto custom-map-scrollbar">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-orange-50 rounded-2xl shrink-0">{modalItem.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                        {modalItem.grade}
                      </span>
                      {modalItem.price && (
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          {modalItem.price}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{modalItem.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{modalItem.dept}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalItem.imageUrl ? (
                <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[360px] relative">
                  <img
                    src={modalItem.imageUrl}
                    alt={modalItem.title}
                    className="w-full h-auto max-h-[360px] object-contain rounded-2xl"
                  />
                </div>
              ) : modalItem.bannerTitle ? (
                <div className={`w-full rounded-2xl p-4 bg-gradient-to-br ${modalItem.bannerColor || "from-slate-800 to-slate-900"} text-white shadow-md relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[120px] border border-white/20 select-none`}>
                  <div className="absolute top-2 left-2.5 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full text-white/90">
                    <ImageIcon className="w-3 h-3" />
                    <span>パンフレット掲載 PR</span>
                  </div>
                  <div className="pt-4 space-y-1">
                    <h4 className="font-black text-lg sm:text-xl drop-shadow-sm tracking-wide">
                      {modalItem.bannerTitle || modalItem.title}
                    </h4>
                    <p className="text-xs text-white/90 font-bold tracking-normal leading-tight px-2">
                      {modalItem.bannerSub || modalItem.description}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2 text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p>{modalItem.description}</p>
              </div>

              {modalItem.menu && (
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-800">🍽️ 取扱・提供メニュー</span>
                  <div className="flex flex-wrap gap-1.5">
                    {modalItem.menu.map((m, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-xl"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{modalItem.location}</span>
                </div>

                {modalItem.instagram && (
                  <a
                    href={modalItem.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-pink-600 hover:underline pt-1"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <span>公式 Instagram を見る</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    const targetZoneId = modalItem.zoneId;
                    if (
                      targetZoneId === "bldg1" ||
                      targetZoneId === "bldg7" ||
                      targetZoneId === "bldg8" ||
                      targetZoneId === "media_center"
                    ) {
                      setDetailMapBuilding(targetZoneId as any);
                      if (modalItem.floor) {
                        setDetailMapFloor(modalItem.floor);
                      } else {
                        setDetailMapFloor(targetZoneId === "bldg8" ? "2階" : "1階");
                      }
                      setModalItem(null);
                    } else {
                      setModalItem(null);
                      handleGoToMapPin(targetZoneId);
                    }
                  }}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>マップで場所を確認</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* モーダル2: スケジュールイベント詳細 */}
      {eventModalItem && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 space-y-4 overflow-y-auto custom-map-scrollbar">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-orange-50 rounded-2xl shrink-0">{eventModalItem.icon}</span>
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                      {eventModalItem.tag}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{eventModalItem.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">主催: {eventModalItem.org}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEventModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {eventModalItem.imageUrl && (
                <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[300px] relative">
                  <img
                    src={eventModalItem.imageUrl}
                    alt={eventModalItem.title}
                    className="w-full h-auto max-h-[300px] object-contain rounded-2xl"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-black text-orange-600 bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>開催時間: {eventModalItem.time}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p>{eventModalItem.desc}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>会場: {eventModalItem.stageName} ({eventModalItem.location})</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    const targetZoneId = eventModalItem.locationZoneId;
                    setEventModalItem(null);
                    if (targetZoneId) {
                      handleGoToMapPin(targetZoneId);
                    }
                  }}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>マップで場所を確認</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* モーダル3: 統合詳細フロアマップモーダル */}
      {detailMapBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            {/* モーダルヘッダー */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-base">フロア詳細マップ</h3>
              </div>
              <button
                onClick={() => setDetailMapBuilding(null)}
                className="p-1 text-slate-400 hover:text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* カテゴリ色凡例 */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-center gap-4 text-[11px] font-black">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 inline-block" />
                <span className="text-amber-950">クラス</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-700 inline-block" />
                <span className="text-blue-950">部活・有志</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-700 inline-block" />
                <span className="text-purple-950">その他・施設</span>
              </span>
            </div>

            {/* 建物切替メインタブ */}
            <div className="flex border-b border-slate-200 bg-slate-200 p-1.5 gap-1 overflow-x-auto">
              {[
                { id: "bldg1", label: "1号館" },
                { id: "bldg7", label: "7号館" },
                { id: "bldg8", label: "8号館" },
                { id: "media_center", label: "総合メディアセンター" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setDetailMapBuilding(b.id as any);
                    setDetailMapFloor(b.id === "bldg8" ? "2階" : "1階");
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    detailMapBuilding === b.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* フロア切替サブタブ (1号館のみ) */}
            {detailMapBuilding === "bldg1" && (
              <div className="flex border-b border-slate-200 bg-slate-100 p-1 gap-1">
                {(["1階", "2階", "3階"] as const).map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setDetailMapFloor(floor)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      detailMapFloor === floor
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            )}

            {/* フロアレイアウトコンテンツ */}
            <div className="p-4 space-y-3 overflow-y-auto bg-slate-100/60 map-container-scrollbar">
              {/* ==================== ① 1号館 ==================== */}
              {detailMapBuilding === "bldg1" && (
                <div className="space-y-3">
                  {/* --- 1号館 1階 --- */}
                  {detailMapFloor === "1階" && (
                    <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                      <div className="min-w-[600px] max-w-[640px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-4 select-none shadow-sm flex flex-col items-center">
                        <div className="font-black text-3xl text-slate-900 mb-2 tracking-wide">
                          1階
                        </div>

                        <div className="w-[580px] h-[320px] relative bg-white">
                          <div className="absolute top-[18px] right-[24px] text-base font-black text-slate-900">
                            4号館
                          </div>

                          {/* 1. 上部横廊下（グレー） */}
                          <div className="absolute top-[50px] left-0 w-full h-8 bg-neutral-600">
                            {/* 411かるた体験：(有志)に統一 */}
                            <button
                              onClick={() => {
                                const stall = getRoomStall("411") || getRoomStall("かるた");
                                if (stall) setModalItem(stall);
                              }}
                              className="absolute -top-3 right-[30px] w-[95px] h-[70px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-1 flex flex-col items-center justify-center font-black hover:bg-blue-100 hover:scale-105 transition shadow-md cursor-pointer text-center leading-tight z-30"
                            >
                              <span className="text-base"></span>
                              <span className="text-xs font-black">411</span>
                              <span className="text-[10px] font-extrabold line-clamp-1">かるた体験</span>
                              <span className="text-[8px] text-blue-800 font-bold">(有志)</span>
                            </button>
                          </div>

                          {/* 2. 中央縦廊下（2階に合わせて幅w-[50px]に統一） */}
                          <div className="absolute top-[82px] left-[268px] w-[50px] h-[72px] bg-neutral-600" />

                          {/* 3. 下部横廊下 */}
                          <div className="absolute top-[154px] left-0 w-full h-8 bg-neutral-600" />

                          {/* 部屋 113, 112, 111 */}
                          <div className="absolute top-[190px] left-[2px] flex gap-1 z-30">
                            {[
                              { id: "113", room: "113", title: "ホスト", grade: "4M", icon: "🌹" },
                              { id: "112", room: "112", title: "ドリンク", grade: "1-2", icon: "🍹" },
                              { id: "111", room: "111", title: "ほっとサンド", grade: "1-1", icon: "🥪" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className="w-[62px] h-[88px] border-[2.5px] border-amber-500 bg-amber-50 text-amber-950 rounded-xl p-0.5 flex flex-col items-center justify-center font-black transition shadow-sm cursor-pointer leading-tight text-center hover:bg-amber-100 hover:scale-105"
                                >
                                  <span className="text-base mb-0.5">{r.icon}</span>
                                  <span className="text-[11px] font-black">{r.room}</span>
                                  <span className="text-[10px] font-extrabold line-clamp-1">{r.title}</span>
                                  <span className="text-[9px] opacity-80 font-bold">({r.grade})</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 4. 入口縦廊下（延長）と△（下に下げて配置） */}
                          <div className="absolute top-[186px] left-[254px] w-[60px] h-[72px] bg-neutral-600 z-10" />
                          <div className="absolute top-[262px] left-[284px] -translate-x-1/2">
                            <RedTriangle />
                          </div>

                          {/* 階段と1階トイレ（追加復元） */}
                          <div className="absolute top-[190px] left-[330px] flex items-center gap-2 z-30">
                            <StairsIcon />
                            <ToiletIcon />
                          </div>

                          {/* △右（階段の下）の「金券販売」と「交流ラウンジ」 */}
                          <div className="absolute top-[232px] left-[330px] flex flex-col gap-1 z-30">
                            <button
                              onClick={() => {
                                const stall = getRoomStall("金券販売") || getRoomStall("金券");
                                if (stall) setModalItem(stall);
                              }}
                              className="w-[88px] h-[36px] border-[2px] border-purple-600 bg-purple-50 text-purple-950 rounded-lg p-0.5 flex items-center justify-center gap-1 font-black transition shadow-sm cursor-pointer hover:bg-purple-100 hover:scale-105"
                            >
                              <span className="text-xs">🎟️</span>
                              <span className="text-[10px] font-black">金券販売</span>
                            </button>
                            <button
                              onClick={() => {
                                const stall = getRoomStall("交流ラウンジ");
                                if (stall) setModalItem(stall);
                              }}
                              className="w-[88px] h-[36px] border-[2px] border-purple-600 bg-purple-50 text-purple-950 rounded-lg p-0.5 flex items-center justify-center gap-1 font-black transition shadow-sm cursor-pointer hover:bg-purple-100 hover:scale-105"
                            >
                              <span className="text-xs">🏫</span>
                              <span className="text-[10px] font-black">交流ラウンジ</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- 1号館 2階 --- */}
                  {detailMapFloor === "2階" && (
                    <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                      <div className="min-w-[600px] max-w-[640px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-4 select-none shadow-sm flex flex-col items-center">
                        <div className="font-black text-3xl text-slate-900 mb-2 tracking-wide">
                          2階
                        </div>

                        <div className="w-[580px] h-[300px] relative bg-white">
                          {/* 1. 上部横廊下（「7号館へ ↓」追加） */}
                          <div className="absolute top-[54px] left-0 w-full h-8 bg-neutral-600 flex items-center justify-end pr-4">
                            <span className="text-[10px] font-black text-white tracking-tight">7号館へ ↓</span>
                          </div>

                          {/* 2. 中央縦廊下 */}
                          <div className="absolute top-[86px] left-[268px] w-[50px] h-[98px] bg-neutral-600 z-10" />

                          {/* 部屋 123(4Iカジノ), 12Fゼミ室, 122, 121 */}
                          <div className="absolute top-[90px] left-[2px] flex gap-1 z-30">
                            {[
                              { id: "123", room: "123", title: "カジノ", grade: "4I", icon: "🎲", type: "class" },
                              { id: "12Fゼミ室", room: "12Fゼミ", title: "美術写真", grade: "美術写真部", icon: "🖼️", type: "club" },
                              { id: "122", room: "122", title: "クレープ", grade: "1-4", icon: "🥞", type: "class" },
                              { id: "121", room: "121", title: "わたあめ", grade: "1-3", icon: "🍥", type: "class" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              const isClub = r.type === "club";
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className={`w-[62px] h-[88px] border-[2.5px] ${
                                    isClub
                                      ? "border-blue-600 bg-blue-50 text-blue-950 hover:bg-blue-100"
                                      : "border-amber-500 bg-amber-50 text-amber-950 hover:bg-amber-100"
                                  } rounded-xl p-0.5 flex flex-col items-center justify-center font-black transition shadow-sm cursor-pointer leading-tight text-center hover:scale-105`}
                                >
                                  <span className="text-base mb-0.5">{r.icon}</span>
                                  <span className="text-[11px] font-black">{r.room}</span>
                                  <span className="text-[10px] font-extrabold line-clamp-1">{r.title}</span>
                                  <span className="text-[9px] opacity-80 font-bold">({r.grade})</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 合同講義室 */}
                          <button
                            onClick={() => {
                              const stall = getRoomStall("合同講義室");
                              if (stall) setModalItem(stall);
                            }}
                            className="absolute top-[184px] left-[253px] w-[80px] h-[76px] border-[2.5px] border-purple-600 bg-purple-50 text-purple-950 rounded-xl p-1 flex flex-col items-center justify-center font-black hover:bg-purple-100 hover:scale-105 transition shadow-md cursor-pointer text-center leading-tight z-30"
                          >
                            <span className="text-base mb-0.5">🎮</span>
                            <span className="text-xs font-black">合同講義室</span>
                            <span className="text-[9px] text-purple-800 font-extrabold line-clamp-1">今日、ゲームに…</span>
                            <span className="text-[8px] text-purple-700 font-bold">(実行委)</span>
                          </button>

                          {/* 階段・トイレ */}
                          <div className="absolute top-[90px] left-[330px] flex items-center gap-2 z-30">
                            <StairsIcon />
                            <ToiletIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- 1号館 3階 --- */}
                  {detailMapFloor === "3階" && (
                    <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                      <div className="min-w-[600px] max-w-[640px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-4 select-none shadow-sm flex flex-col items-center">
                        <div className="font-black text-3xl text-slate-900 mb-2 tracking-wide">
                          3階
                        </div>

                        <div className="w-[580px] h-[300px] relative bg-white">
                          {/* 1. 上部横廊下（「7号館へ ↓」追加） */}
                          <div className="absolute top-[54px] left-0 w-full h-8 bg-neutral-600 flex items-center justify-end pr-[100px]">
                            <span className="text-[10px] font-black text-white tracking-tight">7号館へ ↓</span>
                          </div>

                          {/* 中会議室：(有志)に統一 */}
                          <button
                            onClick={() => {
                              const stall = getRoomStall("中会議室") || getRoomStall("ボードゲーム");
                              if (stall) setModalItem(stall);
                            }}
                            className="absolute top-[26px] right-0 w-[90px] h-[88px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-0.5 flex flex-col items-center justify-center font-black hover:bg-blue-100 hover:scale-105 transition shadow-md cursor-pointer text-center leading-tight z-30"
                          >
                            <span className="text-base mb-0.5">🎲</span>
                            <span className="text-[11px] font-black">中会議室</span>
                            <span className="text-[10px] font-extrabold text-blue-900 line-clamp-1">ボードゲーム</span>
                            <span className="text-[8px] text-blue-800 font-bold">(有志)</span>
                          </button>

                          {/* 2. 中央縦廊下 */}
                          <div className="absolute top-[86px] left-[268px] w-[50px] h-[98px] bg-neutral-600" />

                          {/* 部屋 13Fゼミ室, 133, 132, 131 */}
                          <div className="absolute top-[90px] left-[2px] flex gap-1 z-30">
                            {[
                              { id: "13Fゼミ室", room: "13Fゼミ", title: "プラネタリウム", grade: "天文部", icon: "🌌", type: "club" },
                              { id: "133", room: "133", title: "バー", grade: "3I", icon: "🍸", type: "class" },
                              { id: "132", room: "132", title: "喫茶店", grade: "3B", icon: "☕", type: "class" },
                              { id: "131", room: "131", title: "ゲームカフェ", grade: "3E", icon: "🎮", type: "class" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              const isClub = r.type === "club";
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className={`w-[62px] h-[88px] border-[2.5px] ${
                                    isClub
                                      ? "border-blue-600 bg-blue-50 text-blue-950 hover:bg-blue-100"
                                      : "border-amber-500 bg-amber-50 text-amber-950 hover:bg-amber-100"
                                  } rounded-xl p-0.5 flex flex-col items-center justify-center font-black transition shadow-sm cursor-pointer leading-tight text-center hover:scale-105`}
                                >
                                  <span className="text-base mb-0.5">{r.icon}</span>
                                  <span className="text-[11px] font-black">{r.room}</span>
                                  <span className="text-[10px] font-extrabold line-clamp-1">{r.title}</span>
                                  <span className="text-[9px] opacity-80 font-bold">({r.grade})</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 大会議室 */}
                          <button
                            onClick={() => {
                              const stall = getRoomStall("大会議室");
                              if (stall) setModalItem(stall);
                            }}
                            className="absolute top-[188px] left-[258px] w-[70px] h-[72px] border-[2.5px] border-purple-600 bg-purple-50 text-purple-950 rounded-xl p-1 flex flex-col items-center justify-center font-black hover:bg-purple-100 hover:scale-105 transition shadow-sm cursor-pointer text-center leading-tight z-30"
                          >
                            <span className="text-base mb-0.5">🏫</span>
                            <span className="text-xs font-black">大会議室</span>
                          </button>

                          {/* 階段・トイレ（2階と位置を完全揃え top-[90px] left-[330px] gap-2） */}
                          <div className="absolute top-[90px] left-[330px] flex items-center gap-2 z-30">
                            <StairsIcon />
                            <ToiletIcon />
                          </div>

                          {/* 小会議室 */}
                          <button
                            onClick={() => {
                              const stall = getRoomStall("小会議室");
                              if (stall) setModalItem(stall);
                            }}
                            className="absolute top-[90px] left-[420px] w-[62px] h-[88px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-0.5 flex flex-col items-center justify-center font-black hover:bg-blue-100 hover:scale-105 transition shadow-sm cursor-pointer text-center leading-tight z-30 shrink-0"
                          >
                            <span className="text-base mb-0.5">🌌</span>
                            <span className="text-[10px] font-black">小会議室</span>
                            <span className="text-[9px] font-extrabold">天体写真</span>
                            <span className="text-[8px] text-blue-800 font-bold">(天文部)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== ② 7号館 ==================== */}
              {detailMapBuilding === "bldg7" && (
                <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                  <div className="min-w-[560px] max-w-[620px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                    <div className="text-center font-black text-2xl sm:text-3xl text-slate-900 mb-6">
                      7号館詳細
                    </div>

                    <div className="grid grid-cols-3 gap-4 divide-x-2 divide-slate-200">
                      {/* --- 1階 --- */}
                      <div className="pr-2 flex flex-col items-center space-y-3">
                        <div className="font-black text-xl text-slate-900">1階</div>
                        <button
                          onClick={() => {
                            const stall = getRoomStall("711") || getRoomStall("お化け屋敷");
                            if (stall) setModalItem(stall);
                          }}
                          className="w-full h-[152px] border-[2.5px] border-amber-500 bg-amber-50 text-amber-950 rounded-xl p-2 flex flex-col items-center justify-center font-black text-xs text-center leading-snug hover:bg-amber-100 transition shadow-sm cursor-pointer hover:scale-105"
                        >
                          <span className="text-2xl mb-1">👻</span>
                          <span className="text-sm font-black">711・712</span>
                          <span className="text-amber-900 font-extrabold text-sm mt-0.5">お化け屋敷</span>
                          <span className="text-[11px] font-black mt-0.5">(3M)</span>
                        </button>
                        <div className="flex items-center gap-2 pt-2">
                          <StairsIcon />
                          <ToiletIcon />
                        </div>
                      </div>

                      {/* --- 2階 --- */}
                      <div className="px-2 flex flex-col items-center space-y-3">
                        <div className="font-black text-xl text-slate-900">2階</div>
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => {
                              const stall = getRoomStall("721") || getRoomStall("研究発表");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[72px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-blue-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-xs font-black">721教室</span>
                            <span className="text-blue-900 font-extrabold text-[11px]">研究発表</span>
                            <span className="text-[9px] text-blue-800 font-bold">(5B)</span>
                          </button>
                          <button
                            onClick={() => {
                              const stall = getRoomStall("722") || getRoomStall("キッキングスナイパー");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[72px] border-[2.5px] border-amber-500 bg-amber-50 text-amber-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-amber-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-xs font-black">722教室</span>
                            <span className="text-amber-900 font-extrabold text-[11px]">キッキングスナイパー</span>
                            <span className="text-[10px] font-black">(4E)</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <StairsIcon />
                        </div>
                      </div>

                      {/* --- 3階 --- */}
                      <div className="pl-2 flex flex-col items-center space-y-3">
                        <div className="font-black text-xl text-slate-900">3階</div>
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => {
                              const stall = getRoomStall("731") || getRoomStall("AMデザイン部");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[72px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-blue-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-xs font-black">731教室</span>
                            <span className="text-blue-900 font-extrabold text-[11px]">3Dプリンタ体験</span>
                            <span className="text-[9px] text-blue-800 font-bold">(AMデザイン部)</span>
                          </button>
                          <button
                            onClick={() => {
                              const stall = getRoomStall("E.S.S.");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[72px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-blue-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-xs font-black">732教室</span>
                            <span className="text-blue-900 font-extrabold text-[11px]">Little World</span>
                            <span className="text-[9px] text-blue-800 font-bold">(E.S.S.)</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <StairsIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== ③ 8号館 ==================== */}
              {detailMapBuilding === "bldg8" && (
                <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                  <div className="min-w-[560px] max-w-[620px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                    <div className="text-center font-black text-2xl sm:text-3xl text-slate-900 mb-6">
                      8号館詳細
                    </div>

                    <div className="grid grid-cols-2 gap-6 divide-x-2 divide-slate-200">
                      {/* --- 2階（トイレ女子のみ） --- */}
                      <div className="pr-4 flex flex-col items-center">
                        <div className="font-black text-2xl text-slate-900 mb-3">2階</div>

                        <button
                          onClick={() => {
                            const stall = getRoomStall("吹奏楽部");
                            if (stall) setModalItem(stall);
                          }}
                          className="w-full h-28 sm:h-32 border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-2 flex flex-col items-center justify-center font-black text-xs sm:text-sm text-center leading-snug hover:bg-blue-100 transition shadow-sm mb-0 z-10 cursor-pointer"
                        >
                          <span className="text-blue-900 font-black">吹奏楽部演奏会</span>
                          <span className="text-slate-500 text-[10px]">(10時〜11時)</span>
                          <span className="text-purple-900 font-black mt-1">学校説明会</span>
                          <span className="text-slate-500 text-[10px]">(13時受付 / 13:30〜15:00)</span>
                        </button>

                        <div className="relative w-10 bg-neutral-600 h-40 flex flex-col items-center justify-end pb-2">
                          <div className="absolute -left-10 top-4">
                            <StairsIcon />
                          </div>
                          <div className="absolute -right-10 top-4">
                            <FemaleToiletIcon />
                          </div>
                          <div className="text-xs font-black text-white text-center leading-tight whitespace-nowrap [writing-mode:vertical-rl] [text-orientation:upright] tracking-wider">
                            １・４号館へ ↓
                          </div>
                        </div>
                      </div>

                      {/* --- 3階（トイレ男子のみ） --- */}
                      <div className="pl-6 flex flex-col items-center">
                        <div className="font-black text-2xl text-slate-900 mb-3">3階</div>

                        <button
                          onClick={() => {
                            const stall = getRoomStall("学校説明会");
                            if (stall) setModalItem(stall);
                          }}
                          className="w-full h-28 sm:h-32 border-[2.5px] border-purple-600 bg-purple-50 text-purple-950 rounded-xl p-2 flex flex-col items-center justify-center font-black text-xs sm:text-sm text-center leading-snug hover:bg-purple-100 transition shadow-sm mb-0 z-10 cursor-pointer"
                        >
                          <span>中学生向け</span>
                          <span>学校説明会</span>
                        </button>

                        <div className="relative w-10 bg-neutral-600 h-40">
                          <div className="absolute -left-10 top-4">
                            <StairsIcon />
                          </div>
                          <div className="absolute -right-10 top-4">
                            <MaleToiletIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== ④ 総合メディアセンター ==================== */}
              {detailMapBuilding === "media_center" && (
                <div className="w-full overflow-x-auto map-container-scrollbar pb-2">
                  <div className="min-w-[560px] max-w-[620px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                    <div className="text-center font-black text-2xl sm:text-3xl text-slate-900 mb-6">
                      総合メディアセンター詳細
                    </div>

                    <div className="grid grid-cols-2 gap-6 divide-x-2 divide-slate-200">
                      {/* --- 1階 --- */}
                      <div className="pr-4 flex flex-col items-center space-y-3">
                        <div className="font-black text-xl text-slate-900">1階</div>
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => {
                              const stall = getRoomStall("多目的交流室") || getRoomStall("ロボット");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[76px] border-[2.5px] border-blue-600 bg-blue-50 text-blue-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-blue-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-base mb-0.5">🤖</span>
                            <span className="text-xs font-black">多目的交流室</span>
                            <span className="text-blue-900 font-extrabold text-[10px]">ロボコン展示・体験</span>
                            <span className="text-[8px] text-blue-800 font-bold">(ロボット部)</span>
                          </button>
                          <button
                            onClick={() => {
                              const stall = getRoomStall("デジタルサロン");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[76px] border-[2.5px] border-purple-600 bg-purple-50 text-purple-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-purple-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-base mb-0.5">💻</span>
                            <span className="text-xs font-black">デジタルサロン</span>
                            <span className="text-purple-900 font-extrabold text-[10px]">展示・情報スペース</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <StairsIcon />
                          <ToiletIcon />
                        </div>
                      </div>

                      {/* --- 2階 --- */}
                      <div className="pl-6 flex flex-col items-center space-y-3">
                        <div className="font-black text-xl text-slate-900">2階</div>
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => {
                              const stall = getRoomStall("図書館");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[76px] border-[2.5px] border-purple-600 bg-purple-50 text-purple-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-purple-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-base mb-0.5">📚</span>
                            <span className="text-xs font-black">図書館</span>
                            <span className="text-purple-900 font-extrabold text-[10px]">図書閲覧・学習</span>
                          </button>
                          <button
                            onClick={() => {
                              const stall = getRoomStall("マルチメディア") || getRoomStall("4B");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-full h-[76px] border-[2.5px] border-amber-500 bg-amber-50 text-amber-950 rounded-xl p-1.5 flex flex-col items-center justify-center font-black text-xs text-center leading-tight hover:bg-amber-100 transition shadow-sm cursor-pointer hover:scale-105"
                          >
                            <span className="text-base mb-0.5">🍷</span>
                            <span className="text-xs font-black">マルチメディア教室</span>
                            <span className="text-amber-900 font-extrabold text-[10px]">格付けチェック</span>
                            <span className="text-[9px] font-black">(4B)</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <StairsIcon />
                          <ToiletIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}