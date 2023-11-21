import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {
  Alert,
  RefreshControl,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import RNFS from 'react-native-fs';
import SectionHeaderCard from './src/components/SectionHeaderCard';
import TaskCard from './src/components/TaskCard';
import moment from 'moment';

const App = () => {
  const filePath = RNFS.DocumentDirectoryPath + '/numberless.txt';

  const [allTasks, setAllTasks] = useState({
    completed: {},
    incomplete: {},
  });
  const [completedOpen, setCompletedOpen] = useState(true);
  const [inCompleteOpen, setInCompleteOpen] = useState(true);

  const [task, setTask] = useState('');

  useEffect(() => {
    RNFS.readFile(filePath)
      .then(value => {
        setAllTasks(JSON.parse(value));
      })
      .catch(err => {
        console.error('Error reading file:', err);
      });
  }, []);

  const markTaskCompleteFunc = useCallback(item => {
    setAllTasks(prev => {
      let completed = prev?.completed;
      let incomplete = prev?.incomplete;

      delete incomplete[item?.createdOn];
      completed[item?.createdOn] = {...item};

      RNFS.writeFile(
        filePath,
        JSON.stringify({
          completed,
          incomplete,
        }),
        'utf8',
      )
        .then(success => {
          // console.log('File written successfully:', filePath);
        })
        .catch(error => {
          console.error('Error writing file:', error);
        });

      return {
        completed,
        incomplete,
      };
    });
  }, []);

  const markTaskInCompleteFunc = useCallback(item => {
    setAllTasks(prev => {
      let completed = prev?.completed;
      let incomplete = {...prev?.incomplete};

      delete completed[item?.createdOn];
      incomplete[item?.createdOn] = {...item};

      RNFS.writeFile(
        filePath,
        JSON.stringify({
          completed,
          incomplete,
        }),
        'utf8',
      )
        .then(success => {
          // console.log('File written successfully:', filePath);
        })
        .catch(error => {
          console.error('Error writing file:', error);
        });

      return {
        completed,
        incomplete,
      };
    });
  }, []);

  const delFunc = useCallback(item => {
    Alert.alert('Alert', 'Are you sure you want to delete task?', [
      {
        text: 'YES',
        onPress: () => {
          setAllTasks(prev => {
            let completed = prev?.completed;
            let incomplete = {...prev?.incomplete};

            delete completed[item?.createdOn];
            delete incomplete[item?.createdOn];

            RNFS.writeFile(
              filePath,
              JSON.stringify({
                completed,
                incomplete,
              }),
              'utf8',
            )
              .then(success => {
                // console.log('File written successfully:', filePath);
              })
              .catch(error => {
                console.error('Error writing file:', error);
              });

            return {
              completed,
              incomplete,
            };
          });
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
    if (task && task != '') {
      setAllTasks(prev => {
        let completed = prev?.completed;
        let incomplete = {...prev?.incomplete};
        let createdOn = moment().valueOf();

        incomplete[createdOn] = {
          title: task,
          createdOn,
        };
        RNFS.writeFile(
          filePath,
          JSON.stringify({
            completed,
            incomplete,
          }),
          'utf8',
        )
          .then(success => {
            // console.log('File written successfully:', filePath);
          })
          .catch(error => {
            console.error('Error writing file:', error);
          });
        setTask('');
        return {
          completed,
          incomplete,
        };
      });
    }
  };

  const renderItem = useCallback(
    ({item, index, section}) => {
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
            data: Object.values(allTasks?.completed),
          },
          {
            title: 'In-Complete',
            data: Object.values(allTasks?.incomplete),
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
            height: 40,
            width: 40,
            backgroundColor: 'red',
          }}></TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
