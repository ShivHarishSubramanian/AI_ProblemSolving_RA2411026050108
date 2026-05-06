# AI_ProblemSolving_RA2411026050108
# Problem 9: Drone Delivery Path Finder System

**AI Problem Solving Assignment — BFS & DFS**

## Problem Description

A delivery company uses drones to deliver packages across a city represented as an N×N grid. Some cells are blocked (no-fly zones / obstacles). The drone must travel from the warehouse to the customer location finding the shortest and safest possible path.

This program implements **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** to find valid paths, and compares them side-by-side.

---

## Algorithms Used

### Breadth-First Search (BFS)
- Uses a **queue (FIFO)** data structure
- Explores nodes **level by level** (all neighbours before going deeper)
- **Guarantees the shortest path** in an unweighted grid
- Higher memory usage (stores all frontier nodes)

### Depth-First Search (DFS)
- Uses a **stack (LIFO)** data structure
- Explores nodes by going **as deep as possible** before backtracking
- **Does NOT guarantee the shortest path**
- Generally explores fewer nodes but may find a longer route

### Comparison

| Feature              | BFS              | DFS               |
|----------------------|------------------|-------------------|
| Data structure       | Queue            | Stack             |
| Shortest path?       | ✅ Yes           | ❌ Not guaranteed |
| Nodes explored       | More (in general)| Fewer (in general)|
| Time complexity      | O(V + E)         | O(V + E)          |
| Space complexity     | O(V)             | O(V)              |
| Best for             | Shortest paths   | Existence check   |

---

## Features

- Interactive **Tkinter GUI** with clickable grid
- Toggle obstacles, set start (🚁) and goal (📦) by clicking
- Adjustable grid size (4×4 to 12×12)
- Random obstacle generator
- Visual overlay of visited cells and final path for both algorithms
- Side-by-side comparison with execution time and node count

---

## Execution Steps

### Prerequisites
```bash
pip install tk   # usually included with Python
```

### Run
```bash
python main.py
```

### How to use
1. Set grid size and click **Apply size**
2. Use **Random obstacles** or click cells in obstacle mode to place no-fly zones
3. Switch mode to **Set start** or **Set goal** and click a cell
4. Click **▶ Run BFS**, **▶ Run DFS**, or **▶ Run Both & Compare**
5. View the path highlighted on the grid and stats in the right panel

---

## Sample Outputs

### BFS Result (6×6 grid)
```
Status   : PATH FOUND ✓
Path len : 10 moves
Explored : 28 nodes
Time     : 0.0421 ms
Path     : (0,0) → (0,1) → (1,1) → (2,1) → (3,1) → (3,2) → (4,2) → (4,3) → (5,3) → (5,4) → (5,5)
```

### DFS Result (same grid)
```
Status   : PATH FOUND ✓
Path len : 14 moves
Explored : 19 nodes
Time     : 0.0180 ms
Path     : (0,0) → (1,0) → (2,0) → (3,0) → (4,0) → (4,1) → (4,2) → (4,3) → (5,3) → (5,4) → (5,5) → ...
```

---

## Folder Structure

```
AI_ProblemSolving_<RegisterNumber>/
└── Problem9_Drone_Delivery/
    ├── main.py        # Main application
    └── README.md      # This file
```

---

## Team Members
- Member 1: [Name] — [Register Number]
- Member 2: [Name] — [Register Number]
