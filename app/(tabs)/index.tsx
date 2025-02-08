import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TaskItem } from '@/components/TaskItem';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      let allTasks: Task[] = [];
  
      if (storedTasks) {
        allTasks = JSON.parse(storedTasks);
      }

      if (allTasks.length === 0) {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const apiTasks = await response.json();
        
        await AsyncStorage.setItem('tasks', JSON.stringify(apiTasks));
        
       
        setTasks(apiTasks.filter((task: Task) => !task.completed));
      } else {
        setTasks(allTasks.filter((task: Task) => !task.completed));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

const addTask = async () => {
  if (newTask.trim()) {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const allTasks = storedTasks ? JSON.parse(storedTasks) : [];

      const newTaskItem = {
        id: Date.now(),
        title: newTask.trim(),
        completed: false,
      };

      const updatedAllTasks = [...allTasks, newTaskItem];

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedAllTasks));

      setTasks(updatedAllTasks.filter(task => !task.completed));
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
};

  const toggleTask = async (id: number) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      const updatedAllTasks: Task[] = allTasks.map((task: Task): Task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedAllTasks));
      
      setTasks(updatedAllTasks.filter(task => !task.completed));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };


  return (
<ParallaxScrollView
    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    headerImage={
      <Image
        source={require('../../assets/images/task-list.png')}
        style={styles.headerImage}
        resizeMode="contain"
      />
    }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Todo List</ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Ionicons name="add-circle" size={38} color="#1D3D47" />
          </TouchableOpacity>
        </ThemedView>

        {loading ? (
          <ActivityIndicator size="large" color="#A1CEDC" />
        ) : (
          <ThemedView style={styles.taskList}>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  taskList: {
    gap: 8,
  },
  headerImage: {
    position: 'absolute',
    bottom: 0,
    left: '50%',  
    transform: [{ translateX: -145 }], 
    height: 178,
    width: 290,
  },
});