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
  AlertTriangle,
  Globe,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Ticket,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

// --- 統一マップ記号コンポーネント（トイレ・階段・赤三角形▲・波線SS） ---

const ToiletIcon = () => (
  <div className="bg-black text-white px-1.5 py-1 rounded-md flex items-center justify-center gap-0.5 shadow-sm min-w-[32px] h-[30px] border border-black select-none shrink-0">
    <svg className="w-3.5 h-4 fill-current" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M12 8c-2 0-3.5 1-4 3l-1.5 5h3v5h5v-5h3l-1.5-5c-.5-2-2-3-4-3z" />
    </svg>
    <div className="w-[1px] h-4 bg-white/60" />
    <svg className="w-3.5 h-4 fill-current" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="3" />
      <path d="M9 8h6v7h-1.5v6h-3v-6H9V8z" />
    </svg>
  </div>
);

const StairsIcon = () => (
  <div className="flex flex-col items-center select-none shrink-0">
    <svg
      className="w-7 h-7 text-slate-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 19h4v-4h4v-4h4V7" />
    </svg>
  </div>
);

const RedTriangle = () => (
  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[18px] border-b-red-600 drop-shadow-sm select-none" />
);

const BreakLineSS = () => (
  <svg
    className="w-5 h-8 text-black select-none shrink-0"
    viewBox="0 0 20 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
  >
    <path d="M4 2 C12 8, 12 12, 4 18 C12 24, 12 28, 4 30" />
    <path d="M12 2 C20 8, 20 12, 12 18 C20 24, 20 28, 12 30" />
  </svg>
);

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
  floor?: "1F" | "2F" | "3F";
  roomNo?: string;
  description: string;
  icon: string;
  instagram?: string;
  menu?: string[];
}

