import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button コンポーネント', () => {
    it('テキストが表示されること', () => {
        render(<Button>クリック</Button>);
        expect(screen.getByText('クリック')).toBeInTheDocument();
    });

    it('クリックイベントが発火すること', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>送信</Button>);
        await user.click(screen.getByRole('button'));

        expect(handleClick).toHaveBeenCalled();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabledの場合, クリックできない', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(
            <Button onClick={handleClick} disabled>
                送信
            </Button>
        );
        await user.click(screen.getByRole('button'));

        expect(handleClick).not.toHaveBeenCalled();
    });
});