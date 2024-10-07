import { Dispatch, SetStateAction, useState } from "react"
import { useTranslation } from "react-i18next"
import { Text, TextInput } from "react-native"

type SearchBarProps = {
	search: string,
	setSearch: Dispatch<SetStateAction<string>>,
}

export function SearchBar({search, setSearch}: SearchBarProps) {
	const { t } = useTranslation()
	const [active, setActive] = useState(false)

	function onFocus() {
		setActive(true)
	}
	function onBlur() {
		setActive(false)
	}

	return (
		<TextInput  style={{
				borderWidth: 1.5,
				borderRadius: 5,
				borderStyle: active ? "dotted" : "dashed",
				borderColor: active ? "#2a2a2a" : "#a2a2a2",
				marginHorizontal: "2%",
				marginTop: 10,
				marginBottom: 20,
				padding: "3%",
				backgroundColor: "#fed7aa",
				elevation: 10,
			}} placeholder={t('sunnan.searchPlaceHolder')} 
			value={search} onChangeText={text => setSearch(text)}
			onFocus={onFocus}
			onBlur={onBlur}/>
	)
}

