export interface SeijinResult {
  /** 満18歳の誕生日を迎える日（法律上の成人）。 */
  legalAdultDate: Date;
  /** 法律上の成人年齢に達する西暦年。 */
  legalAdultYear: number;
  /**
   * 二十歳のつどい（成人式）の目安の開催年。多くの自治体は民法改正後も
   * 20歳を対象に開催しており、小学校入学と同じ4月2日カットオフの学年区分で
   * 対象年度が決まる。
   */
  ceremonyYear: number;
}

export function calcSeijin(birthDate: Date): SeijinResult {
  const birthYear = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const bornBeforeCutoff = month < 4 || (month === 4 && day === 1);
  const ceremonyYear = birthYear + (bornBeforeCutoff ? 20 : 21);

  return {
    legalAdultDate: new Date(birthYear + 18, birthDate.getMonth(), birthDate.getDate()),
    legalAdultYear: birthYear + 18,
    ceremonyYear,
  };
}

export const seijinAgeExplanation =
  "2022年4月1日の民法改正により、成人年齢は20歳から18歳に引き下げられました。18歳になった時点で、親の同意なく契約を結べるなど法律上は成人として扱われます（飲酒・喫煙・公営競技の年齢制限は従来どおり20歳のままです）。";

export const seijinCeremonyExplanation =
  "多くの自治体では、受験や就職活動と重なる18歳ではなく、従来どおり20歳を対象に「成人式」（近年は「二十歳のつどい」という名称も増えています）を1月に開催しています。";
