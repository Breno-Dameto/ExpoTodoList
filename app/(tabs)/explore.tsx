import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function ExploreScreen() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadTasks = async () => {
        setLoading(true);
        await loadCompletedTasks();
        setLoading(false);
      };
      loadTasks();
    }, [])
  );

  const loadCompletedTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      console.log('Stored tasks:', storedTasks); 
      
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        console.log('All tasks:', allTasks);
        
        // Get all completed tasks
        const completedTasksList = allTasks.filter((task: Task) => task.completed === true);
        console.log('Completed tasks:', completedTasksList); 
        
        setCompletedTasks(completedTasksList);
      }
    } catch (error) {
      console.error('Error loading completed tasks:', error);
    }
  };

const deleteTask = async (id: number) => {
  try {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
   
      const allTasks = JSON.parse(storedTasks);
      
   
      const updatedAllTasks = allTasks.filter((task: Task) => task.id !== id);
      
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedAllTasks));
      
      const updatedCompletedTasks = updatedAllTasks.filter((task: Task) => task.completed);
      setCompletedTasks(updatedCompletedTasks);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

return (
  <ParallaxScrollView
       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    headerImage={
      <Image
        style={styles.headerImage}
        resizeMode="contain"
        source={require('../../assets/images/task-list.png')}
      />
    }>
    <ThemedView style={styles.container}>
      <ThemedText type="title">Completed Tasks</ThemedText>
      
      {loading ? (
        <ActivityIndicator size="large" color="#D0D0D0" style={styles.loader} />
      ) : (
        <ThemedView style={styles.taskList}>
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => {}} 
              onDelete={deleteTask}
            />
          ))}
          
          {completedTasks.length === 0 && (
            <ThemedText style={styles.emptyText}>
              No completed tasks yet
            </ThemedText>
          )}
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
  headerImage: {
    position: 'absolute',
    bottom: 0,
    left: '50%',  
    transform: [{ translateX: -145 }], 
    height: 178,
    width: 290,
  },
  taskList: {
    gap: 8,
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.6,
  },
  loader: {
    marginTop: 32,
  },
  
});