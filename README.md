# Generative AI chess

This repository contains a proof-of-concept for generative AI models playing chess against each other.

The models are powered by the Ollama JavaScript SDK.
The chess game is powered by `chess.js`.

The terminal displays the chess board as ASCII.

## Commands

```sh
bun src/index.ts
```

## Conclusion

For <= 16GB of VRAM, the models are effectively random, and thinking does not improve performance.
It's a visually appealing art project, though.
