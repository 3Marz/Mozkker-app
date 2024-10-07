import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs/lib/typescript/src/types";

type AnimatedTabBarButtonProps = BottomTabBarButtonProps & {
	name : string,
	activeIcon: string,
	inactiveIcon: string,
}

export function AnimatedTabBarButton(props: AnimatedTabBarButtonProps) {
  const {onPress, accessibilityState, name, activeIcon, inactiveIcon} = props;
	let focused = accessibilityState?.selected;

	const pop = useSharedValue(0)
	const fade = useSharedValue(0)

	useEffect(()=> {
		if(focused) {
			pop.value = withSpring(-8)
			fade.value = withTiming(1, {duration: 200})
		} else {
			pop.value = withSpring(0)
			fade.value = withTiming(0, {duration: 200})
		}
	}, [focused])

	const popAnimation = useAnimatedStyle(() => ({
		transform: [{translateY: pop.value}]
	}))
	const fadeAnimation = useAnimatedStyle(() => ({
		opacity: fade.value
	}))

  return (
	<TouchableOpacity onPress={onPress} className="flex-1 justify-center items-center place-items-center">
		<Animated.View style={popAnimation}>
			<Ionicons style={{marginTop: 20}} size={34} name={focused ? activeIcon as any : inactiveIcon as any}/>
		</Animated.View>
		<Animated.Text className="translate-y-[-8px] font-bold" style={fadeAnimation}>{name}</Animated.Text>
	</TouchableOpacity>
	);
}
