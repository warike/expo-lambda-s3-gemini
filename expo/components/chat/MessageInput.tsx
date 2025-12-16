import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import type { ChatStatus } from "ai";
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APressable = Animated.createAnimatedComponent(Pressable);
const ANIMATION_DURATION = 400;

export type Props = {
  onShouldSend: (message: string) => void;
  onShouldStop: () => void;
  status: ChatStatus;
};

const MessageInput = ({ onShouldSend, onShouldStop, status }: Props) => {
  const [message, setMessage] = useState('');
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const isPressed = useSharedValue(false);
  const inputRef = useRef<TextInput>(null);

  const toggleItems = () => {
    expanded.value = withTiming(expanded.value === 0 ? 1 : 0, { duration: ANIMATION_DURATION });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  const expandButtonStyle = useAnimatedStyle(() => {
    const opacityInterpolation = interpolate(expanded.value, [0, 1], [1, 0], Extrapolation.CLAMP);
    const widthInterpolation = interpolate(expanded.value, [0, 1], [30, 0], Extrapolation.CLAMP);

    return {
      opacity: isPressed.value ? 0.5 : opacityInterpolation,
      width: widthInterpolation,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(expanded.value, [0, 1], [0, 100], Extrapolation.CLAMP);
    return {
      width: widthInterpolation,
      opacity: expanded.value,
    };
  });

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const onSend = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    onShouldSend(trimmed);
    setMessage('');
  };

  return (
    <BlurView intensity={90} tint="extraLight" style={{ paddingBottom: bottom, paddingTop: 10 }}>
      <View style={styles.row}>
        <APressable
          onPress={toggleItems}
          onPressIn={() => { isPressed.value = true; }}
          onPressOut={() => { isPressed.value = false; }}
          style={[styles.roundBtn, expandButtonStyle]}
        >
          <Ionicons name="add" size={24} color={Colors.grey} />
        </APressable>

        <Animated.View style={[styles.buttonView, buttonViewStyle]}>
          <Pressable
            onPress={() => ImagePicker.launchCameraAsync()}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="camera-outline" size={24} color={Colors.grey} />
          </Pressable>
          <Pressable
            onPress={() => ImagePicker.launchImageLibraryAsync()}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="image-outline" size={24} color={Colors.grey} />
          </Pressable>
          <Pressable
            onPress={() => DocumentPicker.getDocumentAsync()}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="folder-outline" size={24} color={Colors.grey} />
          </Pressable>
        </Animated.View>

        <TextInput

          style={styles.messageInput}
          ref={inputRef}
          placeholder="Message"
          value={message}

          onFocus={collapseItems}
          onChangeText={onChangeText}
          autoFocus={true}
          multiline
        />
        {status !== "streaming" ? (
          <Pressable
            onPress={onSend}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="arrow-up-circle" size={24} color={Colors.grey} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onShouldStop}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Ionicons name="stop" size={24} color={Colors.grey} />
          </Pressable>
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
export default MessageInput;
