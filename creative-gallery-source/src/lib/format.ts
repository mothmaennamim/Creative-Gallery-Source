const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** ইংরেজি সংখ্যা → বাংলা সংখ্যা */
export function bn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** টাকার ফরম্যাট: ৳১,২৫০ */
export function tk(value: number): string {
  return "৳" + bn(value.toLocaleString("en-IN"));
}

/** রেটিং: ৪.৫ */
export function bnRate(value: number): string {
  return bn(value.toFixed(1));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
  ];
  return `${bn(d.getDate())} ${months[d.getMonth()]}, ${bn(d.getFullYear())}`;
}
