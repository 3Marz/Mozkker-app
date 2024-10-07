
import { getLocales } from "expo-localization";

type Code = "ar" | "en"

export function useLangCode() : Code {
	let lc = getLocales()[0].languageCode || 'en';
	if(lc == "ar" || lc == "en") {} 
	else { lc = "en" }

	return lc as Code;
}
