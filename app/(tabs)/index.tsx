import { HijriDateType, useHijriDate } from "@/hooks/useHijriDate";
import { useLangCode } from "@/hooks/useLangCode";
import { Category, Sunnah } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import Animated, {FadeIn, FadeInUp, FadeOut, LinearTransition} from "react-native-reanimated";

import * as Notifications from 'expo-notifications'; 
import { TouchableOpacity } from "react-native";

type RandSunnah = {
	sunnah: Sunnah | null,
	category: Category | null
}

export default function Index() {

	const hijri = useHijriDate();
	const db = useSQLiteContext()
	const [randSunnah, setRandSunnah] = useState<RandSunnah>()
	const [loadedRand, setLoadedRand] = useState(false)
	const lc = useLangCode()
	const {t} = useTranslation()

	useEffect(() => {
		db.withTransactionAsync(async () => {
			await getRandom()
		})
	}, [db])

	async function getRandom () {
		const sunnah = await db.getFirstAsync<Sunnah>("SELECt * FROM sunnan ORDER BY RANDOM() LIMIT 1")
		let category : Category | null = null
		if(sunnah != null) {
			category = await db.getFirstAsync<Category>("SELECT * FROM category WHERE id=?", [sunnah.category_id])
		}
		setRandSunnah({sunnah: sunnah, category: category})
		setLoadedRand(true)
	}

  return (
    <ScrollView className="flex-1 bg-orange-100 dark:bg-slate-900">
			<SafeAreaView className="m-5">

				<Animated.View entering={FadeIn.delay(100)} layout={LinearTransition}>
				<Shadow style={{borderRadius: 7, marginBottom:25}} stretch distance={0} offset={[-5, 5]} startColor="#222">
					<View className="bg-orange-200 p-4 border rounded-lg">
						<Text style={[styles.header]}>{hijri.month+"  "+hijri.dayNum}</Text>
						<Text style={[styles.normal]}>{hijri.day + " " + hijri.year}  |  {hijri.geDate}</Text>
					</View>
				</Shadow>
				</Animated.View>

				<Animated.View entering={FadeIn.delay(200)} layout={LinearTransition}>
				<Shadow style={{borderRadius: 7, marginBottom:25}} stretch distance={0} offset={[-5, 5]} startColor="#222">
					<View className="bg-orange-200 p-4 border rounded-lg">
						<Text style={styles.subTitle} className="mb-2">{t('index.randomSunnah')} :</Text>
						<View>
							{loadedRand &&
							<>
								{randSunnah?.category && <Animated.Text entering={FadeIn} style={styles.normal}>{randSunnah?.category[lc]}</Animated.Text>}
								{randSunnah?.sunnah && <Animated.Text entering={FadeIn} style={styles.small} className="border-t border-dashed mt-3 pt-3">{randSunnah?.sunnah[lc]}</Animated.Text>}
							</>
							}
						</View>
					</View>
				</Shadow>
				</Animated.View>

				<Animated.View entering={FadeIn.delay(300)} layout={LinearTransition}>
				<Shadow style={{borderRadius: 7, marginBottom:25}} stretch distance={0} offset={[-5, 5]} startColor="#222">
					<View className="bg-orange-200 p-4 border rounded-lg">
						<TouchableOpacity onPress={async () => {await schedulePushNotification()}}>
								<Text>noto</Text>
							</TouchableOpacity>
					</View>
				</Shadow>
				</Animated.View>

			</SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
	header: {
		fontFamily: "RobotoSlab_900Black",
		textDecorationLine: "underline",
		fontSize: 32,
	},
	subTitle: {
		fontFamily: "RobotoSlab_700Bold",
		textDecorationLine: "underline",
		fontSize: 25,
	},
	normal: {
		fontFamily: "RobotoSlab_500Medium",
		fontSize: 20,
	},
	small: {
		fontFamily: "RobotoSlab_400Regular",
		fontSize: 14,
	}
})

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: { seconds: 2 },
  });
}

