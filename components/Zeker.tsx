import { Text } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated";

type ZekerProps = {
	text: string,
	id: number
}

export default function Zeker({text, id}: ZekerProps) {
	return (
		<Animated.View entering={FadeInDown.delay(id*10)} className="border-t mt-3 pt-3 border-dashed text-gray-100 border-black">
			<Text>{text}</Text>
		</Animated.View>
	)
}

