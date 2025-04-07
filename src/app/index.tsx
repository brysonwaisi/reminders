import {
  ActivityIndicator,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getReminders } from "@/services/reminderService";
import ReminderListItem from "@/components/ReminderListItem";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reminders"],
    queryFn: () => getReminders(),
  });

  if (isLoading) {
    return <ActivityIndicator size={'large'} style={{ marginTop: "20%" }} />;
  }

  if (error) {
    return (
      <Text style={{ alignSelf: "center", marginTop: "20%" }}>
        {error.message}
      </Text>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ReminderListItem reminderItem={item} />}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 27,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: "#FF8C00",
            }}
          ></Text>
        }
        showsVerticalScrollIndicator={false}
      />

      <Link href={"createUpdateReminder"} asChild>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 10,
          }}
        >
          <Entypo name="circle-with-plus" size={24} color="FF8C00" />
          <Text style={{ fontWeight: "600", color: "#FF8C00", fontSize: 16 }}>New Reminder</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
