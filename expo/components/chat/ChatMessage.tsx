import { CustomMarkdown } from '@/components/chat/ChatMarkdown';
import { LottieLoader } from '@/components/chat/MessageLoader';
import { MessageData, DataProps as WeatherDataProps } from '@/components/chat/MessageData';
import { MessageChart, ChartProps as SoilChartProps } from '@/components/chat/MessageChart';
import { MessageGDD, DataProps as GDDDataProps } from '@/components/chat/MessageGDD';
import { Role } from '@/utils/Interfaces';
import { useUser } from "@clerk/clerk-expo";
import type { ChatStatus, UIMessage } from 'ai';
import { Image, StyleSheet, View } from 'react-native';

type ChatMessageProps = {
  message: UIMessage;
  isLoading?: boolean;
  status?: ChatStatus;
};

const ChatMessage = ({ message, isLoading, status }: ChatMessageProps) => {
  const { user } = useUser();
  const { role, id, parts } = message;
  const isUser = role === Role.User;
  const isAssistant = role === Role.Assistant;

  // Check if this is a streaming message with no content yet
  const hasTextContent = parts?.some(
    (part) => part.type === 'text' && part.text && part.text.trim().length > 0
  );

  // Check if we have a data tool response to avoid duplicate rendering
  const hasTools = parts?.some(
    // @ts-ignore
    (part) => part.type === 'tool-dataTool' || part.type === 'tool-weatherTool' || part.type === 'tool-gddTool'
  );

  // Show loader for assistant messages that are empty and we're streaming
  const showLoader = isLoading || (isAssistant && !hasTextContent && !hasTools && status === 'streaming');


  // Don't render empty user messages
  if (isUser && !hasTextContent) {
    return null;
  }

  return (
    <View style={[styles.row, isUser && { flexDirection: 'row-reverse' }]}>
      <View style={[styles.item, { backgroundColor: '#fff', paddingTop: 5 }]}>
        <Image
          source={
            isUser
              ? { uri: user?.imageUrl || 'https://placehold.co/250x250?text=U' }
              : require('@/assets/images/logo-white.png')
          }
          style={styles.avatar}
        />
      </View>

      <View style={[styles.text, { flex: 1, paddingBottom: 10 }, isUser && styles.userMessageBubble]}>
        {showLoader ? (
          <LottieLoader />
        ) : (
          parts?.map((part, i) => {
            switch (part.type) {
              case 'text':
                if (!part.text || part.text.trim().length === 0) {
                  return null;
                }
                return <CustomMarkdown key={`${id}-${i}`} content={part.text} />;
              case 'dynamic-tool':
                return <LottieLoader key={`${id}-${i}`} />;
              case 'tool-weatherTool':
                const weatherOutput = part.output as WeatherDataProps;
                if (weatherOutput) {
                  const { temperature, unit, description, forecast } = weatherOutput;
                  return <MessageData key={`${id}-${i}`} temperature={temperature} unit={unit} description={description} forecast={forecast} />;
                }
                return <LottieLoader key={`${id}-${i}`} />;
              case 'tool-dataTool':
                const soilOutput = part.output as SoilChartProps;
                if (soilOutput) {
                  const { labels, datasets, legend } = soilOutput;
                  return <MessageChart key={`${id}-${i}`} labels={labels} datasets={datasets} legend={legend} />;
                }
                return <LottieLoader key={`${id}-${i}`} />;
              case 'tool-gddTool':
                const gddOutput = part.output as GDDDataProps;
                if (gddOutput) {
                  const { labels, datasets } = gddOutput;
                  return <MessageGDD key={`${id}-${i}`} labels={labels} datasets={datasets} />;
                }
                return <LottieLoader key={`${id}-${i}`} />;
              default:
                return null;
            }
          })
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  text: {
    padding: 4,
    fontSize: 16,
    flex: 1,
  },
  userMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  loading: {
    justifyContent: 'center',
    height: 26,
    marginLeft: 14,
  },
});
export default ChatMessage;
