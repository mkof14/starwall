import type { Locale } from "@/lib/i18n/locales";

export type PlansDeskCopy = {
  kicker: string;
  title: string;
  body: string;
  cta: string;
  catalog: string;
};

const en: PlansDeskCopy = {
  kicker: "Closed site · Plans",
  title: "Open the StarWall price book",
  body: "Super Admin, Admin, and people assigned to this page can work quotes and list prices here. The public Plans page does not show numbers.",
  cta: "Open Price Book",
  catalog: "View public Plans",
};

const ru: PlansDeskCopy = {
  kicker: "Закрытая часть · Планы",
  title: "Открыть стол цен StarWall",
  body: "Суперадмин, администратор и люди с правами на эту страницу работают с котировками и прайсом здесь. Публичные Планы цифр не показывают.",
  cta: "Открыть стол цен",
  catalog: "Публичные планы",
};

const uk: PlansDeskCopy = {
  kicker: "Закрита частина · Плани",
  title: "Відкрити стіл цін StarWall",
  body: "Суперадмін, адміністратор і люди з правами на цю сторінку працюють із котируваннями та прайсом тут. Публічні Плани цифр не показують.",
  cta: "Відкрити стіл цін",
  catalog: "Публічні плани",
};

const es: PlansDeskCopy = {
  kicker: "Sitio cerrado · Planes",
  title: "Abrir el libro de precios StarWall",
  body: "Super Admin, Admin y quienes tienen derechos sobre esta página trabajan aquí con cotizaciones y precios de lista. Los Planes públicos no muestran cifras.",
  cta: "Abrir libro de precios",
  catalog: "Ver planes públicos",
};

const fr: PlansDeskCopy = {
  kicker: "Partie fermée · Plans",
  title: "Ouvrir le livre des prix StarWall",
  body: "Les Super Admin, Admin et les personnes autorisées travaillent ici les devis et les prix catalogue. Les Plans publics n’affichent aucun chiffre.",
  cta: "Ouvrir le livre des prix",
  catalog: "Plans publics",
};

const de: PlansDeskCopy = {
  kicker: "Geschlossener Bereich · Pläne",
  title: "StarWall-Preisbuch öffnen",
  body: "Super Admin, Admin und Personen mit Rechte für diese Seite arbeiten hier mit Angeboten und Listenpreisen. Die öffentlichen Pläne zeigen keine Zahlen.",
  cta: "Preisbuch öffnen",
  catalog: "Öffentliche Pläne",
};

const ar: PlansDeskCopy = {
  kicker: "الجزء المغلق · الخطط",
  title: "فتح دفتر أسعار StarWall",
  body: "يمكن للمسؤول الأعلى والمسؤول والأشخاص المصرّح لهم العمل على العروض والأسعار هنا. الصفحة العامة لا تعرض أرقامًا.",
  cta: "فتح دفتر الأسعار",
  catalog: "الخطط العامة",
};

const zh: PlansDeskCopy = {
  kicker: "内部 · 方案",
  title: "打开 StarWall 价格手册",
  body: "超级管理员、管理员以及获授权的人员可在此处理报价与目录价。公开方案页不显示数字。",
  cta: "打开价格手册",
  catalog: "查看公开方案",
};

const ja: PlansDeskCopy = {
  kicker: "クローズド · プラン",
  title: "StarWall 価格帳を開く",
  body: "スーパー管理者、管理者、およびこのページの権限を持つ人が、見積と定価をここで扱います。公開プランに数字は出ません。",
  cta: "価格帳を開く",
  catalog: "公開プランを見る",
};

const he: PlansDeskCopy = {
  kicker: "החלק הסגור · תוכניות",
  title: "לפתוח את ספר המחירים של StarWall",
  body: "סופר־אדמין, אדמין ומי שיש לו הרשאה לדף הזה עובדים כאן עם הצעות ומחירון. בתוכניות הציבוריות אין מספרים.",
  cta: "לפתוח את ספר המחירים",
  catalog: "תוכניות ציבוריות",
};

const copy: Record<Locale, PlansDeskCopy> = {
  en,
  es,
  fr,
  de,
  ru,
  uk,
  ar,
  zh,
  ja,
  he,
};

export function getPlansDesk(locale: Locale): PlansDeskCopy {
  return copy[locale] ?? en;
}
