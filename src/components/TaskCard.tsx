import React, {FC, memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AnimatePresence} from 'moti';
import {MotiPressable} from 'moti/interactions';
import moment from 'moment';

interface TaskCardProps {
  item: {
    title: string;
    createdOn: Date;
  };
  markTaskCompleteFunc: (item: {title: string; createdOn: Date}) => void;
  markTaskInCompleteFunc: (item: {title: string; createdOn: Date}) => void;
  delFunc: (
    item: {title: string; createdOn: Date},
    isComplete: boolean,
  ) => void;
  isComplete?: boolean;
  shown?: boolean;
}

const HEIGHT = 80;

const TaskCard: FC<TaskCardProps> = ({
  item,
  markTaskCompleteFunc,
  markTaskInCompleteFunc,
  delFunc,
  isComplete = false,
  shown = true,
}) => {
  return (
    <AnimatePresence>
      <MotiPressable
        from={{height: 0}}
        key={item?.title}
        animate={{
          opacity: 1,
          height: shown ? HEIGHT : 0,
          borderBottomWidth: shown ? 0.5 : 0,
        }}
        transition={{type: 'timing', duration: 200}}
        onPress={() => {
          if (isComplete) {
            markTaskInCompleteFunc(item);
          } else {
            markTaskCompleteFunc(item);
          }
        }}
        onLongPress={() => delFunc(item, isComplete)}
        style={[style.motiView]}>
        <View style={style.viewContainer}>
          <Text style={style.textStyle}>{item?.title}</Text>
          <Text style={style.dateStyle}>
            {moment(item?.createdOn).format('DD MMM YYYY hh:mm:ss')}
          </Text>
        </View>
      </MotiPressable>
    </AnimatePresence>
  );
};

const style = StyleSheet.create({
  motiView: {
    width: '100%',
    borderColor: 'grey',
    backgroundColor: '#fff',
  },
  viewContainer: {
    padding: 20,
    width: '100%',
  },
  textStyle: {
    color: 'black',
    width: '90%',
    fontSize: 18,
  },
  dateStyle: {
    color: 'gray',
    marginTop: 5,
  },
});

export default memo(TaskCard);
