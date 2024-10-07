import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons"
import { useSQLiteContext } from "expo-sqlite"
import { View, Text, TouchableWithoutFeedback } from "react-native"
import { useState } from "react"
import { Sunnah } from "@/types"
import Zeker from "./Zeker"
import Animated, { FadingTransition, LinearTransition } from "react-native-reanimated"

type CategorySunnahProps = {
	id : number,
	text : string,
	lang : string
}

export default function CategorySunnah({id, text, lang}: CategorySunnahProps) {
	const db = useSQLiteContext();

	const [sunnan, setSunnan] = useState<Sunnah[]>([]);
	const [show, setShow] = useState(false);
	
	async function setup() {
		const res = await db.getAllAsync<Sunnah>("SELECT * FROM sunnan where category_id=?", id);
		setSunnan(res);
	};

	function onPress() {
		if (sunnan.length == 0) {
			db.withTransactionAsync(async () => {
				await setup()
			})
		}
		setShow(!show)
	}

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<Animated.View className="p-5 mb-3 mx-4 border rounded">
				<View style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "space-between",
				}}>
					<Text className="font-extrabold" style={{
						width: "95%"
					}}>{text}</Text>
					<MaterialIcons name={ show ? "keyboard-arrow-up" : "keyboard-arrow-down" } size={20}/>
				</View>
				{show && 
					sunnan.map((sn, i) => {
						return <Zeker key={i} id={i} text={sn[lang]}/> 
					})
				}	
			</Animated.View>
		</TouchableWithoutFeedback>
	)
}

