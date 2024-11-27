// Grid size constants
const GRID_COLS = 5;
const GRID_ROWS = 4;
const TOTAL_POSITIONS = GRID_COLS * GRID_ROWS;

// Scoring function for position quality
const scorePosition = (pos, occupiedPositions, windowSize = 1) => {
  let score = 0;
  
  // Prefer positions that are not at the edges
  const row = Math.floor(pos / GRID_COLS);
  const col = pos % GRID_COLS;
  if (row > 0 && row < GRID_ROWS - 1) score += 1;
  if (col > 0 && col < GRID_COLS - 1) score += 1;
  
  // Penalize positions close to occupied spaces
  occupiedPositions.forEach(occupied => {
    const occupiedRow = Math.floor(occupied / GRID_COLS);
    const occupiedCol = occupied % GRID_COLS;
    const distance = Math.sqrt(
      Math.pow(row - occupiedRow, 2) + 
      Math.pow(col - occupiedCol, 2)
    );
    if (distance < 2) score -= (2 - distance);
  });
  
  // Bonus for positions that create nice clusters
  const adjacentOccupied = occupiedPositions.filter(occupied => {
    const occupiedRow = Math.floor(occupied / GRID_COLS);
    const occupiedCol = occupied % GRID_COLS;
    return Math.abs(row - occupiedRow) + Math.abs(col - occupiedCol) === 1;
  }).length;
  
  if (adjacentOccupied === 1) score += 0.5; // Some adjacency is good
  if (adjacentOccupied > 2) score -= 1; // But not too much
  
  return score;
};

export const findOptimalPosition = (occupiedPositions, windowSize = 1) => {
  let bestPosition = 0;
  let bestScore = -Infinity;
  
  // Try each possible position
  for (let pos = 0; pos < TOTAL_POSITIONS; pos++) {
    // Skip if position is already occupied
    if (occupiedPositions.includes(pos)) continue;
    
    // Check if window fits at this position
    const row = Math.floor(pos / GRID_COLS);
    const col = pos % GRID_COLS;
    if (col + windowSize > GRID_COLS || row + windowSize > GRID_ROWS) continue;
    
    // Calculate score for this position
    const score = scorePosition(pos, occupiedPositions, windowSize);
    
    if (score > bestScore) {
      bestScore = score;
      bestPosition = pos;
    }
  }
  
  return bestPosition;
}; 