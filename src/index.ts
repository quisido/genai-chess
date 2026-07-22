/// <reference types="bun-types" />
/* eslint-disable no-await-in-loop, no-console */
import { Chess, type Color } from 'chess.js';
import { type AbortableAsyncIterator, type ChatResponse, Ollama } from 'ollama';
import createMessage from './create-message.js';
import { COLORS, MODELS, THINKING } from './constants.js';

const NANOSECONDS_PER_SECOND: number = 1_000_000_000;
const THINKING_SAMPLE_RATE: number = 0.05;

const chess = new Chess();
const ollama = new Ollama();

console.log(`${chess.ascii()}\n`);

while (!chess.isGameOver()) {
  const inCheck: boolean = chess.inCheck();
  const turn: Color = chess.turn();
  const colorStr: string = COLORS[turn];

  await Bun.write(Bun.stdout, `\nTurn ${chess.moveNumber()}! `);
  if (inCheck) {
    await Bun.write(Bun.stdout, `${colorStr} is in check! `);
  } else {
    await Bun.write(Bun.stdout, `${colorStr} is thinking.`);
  }

  const chatResponses: AbortableAsyncIterator<ChatResponse> = await ollama.chat(
    {
      format: {
        properties: {
          move: {
            enum: chess.moves(),
            type: 'string',
          },
        },
        required: ['move'],
        type: 'object',
      },
      messages: [
        createMessage({
          color: colorStr,
          fen: chess.fen(),
          inCheck,
        }),
      ],
      model: MODELS[turn],
      options: {
        temperature: 0,
      },
      stream: true,
      think: THINKING[turn],
    },
  );

  let move: string = '';
  for await (const {
    done,
    message,
    total_duration: totalDuration,
  } of chatResponses) {
    if (
      message.thinking !== undefined &&
      Math.random() < THINKING_SAMPLE_RATE
    ) {
      await Bun.write(Bun.stdout, '.');
    }

    move += message.content;

    if (done) {
      await Bun.write(
        Bun.stdout,
        ` ${Math.round(totalDuration / NANOSECONDS_PER_SECOND)}s\n`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  chess.move(JSON.parse(move).move);

  const ascii: string = chess.ascii();
  console.log(`${ascii}\n`);
}

if (chess.isCheckmate()) {
  console.log('Checkmate!');
} else if (chess.isDrawByFiftyMoves()) {
  console.log('Draw due to fifty-move rule!');
} else if (chess.isInsufficientMaterial()) {
  console.log('Draw due to insufficient material!');
} else if (chess.isStalemate()) {
  console.log('Stalemate!');
} else if (chess.isThreefoldRepetition()) {
  console.log('Draw due to threefold repetition!');
} else {
  console.log('Game over! (unknown reason)');
}

export {};
