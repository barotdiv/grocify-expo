import { Pressable, ScrollView, Text, View } from "react-native"
import { CATEGORIES } from "../types/grocery"

const ALl_CATEGORIES = ["All", ...CATEGORIES.map((c) => c.name)]

interface Props {
    selected: string
    onSelect: (cat: string) => void
}

export function CategoryFilter({ selected, onSelect }: Props) {
    return (
        <View className="bg-white dark:bg-card py-3 border-b border-gray-100 dark:border-border">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
                {ALl_CATEGORIES.map((cat) => {
                    const isActive = selected === cat
                    return (
                        <Pressable key={cat} onPress={() => onSelect(cat)} className={`px-3.5 py-1.5 rounded-full ${isActive ? "bg-emerald-600 border-emerald-600 shadow-sm" : "bg-gray-50 dark:bg-secondary border-gray-200 dark:border-border"}`}>
                            <Text className={`text-xs font-semibold ${isActive ? "text-white" : "text-gray-600 dark:gray-600 dark:text-muted-foreground"}`}>{cat}</Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}