// 全出店・企画・施設データ
const STALLS_DATA: StallItem[] = [
  // --- 1号館 (bldg1) 1F ---
  {
    id: 1,
    title: "ほっとサンド",
    category: "模擬店",
    grade: "1-1",
    dept: "1年1組",
    location: "1号館 1F 111教室",
    zoneId: "bldg1",
    floor: "1F",
    roomNo: "111",
    description: "1-1による熱々で外はサクッ、中はジュワッ！香ばしい絶品ほっとサンド！",
    icon: "🥪",
    menu: ["ほっとサンド"],
  },
  {
    id: 2,
    title: "ドリンク",
    category: "模擬店",
    grade: "1-2",
    dept: "1年2組",
    location: "1号館 1F 112教室",
    zoneId: "bldg1",
    floor: "1F",
    roomNo: "112",
    description: "1-2がお届けする冷たくてシュワっと美味しい各種ソフトドリンク！",
    icon: "🍹",
    menu: ["ソフトドリンク各種"],
  },
  {
    id: 13,
    title: "ホスト",
    category: "クラス企画",
    grade: "4M",
    dept: "4年 機械コース (4M)",
    location: "1号館 1F 113教室",
    zoneId: "bldg1",
    floor: "1F",
    roomNo: "113",
    description: "4Mのメンバーが華麗にお出迎え！？非日常の最高のおもてなし空間！",
    icon: "🌹",
  },
  {
    id: 307,
    title: "かるた体験（見学・体験）",
    category: "部活動企画",
    grade: "有志",
    dept: "かるた体験",
    location: "4号館 412教室",
    zoneId: "bldg4",
    roomNo: "412",
    description: "競技かるたの見学および実際の体験コーナー！初心者歓迎！",
    icon: "🎴",
  },

  // --- 1号館 (bldg1) 2F ---
  {
    id: 3,
    title: "わたあめ",
    category: "模擬店",
    grade: "1-3",
    dept: "1年3組",
    location: "1号館 2F 121教室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "121",
    description: "1-3作！フワフワ甘くて可愛いビッグわたあめ！",
    icon: "🍥",
    menu: ["わたあめ"],
  },
  {
    id: 4,
    title: "クレープ",
    category: "模擬店",
    grade: "1-4",
    dept: "1年4組",
    location: "1号館 2F 122教室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "122",
    description: "1-4手作り生地のボリューム満点トッピングクレープ！",
    icon: "🥞",
    menu: ["手作りクレープ"],
  },
  {
    id: 10,
    title: "ゲームカフェ",
    category: "クラス企画",
    grade: "3E",
    dept: "3年 電気・電子コース (3E)",
    location: "1号館 2F 123教室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "123",
    description: "3Eみんなでワイワイ楽しめる対戦ゲーム＆レトロゲームが揃ったゲームカフェ！",
    icon: "🎮",
  },
  {
    id: 302,
    title: "美術写真部（作品展示・看板展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "美術写真部",
    location: "1号館 2F 12Fゼミ室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "12Fゼミ室",
    description: "絵画・写真作品や高専祭を彩る各種看板作品の展示。",
    icon: "🖼️",
  },
  {
    id: 401,
    title: "今日、ゲームになりました。",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "1号館 2F 合同講義室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "合同講義室",
    description: "大画面での白熱ゲームトーナメント＆対戦アトラクション！",
    icon: "🎮",
  },

  // --- 1号館 (bldg1) 3F ---
  {
    id: 15,
    title: "カジノ",
    category: "クラス企画",
    grade: "4I",
    dept: "4年 情報コース (4I)",
    location: "1号館 3F 131教室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "131",
    description: "4I特製カジノ！本格的なテーブルゲームでスリリングな心理戦を楽しもう！",
    icon: "🎲",
  },
  {
    id: 11,
    title: "バー",
    category: "クラス企画",
    grade: "3I",
    dept: "3年 情報コース (3I)",
    location: "1号館 3F 132教室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "132",
    description: "3Iがお届けするおしゃれで落ち着いた雰囲気のノンアルコールバー！",
    icon: "🍸",
  },
  {
    id: 12,
    title: "喫茶店",
    category: "クラス企画",
    grade: "3B",
    dept: "3年 生物・化学コース (3B)",
    location: "1号館 3F 133教室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "133",
    description: "3Bによるゆったり寛げる特製喫茶店！こだわりのドリンクでおもてなし。",
    icon: "☕",
  },
  {
    id: 301,
    title: "天文部（写真展示・プラネタリウム）",
    category: "部活動企画",
    grade: "部活",
    dept: "天文部",
    location: "1号館 3F 13Fゼミ室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "13Fゼミ室",
    description: "天体写真展示および手作りドームによる幻想的なプラネタリウム上映！",
    icon: "🌌",
  },
  {
    id: 310,
    title: "大会議室（展示・企画）",
    category: "校内施設・その他",
    grade: "施設",
    dept: "各系展示",
    location: "1号館 3F 大会議室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "大会議室",
    description: "1号館3Fに位置する大会議室。各種展示・研究紹介ブースが設置されています。",
    icon: "🏛️",
  },
  {
    id: 311,
    title: "小会議室（展示・研究）",
    category: "校内施設・その他",
    grade: "施設",
    dept: "各種展示",
    location: "1号館 3F 小会議室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "小会議室",
    description: "1号館3Fに位置する小会議室。作品・資料展示スペースです。",
    icon: "🏢",
  },

  // --- 第一体育館 (gym1) ---
  {
    id: 5,
    title: "餃子",
    category: "模擬店",
    grade: "2M",
    dept: "2年 機械コース (2M)",
    location: "第一体育館",
    zoneId: "gym1",
    description: "2M特製！鉄板で一気に焼き上げるパリッとジューシーな絶品焼き餃子！",
    icon: "🥟",
    menu: ["特製焼き餃子"],
  },
  {
    id: 6,
    title: "ポップコーン",
    category: "模擬店",
    grade: "2E",
    dept: "2年 電気・電子コース (2E)",
    location: "第一体育館",
    zoneId: "gym1",
    description: "2Eがお届けする弾ける香ばしさ！選べるフレーバーポップコーン！",
    icon: "🍿",
    menu: ["フレーバーポップコーン"],
  },
  {
    id: 7,
    title: "玉こん",
    category: "模擬店",
    grade: "2I",
    dept: "2年 情報コース (2I)",
    location: "第一体育館",
    zoneId: "gym1",
    description: "2I秘伝の出汁がしっかり染み込んだ熱々の山形名物・玉こんにゃく！",
    icon: "🍡",
    menu: ["山形名物 玉こんにゃく"],
  },
  {
    id: 8,
    title: "焼き鳥",
    category: "模擬店",
    grade: "2B",
    dept: "2年 生物・化学コース (2B)",
    location: "第一体育館",
    zoneId: "gym1",
    description: "2B香ばしく焼き上げる秘伝タレ＆塩のやみつき焼き鳥！",
    icon: "🍢",
    menu: ["やみつき焼き鳥"],
  },

  // --- 第二体育館 (gym2) ---
  {
    id: 303,
    title: "音楽部（音楽ライブ）",
    category: "部活動企画",
    grade: "部活",
    dept: "音楽部",
    location: "第二体育館",
    zoneId: "gym2",
    description: "バンド演奏による熱いロック＆ポップスサウンドをお届け！（10:00〜15:00）",
    icon: "🎸",
  },

  // --- 8号館 (bldg8) ---
  {
    id: 308,
    title: "吹奏楽部 ミニコンサート",
    category: "部活動企画",
    grade: "部活",
    dept: "吹奏楽部",
    location: "8号館 2F 大講義室",
    zoneId: "bldg8",
    floor: "2F",
    roomNo: "吹奏楽部演奏会",
    description: "吹奏楽部によるミニコンサート（9:00〜11:45）！素敵な演奏をお楽しみください！",
    icon: "🎷",
  },
  {
    id: 503,
    title: "学校説明会",
    category: "校内施設・その他",
    grade: "案内",
    dept: "広報・入試",
    location: "8号館 2F / 3F 大講義室",
    zoneId: "bldg8",
    floor: "2F",
    roomNo: "学校説明会",
    description: "中学生・保護者の皆様に向けた学校説明会（13:00〜14:00）。",
    icon: "🏫",
  },

  // --- 総合メディアセンター (media_center) ---
  {
    id: 16,
    title: "格付けチェック",
    category: "クラス企画",
    grade: "4B",
    dept: "4年 生物・化学コース (4B)",
    location: "総合メディアセンター 2F マルチメディア教室",
    zoneId: "media_center",
    roomNo: "マルチメディア室",
    description: "4Bあなたの一流度が試される！高級品と激安品を見破れるか！？",
    icon: "🍷",
  },
  {
    id: 309,
    title: "ロボット研究部（ロボット展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "ロボット研究部",
    location: "総合メディアセンター 1F 多目的交流室",
    zoneId: "media_center",
    floor: "1F",
    roomNo: "多目的交流室",
    description: "自作ロボットのデモ実演および操縦体験コーナー！",
    icon: "🤖",
  },
  {
    id: 312,
    title: "デジタルサロン（作品展示）",
    category: "校内施設・その他",
    grade: "施設",
    dept: "情報基盤",
    location: "総合メディアセンター 1F デジタルサロン",
    zoneId: "media_center",
    floor: "1F",
    roomNo: "デジタルサロン",
    description: "デジタルコンテンツ作品展示および体験コーナーです。",
    icon: "💻",
  },

  // --- 7号館 (bldg7) ---
  {
    id: 9,
    title: "お化け屋敷",
    category: "クラス企画",
    grade: "3M",
    dept: "3年 機械コース (3M)",
    location: "7号館 (711・712教室)",
    zoneId: "bldg7",
    description: "3Mギミック満載！機械コースの技術を結集した本格的な恐怖があなたを襲う…！",
    icon: "👻",
  },
  {
    id: 14,
    title: "キッキングスナイパー",
    category: "クラス企画",
    grade: "4E",
    dept: "4年 電気・電子コース (4E)",
    location: "7号館 722教室",
    zoneId: "bldg7",
    description: "4E動くターゲットを狙って力強くシュート！高得点を狙って豪華景品をゲット！",
    icon: "⚽",
  },

  // --- キッチンカー (entrance) ---
  {
    id: 101,
    title: "ラーメン もっけだの",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "スープと麺にこだわり抜いた自慢の本格ラーメン！高専祭で味わう極上の一杯！",
    icon: "🍜",
    instagram: "https://www.instagram.com/mokkedanonoodle/",
    menu: ["ラーメン"],
  },
  {
    id: 102,
    title: "祇園はんなりCafé",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "とろける口溶けの本格本わらび餅や、出来立てふわふわのベビーカステラ！",
    icon: "🍡",
    instagram: "https://www.instagram.com/gion_hannari_cafe/",
    menu: ["本わらび餅", "ベビーカステラ等"],
  },
  {
    id: 103,
    title: "フェリチタプラス",
    category: "キッチンカー",
    grade: "外部",
    dept: "キッチンカー",
    location: "学生昇降口前ロータリー",
    zoneId: "entrance",
    description: "フルーツたっぷりのフレッシュスムージー＆スパイシーで食欲をそそる本格ガパオライス！",
    icon: "🥤",
    instagram: "https://www.instagram.com/felicitaplus.sakata/",
    menu: ["スムージー", "ガパオライス等"],
  },

  // --- 金券・本部・その他 ---
  {
    id: 501,
    title: "金券販売",
    category: "校内施設・その他",
    grade: "本部",
    dept: "実行委員会",
    location: "1号館 1F 金券販売",
    zoneId: "ticket",
    floor: "1F",
    roomNo: "金券販売",
    description: "模擬店等で使用できる金券の販売を行っています。お買い求めはこちらでどうぞ！",
    icon: "🎟️",
  },
  {
    id: 504,
    title: "本部",
    category: "校内施設・その他",
    grade: "本部",
    dept: "実行委員会",
    location: "1号館 1F 本部",
    zoneId: "bldg1",
    floor: "1F",
    roomNo: "本部",
    description: "高専祭実行委員会本部です。落とし物やご案内はこちらまでお越しください。",
    icon: "🏫",
  },
];

