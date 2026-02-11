import { describe, expect, it } from 'vitest';
import {
    validateMessage,
    validateImage,
    ERROR_MESSAGES,
    FILE_ERROR_MESSAGES,
    MAX_FILENAME_LENGTH,
    MAX_FILE_SIZE,
    MAX_MESSAGE_LENGTH,
} from './validation';

describe('validateMessage 関数', () => {
    it('空文字の場合はエラーを返す', () => {
        const result = validateMessage('');
        expect(result).toBe(ERROR_MESSAGES.EMPTY);
    })

    it('空白文字のみの場合はエラーを返す', () => {
        const result = validateMessage('   ');
        expect(result).toBe(ERROR_MESSAGES.EMPTY);
    });

    it(`${MAX_MESSAGE_LENGTH}文字を超える場合はエラーを返す`, () => {
        const longText = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
        const error = validateMessage(longText);
        expect(error).toBe(ERROR_MESSAGES.TOO_LONG);
    });

    it('有効なメッセージの場合は空文字列を返す', () => {
        const validateText = 'Hello';
        const result = validateMessage(validateText);
        expect(result).toBe('');
    })
});

describe('validateImage 関数', () => {
    const invalidExtensionImage = new File(
        ['dummy text data'],
        'test.webp',
        { type: 'image/webp'},
    );
    it('対象外の拡張子の場合はエラーを返す', () => {
        const result = validateImage(invalidExtensionImage);
        expect(result).toBe(FILE_ERROR_MESSAGES.INVALID_TYPE);
    });

    it('ファイルサイズが大きい場合はエラーを返す', () => {
        const largeImage = new File(
            [new ArrayBuffer(MAX_FILE_SIZE + 1)],
            'largeImage.png',
            { type: 'image/png' }
        );
        const result = validateImage(largeImage);
        expect(result).toBe(
            FILE_ERROR_MESSAGES.TOO_LARGE
        )
    });

    it('ファイル名が長すぎる場合はエラーを返す', () => {
        const longName = 'a'.repeat(MAX_FILENAME_LENGTH + 1) + '.png';
        const longNameImage = new File(
            ['dummy text data'],
            longName,
            { type: 'image/png'},
        )
        const result = validateImage(longNameImage);
        expect(result).toBe(FILE_ERROR_MESSAGES.FILENAME_TOO_LONG);
    });

    it('有効な画像ファイルの場合は空文字列を返す', () => {
        const validImage = new File(
            ['dummy text data'],
            'validImage.png',
            { type: 'image/png'},
        );
        const result = validateImage(validImage);
        expect(result).toBe('');
    });
});