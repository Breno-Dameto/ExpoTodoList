import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <ThemedView style={styles.taskItem}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onToggle(task.id)}>
        <Ionicons 
          name={task.completed ? "checkbox" : "square-outline"} 
          size={24} 
          color={task.completed ? "#4CAF50" : "#666"}
        />
      </TouchableOpacity>
      <ThemedText style={[
        styles.taskText,
        task.completed && styles.completedText
      ]}>
        {task.title}
      </ThemedText>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkbox: {
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});