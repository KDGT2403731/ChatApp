export const MAX_MESSAGE_LENGTH = 140;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILENAME_LENGTH = 100;
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export const ERROR_MESSAGES = {
  EMPTY: "内容を入力してください",
  TOO_LONG: `${MAX_MESSAGE_LENGTH}文字以内で入力してください`,
} as const;

export const FILE_ERROR_MESSAGES = {
  INVALID_TYPE: "PNG, JPG, GIFファイルのみアップロード可能です",
  TOO_LARGE: `ファイルサイズが大きすぎます (${MAX_FILE_SIZE / (1024 * 1024)} MB以下にしてください)`,
  FILENAME_TOO_LONG: `ファイル名が長すぎます (${MAX_FILENAME_LENGTH}文字以内にしてください)`
} as const;

export const validateImage = (file: File): string => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return FILE_ERROR_MESSAGES.INVALID_TYPE;
    }
    if (file.size > MAX_FILE_SIZE) {
      return FILE_ERROR_MESSAGES.TOO_LARGE;
    }
    if (file.name.length > MAX_FILENAME_LENGTH) {
      return FILE_ERROR_MESSAGES.FILENAME_TOO_LONG;
    }
    return "";
  };

export const validateMessage = (text: string): string | null => {
    if (!text.trim()) {
      return ERROR_MESSAGES.EMPTY;
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      return ERROR_MESSAGES.TOO_LONG;
    }
    return "";
  };