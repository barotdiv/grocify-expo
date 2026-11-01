import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"
import { GroceryItem, Priority } from "../types/grocery"

interface Props {
    item: GroceryItem
    onToggle: () => void
    onDelete: () => void
    onUpdateQty: (delta: number) => void
}

function getPriorityBadge(priority?: Priority) {
    switch (priority) {
        case "high":
            return {
                bg: "bg-red-50 dark:bg-red-950/40",
                text: "text-red-700 dark:text-red-400",
                border: "border-red-200 dark:border-red-900/50",
                label: "High",
            }
        case "medium":
            return {
                bg: "bg-amber-50 dark:bg-amber-950/40",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200 dark:border-amber-900/50",
                label: "Med",
            }
        case "low":
        default:
            return {
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-900/50",
                label: "Low",
            }
    }
}

export function GroceryItemCard({ item, onToggle, onDelete, onUpdateQty }: Props) {
    const priorityStyle = getPriorityBadge(item.priority)
    return (
        <View className={`bg-white dark:bg-card rounded-2xl p-4 mb-3 border border-gray-100 dark:border-border flex-row items-center shadow-sm ${item.isCompleted ? "opacity-60" : "opacity-100"}`}>
            <Pressable onPress={onToggle} className="mr-3">
                <Ionicons
                    name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                    size={26}
                    color={item.isCompleted ? "#16a34a" : "#9ca3af"}
                />
            </Pressable>
            <View className="flex-1 mr-2">
                <Text className={`text-base font-semibold ${item.isCompleted ? "line-through text-gray-400 dark:text-muted-foreground" : "text-gray-900 dark:text-foreground"}`}>
                    {item.name}
                </Text>
                <View className="flex-row items-center gap-2 mt-1.5 flex-wrap">
                    <View className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 px-2 py-0.5 rounded-md">
                        <Text className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                            {item.category}
                        </Text>
                    </View>
                    <View className={`px-2 py-0.5 rounded-md border ${priorityStyle.bg} ${priorityStyle.border}`}>
                        <Text className={`text-[11px] font-bold ${priorityStyle.text}`}>
                            {priorityStyle.label}
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-muted-foreground">
                        {item.quantity} {item.unit}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center bg-gray-50 dark:bg-secondary rounded-xl px-2 py-1 mr-2 border border-gray-100 dark:border-border">
                <Pressable onPress={() => onUpdateQty(-1)} hitSlop={6} className="w-6 h-6 items-center justify-center active:opacity-50">
                    <Ionicons name="remove" size={14} color="#374151" />
                </Pressable>
                <Text className="text-xs font-bold text-gray-800 dark:text-foreground mx-1.5 min-w-[14px] text-center">{item.quantity}</Text>
                <Pressable onPress={() => onUpdateQty(1)} hitSlop={6} className="w-6 h-6 items-center justify-center active:opacity-50">
                    <Ionicons name="add" size={14} color="#374151" />
                </Pressable>
            </View>
            <Pressable onPress={onDelete} hitSlop={8} className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 active:opacity-60">
                <Ionicons name="trash-outline" size={16} color="#dc2626" />
            </Pressable>
        </View>
    )
}
