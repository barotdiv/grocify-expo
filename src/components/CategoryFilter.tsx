import { Pressable, ScrollView, Text, View } from "react-native"
import { CATEGORIES } from "../types/grocery"

const ALl_CATEGORIES = ["All", ...CATEGORIES.map((c) => c.name)]

interface Props {
    selected: string
    onSelect: (cat: string) => void
}

export function CategoryFilter({ selected, onSelect }: Props) {
    return (
        <View className="bg-white py-2.5 border-b border-gray-100">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
                {ALl_CATEGORIES.map((cat) => {
                    const isActive = selected === cat
                    return (
                        <Pressable key={cat} onPress={() => onSelect(cat)} className={`px-3.5 py-1.5 rounded-full ${isActive ? "bg-sky-600" : "bg-gray-100"}`}>
                            <Text className={`text-xs font-semibold ${isActive ? "text-white" : "text-gray-600"}`}>{cat}</Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}