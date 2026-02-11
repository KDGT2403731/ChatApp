import {
  useEffect,
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Typography, Box, Container, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Dexie, { type EntityTable } from "dexie";
import type { Colors, Message } from "./types";
import { MessageList } from "./components/MessageList";
import { MessageForm } from "./components/MessageForm";
import { MessageItem } from "./components/MessageItem";
import { ChatAppHeader } from "./components/ChatAppHeader";
import { SearchBar } from "./components/SearchBar";
import { validateImage, validateMessage } from "./utils/validation";
import "./App.css";

const db = new Dexie("MyChatApp") as Dexie &{
  messages: EntityTable<Message, 'id'>;
};
db.version(1).stores({
  messages: "id, createdAt",
});

function App() {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>("");

  const theme = useTheme();
  const colors: Colors = {
    primary: theme.palette.primary.main,
    surface: theme.palette.background.paper,
    gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    background: theme.palette.background.default,
  };

  useEffect(() => {
    const loadMessage = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const allMessages = await db.messages
          .orderBy("createdAt")
          .reverse()
          .toArray();
        setMessages(allMessages);
      } catch (e) {
        console.error("メッセージの読み込みに失敗しました:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessage();
  }, []);

  console.log(messages);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handlePost = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const errorMessage = validateMessage(text);
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      setIsPosting(true);
      try {
        const createdAt = new Date();
        const dateString = createdAt.toLocaleString();
        const imageData = image ? await readImageAsDataURL(image) : undefined;

        const newMessage: Message = {
          id: uuidv4(),
          text: text,
          date: dateString,
          image: imageData,
          imageName: image?.name,
          createdAt,
          updateAt: createdAt,
        };

        await db.messages.add(newMessage);
        setMessages([newMessage, ...messages]);
        setImage(null);
        setText("");
      } catch (e) {
        console.log(e);
      } finally {
        setIsPosting(false);
      }
    },
    [text, image]
  );

  const handleDeleteMessage = useCallback(
    async (id: string): Promise<void> => {
      const targetMessage = messages.find((message) => message.id === id);
      if (!targetMessage) return;
      const previewText =
        targetMessage.text.length > 20
          ? targetMessage.text.substring(0, 20) + "..."
          : targetMessage.text;

      if (window.confirm(`「${previewText}」を削除しますか？`)) {
        try {
          await db.messages.delete(id);
          setMessages((prev) => prev.filter((message) => message.id !== id));
        } catch (e) {
          console.error("メッセージの削除に失敗しました:", e);
          alert("削除に失敗しました。再度お試しください");
        }
      }
    },
    [messages]
  );

  const handleSelectImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const errorMessage = validateImage(file);
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      e.target.value = "";
      setImage(file);
    }
  }, []);

  const readImageAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleStartEdit = useCallback((id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const handleSaveEdit = useCallback(
    async (): Promise<void> => {
      if (!editingId || !editingText.trim()) {
        alert("内容を入力してください");
        return;
      }

      setIsPosting(true);

      try {
        const updateAt = new Date();
        await db.messages.update(editingId, {
          text: editingText,
          updateAt,
        });

        // FIXME: 要リファクタリング
        setMessages((prev) =>
          prev.map((message) =>
            message.id === editingId
              ? { ...message, text: editingText, updateAt }
              : message,
          )
        );
        // 初期化
        setEditingId(null);
        setEditingText("");
      } catch (error) {
        console.error('編集に失敗しました:', error);
      } finally {
        setIsPosting(false);
      }
    },
    [editingId, editingText]
  );

  if (isLoading) {

    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: colors.background,
        }}
        >
        <Typography variant="h6">読み込み中....🔄</Typography>
      </Box>
    );
  }

  const getFilteredMessages = (): Message[] => {
    if (!searchText.trim()) {
      return messages;
    }
    return messages.filter((message) =>
      message.text.toLowerCase().trim().includes(searchText.toLowerCase()),
    );
  };
  const filteredMessages = getFilteredMessages();
  
  const messageItems = filteredMessages.map((message: Message) => (
    <div>
      <MessageItem
        message={message}
        colors={colors}
        isEditing={message.id === editingId}
        editingText={editingText}
        searchText={searchText}
        onEditTextChange={setEditingText}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  ));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          maxWidth: { xs: "100%", sm: "720px" },
          px: { xs: 0, sm: 3 },
        }}
      >
        {/* ヘッダー */}
        <ChatAppHeader colors={colors} />

        {/* 入力フォーム */}
        <MessageForm
          text={text}
          image={image}
          isPosting={isPosting}
          colors={colors}
          onSubmit={handlePost}
          onChange={handleTextChange}
          onSelectImage={handleSelectImage}
          onSetImage={setImage}
        />

        {/* 検索バー */}
        <SearchBar
          searchText={searchText}
          colors={colors}
          onSearchTextChange={setSearchText}
        />

        {/* メッセージ一覧 */}
        <MessageList>
          {messageItems}
        </MessageList>
      </Container>
    </Box>
  );
}

export default App;