// ステージ・タイムスケジュールデータ
const EVENTS_DATA = [
  {
    stageId: "gym2",
    stageName: "第二体育館",
    location: "第二体育館",
    locationZoneId: "gym2",
    schedule: [
      {
        id: "g2_1",
        time: "10:00 - 15:00",
        startTime: "10:00",
        endTime: "15:00",
        title: "音楽部 ライブステージ",
        org: "音楽部",
        desc: "バンド演奏による熱いロック＆ポップスサウンドをお届け！",
        tag: "ライブ",
        icon: "🎸",
      },
    ],
  },
  {
    stageId: "gym1",
    stageName: "第一体育館",
    location: "第一体育館",
    locationZoneId: "gym1",
    schedule: [
      {
        id: "g1_1",
        time: "10:00 - 11:00",
        startTime: "10:00",
        endTime: "11:00",
        title: "腕立て選手権 あつまれ きんにくの森",
        org: "実行委員会",
        desc: "筋肉自慢の高専生が集結！極限の腕立て伏せバトル！",
        tag: "競技・企画",
        icon: "💪",
      },
      {
        id: "g1_2",
        time: "12:00 - 13:00",
        startTime: "12:00",
        endTime: "13:00",
        title: "漫才 鶴専-1グランプリ",
        org: "有志企画",
        desc: "高専生のお笑いNo.1を決める爆笑必至の漫才グランプリ！",
        tag: "お笑い",
        icon: "🎙",
      },
      {
        id: "g1_3",
        time: "13:30 - 14:30",
        startTime: "13:30",
        endTime: "14:30",
        title: "ダンス DoKa Project",
        org: "ダンス部・有志",
        desc: "圧倒的なパフォーマンスと熱量でお届けするダンスステージ！",
        tag: "ダンス",
        icon: "💃",
      },
    ],
  },
];

