import { useLangCode } from "./useLangCode"

export type HijriDateType = {
	full: string
	medium: string
	short: string

	year: string
	month: string
	day: string
	dayNum: string
	geDate: string
}

export function useHijriDate(): HijriDateType {
	const lc = useLangCode();
	const format = lc+"-u-ca-islamic-umalqura-nu-latn";
	const date = new Date(Date.now());

	const full = new Intl.DateTimeFormat(format,{dateStyle: "full"}).format(date);
	const medium = new Intl.DateTimeFormat(format,{dateStyle: "medium"}).format(date);
	const short = new Intl.DateTimeFormat(format,{dateStyle: "short"}).format(date);

	const yearF = new Intl.DateTimeFormat(format, {year:"numeric"}).format(date);
	const year = yearF.split(" ")[0]
	const month = new Intl.DateTimeFormat(format, {month: "long"}).format(date);
	const day = new Intl.DateTimeFormat(format, {weekday:"short"}).format(date);
	const dayNum = new Intl.DateTimeFormat(format, {day:"numeric"}).format(date);

	return {
		full: full,
		medium: medium,
		short: short,

		year: year,
		month: month,
		day: day,
		dayNum: dayNum,
		geDate: new Date().toLocaleDateString(lc)
	}
}

