import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"
import { GroceryItem } from "../types/grocery"

interface Props {
    item: GroceryItem
    onToggle: () => void
    onDelete: () => void
    onUpdateQty: (delts: number) => void
}

export function GroceryItemCard({ item, onToggle, onDelete, onUpdateQty }: Props) {
    return (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center shadow-sm">
            <Pressable onPress={onToggle} className="mr-3">
                <Ionicons name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"} size={26} color={item.isCompleted ? "#16a34a" : "#9ca3af"} />
            </Pressable>
            <View className="flex-1 mr-2">
                <Text className={`text-base font-semibold ${item.isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>{item.name}</Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-medium">{item.category}</Text>
                    <Text className="text-xs text-gray-400 ml-2">{item.quantity} {item.unit}</Text>
                </View>
            </View>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-2 py-1 mr-2">
                <Pressable onPress={() => onUpdateQty(-1)} className="w-6 h-6 items-center justify-center">
                    <Text className="text-gray-600 font-bold text-sm">+</Text>
                </Pressable>
            </View>
            <Pressable onPress={onDelete} className="p-1.5 rounded-lg bg-gray-50">
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Pressable>
        </View>
    )
}