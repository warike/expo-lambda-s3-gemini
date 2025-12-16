// Interfaces
export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

// Use the UIMessage type from the ai SDK directly to ensure compatibility
import type { UIMessage } from 'ai';

// For database storage purposes, we extend UIMessage with optional metadata
// that might not be part of the standard UIMessage structure
export interface Message extends Omit<UIMessage, 'id'> {
  id?: string; // ID is optional when creating, but required in UIMessage
}

// Chat
export interface Chat {
  id: number;
  title: string;
}
