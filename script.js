// 游戏状态
const gameState = {
    disksCount: 5,
    pegs: [[5,4,3,2,1], [], []],
    moves: 0,
    isAutoSolving: false,
    selectedPegIndex: null
};

// 彩虹圆盘配色
const colors = [
    "#ff6b6b", "#ffa500", "#ffd93d",
    "#6bcb77", "#4d96ff", "#9b59b6", "#e74c3c", "#3498db"
];

// DOM 元素
const diskCountInput = document.getElementById("diskCount");
const moveCountEl = document.getElementById("moveCount");
const resetBtn = document.getElementById("resetBtn");
const autoSolveBtn = document.getElementById("autoSolveBtn");
const warningEl = document.getElementById("warning");
const victoryEl = document.getElementById("victory");
const pegEls = document.querySelectorAll(".peg");

// 初始化
initGame(gameState.disksCount);

// 事件监听
diskCountInput.addEventListener("change", () => {
    let val = parseInt(diskCountInput.value);
    if(val < 3) val = 3;
    if(val > 8) val = 8;
    diskCountInput.value = val;
    initGame(val);
});

resetBtn.addEventListener("click", () => {
    if(gameState.isAutoSolving) return;
    initGame(gameState.disksCount);
});

autoSolveBtn.addEventListener("click", autoSolve);

// 给柱子绑定点击
pegEls.forEach((peg, idx) => {
    peg.addEventListener("click", () => handlePegClick(idx));
});

// 初始化游戏
function initGame(num) {
    gameState.disksCount = num;
    gameState.moves = 0;
    gameState.isAutoSolving = false;
    gameState.selectedPegIndex = null;
    gameState.pegs = [];
    gameState.pegs.push([...Array(num).keys()].reverse());
    gameState.pegs.push([]);
    gameState.pegs.push([]);

    moveCountEl.textContent = 0;
    victoryEl.classList.remove("show");
    renderAllPegs();
}

// 渲染所有柱子
function renderAllPegs() {
    pegEls.forEach((peg, pegIdx) => {
        peg.innerHTML = "";
        gameState.pegs[pegIdx].forEach(size => {
            const disk = document.createElement("div");
            disk.classList.add("disk");
            // 宽度 60px ~ 180px
            const width = 60 + (size - 1) * 15;
            disk.style.width = width + "px";
            disk.style.backgroundColor = colors[size % colors.length];
            disk.dataset.size = size;
            peg.appendChild(disk);
        });
    });
}

// 柱子点击逻辑
function handlePegClick(pegIdx) {
    if(gameState.isAutoSolving) return;

    // 第一次选中柱子
    if(gameState.selectedPegIndex === null) {
        if(gameState.pegs[pegIdx].length === 0) return;
        gameState.selectedPegIndex = pegIdx;
    } else {
        // 第二次放置
        const from = gameState.selectedPegIndex;
        const to = pegIdx;
        if(from === to) {
            gameState.selectedPegIndex = null;
            return;
        }

        if(isValidMove(from, to)) {
            executeMove(from, to);
            gameState.moves++;
            moveCountEl.textContent = gameState.moves;
            checkWin();
        } else {
            showWarning();
        }
        gameState.selectedPegIndex = null;
    }
}

// 校验移动是否合法
function isValidMove(from, to) {
    const fromTop = gameState.pegs[from].at(-1);
    const toTop = gameState.pegs[to].at(-1);
    if(!toTop) return true;
    return fromTop < toTop;
}

// 执行移动
function executeMove(from, to) {
    const disk = gameState.pegs[from].pop();
    gameState.pegs[to].push(disk);
    renderAllPegs();
}

// 显示警告
function showWarning() {
    warningEl.style.animation = "none";
    warningEl.offsetHeight;
    warningEl.style.animation = "shakeWarning 0.4s ease, fadeOutWarning 2s forwards";
}

// 检查胜利
function checkWin() {
    if(gameState.pegs[2].length === gameState.disksCount) {
        victoryEl.classList.add("show");
    }
}

// 递归自动求解
async function autoSolve() {
    if(gameState.isAutoSolving) return;
    gameState.isAutoSolving = true;
    diskCountInput.disabled = true;
    resetBtn.disabled = true;
    autoSolveBtn.disabled = true;

    // 先重置到初始状态
    initGame(gameState.disksCount);

    await hanoiSolve(gameState.disksCount, 0, 2, 1);

    gameState.isAutoSolving = false;
    diskCountInput.disabled = false;
    resetBtn.disabled = false;
    autoSolveBtn.disabled = false;
    checkWin();
}

// 汉诺塔递归
async function hanoiSolve(n, start, end, temp) {
    if(n === 0) return;
    await hanoiSolve(n-1, start, temp, end);
    // 移动一步
    executeMove(start, end);
    gameState.moves++;
    moveCountEl.textContent = gameState.moves;
    await sleep(600);
    await hanoiSolve(n-1, temp, end, start);
}

// 延时
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
