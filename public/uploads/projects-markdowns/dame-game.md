## Project Overview

Dame is a desktop checkers (draughts) game built in Java, developed as a collaborative university project. It supports both player-vs-player and player-vs-AI modes, with three selectable difficulty levels.

💻 [Source on GitHub](https://github.com/ayoubomari/Dame)

## Features

- Two-player local matches
- Single-player mode against an AI opponent
- Three difficulty levels, each tuning how deep the AI searches ahead

## The AI Opponent

The computer player is implemented using the **Minimax algorithm** — the AI simulates future move sequences for both sides and picks the move that minimizes the opponent's best possible outcome. The three difficulty levels adjust the search depth, so higher difficulties look further ahead and play noticeably stronger.

## Technical Implementation

- **Language**: Java
- **UI**: AWT and Swing for the desktop interface and game board rendering
- **Version control**: Git/GitHub, developed collaboratively

## Conclusion

This was one of my earlier projects, and a practical introduction to implementing classic game-tree search algorithms rather than just reading about them — turning Minimax from a textbook concept into an opponent that actually had to be beaten.
