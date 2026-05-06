/* ═══════════════════════════════════════════════════
   Drone Delivery Path Finder — script.js
   Algorithms: BFS & DFS on a grid
═══════════════════════════════════════════════════ */

const App = (() => {

  /* ── State ─────────────────────────────────── */
  let N       = 7;
  let grid    = [];
  let start   = [0, 0];
  let goal    = [N - 1, N - 1];
  let mode    = 'obstacle';
  let lastBFS = null;
  let lastDFS = null;

  /* ── Init ───────────────────────────────────── */
  function init() {
    grid = makeGrid(N);
    start = [0, 0];
    goal  = [N - 1, N - 1];
    renderGrid();
    resetStats();
    updateGridLabel();

    const sizeSlider = document.getElementById('gridSize');
    const sizeVal    = document.getElementById('gridSizeVal');
    sizeSlider.addEventListener('input', () => {
      sizeVal.textContent = `${sizeSlider.value}×${sizeSlider.value}`;
    });
  }

  function makeGrid(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  /* ── Grid render ────────────────────────────── */
  function renderGrid(bfsData = null, dfsData = null) {
    const container = document.getElementById('gridContainer');
    container.style.gridTemplateColumns = `repeat(${N}, auto)`;
    container.innerHTML = '';

    const bfsPathSet    = new Set(bfsData ? bfsData.path.map(key) : []);
    const bfsVisitedSet = bfsData ? bfsData.visited : new Set();
    const dfsPathSet    = new Set(dfsData ? dfsData.path.map(key) : []);
    const dfsVisitedSet = dfsData ? dfsData.visited : new Set();

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const pos = [r, c];
        const k   = key(pos);
        let emoji = '';

        if (r === start[0] && c === start[1]) {
          cell.classList.add('start');
          emoji = '🚁';
        } else if (r === goal[0] && c === goal[1]) {
          cell.classList.add('goal');
          emoji = '📦';
        } else if (grid[r][c] === 1) {
          cell.classList.add('obstacle');
          emoji = '🧱';
        } else if (bfsPathSet.has(k)) {
          cell.classList.add('bfs-path');
          emoji = '·';
        } else if (dfsPathSet.has(k)) {
          cell.classList.add('dfs-path');
          emoji = '·';
        } else if (bfsVisitedSet.has(k)) {
          cell.classList.add('bfs-vis');
        } else if (dfsVisitedSet.has(k)) {
          cell.classList.add('dfs-vis');
        } else {
          cell.classList.add('free');
        }

        if (emoji) cell.textContent = emoji;

        // coord label
        const coord = document.createElement('span');
        coord.className = 'coord-label';
        coord.textContent = `${r},${c}`;
        cell.appendChild(coord);

        cell.addEventListener('click', () => onCellClick(r, c));
        container.appendChild(cell);
      }
    }
  }

  /* ── Cell click ─────────────────────────────── */
  function onCellClick(r, c) {
    if (mode === 'obstacle') {
      if (r === start[0] && c === start[1]) return;
      if (r === goal[0]  && c === goal[1])  return;
      grid[r][c] = grid[r][c] ? 0 : 1;
    } else if (mode === 'start') {
      if (grid[r][c] === 1) return;
      if (r === goal[0] && c === goal[1]) return;
      start = [r, c];
    } else if (mode === 'goal') {
      if (grid[r][c] === 1) return;
      if (r === start[0] && c === start[1]) return;
      goal = [r, c];
    }
    clearResults();
  }

  /* ── Controls ───────────────────────────────── */
  function setMode(m) {
    mode = m;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${m}`).classList.add('active');
  }

  function applySize() {
    N     = parseInt(document.getElementById('gridSize').value) || 7;
    N     = Math.max(4, Math.min(12, N));
    grid  = makeGrid(N);
    start = [0, 0];
    goal  = [N - 1, N - 1];
    clearResults();
    updateGridLabel();
  }

  function randomObstacles() {
    grid = makeGrid(N);
    let count = Math.floor(N * N * 0.25);
    let placed = 0;
    while (placed < count) {
      const r = randInt(0, N - 1);
      const c = randInt(0, N - 1);
      if ((r === start[0] && c === start[1]) ||
          (r === goal[0]  && c === goal[1]))  continue;
      grid[r][c] = 1;
      placed++;
    }
    clearResults();
  }

  function clearGrid() {
    grid = makeGrid(N);
    clearResults();
  }

  function clearResults() {
    lastBFS = null;
    lastDFS = null;
    renderGrid();
    resetStats();
    setPathDisplay(null, null);
  }

  function updateGridLabel() {
    document.getElementById('gridLabel').textContent = `${N} × ${N} City Grid`;
    document.getElementById('gridSizeVal').textContent = `${N}×${N}`;
    document.getElementById('gridSize').value = N;
  }

  /* ── Algorithms ─────────────────────────────── */
  function bfs() {
    const visited = new Set();
    const parent  = {};
    const queue   = [start.slice()];
    const order   = [];
    visited.add(key(start));

    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      if (node[0] === goal[0] && node[1] === goal[1]) {
        return { path: reconstructPath(parent, start, goal), visited, found: true, order };
      }
      for (const nb of neighbors(node)) {
        const k = key(nb);
        if (!visited.has(k)) {
          visited.add(k);
          parent[k] = node;
          queue.push(nb);
        }
      }
    }
    return { path: [], visited, found: false, order };
  }

  function dfs() {
    const visited = new Set();
    const parent  = {};
    const stack   = [start.slice()];
    const order   = [];

    while (stack.length) {
      const node = stack.pop();
      const k    = key(node);
      if (visited.has(k)) continue;
      visited.add(k);
      order.push(node);
      if (node[0] === goal[0] && node[1] === goal[1]) {
        return { path: reconstructPath(parent, start, goal), visited, found: true, order };
      }
      for (const nb of neighbors(node)) {
        const nk = key(nb);
        if (!visited.has(nk)) {
          parent[nk] = node;
          stack.push(nb);
        }
      }
    }
    return { path: [], visited, found: false, order };
  }

  function neighbors([r, c]) {
    return [[0,1],[1,0],[0,-1],[-1,0]]
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) =>
        nr >= 0 && nr < N && nc >= 0 && nc < N && grid[nr][nc] === 0
      );
  }

  function reconstructPath(parent, from, to) {
    const path = [];
    let cur = key(to);
    const startKey = key(from);
    let safety = 0;
    while (cur && cur !== startKey && safety++ < N * N) {
      const [r, c] = cur.split(',').map(Number);
      path.unshift([r, c]);
      cur = parent[cur] ? key(parent[cur]) : null;
    }
    if (cur === startKey) path.unshift(from.slice());
    return path;
  }

  /* ── Run ────────────────────────────────────── */
  function run(algo) {
    const t0     = performance.now();
    const result = algo === 'bfs' ? bfs() : dfs();
    const elapsed = (performance.now() - t0).toFixed(4);

    if (algo === 'bfs') {
      lastBFS = result;
      renderGrid(lastBFS, lastDFS);
      updateStat('bfs', result, elapsed);
    } else {
      lastDFS = result;
      renderGrid(lastBFS, lastDFS);
      updateStat('dfs', result, elapsed);
    }
    setPathDisplay(
      lastBFS && lastBFS.found ? lastBFS.path : null,
      lastDFS && lastDFS.found ? lastDFS.path : null
    );
    document.getElementById('compBlock').style.display = 'none';
  }

  function runBoth() {
    let t0 = performance.now();
    const b = bfs();
    const bt = (performance.now() - t0).toFixed(4);

    t0 = performance.now();
    const d = dfs();
    const dt = (performance.now() - t0).toFixed(4);

    lastBFS = b;
    lastDFS = d;
    renderGrid(b, d);
    updateStat('bfs', b, bt);
    updateStat('dfs', d, dt);
    setPathDisplay(
      b.found ? b.path : null,
      d.found ? d.path : null
    );
    renderComparison(b, bt, d, dt);
  }

  /* ── UI updates ─────────────────────────────── */
  function updateStat(algo, result, timeMs) {
    const pre = algo;
    const statusEl = document.getElementById(`${pre}Status`);
    const pathEl   = document.getElementById(`${pre}Path`);
    const nodesEl  = document.getElementById(`${pre}Nodes`);
    const timeEl   = document.getElementById(`${pre}Time`);

    if (result.found) {
      statusEl.textContent = 'Found ✓';
      statusEl.className   = 'stat-val found';
    } else {
      statusEl.textContent = 'No path ✗';
      statusEl.className   = 'stat-val notfound';
    }
    pathEl.textContent  = result.found ? `${result.path.length - 1} moves` : '—';
    nodesEl.textContent = `${result.visited.size}`;
    timeEl.textContent  = `${timeMs} ms`;
  }

  function resetStats() {
    ['bfs', 'dfs'].forEach(pre => {
      ['Status','Path','Nodes','Time'].forEach(f => {
        const el = document.getElementById(`${pre}${f}`);
        if (el) { el.textContent = '—'; el.className = 'stat-val'; }
      });
    });
    document.getElementById('compBlock').style.display = 'none';
  }

  function setPathDisplay(bfsPath, dfsPath) {
    const el = document.getElementById('pathDisplay');
    el.innerHTML = '';

    if (!bfsPath && !dfsPath) {
      el.innerHTML = '<span class="path-placeholder">Run an algorithm to see the path here...</span>';
      return;
    }

    if (bfsPath) {
      const div = document.createElement('div');
      div.className = 'path-entry';
      div.innerHTML = `<span class="path-label bfs-label">BFS</span>${fmtPath(bfsPath)}`;
      el.appendChild(div);
    }
    if (dfsPath) {
      const div = document.createElement('div');
      div.className = 'path-entry';
      div.innerHTML = `<span class="path-label dfs-label">DFS</span>${fmtPath(dfsPath)}`;
      el.appendChild(div);
    }
  }

  function fmtPath(path) {
    return path.map(([r, c]) => `(${r},${c})`).join(' → ');
  }

  function renderComparison(b, bt, d, dt) {
    const block   = document.getElementById('compBlock');
    const content = document.getElementById('compContent');
    block.style.display = 'block';

    if (!b.found && !d.found) {
      content.innerHTML = '<p class="comp-summary">No path exists for either algorithm.</p>';
      return;
    }

    const bLen = b.found ? b.path.length - 1 : Infinity;
    const dLen = d.found ? d.path.length - 1 : Infinity;
    const bNodes = b.visited.size;
    const dNodes = d.visited.size;
    const bFaster = parseFloat(bt) <= parseFloat(dt);

    const pathWinner  = bLen <= dLen ? 'BFS' : 'DFS';
    const nodesWinner = bNodes <= dNodes ? 'BFS' : 'DFS';

    content.innerHTML = `
      <div class="comp-row">
        <span>Shorter path</span>
        <span class="${bLen <= dLen ? 'comp-winner' : ''}">BFS: ${b.found ? bLen + ' moves' : '—'}</span>
        <span class="${dLen < bLen ? 'comp-winner' : ''}">DFS: ${d.found ? dLen + ' moves' : '—'}</span>
      </div>
      <div class="comp-row">
        <span>Nodes explored</span>
        <span class="${bNodes <= dNodes ? 'comp-winner' : 'comp-loser'}">BFS: ${bNodes}</span>
        <span class="${dNodes < bNodes ? 'comp-winner' : 'comp-loser'}">DFS: ${dNodes}</span>
      </div>
      <div class="comp-row">
        <span>Execution time</span>
        <span class="${bFaster ? 'comp-winner' : ''}">BFS: ${bt} ms</span>
        <span class="${!bFaster ? 'comp-winner' : ''}">DFS: ${dt} ms</span>
      </div>
      <p class="comp-summary">
        BFS always finds the <strong style="color:#6eb4f5">shortest path</strong>.
        DFS is often faster but the path is <strong style="color:#f0a070">not guaranteed optimal</strong>.
        ${pathWinner === 'BFS' && bLen < dLen ? `BFS found a ${dLen - bLen}-move shorter route in this case.` : ''}
      </p>`;
  }

  /* ── Tab toggle ─────────────────────────────── */
  function showTab(t) {
    document.getElementById('tab-bfs').classList.toggle('hidden', t !== 'bfs');
    document.getElementById('tab-dfs').classList.toggle('hidden', t !== 'dfs');
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
      b.classList.toggle('active', (i === 0 && t === 'bfs') || (i === 1 && t === 'dfs'));
    });
  }

  /* ── Helpers ────────────────────────────────── */
  function key([r, c]) { return `${r},${c}`; }
  function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  /* ── Boot ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ─────────────────────────────── */
  return { setMode, applySize, randomObstacles, clearGrid, run, runBoth, clearResults, showTab };

})();
