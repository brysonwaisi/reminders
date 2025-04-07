import { createReminder, deleteReminder, getReminderById, updateOldReminder } from "@/services/reminderService";
import { InsertReminder } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";

export default function CreateUpdateReminder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reminderId = parseInt(id);
  const [reminder, setReminder] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reminders", reminderId],
    queryFn: () => getReminderById(reminderId),
    enabled: !!reminderId,
  });
  const { mutate: saveReminder, isPending } = useMutation({
    mutationFn: () => {
      let newReminder: InsertReminder = {
        reminder,
        userId: 1,
      };

      if (notes) {
        newReminder.notes = notes;
      }
      return createReminder(newReminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      router.back();
    },

    onError(error, variables, context) {
      Alert.alert("Error", error.message);
    },
  });

  const {mutate: updateReminder} = useMutation({
    mutationFn: () => {
      const newReminder = {
        reminder,
        notes: notes ? notes: null,
      }
 
      return updateOldReminder(reminderId, newReminder)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      router.back();
    },

    onError(error, variables, context) {
      Alert.alert("Error", error.message);
    },
  });

  const { mutate: removeReminder } = useMutation({
    mutationFn: () => deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      router.back();
    },

    onError(error, variables, context) {
      Alert.alert("Error", error.message);
    },
  });

  useEffect(() => {
    if (data) {
      setReminder(data.reminder)
      setNotes(data.notes)
    }
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator size={"large"} style={{ marginTop: "20%" }} />;
  }

  if (error) {
    return (
      <Text style={{ alignSelf: "center", marginTop: "20%" }}>
        {error.message}
      </Text>
    );
  }

  const isSaveButtonDisabled = () => isPending || !reminder;
  
  const onDonePressed = () => {
    if (reminderId) {
      return updateReminder()
    }

    return saveReminder()
  }
    return (
      <>
        <Stack.Screen
          name="createUpdateReminder"
          options={{
            headerTitle: "New Reminder",
            headerRight: () => (
              <Text
                disabled={isSaveButtonDisabled()}
                style={{ color: "#0E7AFE", marginRight: 16 }}
                onPress={() => onDonePressed()}
              >
                Done
              </Text>
            ),
          }}
        />
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Title"
            multiline
            value={reminder}
            onChangeText={setReminder}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="Notes"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
        {!!reminderId && (
          <Pressable onPress={() => removeReminder()} style={styles.inputBox}>
            <Text style={{ color: "crimson" }}> Delete </Text>
          </Pressable>
        )}
      </>
    );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgrey",
  },
  inputBox: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
});
