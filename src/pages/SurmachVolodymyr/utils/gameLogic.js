// Чисті функції: генерація поля, пошук сусідів і переходи стану.
export const GAME_CONFIG = Object.freeze({ rows: 10, cols: 10, mineCount: 15 });

export function getNeighbors(index, rows, cols) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const neighbors = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
        neighbors.push(nextRow * cols + nextCol);
      }
    }
  }
  return neighbors;
}

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows * cols }, (_, id) => ({
    id, isMine: false, adjacent: 0, revealed: false, flagged: false, exploded: false,
  }));
}

export function placeMines(board, firstIndex, rows, cols, mineCount, random = Math.random) {
  // 3 × 3 навколо першої відкритої клітинки гарантовано без мін.
  const safeArea = new Set([firstIndex, ...getNeighbors(firstIndex, rows, cols)]);
  let candidates = board.map(({ id }) => id).filter((id) => !safeArea.has(id));
  // Для надто малого тестового поля зберігаємо як мінімум безпеку натиснутої клітинки.
  if (mineCount > candidates.length) {
    candidates = board.map(({ id }) => id).filter((id) => id !== firstIndex);
  }
  if (mineCount > candidates.length) throw new Error('Недостатньо вільних клітинок для мін');

  // Fisher–Yates shuffle, як у практичній роботі №2.
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[randomIndex]] = [candidates[randomIndex], candidates[index]];
  }
  const mines = new Set(candidates.slice(0, mineCount));
  return board.map((cell) => ({
    ...cell,
    isMine: mines.has(cell.id),
    adjacent: getNeighbors(cell.id, rows, cols).filter((id) => mines.has(id)).length,
  }));
}

export function revealSafeArea(board, startIndex, rows, cols) {
  const updated = board.map((cell) => ({ ...cell }));
  const queue = [startIndex];
  const visited = new Set();
  // Ітеративний flood fill — без ризику переповнення стека.
  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    if (visited.has(index)) continue;
    visited.add(index);
    const cell = updated[index];
    if (cell.flagged || cell.revealed || cell.isMine) continue;
    cell.revealed = true;
    if (cell.adjacent === 0) queue.push(...getNeighbors(index, rows, cols));
  }
  return updated;
}

export function createInitialState(config = GAME_CONFIG) {
  return { ...config, board: createEmptyBoard(config.rows, config.cols), status: 'idle', seconds: 0 };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'RESET': return createInitialState({ rows: state.rows, cols: state.cols, mineCount: state.mineCount });
    case 'TICK': return state.status === 'playing' ? { ...state, seconds: state.seconds + 1 } : state;
    case 'TOGGLE_FLAG': {
      if (state.status === 'won' || state.status === 'lost') return state;
      const target = state.board[action.index];
      if (!target || target.revealed) return state;
      // Заборонити більше прапорців, ніж мін, але дозволяти знімати їх.
      const placedCount = state.board.filter((cell) => cell.flagged).length;
      if (!target.flagged && placedCount >= state.mineCount) return state;
      return {
        ...state,
        board: state.board.map((cell) => cell.id === action.index
          ? { ...cell, flagged: !cell.flagged }
          : cell),
      };
    }
    case 'REVEAL': {
      if (state.status === 'won' || state.status === 'lost') return state;
      const target = state.board[action.index];
      if (!target || target.revealed || target.flagged) return state;
      // Перший хід: розміщуємо 15 мін поза безпечною зоною 3 × 3.
      const board = state.status === 'idle'
        ? placeMines(state.board, action.index, state.rows, state.cols, state.mineCount)
        : state.board;
      if (board[action.index].isMine) {
        return {
          ...state,
          status: 'lost',
          board: board.map((cell) => ({
            ...cell, revealed: cell.isMine || cell.revealed,
            exploded: cell.id === action.index,
          })),
        };
      }
      const revealedBoard = revealSafeArea(board, action.index, state.rows, state.cols);
      const won = revealedBoard.every((cell) => cell.isMine || cell.revealed);
      return { ...state, board: revealedBoard, status: won ? 'won' : 'playing' };
    }
    default: return state;
  }
}
