/* eslint-disable no-ternary */
import { type Message } from 'ollama';

interface Options {
  readonly color: string;
  readonly fen: string;
  readonly inCheck: boolean;
}

export default function createMessage({
  color,
  fen,
  inCheck,
}: Options): Message {
  return {
    content: `
You are a chess grandmaster, currently in a game of chess. You control the **${color}** pieces.${inCheck ? ' You are currently in check!' : ''}
Using Forsyth-Edwards Notation (FEN), the current state of the chessboard is \`${fen}\`.
`.trim(),
    role: 'system',
  };
}
