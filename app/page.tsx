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
    location: "1号館 13Fゼミ室",
    zoneId: "bldg1",
    floor: "3F",
    roomNo: "13Fゼミ室",
    description: "天体写真展示および手作りドームによる幻想的なプラネタリウム上映！",
    icon: "🌌",
  },
  {
    id: 302,
    title: "美術写真部（作品展示・看板展示）",
    category: "部活動企画",
    grade: "部活",
    dept: "美術写真部",
    location: "1号館 12Fゼミ室",
    zoneId: "bldg1",
    floor: "2F",
    roomNo: "12Fゼミ室",
    description: "絵画・写真作品や高専祭を彩る各種看板作品の展示。",
    icon: "🖼️",
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
    icon: "𖤤",
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
    icon: "𔢤",
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
    icon: "🎴",
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

  // 1号館フロア別データ
  const floorStalls = useMemo(() => {
    return STALLS_DATA.filter((s) => s.zoneId === "bldg1" && s.floor === currentFloor);
  }, [currentFloor]);

  // 現在選択中のゾーン情報
  const currentZone = CAMPUS_ZONES.find((z) => z.id === selectedZoneId);

  // 111〜113教室・各ブースの個別出展取得ヘルパー
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

                {/* 校内マップのピン */}
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
                        onClick={() =>
                          setSelectedZoneId((prev) => (prev === zone.id ? null : zone.id))
                        }
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

            {/* 選択されたスポットの詳細パネル */}
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

                {selectedZoneId === "bldg1" && (
                  <button
                    onClick={() => {
                      setIsBldg1ModalOpen(true);
                      setHighlightedRoomNo(null);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>1号館のフロア詳細マップ（1F / 2F / 3F）を開く</span>
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
                            <span className="text-2xl p-2 bg-slate-50 rounded-xl">{stall.icon}</span>
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
                該当件数: {filteredStalls.length}件 （開催時間: 10:00〜15:00）
              </p>

              {filteredStalls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredStalls.map((stall) => (
                    <div
                      key={stall.id}
                      onClick={() => setModalItem(stall)}
                      className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2.5 bg-orange-50 rounded-2xl group-hover:scale-110 transition shrink-0">
                            {stall.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                                {stall.grade}
                              </span>
                              <span className="text-[10px] font-extrabold text-slate-400">
                                {stall.category}
                              </span>
                            </div>
                            <h3 className="font-black text-base text-slate-900 mt-1 line-clamp-1">
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

        {/* タブ 3: ステージ・タイムスケジュール */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-2xl text-xs font-bold text-orange-900 flex items-center justify-between">
              <span>📅 高専祭 タイムスケジュール</span>
              <span className="bg-orange-200 text-orange-900 px-2 py-0.5 rounded font-black text-[10px]">
                10:00〜15:00
              </span>
            </div>

            {EVENTS_DATA.map((stage) => (
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
                    onClick={() => {
                      setSelectedZoneId(stage.locationZoneId);
                      setActiveTab("map");
                    }}
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
                        className={`p-4 rounded-3xl border transition relative overflow-hidden ${
                          isLive
                            ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 border-orange-500 ring-2 ring-orange-400/50 shadow-md"
                            : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        {isLive && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-pulse" />
                            <span>LIVE 実施中</span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <span className="text-3xl p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-1">
                            {event.icon}
                          </span>
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
                            <p className="text-xs text-slate-600 leading-relaxed pt-1">{event.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* タブ 4: 交通・アクセス */}
        {activeTab === "access" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl shadow-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-black text-amber-900">
                  【重要】ご来場時のお車のご利用について
                </h3>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  <strong>※臨時駐車場はございません。</strong>
                  校内の指定駐車場は駐車台数に大変限りがございます。ご来校の際は可能な限り公共交通機関（路線バス等）のご利用にご協力をお願いいたします。
                </p>
              </div>
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

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Info className="w-4 h-4 text-slate-600" />
                    <span>ご来場にあたってのお願い</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                    <li>校内は全面禁煙です。</li>
                    <li>酒類の持ち込み・飲酒は厳禁となっております。</li>
                  </ul>
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

      {/* モーダル1: 出店・施設詳細 */}
      {modalItem && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-orange-50 rounded-2xl">{modalItem.icon}</span>
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                      {modalItem.grade}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{modalItem.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{modalItem.dept}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                  <MapPin className="w-4 h-4 text-orange-500" />
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
                    if (modalItem.zoneId === "bldg1") {
                      setIsBldg1ModalOpen(true);
                      if (modalItem.floor) {
                        setCurrentFloor(modalItem.floor);
                      }
                      setHighlightedRoomNo(modalItem.roomNo || modalItem.title);
                      setModalItem(null);
                    } else {
                      setSelectedZoneId(modalItem.zoneId);
                      setActiveTab("map");
                      setModalItem(null);
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

      {/* モーダル2: 1号館フロア詳細マップ (z-50) */}
      {isBldg1ModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-base">1号館 フロア詳細マップ</h3>
              </div>
              <button
                onClick={() => {
                  setIsBldg1ModalOpen(false);
                  setHighlightedRoomNo(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* フロア切替タブ */}
            <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
              {(["1F", "2F", "3F"] as const).map((floor) => (
                <button
                  key={floor}
                  onClick={() => setCurrentFloor(floor)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                    currentFloor === floor
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>

            {/* フロアレイアウトコンテンツ */}
            <div className="p-4 space-y-3 overflow-y-auto custom-map-scrollbar">
              {currentFloor === "1F" ? (
                /* 1F 十字路フロアマップ */
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-2.5 text-[11px] font-extrabold text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1号館 1Fフロアマップ</span>
                    </span>
                    <span className="text-blue-600 font-bold hidden sm:inline">※部屋をタップして詳細表示</span>
                  </div>

                  {/* 十字路フロアマップ外枠 */}
                  <div className="w-full overflow-x-auto custom-map-scrollbar pb-2">
                    <div className="min-w-[540px] max-w-[660px] mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 relative select-none">
                      
                      {/* 上部: 4号館への通路(縦書き「4号館」＋矢印) ＆ 本部 */}
                      <div className="grid grid-cols-12 gap-1 items-end mb-1">
                        <div className="col-span-5"></div>
                        
                        {/* 中央北側: 4号館への通路 */}
                        <div className="col-span-2 flex flex-col items-center justify-end pb-1">
                          <span className="text-xs font-black text-slate-800 [writing-mode:vertical-rl] tracking-widest mb-1">
                            4号館
                          </span>
                          <ArrowUp className="w-5 h-5 text-slate-600 animate-bounce" />
                        </div>

                        {/* 北東側: 本部 */}
                        <div className="col-span-5 pl-2 flex justify-start">
                          <button
                            onClick={() => {
                              const stall = getRoomStall("本部");
                              if (stall) setModalItem(stall);
                            }}
                            className={`relative w-28 h-14 border-2 rounded-xl shadow-sm text-center font-black transition flex flex-col items-center justify-center ${
                              highlightedRoomNo === "本部" || highlightedRoomNo === "1F 本部"
                                ? "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400"
                                : "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                            }`}
                          >
                            {(highlightedRoomNo === "本部" || highlightedRoomNo === "1F 本部") && (
                              <div className="absolute -top-3 -right-2 z-20 bg-amber-400 text-rose-900 rounded-full p-1 shadow-md animate-bounce">
                                <MapPin className="w-4 h-4 fill-amber-400 text-rose-900" />
                              </div>
                            )}
                            <span className="text-[9px] opacity-80 uppercase tracking-wider">Headquarters</span>
                            <span className="text-xs mt-0.5">🏫 本部</span>
                          </button>
                        </div>
                      </div>

                      {/* 十字路＋各施設配置の全体エリア */}
                      <div className="relative grid grid-cols-12 gap-0 border-t-2 border-slate-300 pt-0">
                        
                        {/* 十字路背景: 水平廊下 */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-slate-200 border-b-2 border-slate-300 z-0" />
                        
                        {/* 十字路背景: 垂直廊下 */}
                        <div className="absolute top-0 bottom-0 left-[41.666%] w-[16.666%] bg-slate-200 border-x-2 border-slate-300 z-0" />

                        {/* 西エリア（左）: 113教室, 112教室, 111教室 */}
                        <div className="col-span-5 grid grid-cols-3 gap-1.5 pt-12 pr-2 z-10">
                          {[
                            { roomNo: "113教室", roomLabel: "113", defaultTitle: "ホスト", emoji: "🌹" },
                            { roomNo: "112教室", roomLabel: "112", defaultTitle: "ドリンク", emoji: "🍹" },
                            { roomNo: "111教室", roomLabel: "111", defaultTitle: "ほっとサンド", emoji: "🥪" },
                          ].map((r) => {
                            const stall = getRoomStall(r.roomNo);
                            const isHighlighted = highlightedRoomNo === r.roomNo;
                            return (
                              <button
                                key={r.roomNo}
                                onClick={() => {
                                  if (stall) setModalItem(stall);
                                }}
                                className={`relative border-2 p-1.5 rounded-xl shadow-sm hover:shadow transition flex flex-col justify-between h-32 text-left group ${
                                  isHighlighted
                                    ? "bg-amber-50 border-rose-500 ring-2 ring-rose-400"
                                    : "bg-white border-orange-200 hover:border-orange-500"
                                }`}
                              >
                                {isHighlighted && (
                                  <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                    <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                  </div>
                                )}
                                <div className="text-[9px] font-black text-orange-600 bg-orange-50 px-1 py-0.5 rounded w-fit">
                                  {r.roomLabel}
                                </div>
                                <div className="my-auto text-center">
                                  <div className="text-lg group-hover:scale-110 transition">{r.emoji}</div>
                                  <div className="text-[11px] font-black text-slate-800 mt-0.5 line-clamp-1 group-hover:text-orange-600">
                                    {stall ? stall.title : r.defaultTitle}
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

                        {/* 中央縦廊下: 最南端に学生昇降口 */}
                        <div className="col-span-2 flex flex-col items-center justify-end z-10 pt-12 min-h-[170px]">
                          <div className="mb-2 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-800 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-md whitespace-nowrap">
                              <Users className="w-3 h-3 text-amber-400" />
                              <span>学生昇降口</span>
                            </div>
                          </div>
                        </div>

                        {/* 東エリア（右）: 金券販売・交流ラウンジ ＆ 階段・トイレ */}
                        <div className="col-span-5 grid grid-cols-12 gap-1 pt-12 pl-1 z-10">
                          
                          {/* 金券販売 ＆ 交流ラウンジ（縦並び） */}
                          <div className="col-span-5 flex flex-col gap-1.5">
                            {/* 金券販売 */}
                            <button
                              onClick={() => {
                                const stall = STALLS_DATA.find((s) => s.id === 501);
                                if (stall) setModalItem(stall);
                              }}
                              className={`relative h-20 border-2 rounded-xl shadow-sm p-1 flex flex-col items-center justify-center text-center font-black transition ${
                                highlightedRoomNo === "金券販売" || highlightedRoomNo === "1号館 1F 金券販売"
                                  ? "bg-amber-300 border-rose-500 ring-2 ring-rose-400 text-amber-950"
                                  : "bg-amber-400 hover:bg-amber-300 border-amber-500 text-amber-950"
                              }`}
                            >
                              {(highlightedRoomNo === "金券販売" || highlightedRoomNo === "1号館 1F 金券販売") && (
                                <div className="absolute -top-3 -right-2 z-20 bg-rose-500 text-white rounded-full p-1 shadow-md animate-bounce">
                                  <MapPin className="w-4 h-4 fill-white text-rose-500" />
                                </div>
                              )}
                              <Ticket className="w-3.5 h-3.5 mb-0.5 shrink-0" />
                              <span className="text-[10px] font-black tracking-widest [writing-mode:vertical-rl]">金券販売</span>
                            </button>

                            {/* 交流ラウンジ */}
                            <div className="h-20 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-1 text-center flex flex-col items-center justify-center">
                              <span className="text-base leading-none mb-0.5">🛋️</span>
                              <span className="text-[9px] font-black text-emerald-900 tracking-wider [writing-mode:vertical-rl]">
                                交流ラウンジ
                              </span>
                            </div>
                          </div>

                          {/* 階段・男子トイレ・女子トイレ（並列） */}
                          <div className="col-span-7 grid grid-cols-3 gap-1 h-20">
                            {/* 階段 */}
                            <div className="bg-slate-200 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <svg
                                className="w-4 h-4 text-slate-700 mb-0.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 19h4v-4h4v-4h4V7" />
                              </svg>
                              <span className="text-[8px] font-extrabold text-slate-700">階段</span>
                            </div>

                            {/* 男子トイレ */}
                            <div className="bg-sky-100 border border-sky-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] font-black text-sky-800 [writing-mode:vertical-rl]">男子トイレ</span>
                            </div>

                            {/* 女子トイレ */}
                            <div className="bg-pink-100 border border-pink-300 rounded-xl p-1 flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] font-black text-pink-800 [writing-mode:vertical-rl]">女子トイレ</span>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                /* 2F / 3F のグリッド表示 */
                <div className="relative w-full bg-slate-100 border-2 border-slate-300 rounded-2xl p-4 min-h-[180px] flex flex-col justify-center space-y-3">
                  <div className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    1号館 {currentFloor} 配置イメージ
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {floorStalls.map((stall) => {
                      const isHighlighted = highlightedRoomNo === stall.roomNo || highlightedRoomNo === stall.title;
                      return (
                        <button
                          key={stall.id}
                          onClick={() => {
                            setModalItem(stall);
                          }}
                          className={`relative p-3 border rounded-xl shadow-sm hover:shadow transition flex flex-col items-center text-center space-y-1 ${
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
                          <span className="text-2xl">{stall.icon}</span>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {stall.roomNo}
                          </span>
                          <span className="text-xs font-black text-slate-800 line-clamp-1">
                            {stall.title}
                          </span>
                        </button>
                      );
                    })}
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