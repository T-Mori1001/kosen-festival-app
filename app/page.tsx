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
} from "lucide-react";

// Instagramアイコン用SVG
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

// 全出店・企画・施設・その他データ
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
    roomNo: "111教室",
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
    roomNo: "112教室",
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
    roomNo: "113教室",
    description: "4Mのメンバーが華麗にお出迎え！？非日常の最高のおもてなし空間！",
    icon: "🌹",
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
    roomNo: "121教室",
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
    roomNo: "122教室",
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
    roomNo: "123教室",
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
    roomNo: "131教室",
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
    roomNo: "132教室",
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
    roomNo: "133教室",
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

  // --- 合同講義室（1号館内） ---
  {
    id: 401,
    title: "今日、ゲームになりました。",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "1号館 合同講義室",
    zoneId: "bldg1",
    description: "大画面での白熱ゲームトーナメント＆対戦アトラクション！",
    icon: "🎮",
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
  {
    id: 402,
    title: "2026KOSEN歌謡祭 秋",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "高専生の自慢の歌声を競う熱いカラオケステージ！",
    icon: "🎤",
  },
  {
    id: 403,
    title: "あつまれ きんにくの森",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "筋肉自慢の高専生が集結！極限の腕立て伏せバトル！",
    icon: "💪",
  },
  {
    id: 404,
    title: "カリモノ競争",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "何を引き当てるか分からない！？大興奮のクラス対抗リレー！",
    icon: "🏃",
  },
  {
    id: 405,
    title: "鶴専-1グランプリ",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "高専生のお笑いNo.1を決める爆笑必至の漫才グランプリ！",
    icon: "🎙️",
  },
  {
    id: 406,
    title: "DoKa Project",
    category: "実行委員会企画",
    grade: "企画",
    dept: "実行委員会",
    location: "第一体育館",
    zoneId: "gym1",
    description: "圧倒的なパフォーマンスと熱量でお届けするダンスステージ！",
    icon: "💃",
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
  {
    id: 304,
    title: "AMデザイン部（作品展示・3Dプリンタ体験）",
    category: "部活動企画",
    grade: "部活",
    dept: "AMデザイン部",
    location: "7号館 731教室",
    zoneId: "bldg7",
    description: "3Dプリンタの実演・造形体験およびデザイン作品の展示。",
    icon: "⚙️",
  },
  {
    id: 305,
    title: "5B 研究発表（ポスター）",
    category: "部活動企画",
    grade: "5B",
    dept: "5年 生物・化学コース",
    location: "7号館 721教室",
    zoneId: "bldg7",
    description: "5Bによる先進的な研究成果のポスター発表展示。",
    icon: "🔬",
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
    roomNo: "大講義室",
    description: "吹奏楽部によるミニコンサート（9:00〜11:45）！素敵な演奏をお楽しみください！",
    icon: "🎷",
  },
  {
    id: 503,
    title: "学校説明会",
    category: "校内施設・その他",
    grade: "案内",
    dept: "広報・入試",
    location: "8号館 2F 大講義室",
    zoneId: "bldg8",
    floor: "2F",
    roomNo: "大講義室",
    description: "中学生・保護者の皆様に向けた学校説明会（13:00〜14:00）。",
    icon: "🏫",
  },

  // --- 4号館 (bldg4) ---
  {
    id: 306,
    title: "E.S.S.（展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "E.S.S.",
    location: "4号館 LL教室",
    zoneId: "bldg4",
    description: "E.S.S.部員による活動紹介・英語文化に関する展示。",
    icon: "🔤",
  },
  {
    id: 307,
    title: "かるた体験（見学・体験）",
    category: "部活動企画",
    grade: "有志",
    dept: "かるた体験",
    location: "4号館 411教室",
    zoneId: "bldg4",
    description: "競技かるたの見学および実際の体験コーナー！初心者歓迎！",
    icon: "🎴",
  },

  // --- 総合メディアセンター (media_center) ---
  {
    id: 16,
    title: "格付けチェック",
    category: "クラス企画",
    grade: "4B",
    dept: "4年 生物・化学コース (4B)",
    location: "総合メディアセンター マルチメディア教室",
    zoneId: "media_center",
    description: "4Bあなたの一流度が試される！高級品と激安品を見破れるか！？",
    icon: "🍷",
  },
  {
    id: 309,
    title: "ロボット研究部（ロボット展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "ロボット研究部",
    location: "総合メディアセンター 多目的交流室",
    zoneId: "media_center",
    description: "自作ロボットのデモ実演および操縦体験コーナー！",
    icon: "🤖",
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
    description: "高専生が日頃の思いや愛を大声で叫ぶ伝統の大人気企画！",
    icon: "📢",
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

  // --- 金券販売 (ticket) ---
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
    id: 502,
    title: "学校紹介ブース",
    category: "校内施設・その他",
    grade: "案内",
    dept: "広報・入試",
    location: "学生昇降口 高専祭本部（金券販売）",
    zoneId: "ticket",
    description: "鶴岡高専の学校案内、学科紹介、入試相談などを行っている特設ブースです。",
    icon: "🏫",
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
  {
    id: 201,
    title: "総合メディアセンター",
    category: "校内施設・その他",
    grade: "施設",
    dept: "図書・情報基盤",
    location: "第一体育館 西側",
    zoneId: "media_center",
    description: "図書室や情報処理施設が設置された総合メディアセンターです。休憩場所としてもご利用いただけます。",
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
    icon: "🅿️",
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
        icon: "🎙️",
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
      {
        id: "g1_4",
        time: "14:30 - 15:30",
        startTime: "14:30",
        endTime: "15:30",
        title: "エンディング",
        org: "全校・実行委員会",
        desc: "高専祭の感動のフィナーレ！",
        tag: "セレモニー",
        icon: "🎆",
      },
    ],
  },
  {
    stageId: "joint",
    stageName: "1号館 合同講義室",
    location: "合同講義室",
    locationZoneId: "bldg1",
    schedule: [
      {
        id: "j_1",
        time: "10:00 - 10:30",
        startTime: "10:00",
        endTime: "10:30",
        title: "参加者募集",
        org: "ゲーム企画運営",
        desc: "ゲーム大会参加者の受付およびルール説明を行います。",
        tag: "受付",
        icon: "📝",
      },
      {
        id: "j_2",
        time: "10:30 - 15:00",
        startTime: "10:30",
        endTime: "15:00",
        title: "今日、ゲームになりました。",
        org: "実行委員会",
        desc: "大画面での白熱ゲームトーナメント＆対戦アトラクション！",
        tag: "eスポーツ",
        icon: "🎮",
      },
    ],
  },
  {
    stageId: "bldg8",
    stageName: "8号館 大講義室",
    location: "8号館 2階 大講義室",
    locationZoneId: "bldg8",
    schedule: [
      {
        id: "b8_1",
        time: "09:00 - 11:45",
        startTime: "09:00",
        endTime: "11:45",
        title: "吹奏楽部 ミニコンサート",
        org: "吹奏楽部",
        desc: "吹奏楽部によるミニコンサートを開催します！素敵な演奏をお楽しみください！",
        tag: "演奏",
        icon: "🎷",
      },
      {
        id: "b8_2",
        time: "13:00 - 14:00",
        startTime: "13:00",
        endTime: "14:00",
        title: "学校説明会",
        org: "広報・入試担当",
        desc: "中学生・保護者の皆様に向けた鶴岡高専の学校説明会です。",
        tag: "説明会",
        icon: "🏫",
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
    desc: "1F〜3Fのクラス企画・模擬店をはじめ、合同講義室でのゲーム企画、13Fゼミ室（天文部）や12Fゼミ室（美術写真部）が実施されています。",
  },
  {
    id: "bldg4",
    name: "4号館",
    subName: "展示・体験棟",
    pinLabel: "4号館",
    lightBg: "bg-teal-50 border-teal-300 text-teal-900",
    icon: "🏫",
    top: "9.0%",
    left: "82.9%",
    desc: "LL教室（E.S.S.展示）、411教室（かるた体験）を開催！",
  },
  {
    id: "ticket",
    name: "高専祭本部（金券販売）",
    subName: "金券本部・案内",
    pinLabel: "高専祭本部\n（金券販売）",
    lightBg: "bg-amber-50 border-amber-300 text-amber-900",
    icon: "🎟️",
    top: "40.6%",
    left: "76.5%",
    desc: "1号館1Fに位置し、模擬店等で使用できる金券の販売を行っています。",
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
    desc: "3Mお化け屋敷、4Eキッキングスナイパー、AMデザイン部、5B研究発表を開催！",
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
    desc: "2階の大講義室にて吹奏楽部ミニコンサート（9:00〜11:45）および学校説明会（13:00〜14:00）を開催！",
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
    desc: "学校紹介ブース（高専祭本部）、高専生の主張、および昇降口前ロータリーのキッチンカー3店が集結！",
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
  const [activeTab, setActiveTab] = useState<"map" | "stalls" | "events" | "access">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<StallItem | null>(null);

  // ハイライト用ピン留め教室・ブース管理ステート
  const [highlightedRoomNo, setHighlightedRoomNo] = useState<string | null>(null);

  // マップの初期ズーム倍率 3.0倍 (300%)
  const [zoomLevel, setZoomLevel] = useState<number>(3.0);

  // マップ表示完了フラグ
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // マップコンテナ＆拡大内側要素の参照
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  // 1号館フロア詳細モーダル用ステート
  const [isBldg1ModalOpen, setIsBldg1ModalOpen] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<"1F" | "2F" | "3F">("1F");

  // 現在時刻ステート
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // マップの初期表示位置を画像右側（学生昇降口〜駐車場エリア付近）に設定する処理
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

  // タブ切り替え・入場時に右側へ一瞬で移動させたあとフェードイン表示
  useEffect(() => {
    if (isEntered && activeTab === "map") {
      setIsMapReady(false);
      const timer = setTimeout(() => {
        scrollToRightSide(false);
        requestAnimationFrame(() => {
          setIsMapReady(true);
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isEntered, activeTab]);

  // 最新のズームレベルを ref で保持
  const zoomLevelRef = useRef(zoomLevel);
  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

  // スマホ用ピンチイン・ピンチアウト機能
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

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
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

  // ズーム操作ハンドラー
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
    setTimeout(() => scrollToRightSide(true), 50);
  };

  // リアルタイムイベント特定ロジック
  const liveEvents = useMemo(() => {
    if (!currentTime) return [];

    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const list: Array<any> = [];

    for (const stage of EVENTS_DATA) {
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
          });
        }
      }
    }
    return list;
  }, [currentTime]);

  const primaryLiveEvent = liveEvents[0] || null;

  // 検索・カテゴリフィルタリング
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

  // 地図上で選択されたゾーンのデータ
  const zoneStalls = useMemo(() => {
    if (!selectedZoneId) return [];
    return STALLS_DATA.filter((s) => s.zoneId === selectedZoneId);
  }, [selectedZoneId]);

  // 現在選択中のゾーン情報
  const currentZone = CAMPUS_ZONES.find((z) => z.id === selectedZoneId);

  // 教室・ブースの個別出展取得ヘルパー
  const getRoomStall = (roomNo: string) => {
    return STALLS_DATA.find((s) => s.zoneId === "bldg1" && (s.roomNo === roomNo || s.title === roomNo));
  };

  // タイトルアニメーション文字
  const titlePart1 = ["熱", "狂", "の"];
  const titlePart2 = ["カ", "ー", "ニ", "バ", "ル"];
  const titlePart3 = ["高", "専", "祭"];

  // 1. 入場前トップ画面
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

        {/* 背景アニメーション */}
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

        {/* メインタイトル ＆ 入場ボタン */}
        <div className="w-full max-w-sm flex flex-col items-center text-center z-10 my-auto space-y-6">
          <div className="text-teal-600 font-extrabold text-xs tracking-[0.25em] font-sans">
            TSURUOKA KOSEN FESTIVAL 2026
          </div>

          <div className="flex flex-col items-center justify-center font-black tracking-tight font-sans">
            <div className="flex items-baseline justify-center text-[#E53935] drop-shadow-sm">
              <div className="text-4xl sm:text-5xl flex">
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

              <div className="relative inline-block ml-1">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] sm:text-xs font-black text-rose-500 tracking-widest whitespace-nowrap flex">
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

                <div className="text-5xl sm:text-6xl flex">
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
            <span>10:00〜15:00</span>
            <span className="text-slate-400 font-normal">@鶴岡高専</span>
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
                <span>高専 HP</span>
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
              鶴岡高専祭をお楽しみください！
            </p>
          </div>
        </div>

        <div />
      </div>
    );
  }

  // 2. 入場後アプリメイン画面
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans relative">
      <style>{`
        .custom-map-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-map-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.8);
          border-radius: 9999px;
        }
        .custom-map-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.9);
          border-radius: 9999px;
        }
        .custom-map-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 1);
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
                <span>ただいま実施中の企画 ({liveEvents.length}件)</span>
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

      {/* ヘッダー・ナビゲーション */}
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
              <span className="text-[10px] font-extrabold text-orange-600">10:00〜15:00</span>
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
              title="マップ"
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
              title="企画一覧"
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
              title="タイムスケジュール"
            >
              <Calendar className="w-4 h-4" />
              {activeTab === "events" && <span>スケジュール</span>}
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === "access"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="交通・アクセス"
            >
              <Car className="w-4 h-4" />
              {activeTab === "access" && <span>アクセス</span>}
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

              {/* ズームコントローラー */}
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

            {/* キャンパスマップコンテナ */}
            <div
              ref={mapContainerRef}
              style={{
                aspectRatio: `${2.37 / Math.min(zoomLevel, 2.0)}`,
              }}
              className={`w-full overflow-auto rounded-3xl border-2 border-slate-200 shadow-md bg-slate-200 cursor-grab active:cursor-grabbing custom-map-scrollbar relative select-none transition-opacity duration-200 touch-pan-x touch-pan-y ${
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
                {/* 校内図画像 */}
                <img
                  src="/校内図.jpeg"
                  alt="校内図"
                  onLoad={() => {
                    scrollToRightSide(false);
                    setIsMapReady(true);
                  }}
                  className="w-full h-full object-contain pointer-events-none rounded-2xl"
                />

                {/* ピンプロット */}
                {CAMPUS_ZONES.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        if (zone.id === "bldg1") {
                          setIsBldg1ModalOpen(true);
                        }
                      }}
                      style={{ top: zone.top, left: zone.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-10 flex flex-col items-center ${
                        isSelected ? "scale-125 z-30" : "hover:scale-110"
                      }`}
                    >
                      <div
                        className={`px-2 py-1 rounded-full shadow-lg border-2 text-[10px] sm:text-xs font-black flex items-center gap-1 whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-red-600 border-white text-white ring-4 ring-red-300"
                            : "bg-white/95 border-orange-500 text-slate-800 group-hover:bg-orange-500 group-hover:text-white"
                        }`}
                      >
                        <span className="text-sm">{zone.icon}</span>
                        <span>{zone.pinLabel}</span>
                      </div>
                      <MapPin
                        className={`w-5 h-5 -mt-1 drop-shadow-md transition-all ${
                          isSelected ? "text-red-600 fill-red-600" : "text-orange-500 fill-white"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 選択したゾーンの企画一覧表示 */}
            {currentZone && (
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentZone.icon}</span>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-800">{currentZone.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{currentZone.subName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {currentZone.id === "bldg1" && (
                      <button
                        onClick={() => setIsBldg1ModalOpen(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-black shadow hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>フロア図</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedZoneId(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                  {currentZone.desc}
                </p>

                {zoneStalls.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-500 tracking-wider uppercase">
                      このエリアの企画・施設 ({zoneStalls.length}件)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {zoneStalls.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setModalItem(item)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-orange-50/50 hover:border-orange-300 transition text-left group"
                        >
                          <span className="text-2xl p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                                {item.grade}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 truncate">
                                {item.category}
                              </span>
                            </div>
                            <h5 className="font-extrabold text-sm text-slate-800 group-hover:text-orange-600 transition truncate">
                              {item.title}
                            </h5>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">
                    このエリアに登録されている個別企画はありません。
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* タブ 2: 企画一覧 */}
        {activeTab === "stalls" && (
          <div className="space-y-4">
            {/* 検索・フィルターバー */}
            <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="企画名、クラス、内容などで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
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

              {/* カテゴリタグ */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-map-scrollbar text-xs font-bold">
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
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-slate-800 text-white font-extrabold shadow"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 企画カードグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStalls.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setModalItem(item)}
                  className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-orange-400 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl p-2 bg-slate-50 border border-slate-100 rounded-2xl group-hover:scale-110 transition shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex flex-wrap items-center gap-1 justify-end">
                        <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                          {item.grade}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-800 group-hover:text-orange-600 transition leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium pt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs font-bold text-orange-600">
                    <span>詳細をみる</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>

            {filteredStalls.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-extrabold text-slate-700">該当する企画が見つかりませんでした</h4>
                <p className="text-xs text-slate-400">検索条件やカテゴリを変更してお試しください。</p>
              </div>
            )}
          </div>
        )}

        {/* タブ 3: タイムスケジュール */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white p-5 rounded-3xl shadow-lg space-y-1">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>ステージ・タイムスケジュール</span>
              </h2>
              <p className="text-xs font-medium text-orange-100">
                各ステージの開催時間やイベント内容をご確認いただけます。
              </p>
            </div>

            <div className="space-y-6">
              {EVENTS_DATA.map((stage) => (
                <div key={stage.stageId} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <h3 className="font-extrabold text-base text-slate-800">{stage.stageName}</h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedZoneId(stage.locationZoneId);
                        setActiveTab("map");
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>マップ表示</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {stage.schedule.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-orange-50/50 hover:border-orange-200 transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-2 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                            {event.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                                {event.tag}
                              </span>
                              <span className="text-xs font-extrabold text-orange-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-800">{event.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{event.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タブ 4: アクセス・交通案内 */}
        {activeTab === "access" && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Car className="w-5 h-5 text-orange-500" />
                <h2 className="font-extrabold text-base text-slate-800">交通アクセス・駐車場案内</h2>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl space-y-1 text-orange-900">
                  <p className="font-black flex items-center gap-1.5 text-sm text-orange-800">
                    <Info className="w-4 h-4 shrink-0" />
                    ご来場者様へのお願い
                  </p>
                  <p>
                    構内駐車場（東側）は台数に限りがございます。混雑が予想されますので、可能な限り公共交通機関をご利用ください。
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">📍 所在地</h3>
                  <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 font-semibold text-slate-700">
                    〒997-8511 山形県鶴岡市井岡字沢田104
                    <br />
                    国立高専機構 鶴岡工業高等専門学校
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">🚌 バスでご来場の場合</h3>
                  <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700">
                    JR鶴岡駅より庄内交通バス「湯野浜温泉行き（加茂経由）」乗車、
                    「高専前」バス停下車すぐ。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 出展・企画詳細モーダル */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalItem(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-6">
              <span className="text-4xl p-3 bg-slate-50 border border-slate-100 rounded-2xl shrink-0">
                {modalItem.icon}
              </span>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                    {modalItem.grade}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {modalItem.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 leading-snug">{modalItem.title}</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{modalItem.dept}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>場所: {modalItem.location}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                {modalItem.description}
              </p>

              {modalItem.menu && modalItem.menu.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-extrabold text-slate-500 mb-1.5">メニュー・取扱品目</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {modalItem.menu.map((m, idx) => (
                      <span key={idx} className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {modalItem.instagram && (
                <div className="pt-2">
                  <a
                    href={modalItem.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 text-white text-xs font-black shadow hover:opacity-95 transition"
                  >
                    <InstagramIcon className="w-4 h-4 text-white" />
                    <span>公式 Instagram を見る</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  if (modalItem.zoneId) {
                    setSelectedZoneId(modalItem.zoneId);
                    setActiveTab("map");
                    setModalItem(null);
                  }
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 text-white text-xs font-extrabold hover:bg-slate-900 transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>マップで場所を確認</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1号館フロア詳細モーダルダイアログ */}
      {isBldg1ModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl w-full space-y-4 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsBldg1ModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-extrabold text-base text-slate-800">1号館 フロア別詳細図</h3>
                <p className="text-xs text-slate-500 font-medium">各階の教室・企画配置をご確認いただけます。</p>
              </div>
            </div>

            {/* フロア切替タブ */}
            <div className="flex items-center justify-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {(["1F", "2F", "3F"] as const).map((floor) => (
                <button
                  key={floor}
                  onClick={() => setCurrentFloor(floor)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    currentFloor === floor
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>

            {/* 各フロア表示エリア */}
            <div className="pt-2">
              {/* --- 1F フロアマップ --- */}
              {currentFloor === "1F" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-2.5 text-[11px] font-extrabold text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1号館 1Fフロアマップ</span>
                    </span>
                    <span className="text-blue-600 font-bold hidden sm:inline">※部屋をタップして詳細表示</span>
                  </div>

                  <div className="w-full overflow-x-auto custom-map-scrollbar pb-2">
                    <div className="min-w-[640px] max-w-[720px] mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 relative select-none">
                      {/* --- 十字路背景構造（境目の線を除去し一体化） --- */}
                      <div className="absolute top-4 left-[41.666%] w-[16.666%] h-[60px] bg-slate-200 border-x-2 border-t-2 border-slate-300 rounded-t-lg z-0" />
                      <div className="absolute top-[76px] left-4 right-4 h-[40px] bg-slate-200 border-y-2 border-x-2 border-slate-300 rounded-lg z-0" />
                      <div className="absolute top-[116px] left-[41.666%] w-[16.666%] bottom-4 bg-slate-200 border-x-2 border-b-2 border-slate-300 rounded-b-lg z-0" />
                      {/* 十字路交差点の接続部目隠し */}
                      <div className="absolute top-[74px] left-[41.666%] w-[16.666%] h-[44px] bg-slate-200 z-0" />

                      <div className="relative z-10 space-y-0">
                        {/* 上段（北側） */}
                        <div className="grid grid-cols-12 gap-1.5 h-[90px] mb-2">
                          {/* 111, 112教室 */}
                          <div className="col-span-5 grid grid-cols-2 gap-1.5">
                            {[
                              { roomNo: "111教室", label: "111", title: "ほっとサンド", emoji: "🥪" },
                              { roomNo: "112教室", label: "112", title: "ドリンク", emoji: "🍹" },
                            ].map((r) => {
                              const stall = getRoomStall(r.roomNo);
                              const isHighlighted = highlightedRoomNo === r.roomNo;
                              return (
                                <button
                                  key={r.roomNo}
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className={`relative border-2 p-1.5 rounded-xl shadow-sm hover:shadow transition flex flex-col justify-between h-full text-left group ${
                                    isHighlighted
                                      ? "bg-amber-50 border-rose-500 ring-2 ring-rose-400"
                                      : "bg-white border-blue-200 hover:border-blue-500"
                                  }`}
                                >
                                  {isHighlighted && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                      <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                    </div>
                                  )}
                                  <div className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded w-fit">
                                    {r.label}
                                  </div>
                                  <div className="my-auto text-center">
                                    <div className="text-base group-hover:scale-110 transition">{r.emoji}</div>
                                    <div className="text-[10px] font-black text-slate-800 mt-0.5 line-clamp-1 group-hover:text-blue-600">
                                      {stall ? stall.title : r.title}
                                    </div>
                                  </div>
                                  {stall && (
                                    <div className="text-[8px] font-extrabold text-slate-400 text-center">
                                      {stall.grade}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* 通路 (4号館へ) */}
                          <div className="col-span-2 flex flex-col items-center justify-center h-full">
                            <span className="text-[10px] font-black text-slate-800 tracking-wider mb-1 bg-white/90 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap">
                              4号館へ
                            </span>
                            <ArrowUp className="w-4 h-4 text-slate-600 animate-bounce" />
                          </div>

                          {/* 階段、トイレ、1階ゼミ室、7号館へ */}
                          <div className="col-span-5 grid grid-cols-4 gap-1">
                            <div className="bg-slate-200 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <svg className="w-4 h-4 text-slate-700 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 19h4v-4h4v-4h4V7" /></svg>
                              <span className="text-[8px] font-extrabold text-slate-700">階段</span>
                            </div>
                            <div className="bg-pink-100 border border-pink-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">🚻</span>
                              <span className="text-[8px] font-black text-pink-800 [writing-mode:vertical-rl]">トイレ</span>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">📂</span>
                              <span className="text-[8px] font-black text-blue-900 [writing-mode:vertical-rl]">1階ゼミ</span>
                            </div>
                            <div className="bg-slate-100 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-sm">
                              <span className="text-[8px] font-black text-slate-700 mb-0.5">7号館へ</span>
                              <ChevronRight className="w-4 h-4 text-slate-600 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* 中央廊下スペース（高さ40px） */}
                        <div className="h-[40px] flex items-center justify-center">
                          <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">
                            ろうか
                          </span>
                        </div>

                        {/* 下段（南側） */}
                        <div className="grid grid-cols-12 gap-1.5 pt-2 h-[90px]">
                          {/* 金券販売・本部・113教室 */}
                          <div className="col-span-5 grid grid-cols-3 gap-1">
                            <button
                              onClick={() => { const s = getRoomStall("金券販売"); if (s) setModalItem(s); }}
                              className="bg-amber-100 border border-amber-300 rounded-xl p-1 flex flex-col items-center justify-center text-center hover:bg-amber-200 transition"
                            >
                              <Ticket className="w-4 h-4 text-amber-700 mb-0.5" />
                              <span className="text-[9px] font-black text-amber-900">金券販売</span>
                            </button>
                            <button
                              onClick={() => { const s = getRoomStall("本部"); if (s) setModalItem(s); }}
                              className="bg-emerald-100 border border-emerald-300 rounded-xl p-1 flex flex-col items-center justify-center text-center hover:bg-emerald-200 transition"
                            >
                              <Info className="w-4 h-4 text-emerald-700 mb-0.5" />
                              <span className="text-[9px] font-black text-emerald-900">本部</span>
                            </button>
                            {(() => {
                              const r = { roomNo: "113教室", label: "113", title: "ホスト", emoji: "🌹" };
                              const stall = getRoomStall(r.roomNo);
                              return (
                                <button
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className="bg-white border-2 border-blue-200 rounded-xl p-1 flex flex-col items-center justify-between text-center hover:border-blue-500 transition"
                                >
                                  <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded">113</span>
                                  <span className="text-sm">{r.emoji}</span>
                                  <span className="text-[9px] font-black text-slate-800 line-clamp-1">{stall ? stall.title : r.title}</span>
                                </button>
                              );
                            })()}
                          </div>

                          {/* 南側通路 (昇降口へ) */}
                          <div className="col-span-2 flex flex-col items-center justify-center h-full">
                            <span className="text-[10px] font-black text-slate-800 tracking-wider mb-1 bg-white/90 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap">
                              昇降口へ
                            </span>
                            <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />
                          </div>

                          {/* 合同講義室 */}
                          <div className="col-span-5">
                            <button
                              onClick={() => { const s = STALLS_DATA.find((x) => x.id === 401); if (s) setModalItem(s); }}
                              className="w-full h-full bg-purple-100 border-2 border-purple-300 rounded-xl p-2 flex flex-col items-center justify-center text-center hover:bg-purple-200 transition"
                            >
                              <span className="text-base leading-none mb-1">🎮</span>
                              <span className="text-xs font-black text-purple-900">合同講義室</span>
                              <span className="text-[9px] font-bold text-purple-700">今日、ゲームになりました。</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2F フロアマップ（修正版） --- */}
              {currentFloor === "2F" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-2.5 text-[11px] font-extrabold text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1号館 2Fフロアマップ</span>
                    </span>
                    <span className="text-blue-600 font-bold hidden sm:inline">※部屋をタップして詳細表示</span>
                  </div>

                  <div className="w-full overflow-x-auto custom-map-scrollbar pb-2">
                    <div className="min-w-[640px] max-w-[720px] mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 relative select-none">
                      {/* --- 廊下（ろうか）構造：余計な区切り線が入らない一体化構造 --- */}
                      {/* 1. 東西のメイン横廊下 */}
                      <div className="absolute top-[108px] left-4 right-4 h-[40px] bg-slate-200 border-y-2 border-x-2 border-slate-300 rounded-lg z-0" />
                      {/* 2. 北（4号館）へ伸びる縦廊下 */}
                      <div className="absolute top-4 left-[31.25%] w-[12.5%] h-[98px] bg-slate-200 border-x-2 border-t-2 border-slate-300 rounded-t-lg z-0" />
                      {/* 3. T字路交差点部分の目隠し（区切り線を除去） */}
                      <div className="absolute top-[106px] left-[31.25%] w-[12.5%] h-[6px] bg-slate-200 z-0" />

                      <div className="relative z-10 space-y-0">
                        {/* 上段（北側） */}
                        <div className="grid grid-cols-12 gap-1.5 h-[90px] mb-2">
                          {/* 121教室, 122教室 */}
                          <div className="col-span-3 grid grid-cols-2 gap-1.5">
                            {[
                              { roomNo: "121教室", label: "121", title: "わたあめ", emoji: "🍥" },
                              { roomNo: "122教室", label: "122", title: "クレープ", emoji: "🥞" },
                            ].map((r) => {
                              const stall = getRoomStall(r.roomNo);
                              const isHighlighted = highlightedRoomNo === r.roomNo;
                              return (
                                <button
                                  key={r.roomNo}
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className={`relative border-2 p-1 rounded-xl shadow-sm hover:shadow transition flex flex-col justify-between h-full text-left group ${
                                    isHighlighted
                                      ? "bg-amber-50 border-rose-500 ring-2 ring-rose-400"
                                      : "bg-white border-blue-200 hover:border-blue-500"
                                  }`}
                                >
                                  {isHighlighted && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                      <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                    </div>
                                  )}
                                  <div className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded w-fit">
                                    {r.label}
                                  </div>
                                  <div className="my-auto text-center">
                                    <div className="text-sm sm:text-base group-hover:scale-110 transition">{r.emoji}</div>
                                    <div className="text-[10px] font-black text-slate-800 mt-0.5 line-clamp-1 group-hover:text-blue-600">
                                      {stall ? stall.title : r.title}
                                    </div>
                                  </div>
                                  {stall && (
                                    <div className="text-[8px] font-extrabold text-slate-400 text-center">
                                      {stall.grade}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* 北側中央: 通路（4号館へ） */}
                          <div className="col-span-2 flex flex-col items-center justify-center h-full">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-wider mb-1 bg-white/90 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap">
                              4号館へ
                            </span>
                            <ArrowUp className="w-4 h-4 text-slate-600 animate-bounce" />
                          </div>

                          {/* 北側右: 階段、女子トイレ、男子トイレ、小会議室、7号館へ */}
                          <div className="col-span-7 grid grid-cols-5 gap-1">
                            <div className="bg-slate-200 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <svg className="w-4 h-4 text-slate-700 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 19h4v-4h4v-4h4V7" /></svg>
                              <span className="text-[9px] font-extrabold text-slate-700">階段</span>
                            </div>
                            <div className="bg-pink-100 border border-pink-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">🚺</span>
                              <span className="text-[9px] font-black text-pink-800 [writing-mode:vertical-rl]">女子トイレ</span>
                            </div>
                            <div className="bg-sky-100 border border-sky-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">🚹</span>
                              <span className="text-[9px] font-black text-sky-800 [writing-mode:vertical-rl]">男子トイレ</span>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">📋</span>
                              <span className="text-[9px] font-black text-amber-900 [writing-mode:vertical-rl]">小会議室</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-sm">
                              <span className="text-[9px] font-black text-emerald-800 mb-0.5">7号館へ</span>
                              <ChevronRight className="w-4 h-4 text-emerald-600 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* 中央廊下スペース（高さ40px） */}
                        <div className="h-[40px] flex items-center justify-center">
                          <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">
                            ろうか
                          </span>
                        </div>

                        {/* 下段（南側） */}
                        <div className="grid grid-cols-12 gap-1.5 pt-2 h-[90px]">
                          {/* 12Fゼミ室, 123教室 */}
                          <div className="col-span-3 grid grid-cols-2 gap-1.5">
                            {[
                              { roomNo: "12Fゼミ室", label: "12Fゼミ", title: "美術写真部", emoji: "🖼️" },
                              { roomNo: "123教室", label: "123", title: "ゲームカフェ", emoji: "🎮" },
                            ].map((r) => {
                              const stall = getRoomStall(r.roomNo);
                              const isHighlighted = highlightedRoomNo === r.roomNo;
                              return (
                                <button
                                  key={r.roomNo}
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className={`relative border-2 p-1 rounded-xl shadow-sm hover:shadow transition flex flex-col justify-between h-full text-left group ${
                                    isHighlighted
                                      ? "bg-amber-50 border-rose-500 ring-2 ring-rose-400"
                                      : "bg-white border-blue-200 hover:border-blue-500"
                                  }`}
                                >
                                  {isHighlighted && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                      <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                    </div>
                                  )}
                                  <div className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded w-fit">
                                    {r.label}
                                  </div>
                                  <div className="my-auto text-center">
                                    <div className="text-sm sm:text-base group-hover:scale-110 transition">{r.emoji}</div>
                                    <div className="text-[10px] font-black text-slate-800 mt-0.5 line-clamp-1 group-hover:text-blue-600">
                                      {stall ? stall.title : r.title}
                                    </div>
                                  </div>
                                  {stall && (
                                    <div className="text-[8px] font-extrabold text-slate-400 text-center">
                                      {stall.grade}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* 中会議室, 大会議室 */}
                          <div className="col-span-9 grid grid-cols-2 gap-1.5">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2 text-center flex flex-col items-center justify-center shadow-sm">
                              <span className="text-base leading-none mb-1">🏛️</span>
                              <span className="text-xs font-black text-indigo-900">中会議室</span>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-2 text-center flex flex-col items-center justify-center shadow-sm">
                              <span className="text-base leading-none mb-1">🏢</span>
                              <span className="text-xs font-black text-purple-900">大会議室</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 3F フロアマップ --- */}
              {currentFloor === "3F" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-2.5 text-[11px] font-extrabold text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1号館 3Fフロアマップ</span>
                    </span>
                    <span className="text-blue-600 font-bold hidden sm:inline">※部屋をタップして詳細表示</span>
                  </div>

                  <div className="w-full overflow-x-auto custom-map-scrollbar pb-2">
                    <div className="min-w-[640px] max-w-[720px] mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 relative select-none">
                      {/* --- 廊下構造（区切り線除去） --- */}
                      <div className="absolute top-[108px] left-4 right-4 h-[40px] bg-slate-200 border-y-2 border-x-2 border-slate-300 rounded-lg z-0" />
                      <div className="absolute top-4 left-[31.25%] w-[12.5%] h-[98px] bg-slate-200 border-x-2 border-t-2 border-slate-300 rounded-t-lg z-0" />
                      <div className="absolute top-[106px] left-[31.25%] w-[12.5%] h-[6px] bg-slate-200 z-0" />

                      <div className="relative z-10 space-y-0">
                        {/* 上段（北側） */}
                        <div className="grid grid-cols-12 gap-1.5 h-[90px] mb-2">
                          <div className="col-span-3 grid grid-cols-2 gap-1.5">
                            {[
                              { roomNo: "131教室", label: "131", title: "カジノ", emoji: "🎲" },
                              { roomNo: "132教室", label: "132", title: "バー", emoji: "🍸" },
                            ].map((r) => {
                              const stall = getRoomStall(r.roomNo);
                              const isHighlighted = highlightedRoomNo === r.roomNo;
                              return (
                                <button
                                  key={r.roomNo}
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className={`relative border-2 p-1 rounded-xl shadow-sm hover:shadow transition flex flex-col justify-between h-full text-left group ${
                                    isHighlighted
                                      ? "bg-amber-50 border-rose-500 ring-2 ring-rose-400"
                                      : "bg-white border-blue-200 hover:border-blue-500"
                                  }`}
                                >
                                  {isHighlighted && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                      <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                    </div>
                                  )}
                                  <div className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded w-fit">
                                    {r.label}
                                  </div>
                                  <div className="my-auto text-center">
                                    <div className="text-sm sm:text-base group-hover:scale-110 transition">{r.emoji}</div>
                                    <div className="text-[10px] font-black text-slate-800 mt-0.5 line-clamp-1 group-hover:text-blue-600">
                                      {stall ? stall.title : r.title}
                                    </div>
                                  </div>
                                  {stall && (
                                    <div className="text-[8px] font-extrabold text-slate-400 text-center">
                                      {stall.grade}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <div className="col-span-2 flex flex-col items-center justify-center h-full">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-wider mb-1 bg-white/90 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap">
                              4号館へ
                            </span>
                            <ArrowUp className="w-4 h-4 text-slate-600 animate-bounce" />
                          </div>

                          <div className="col-span-7 grid grid-cols-4 gap-1">
                            <div className="bg-slate-200 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <svg className="w-4 h-4 text-slate-700 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 19h4v-4h4v-4h4V7" /></svg>
                              <span className="text-[9px] font-extrabold text-slate-700">階段</span>
                            </div>
                            <div className="bg-pink-100 border border-pink-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">🚺</span>
                              <span className="text-[9px] font-black text-pink-800 [writing-mode:vertical-rl]">女子トイレ</span>
                            </div>
                            <div className="bg-sky-100 border border-sky-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-xs leading-none mb-0.5">🚹</span>
                              <span className="text-[9px] font-black text-sky-800 [writing-mode:vertical-rl]">男子トイレ</span>
                            </div>
                            {(() => {
                              const r = { roomNo: "13Fゼミ室", label: "13Fゼミ", title: "天文部", emoji: "🌌" };
                              const stall = getRoomStall(r.roomNo);
                              return (
                                <button
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className="bg-white border-2 border-blue-200 rounded-xl p-1 flex flex-col items-center justify-between text-center hover:border-blue-500 transition"
                                >
                                  <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded">13Fゼミ</span>
                                  <span className="text-sm">{r.emoji}</span>
                                  <span className="text-[9px] font-black text-slate-800 line-clamp-1">{stall ? stall.title : r.title}</span>
                                </button>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 中央廊下スペース（高さ40px） */}
                        <div className="h-[40px] flex items-center justify-center">
                          <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">
                            ろうか
                          </span>
                        </div>

                        {/* 下段（南側） */}
                        <div className="grid grid-cols-12 gap-1.5 pt-2 h-[90px]">
                          <div className="col-span-3">
                            {(() => {
                              const r = { roomNo: "133教室", label: "133", title: "喫茶店", emoji: "☕" };
                              const stall = getRoomStall(r.roomNo);
                              return (
                                <button
                                  onClick={() => { if (stall) setModalItem(stall); }}
                                  className="w-full h-full bg-white border-2 border-blue-200 rounded-xl p-1 flex flex-col items-center justify-between text-center hover:border-blue-500 transition"
                                >
                                  <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded">133</span>
                                  <span className="text-base">{r.emoji}</span>
                                  <span className="text-[10px] font-black text-slate-800">{stall ? stall.title : r.title}</span>
                                  {stall && <span className="text-[8px] font-bold text-slate-400">{stall.grade}</span>}
                                </button>
                              );
                            })()}
                          </div>

                          <div className="col-span-9 bg-slate-100 border border-slate-200 rounded-xl p-2 text-center flex flex-col items-center justify-center">
                            <span className="text-xs font-extrabold text-slate-500">講義室・実験室エリア</span>
                          </div>
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