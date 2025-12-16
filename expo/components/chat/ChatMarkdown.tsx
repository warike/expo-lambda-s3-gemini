import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

const markdownStyles = StyleSheet.create({
  body: {
    color: '#000',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    marginBottom: 16,
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  heading2: {
    marginBottom: 16,
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },
  heading3: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 18,
  },
  heading4: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  heading5: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  heading6: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
  code_block: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  code_inline: {
    borderRadius: 4,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  fence: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    padding: 8,
    // padding: 12,
  },
  list_item: {
    paddingVertical: 2,
  },
  ordered_list: {
    marginLeft: 6,
    // marginLeft: 8,
  },
  bullet_list: {
    marginLeft: 6,
    // marginLeft: 8,
  },
  hr: {
    backgroundColor: '#e5e5e5',
    height: 1,
    marginVertical: 8,
  },
  strong: {
    fontWeight: '600',
  },
  link: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  paragraph: {
    marginTop: 4,
    marginBottom: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export function CustomMarkdown({ content }: { content: string }) {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
}
