import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {
  Alert,
  SectionList,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  addTask,
  deleteTask,
  markTaskAsComplete,
  markTaskAsInComplete,
  setAllTaks,
} from './src/reducers/taskSlice';
import {useDispatch, useSelector} from 'react-redux';

import {AnyAction} from '@reduxjs/toolkit';
import RNFS from 'react-native-fs';
import {RootState} from './src/reducers/store';
import SectionHeaderCard from './src/components/SectionHeaderCard';
import Send from './src/assets/Send.svg';
import TaskCard from './src/components/TaskCard';
import {ThunkDispatch} from 'redux-thunk';
import moment from 'moment';

const App = () => {
  const filePath = RNFS.DocumentDirectoryPath + '/numberless.txt';

  const tasks = useSelector((state: RootState) => state.task.tasks);
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

  const [completedOpen, setCompletedOpen] = useState(true);
  const [inCompleteOpen, setInCompleteOpen] = useState(true);
  const [task, setTask] = useState<string>('');

  useEffect(() => {
    /**
     * fetch data from file on load
     * @constructor
     */
    RNFS.readFile(filePath)
      .then(value => {
        dispatch(setAllTaks(JSON.parse(value)));
      })
      .catch(err => {
        console.error('Error reading file:', err);
      });
  }, []);

  const markTaskCompleteFunc = useCallback((item: any) => {
    /**
     * Marking any incomplete task as complete on click
     * @constructor
     * @param {Task} item - The task object
     */
    dispatch(markTaskAsComplete({task: item}))
      .then(() => {})
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const markTaskInCompleteFunc = useCallback((item: any) => {
    /**
     * Marking any complete task as incomplete on click
     * @constructor
     * @param {Task} item - The task object
     */
    dispatch(markTaskAsInComplete({task: item}))
      .then(() => {})
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const delFunc = useCallback((item: any, isComplete: any) => {
    /**
     * Deleting any task with alert on long press
     * @constructor
     * @param {Task} item - The task object
     * @param {Boolean} isComplete - The task category
     */
    Alert.alert('Alert', 'Are you sure you want to delete task?', [
      {
        text: 'YES',
        onPress: () => {
          dispatch(deleteTask({task: item, isComplete}));
        },
      },
      {text: '', onPress: () => console.log('OK Pressed')},
      {
        text: 'NO',
        onPress: () => {},
      },
    ]);
  }, []);

  const handleAddTask = async () => {
    /**
     * Add a task to the array
     * @constructor
     */
    if (task && task != '') {
      let createdOn = moment().valueOf();
      dispatch(
        addTask({
          title: task,
          createdOn,
        }),
      )
        .then(() => {
          setTask('');
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  const renderItem = useCallback(
    ({item, index, section}: any) => {
      return (
        <TaskCard
          item={item}
          key={item?.createdOn.toString()}
          markTaskCompleteFunc={markTaskCompleteFunc}
          markTaskInCompleteFunc={markTaskInCompleteFunc}
          delFunc={delFunc}
          isComplete={section.title == 'Completed' ? true : false}
          shown={section.title == 'Completed' ? completedOpen : inCompleteOpen}
        />
      );
    },
    [completedOpen, inCompleteOpen],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'flex-start'}}>
      <SectionList
        sections={[
          {
            title: 'Completed',
            data: tasks?.completed,
          },
          {
            title: 'In-Complete',
            data: tasks?.incomplete,
          },
        ]}
        keyExtractor={(item, index) => item?.createdOn.toString()}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <SectionHeaderCard
            title={title}
            setOpen={
              title == 'Completed' ? setCompletedOpen : setInCompleteOpen
            }
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100,
          width: '100%',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
          borderTopWidth: 0.5,
          backgroundColor: 'white',
          zIndex: 10,
        }}>
        <TextInput
          style={{
            fontSize: 20,
            width: '90%',
            color: 'black',
            zIndex: 10,
          }}
          value={task}
          onChangeText={text => {
            if (text.length > 250) {
              Alert.alert('Alert', 'Reached 250 characters limit!!');
            } else {
              setTask(text);
            }
          }}
          placeholder={'Add new task....'}
          placeholderTextColor={'grey'}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddTask}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <Send />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
