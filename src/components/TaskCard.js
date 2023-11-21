import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AnimatePresence} from 'moti';
import {MotiPressable} from 'moti/interactions';
import moment from 'moment';

const HEIGHT = 80;

const TaskCard = ({
  item,
  markTaskCompleteFunc = () => {},
  markTaskInCompleteFunc = () => {},
  delFunc = () => {},
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
        onLongPress={() => delFunc(item)}
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

// const areEqual = (prevProps, nextProps) => {
//   if (JSON.stringify(prevProps?.item) == JSON.stringify(nextProps?.item)) {
//     return true; // donot re-render
//   }
//   return false; // will re-render
// };

export default memo(TaskCard);

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
  animateStyle: {
    opacity: 1,
    height: HEIGHT,
    borderBottomWidth: 0.5,
  },
  dateStyle: {
    color: 'gray',
    marginTop: 5,
  },
});
