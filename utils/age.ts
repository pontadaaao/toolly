/**
 * Age / elapsed-time math shared by the 人生・暮らし category tools
 * (age-calculator, yakudoshi-checker, kazoedoshi-calculator, etc).
 */

export interface ElapsedTime {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** A birth date is usable if it is a valid, non-future date. */
export function isValidBirthDate(date: Date, atDate: Date = new Date()): boolean {
  return !Number.isNaN(date.getTime()) && date.getTime() <= atDate.getTime();
}

/** 満年齢（誕生日を迎えていれば+1、まだなら現在の差分のまま）。 */
export function calcAge(birthDate: Date, atDate: Date = new Date()): number {
  let age = atDate.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    atDate.getMonth() > birthDate.getMonth() ||
    (atDate.getMonth() === birthDate.getMonth() && atDate.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return Math.max(age, 0);
}

/**
 * 数え年 = 生まれた年を1歳とし、以降は誕生日に関係なく元日ごとに+1する伝統的な数え方。
 * そのため「年の差 + 1」だけで求まり、満年齢のように誕生日を通過したかどうかは関係ない。
 */
export function calcKazoedoshi(birthDate: Date, atDate: Date = new Date()): number {
  return atDate.getFullYear() - birthDate.getFullYear() + 1;
}

/** 生まれてからの経過時間（日/時/分/秒、いずれも累計）。 */
export function calcElapsed(birthDate: Date, atDate: Date = new Date()): ElapsedTime {
  const diffMs = Math.max(atDate.getTime() - birthDate.getTime(), 0);
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  return { totalDays, totalHours, totalMinutes, totalSeconds };
}

/** 次に迎える誕生日（今日が誕生日なら今日を返す）。 */
export function nextBirthday(birthDate: Date, atDate: Date = new Date()): Date {
  const today = atMidnight(atDate);
  let next = new Date(atDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next.getTime() < today.getTime()) {
    next = new Date(atDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  return next;
}

/** 次の誕生日までの日数（誕生日当日は0）。 */
export function daysUntilNextBirthday(birthDate: Date, atDate: Date = new Date()): number {
  const today = atMidnight(atDate);
  const next = nextBirthday(birthDate, atDate);
  return Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function weekdayJa(date: Date): string {
  return `${weekdayLabels[date.getDay()]}曜日`;
}
