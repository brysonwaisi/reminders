import { InsertReminder, UpdateReminder } from "@/types/types";


export async function getReminders() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reminders`
    );
    if(!response.ok) {
        throw new Error('Failed to fetch reminders')
    }

    return response.json()
}


export async function completeReminder(id: number, isCompleted: boolean) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed: !isCompleted})
    });

  if (!response.ok) {
    throw new Error("Failed to update a reminder");
  }

  return response.json();
}

export async function createReminder(newReminder: InsertReminder) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReminder),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create a reminder");
  }

  return response.json();
}

export async function getReminderById(id: number) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`)

  if (!response.ok) {
    throw new Error("Failed to get a reminder");
  }

  return response.json();
}

export async function updateOldReminder(id: number, updatedReminder: UpdateReminder) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedReminder }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update a reminder");
  }

  return response.json();
}

export async function deleteReminder(id: number) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get a reminder");
  }

  return response.json();
}