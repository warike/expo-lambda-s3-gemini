import Colors from '@/constants/Colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PredefinedMessages = [
  { title: 'How to calibrate temperature?', text: "when I just started using the device" },
  { title: 'How to calibrate pressure?', text: 'if it is my values are not correct' },
  { title: 'How to clean all values?', text: "in the weather options" },
];

type Props = {
  onSelectSuggestion: (message: string) => void;
};

const MessageSuggestions = ({ onSelectSuggestion }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        style={{
          backgroundColor: "#fff",
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}>
        {PredefinedMessages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSelectSuggestion(`${item.title} ${item.text}`)}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.title}</Text>
            <Text style={{ color: Colors.grey, fontSize: 14 }}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
export default MessageSuggestions;
