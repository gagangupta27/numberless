import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';

import ChevronDown from '../assets/ChevronDown.svg';

interface SectionHeaderCardProps {
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SectionHeaderCard = ({title, setOpen}: SectionHeaderCardProps) => {
  const windowWidth = Dimensions.get('window').width;
  const shareValue = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(shareValue.value, [0, 1], [180, 0])}deg`,
        },
      ],
    };
  });

  const toggleButton = () => {
    /**
     * Animation to show or hide the tasks
     * @constructor
     */
    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        duration: 500,
      });
    } else {
      shareValue.value = withTiming(0, {
        duration: 500,
      });
    }
  };

  return (
    <TouchableOpacity
      style={{
        width: windowWidth,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
      }}
      onPress={() => {
        toggleButton();
        setOpen(prev => !prev);
      }}>
      <Text
        style={{
          flexShrink: 1,
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        {title}
      </Text>
      <Animated.View style={[chevronStyle]}>
        <ChevronDown />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(SectionHeaderCard);