// 校内マップのピン座標
const CAMPUS_ZONES = [
  {
    id: "gym2",
    name: "第二体育館",
    subName: "音楽部ライブ会場 (10:00〜15:00)",
    pinLabel: "第二体育館",
    lightBg: "bg-purple-50 border-purple-300 text-purple-900",
    icon: "🎸",
    top: "56.0%",
    left: "6.4%",
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
    desc: "4B格付けチェック（マルチメディア教室）およびロボ研（多目的交流室）を開催！",
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
    name: "1号館・合同講義室",
    subName: "一般教室棟・文化部展示",
    pinLabel: "1号館",
    lightBg: "bg-blue-50 border-blue-300 text-blue-900",
    icon: "🏫",
    top: "30.4%",
    left: "69.8%",
    desc: "1F〜3Fのクラス企画・模擬店をはじめ、合同講義室でのゲーム企画が実施されています。",
  },
  {
    id: "bldg8",
    name: "8号館（大講義室）",
    subName: "ミニコンサート・学校説明会",
    pinLabel: "8号館",
    lightBg: "bg-emerald-50 border-emerald-300 text-emerald-900",
    icon: "🎷",
    top: "26.5%",
    left: "91.5%",
    desc: "2階・3階にて吹奏楽部ミニコンサートおよび学校説明会を開催！",
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
    desc: "3Mお化け屋敷、4Eキッキングスナイパーを開催！",
  },
  {
    id: "entrance",
    name: "学生昇降口前広場",
    subName: "学校紹介・キッチンカー",
    pinLabel: "学生昇降口前広場",
    lightBg: "bg-amber-50 border-amber-300 text-amber-900",
    icon: "🚚",
    top: "55.1%",
    left: "77.4%",
    desc: "キッチンカー3店が集結！",
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

export default function Page() {
  const [isEntered, setIsEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "stalls" | "events" | "access">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<StallItem | null>(null);

  // マップの初期ズーム倍率 3.0倍 (300%)
  const [zoomLevel, setZoomLevel] = useState<number>(3.0);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  // 詳細マップモーダル用ステート (1号館 / 8号館 / 総合メディアセンター)
  const [detailMapBuilding, setDetailMapBuilding] = useState<"bldg1" | "bldg8" | "media_center" | null>(null);
  const [detailMapFloor, setDetailMapFloor] = useState<"1F" | "2F" | "3F">("1F");

  // 現在時刻ステート
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
        scrollToRightSide(false);
        requestAnimationFrame(() => {
          setIsMapReady(true);
        });
      }, 50);
      return () => (clearImmediate ? clearImmediate(timer) : clearTimeout(timer));
    }
  }, [isEntered, activeTab]);

  const zoomLevelRef = useRef(zoomLevel);
  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

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

  // 1. 入場前トップ画面
  if (!isEntered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden select-none font-sans">
        <div className="w-full max-w-sm flex flex-col items-center text-center z-10 my-auto space-y-6">
          <div className="text-teal-600 font-extrabold text-xs tracking-[0.25em]">
            TSURUOKA KOSEN FESTIVAL 2026
          </div>

          <div className="text-5xl sm:text-6xl font-black text-[#E53935] tracking-tight">
            高専祭
          </div>

          <div className="bg-white/95 border border-slate-200/80 shadow-md rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-xs font-extrabold text-slate-700">
            <span className="text-rose-600">高専祭</span>
            <span className="text-slate-300">|</span>
            <span>10:00〜15:00</span>
            <span className="text-slate-400 font-normal">@鶴岡高専</span>
          </div>

          <button
            onClick={() => setIsEntered(true)}
            className="w-full max-w-[260px] py-4 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white text-base font-black tracking-wider shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>プログラムを見る</span>
            <span>⚙️</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. 入場後メインアプリ
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans relative">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <button onClick={() => setIsEntered(false)} className="flex items-center gap-2 text-left">
            <span className="font-black text-base text-slate-800">高専祭</span>
            <span className="text-[10px] font-extrabold text-orange-600">10:00〜15:00</span>
          </button>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === "map" ? "bg-orange-500 text-white" : "text-slate-600"
              }`}
            >
              マップ
            </button>
            <button
              onClick={() => setActiveTab("stalls")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === "stalls" ? "bg-orange-500 text-white" : "text-slate-600"
              }`}
            >
              企画一覧
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === "events" ? "bg-orange-500 text-white" : "text-slate-600"
              }`}
            >
              スケジュール
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === "access" ? "bg-orange-500 text-white" : "text-slate-600"
              }`}
            >
              アクセス
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 pb-12 space-y-4">
        {activeTab === "map" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>校内マップ</span>
              <div className="flex items-center gap-1 bg-white border rounded-full p-1 shadow-sm">
                <button onClick={handleZoomOut} className="p-1"><ZoomOut className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] font-black">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1"><ZoomIn className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div
              ref={mapContainerRef}
              className="w-full overflow-auto rounded-3xl border-2 border-slate-200 bg-slate-200 relative aspect-[2.37/1]"
            >
              <div ref={mapContentRef} style={{ width: `${zoomLevel * 100}%` }} className="relative aspect-[2.37/1]">
                <img src="/校内図.jpeg" alt="校内図" className="w-full h-full object-contain pointer-events-none" />

                {CAMPUS_ZONES.map((zone) => (
                  <div key={zone.id} style={{ top: zone.top, left: zone.left }} className="absolute -translate-x-1/2 -translate-y-full">
                    <button
                      onClick={() => setSelectedZoneId((prev) => (prev === zone.id ? null : zone.id))}
                      className="w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white hover:scale-110 transition"
                    >
                      📍
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {currentZone ? (
              <div className={`rounded-3xl p-5 border shadow-sm space-y-4 ${currentZone.lightBg}`}>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-xl font-black">{currentZone.name}</h3>
                    <p className="text-xs font-bold opacity-80">{currentZone.subName}</p>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-white/90 rounded-full shadow-sm">
                    ({zoneStalls.length}件)
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed">{currentZone.desc}</p>

                {(selectedZoneId === "bldg1" || selectedZoneId === "bldg8" || selectedZoneId === "media_center") && (
                  <button
                    onClick={() => {
                      setDetailMapBuilding(selectedZoneId as any);
                      setDetailMapFloor(selectedZoneId === "bldg8" ? "2F" : "1F");
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{currentZone.name} の詳細フロアマップを開く</span>
                  </button>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-800">出展・施設一覧</h4>
                  {zoneStalls.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {zoneStalls.map((stall) => (
                        <div
                          key={stall.id}
                          onClick={() => setModalItem(stall)}
                          className="bg-white text-slate-800 p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 bg-slate-50 rounded-xl">{stall.icon}</span>
                            <div>
                              <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                                {stall.grade}
                              </span>
                              <h5 className="font-black text-sm text-slate-900 mt-0.5">{stall.title}</h5>
                              <p className="text-[11px] text-slate-500">{stall.location}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-bold">該当するリストはありません。</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl text-center text-xs text-slate-500 font-bold border shadow-sm">
                マップ上のピンをタップすると場所の詳細が表示されます
              </div>
            )}
          </div>
        )}

        {activeTab === "stalls" && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="企画名・場所・クラスで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["すべて", "模擬店", "クラス企画", "部活動企画", "キッチンカー", "校内施設・その他"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-black shrink-0 transition ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStalls.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setModalItem(s)}
                  className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-orange-50 rounded-2xl">{s.icon}</span>
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                        {s.grade}
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-0.5">{s.title}</h4>
                      <p className="text-xs text-slate-500">{s.location}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-4">
            {EVENTS_DATA.map((stage) => (
              <div key={stage.stageId} className="bg-white p-5 rounded-3xl border shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-black text-base">{stage.stageName}</h3>
                  <span className="text-xs text-slate-500 font-bold">{stage.location}</span>
                </div>
                <div className="space-y-2">
                  {stage.schedule.map((ev) => (
                    <div key={ev.id} className="p-3 bg-slate-50 rounded-2xl border text-xs space-y-1">
                      <div className="flex items-center justify-between font-black text-orange-600">
                        <span>{ev.time}</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px]">
                          {ev.tag}
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-slate-800">{ev.title}</h4>
                      <p className="text-slate-600">{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "access" && (
          <div className="bg-white p-5 rounded-3xl border shadow-sm space-y-4">
            <h3 className="font-black text-base">鶴岡高専へのアクセス</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              〒997-8511 山形県鶴岡市井岡字沢田104<br />
              JR鶴岡駅より庄内交通バス「湯野浜温泉行き（加茂経由）」乗車（約20分）、「高専前」バス停下車すぐ。
            </p>
          </div>
        )}
      </main>

      {/* モーダル1: 出店・施設詳細 */}
      {modalItem && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-orange-50 rounded-2xl">{modalItem.icon}</span>
                <div>
                  <span className="text-xs font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    {modalItem.grade}
                  </span>
                  <h3 className="text-lg font-black mt-1">{modalItem.title}</h3>
                  <p className="text-xs text-slate-500">{modalItem.location}</p>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border">
              {modalItem.description}
            </p>
            <button
              onClick={() => {
                if (modalItem.zoneId === "bldg1" || modalItem.zoneId === "bldg8" || modalItem.zoneId === "media_center") {
                  setDetailMapBuilding(modalItem.zoneId as any);
                  setDetailMapFloor(modalItem.floor || "1F");
                  setModalItem(null);
                } else {
                  setSelectedZoneId(modalItem.zoneId);
                  setActiveTab("map");
                  setModalItem(null);
                }
              }}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition"
            >
              詳細マップで場所を確認 📍
            </button>
          </div>
        </div>
      )}

      {/* モーダル2: 統合詳細フロアマップモーダル (1号館 / 8号館 / 総合メディアセンター) */}
      {detailMapBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* モーダルヘッダー */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
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

            {/* 建物切替メインタブ */}
            <div className="flex border-b border-slate-200 bg-slate-200 p-1.5 gap-1">
              {[
                { id: "bldg1", label: "1号館" },
                { id: "bldg8", label: "8号館" },
                { id: "media_center", label: "総合メディアセンター" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setDetailMapBuilding(b.id as any);
                    setDetailMapFloor(b.id === "bldg8" ? "2F" : "1F");
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                    detailMapBuilding === b.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* フロア切替サブタブ (1号館) */}
            {detailMapBuilding === "bldg1" && (
              <div className="flex border-b border-slate-200 bg-slate-100 p-1 gap-1">
                {(["1F", "2F", "3F"] as const).map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setDetailMapFloor(floor)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      detailMapFloor === floor ? "bg-blue-600 text-white shadow-sm" : "text-slate-600"
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            )}

            {/* フロアレイアウトコンテンツ */}
            <div className="p-4 space-y-3 overflow-y-auto bg-slate-100/60">
              {/* ==================== ① 1号館 (1-1F, 1-2F, 1-3F 忠実再現) ==================== */}
              {detailMapBuilding === "bldg1" && (
                <div className="space-y-3">
                  {/* --- 1号館 1F (画像「1-1F」準拠) --- */}
                  {detailMapFloor === "1F" && (
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[560px] max-w-[660px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                        <div className="text-center font-black text-3xl text-slate-900 mb-6 tracking-wide">1F</div>

                        {/* 上部横廊下 (右上に「4号館」テキスト、右側に「SS」波線、右下に部屋「412」) */}
                        <div className="relative mb-12">
                          <div className="absolute -top-7 right-20 text-sm font-black text-slate-900 tracking-wider">
                            4号館
                          </div>

                          <div className="h-10 bg-slate-500 w-full relative flex items-center justify-end pr-20">
                            <BreakLineSS />
                          </div>

                          <div className="absolute right-2 top-0 translate-y-3">
                            <button
                              onClick={() => {
                                const stall = getRoomStall("412");
                                if (stall) setModalItem(stall);
                              }}
                              className="w-16 h-22 border-[2.5px] border-slate-900 bg-white font-black text-slate-900 text-lg rounded-lg hover:bg-amber-100 transition shadow-sm flex items-center justify-center cursor-pointer"
                            >
                              412
                            </button>
                          </div>
                        </div>

                        {/* 中央縦廊下 + 入口赤三角▲ */}
                        <div className="relative min-h-[160px] flex flex-col items-center">
                          <div className="w-12 bg-slate-500 h-28 relative">
                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                              <RedTriangle />
                            </div>
                          </div>

                          {/* 廊下左側: 113, 112, 111 教室 */}
                          <div className="absolute left-6 top-0 flex gap-3">
                            {[
                              { id: "113", label: "113" },
                              { id: "112", label: "112" },
                              { id: "111", label: "111" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className="w-16 h-24 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-lg text-slate-900 hover:bg-amber-100 transition shadow-sm cursor-pointer"
                                >
                                  <span>{r.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 廊下右側: 階段 & トイレ */}
                          <div className="absolute right-12 top-2 flex items-center gap-4">
                            <StairsIcon />
                            <ToiletIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- 1号館 2F (画像「1-2F」準拠) --- */}
                  {detailMapFloor === "2F" && (
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[560px] max-w-[660px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                        <div className="text-center font-black text-3xl text-slate-900 mb-6 tracking-wide">2F</div>

                        <div className="h-10 bg-slate-500 w-full mb-10" />

                        <div className="relative min-h-[160px] flex flex-col items-center">
                          <div className="w-12 bg-slate-500 h-24 relative" />

                          <button
                            onClick={() => {
                              const stall = getRoomStall("合同講義室");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-24 h-20 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-slate-900 text-sm leading-tight hover:bg-amber-100 transition shadow-sm -mt-1 z-10 cursor-pointer"
                          >
                            <span>合同</span>
                            <span>講義室</span>
                          </button>

                          <div className="absolute left-2 top-0 flex gap-2">
                            {[
                              { id: "123", label: "123" },
                              { id: "12Fゼミ室", label: "12F\nゼミ室" },
                              { id: "122", label: "122" },
                              { id: "121", label: "121" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className="w-15 h-24 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-base text-slate-900 whitespace-pre-line leading-tight hover:bg-amber-100 transition shadow-sm cursor-pointer"
                                >
                                  {r.label}
                                </button>
                              );
                            })}
                          </div>

                          <div className="absolute right-12 top-2 flex items-center gap-4">
                            <StairsIcon />
                            <ToiletIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- 1号館 3F (画像「1-3F」準拠) --- */}
                  {detailMapFloor === "3F" && (
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="min-w-[560px] max-w-[660px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                        <div className="text-center font-black text-3xl text-slate-900 mb-6 tracking-wide">3F</div>

                        <div className="h-10 bg-slate-500 w-full mb-10" />

                        <div className="relative min-h-[160px] flex flex-col items-center">
                          <div className="w-12 bg-slate-500 h-24 relative" />

                          <button
                            onClick={() => {
                              const stall = getRoomStall("大会議室");
                              if (stall) setModalItem(stall);
                            }}
                            className="w-24 h-20 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-slate-900 text-sm leading-tight hover:bg-amber-100 transition shadow-sm -mt-1 z-10 cursor-pointer"
                          >
                            <span>大</span>
                            <span>会議室</span>
                          </button>

                          <div className="absolute left-2 top-0 flex gap-2">
                            {[
                              { id: "13Fゼミ室", label: "13F\nゼミ室" },
                              { id: "133", label: "133" },
                              { id: "132", label: "132" },
                              { id: "131", label: "131" },
                            ].map((r) => {
                              const stall = getRoomStall(r.id);
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => {
                                    if (stall) setModalItem(stall);
                                  }}
                                  className="w-15 h-24 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-base text-slate-900 whitespace-pre-line leading-tight hover:bg-amber-100 transition shadow-sm cursor-pointer"
                                >
                                  {r.label}
                                </button>
                              );
                            })}
                          </div>

                          <div className="absolute right-2 top-2 flex items-center gap-3">
                            <StairsIcon />
                            <ToiletIcon />
                            <button
                              onClick={() => {
                                const stall = getRoomStall("小会議室");
                                if (stall) setModalItem(stall);
                              }}
                              className="w-16 h-24 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex flex-col items-center justify-center font-black text-sm text-slate-900 leading-tight hover:bg-amber-100 transition shadow-sm cursor-pointer"
                            >
                              <span>小</span>
                              <span>会議室</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== ② 8号館 (画像「8-2-3F」忠実再現) ==================== */}
              {detailMapBuilding === "bldg8" && (
                <div className="w-full overflow-x-auto pb-2">
                  <div className="min-w-[560px] max-w-[660px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                    <div className="text-center font-black text-2xl sm:text-3xl text-slate-900 mb-6">
                      8号館詳細
                    </div>

                    <div className="grid grid-cols-2 gap-6 divide-x-2 divide-slate-200">
                      {/* --- 2F --- */}
                      <div className="pr-4 flex flex-col items-center">
                        <div className="font-black text-2xl text-slate-900 mb-3">2F</div>

                        <button
                          onClick={() => {
                            const stall = getRoomStall("吹奏楽部");
                            if (stall) setModalItem(stall);
                          }}
                          className="w-full h-28 sm:h-32 border-[2.5px] border-slate-900 bg-white rounded-lg p-2 flex flex-col items-center justify-center font-black text-slate-900 text-xs sm:text-sm text-center leading-snug hover:bg-amber-100 transition shadow-sm mb-0 z-10 cursor-pointer"
                        >
                          <span>吹奏楽部演奏会</span>
                          <span className="text-slate-600 my-0.5">&</span>
                          <span>中学生向け</span>
                          <span>学校説明会</span>
                        </button>

                        <div className="relative w-10 bg-slate-500 h-40 flex flex-col items-center justify-end pb-2">
                          <div className="absolute -left-10 top-4">
                            <StairsIcon />
                          </div>
                          <div className="absolute -right-12 top-4">
                            <ToiletIcon />
                          </div>
                          <div className="text-xs font-black text-white text-center leading-tight whitespace-nowrap [writing-mode:vertical-rl] tracking-wider">
                            1号館2階へ ↓
                          </div>
                        </div>
                      </div>

                      {/* --- 3F --- */}
                      <div className="pl-6 flex flex-col items-center">
                        <div className="font-black text-2xl text-slate-900 mb-3">3F</div>

                        <button
                          onClick={() => {
                            const stall = getRoomStall("学校説明会");
                            if (stall) setModalItem(stall);
                          }}
                          className="w-full h-28 sm:h-32 border-[2.5px] border-slate-900 bg-white rounded-lg p-2 flex flex-col items-center justify-center font-black text-slate-900 text-xs sm:text-sm text-center leading-snug hover:bg-amber-100 transition shadow-sm mb-0 z-10 cursor-pointer"
                        >
                          <span>中学生向け</span>
                          <span>学校説明会</span>
                        </button>

                        <div className="relative w-10 bg-slate-500 h-40">
                          <div className="absolute -left-10 top-4">
                            <StairsIcon />
                          </div>
                          <div className="absolute -right-12 top-4">
                            <ToiletIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== ③ 総合メディアセンター (画像「総合メディアセンター1F」忠実再現) ==================== */}
              {detailMapBuilding === "media_center" && (
                <div className="w-full overflow-x-auto pb-2">
                  <div className="min-w-[560px] max-w-[660px] mx-auto bg-white border-2 border-slate-300 rounded-2xl p-6 relative select-none shadow-sm">
                    <div className="text-center font-black text-xl sm:text-2xl text-slate-900 mb-6">
                      総合メディアセンター 1F
                    </div>

                    <div className="relative min-h-[220px] flex items-center justify-center my-4">
                      {/* 中央横廊下 */}
                      <div className="w-full h-10 bg-slate-500 relative flex items-center justify-center">
                        <div className="absolute -top-10">
                          <ToiletIcon />
                        </div>

                        <div className="absolute -bottom-6">
                          <RedTriangle />
                        </div>

                        <div className="absolute right-12 top-12 flex flex-col items-center">
                          <StairsIcon />
                          <div className="text-center font-black text-xs text-slate-900 leading-tight mt-1">
                            <span>↓</span>
                            <br />
                            <span>2 階</span>
                            <br />
                            <span>マルチメディア室へ</span>
                          </div>
                        </div>
                      </div>

                      {/* 左端縦エリア: 多目的交流室 */}
                      <button
                        onClick={() => {
                          const stall = getRoomStall("多目的交流室");
                          if (stall) setModalItem(stall);
                        }}
                        className="absolute left-0 h-48 sm:h-52 w-16 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex items-center justify-center font-black text-slate-900 text-sm sm:text-base [writing-mode:vertical-rl] hover:bg-amber-100 transition shadow-sm cursor-pointer"
                      >
                        多目的交流室
                      </button>

                      {/* 右端縦エリア: デジタルサロン */}
                      <button
                        onClick={() => {
                          const stall = getRoomStall("デジタルサロン");
                          if (stall) setModalItem(stall);
                        }}
                        className="absolute right-0 h-48 sm:h-52 w-16 border-[2.5px] border-slate-900 bg-white rounded-lg p-1 flex items-center justify-center font-black text-slate-900 text-sm sm:text-base [writing-mode:vertical-rl] hover:bg-amber-100 transition shadow-sm cursor-pointer"
                      >
                        デジタルサロン
                      </button>
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