import { Message, Role } from '@/utils/Interfaces';
import { type SQLiteDatabase } from 'expo-sqlite';


export const DATABASE_NAME = 'chat.db';
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2; // Incremented version
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE chats (
        id INTEGER PRIMARY KEY NOT NULL, 
        title TEXT NOT NULL
      );

      CREATE TABLE messages (
        id INTEGER PRIMARY KEY NOT NULL, 
        chat_id INTEGER NOT NULL, 
        parts TEXT NOT NULL, 
        role TEXT, 
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);
    currentDbVersion = 2;
  } else if (currentDbVersion === 1) {
    const oldMessages = await db.getAllAsync<{ id: number; chat_id: number; content: string; imageUrl?: string; role: string }>('SELECT * FROM messages');

    await db.execAsync(`
      CREATE TABLE messages_new (
        id INTEGER PRIMARY KEY NOT NULL, 
        chat_id INTEGER NOT NULL, 
        parts TEXT NOT NULL,  
        role TEXT, 
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);

    for (const msg of oldMessages) {
      const parts = JSON.stringify([{ type: 'text', text: msg.content }]);
      await db.runAsync(
        'INSERT INTO messages_new (id, chat_id, parts, role) VALUES (?, ?, ?, ?)',
        msg.id, msg.chat_id, parts, msg.role
      );
    }

    await db.execAsync(`
      DROP TABLE messages;
      ALTER TABLE messages_new RENAME TO messages;
    `);
    currentDbVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChat = async (db: SQLiteDatabase, title: string) => {
  return await db.runAsync('INSERT INTO chats (title) VALUES (?)', title);
};

export const getChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync('SELECT * FROM chats ORDER BY id DESC');
};

export const getMessages = async (db: SQLiteDatabase, chatId: number): Promise<Message[]> => {
  // Use a temporary type for the DB row where parts is a JSON string
  type MessageRow = {
    id: number;
    chat_id: number;
    parts: string;
    role: string;
  };

  const rows = await db.getAllAsync<MessageRow>('SELECT * FROM messages WHERE chat_id = ?', chatId);

  return rows.map((row) => ({
    id: row.id.toString(),
    role: (row.role === Role.Assistant ? Role.Assistant : Role.User),
    parts: JSON.parse(row.parts),
  }));
};

export const addMessage = async (
  db: SQLiteDatabase,
  chatId: number,
  { parts, role }: Message
) => {
  const partsJson = JSON.stringify(parts);
  return await db.runAsync(
    'INSERT INTO messages (chat_id, parts, role) VALUES (?, ?, ?)',
    chatId,
    partsJson,
    role === Role.Assistant ? Role.Assistant : Role.User,
  );
};

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  await db.runAsync('DELETE FROM messages WHERE chat_id = ?', chatId);
  return await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
};

export const renameChat = async (db: SQLiteDatabase, chatId: number, title: string) => {
  return await db.runAsync('UPDATE chats SET title = ? WHERE id = ?', title, chatId);
};
