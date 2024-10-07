import { ScrollView, View, Text } from "react-native";
import { useEffect, useState } from "react";
import {useSQLiteContext } from "expo-sqlite";
import { Category } from "@/types";
import CategorySunnah from "@/components/CategorySunnah";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@/components/SearchBar";
import { useLangCode } from "@/hooks/useLangCode";

export default function Sunnan() {
	let db = useSQLiteContext(); 	
	const [categorys, setCategorys] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	
	let lc = useLangCode();
	
	useEffect(() => {
		db.withTransactionAsync(async () => {
			await setup();
		})
	}, [db]);
	
	async function setup() {
		const res = await db.getAllAsync<Category>("SELECT * FROM category");
		setCategorys(res);
		setLoading(false);
	};

	if(loading) {
		return ( 
		<View className="flex-1 justify-center items-center bg-orange-100">
			<Text>Loading...</Text>
		</View> 
		)
	}
	
	return (
		<View className="bg-orange-100 h-full">
			<SafeAreaView className="">
				<ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
					<SearchBar search={search} setSearch={setSearch} />				
					{categorys.map( (cat, i) => {
						if(cat[lc].includes(search)) {
							return <CategorySunnah key={i} text={cat[lc]} id={i+1} lang={lc}/> 
						}
					})}
				</ScrollView>
			</SafeAreaView>
		</View>
  );
}
