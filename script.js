/* =====================================================
   LOADER
===================================================== */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 800);
});

/* =====================================================
   TECH BACKGROUND — CODE RAIN
===================================================== */
(function initCodeRain() {
    const canvas = document.getElementById("code-rain");
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]()<>/\\|;:=+*&^%$#@!?<>HTMLCSSJS{}()<>&";
    const FONT_SIZE = 14;
    const colors = ["#ff0033", "#ff4d6d", "#c77dff", "#9d4edd", "#e0aaff"];

    let columns = [];
    let width = 0, height = 0;
    let colWidth = FONT_SIZE;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 24;
    let animationId = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const density = width < 600 ? 22 : width < 1000 ? 16 : 14;
        colWidth = FONT_SIZE + 4;
        const totalCols = Math.max(10, Math.floor(width / colWidth));

        columns = [];
        for (let i = 0; i < totalCols; i++) {
            columns.push({
                x: i * colWidth,
                y: Math.random() * -height,
                speed: 0.6 + Math.random() * 1.4,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                lastChange: 0
            });
        }
    }

    function draw(timestamp) {
        if (!lastFrame) lastFrame = timestamp;
        const elapsed = timestamp - lastFrame;

        if (elapsed > FRAME_INTERVAL) {
            lastFrame = timestamp;
            ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${FONT_SIZE}px "Space Grotesk", monospace`;
            ctx.textBaseline = "top";

            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                if (timestamp - col.lastChange > 120 + Math.random() * 200) {
                    col.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    col.lastChange = timestamp;
                }
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = col.color;
                ctx.shadowBlur = 12;
                ctx.fillText(col.char, col.x, col.y);
                ctx.shadowBlur = 0;
                ctx.fillStyle = col.color;
                ctx.globalAlpha = 0.85;
                ctx.fillText(col.char, col.x, col.y - 2);
                ctx.globalAlpha = 1;
                col.y += col.speed * FONT_SIZE * 0.55;
                if (col.y > height + 40) {
                    col.y = -20;
                    col.speed = 0.6 + Math.random() * 1.4;
                    col.color = colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }
        animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", () => {
        clearTimeout(window.__rainResizeTimer);
        window.__rainResizeTimer = setTimeout(resize, 220);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && !animationId) {
            lastFrame = 0;
            animationId = requestAnimationFrame(draw);
        }
    });
})();

/* =====================================================
   MOBILE MENU / NAV / ACTIVE LINK
===================================================== */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const icon = menuToggle.querySelector("i");
    if (navLinks.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    });
});

const header = document.getElementById("header");
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
});

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + entry.target.id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { threshold: 0.35 }
);
sections.forEach(section => sectionObserver.observe(section));

/* =====================================================
   TYPING ANIMATION
===================================================== */
const typingElement = document.getElementById("typing");
const words = [
    "Web Developer",
    "ICT Student",
    "Network Enthusiast",
    "Tech Enthusiast",
    "Problem Solver"
];

let wordIndex = 0,
    charIndex = 0,
    deleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (!deleting) {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }
    setTimeout(typeEffect, deleting ? 60 : 100);
}
typeEffect();

/* =====================================================
   SCROLL REVEAL + SKILL BARS
===================================================== */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 }
);
revealElements.forEach(el => revealObserver.observe(el));

const skillBars = document.querySelectorAll(".skill-fill");
const skillObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.width;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 }
);
skillBars.forEach(bar => skillObserver.observe(bar));

/* =====================================================
   SKILL CARD 3D TILT
===================================================== */
document.querySelectorAll(".skill-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

/* =====================================================
   PROJECT CARDS — 3D TILT + CLICK-TO-OPEN
===================================================== */
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });

    card.addEventListener("mouseleave", () => { card.style.transform = ""; });

    card.addEventListener("click", (e) => {
        if (e.target.closest(".project-actions")) return;
        const projectId = card.dataset.project;
        if (projectId) openProjectModal(projectId);
    });

    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const projectId = card.dataset.project;
            if (projectId) openProjectModal(projectId);
        }
    });
});

/* =====================================================
   PROJECT FILTER
===================================================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        projects.forEach(project => {
            const category = project.dataset.category;
            if (filter === "all" || category === filter) {
                project.classList.remove("hidden");
                project.style.animation = "none";
                void project.offsetWidth;
                project.style.animation = "cardIn 0.45s ease";
            } else {
                project.classList.add("hidden");
            }
        });
    });
});

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes cardIn {
        from { opacity: 0; transform: translateY(14px) scale(0.98); }
        to   { opacity: 1; transform: none; }
    }
`;
document.head.appendChild(styleSheet);

/* =====================================================
   PROJECT DATA
===================================================== */
const projectData = {
    weather: {
        title: "Weather Website",
        description: "A responsive weather application that displays real-time weather information using a weather API.",
        features: "Real-time weather data for any city worldwide, live temperature, humidity and wind speed, 5-day forecast, dynamic weather icons and responsive interface.",
        tags: ["HTML", "CSS", "JavaScript", "Open-Meteo API"],
        demoType: "weather"
    },
    game: {
        title: "JavaScript Game Website — Snake",
        description: "An interactive browser-based Snake game developed using JavaScript and HTML5 Canvas.",
        features: "Classic Snake gameplay, keyboard + touch controls, live score tracking, high score memory, responsive canvas and smooth 60fps rendering.",
        tags: ["HTML", "CSS", "JavaScript", "Canvas"],
        demoType: "game"
    },
    network: {
        title: "Polytechnic Network Design",
        description: "A secure campus network topology designed for a polytechnic environment using Cisco Packet Tracer.",
        features: "Star-topology campus network with core router, distribution switch, 4 VLANs (Admin, Labs, Library, Students), DHCP, DNS and internet gateway.",
        tags: ["Cisco Packet Tracer", "Networking", "VLANs", "Routing"],
        demoType: "network"
    },
    database: {
        title: "Database Projects",
        description: "Database projects involving student records, inventory management and SQL operations.",
        features: "Normalized relational schema, SQL queries with JOINs and aggregation, student records system, inventory management and data validation.",
        tags: ["SQL", "Databases", "MS Access"],
        demoType: "database"
    }
};

/* =====================================================
   MODAL — OPEN / CLOSE / TABS
===================================================== */
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalFeatures = document.getElementById("modalFeatures");
const modalTags = document.getElementById("modalTags");
const modalClose = document.getElementById("modalClose");
const demoPanel = document.getElementById("demoPanel");
let activeGame = null;

function openProjectModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalFeatures.textContent = project.features;
    modalTags.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join("");

    document.querySelectorAll(".modal-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".modal-panel").forEach(p => p.classList.remove("active"));
    document.querySelector('[data-tab="demo"]').classList.add("active");
    document.querySelector('[data-panel="demo"]').classList.add("active");

    if (activeGame && typeof activeGame.stop === "function") {
        activeGame.stop();
        activeGame = null;
    }

    demoPanel.innerHTML = "";
    if (project.demoType === "game") buildSnakeGame();
    else if (project.demoType === "weather") buildWeatherDemo();
    else if (project.demoType === "network") buildNetworkDemo();
    else if (project.demoType === "database") buildDatabaseDemo();

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (activeGame && typeof activeGame.stop === "function") {
        activeGame.stop();
        activeGame = null;
    }
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

document.querySelectorAll(".view-project").forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        openProjectModal(button.dataset.project);
    });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("show")) closeModal();
});

document.querySelectorAll(".modal-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".modal-tab").forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });
        document.querySelectorAll(".modal-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");

        if (tab.dataset.tab !== "demo" && activeGame && typeof activeGame.pause === "function") {
            activeGame.pause();
        } else if (tab.dataset.tab === "demo" && activeGame && typeof activeGame.resume === "function") {
            activeGame.resume();
        }
    });
});

/* =====================================================
   SNAKE GAME
===================================================== */
function buildSnakeGame() {
    demoPanel.innerHTML = `
        <div class="game-demo-wrap">
            <div class="game-header">
                <div class="game-score">Score: <span id="snakeScore">0</span> &nbsp;|&nbsp; Best: <span id="snakeBest">0</span></div>
                <div class="game-controls">
                    <button id="snakeRestart" type="button"><i class="fas fa-redo"></i> Restart</button>
                </div>
            </div>
            <canvas id="snakeCanvas" width="360" height="360"></canvas>
            <div class="game-hint">
                Use <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move. Press <kbd>Space</kbd> to pause.
            </div>
            <div class="dpad" id="dpad">
                <div></div>
                <button data-dir="up" aria-label="Move up"><i class="fas fa-chevron-up"></i></button>
                <div></div>
                <button data-dir="left" aria-label="Move left"><i class="fas fa-chevron-left"></i></button>
                <div></div>
                <button data-dir="right" aria-label="Move right"><i class="fas fa-chevron-right"></i></button>
                <div></div>
                <button data-dir="down" aria-label="Move down"><i class="fas fa-chevron-down"></i></button>
                <div></div>
            </div>
        </div>
    `;

    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("snakeScore");
    const bestEl = document.getElementById("snakeBest");
    const restartBtn = document.getElementById("snakeRestart");

    const GRID = 18;
    const CELL = canvas.width / GRID;

    let snake, direction, nextDirection, food, score, best, gameOver, paused;
    let loopId = null;
    let lastTick = 0;
    const TICK_MS = 110;

    best = Number(localStorage.getItem("snake-best") || 0);
    bestEl.textContent = best;

    function reset() {
        snake = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        paused = false;
        scoreEl.textContent = "0";
        placeFood();
    }

    function placeFood() {
        let attempts = 0;
        do {
            food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
            attempts++;
        } while (snake.some(s => s.x === food.x && s.y === food.y) && attempts < 200);
    }

    function draw() {
        ctx.fillStyle = "#050002";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(199, 125, 255, 0.07)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL, 0);
            ctx.lineTo(i * CELL, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL);
            ctx.lineTo(canvas.width, i * CELL);
            ctx.stroke();
        }

        if (food) {
            const fx = food.x * CELL + CELL / 2;
            const fy = food.y * CELL + CELL / 2;
            ctx.shadowColor = "#ff0033";
            ctx.shadowBlur = 18;
            ctx.fillStyle = "#ff0033";
            ctx.beginPath();
            ctx.arc(fx, fy, CELL / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        snake.forEach((seg, i) => {
            const x = seg.x * CELL;
            const y = seg.y * CELL;
            const isHead = i === 0;
            ctx.shadowColor = isHead ? "#ff4d6d" : "#9d4edd";
            ctx.shadowBlur = isHead ? 16 : 8;
            ctx.fillStyle = isHead ? "#ff4d6d" : "#c77dff";
            roundRect(ctx, x + 1, y + 1, CELL - 2, CELL - 2, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        if (gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ff4d6d";
            ctx.font = "bold 30px 'Space Grotesk', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 14);
            ctx.fillStyle = "#c77dff";
            ctx.font = "14px Inter, sans-serif";
            ctx.fillText("Press Restart or Space", canvas.width / 2, canvas.height / 2 + 20);
        } else if (paused) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c77dff";
            ctx.font = "bold 26px 'Space Grotesk', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        }
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function tick(now) {
        if (!lastTick) lastTick = now;
        if (now - lastTick >= TICK_MS) {
            lastTick = now;
            step();
        }
        draw();
        loopId = requestAnimationFrame(tick);
    }

    function step() {
        if (gameOver || paused) return;
        direction = nextDirection;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) { endGame(); return; }
        if (snake.some((s, i) => i !== snake.length - 1 && s.x === head.x && s.y === head.y)) { endGame(); return; }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.textContent = score;
            if (score > best) {
                best = score;
                bestEl.textContent = best;
                localStorage.setItem("snake-best", best);
            }
            placeFood();
        } else {
            snake.pop();
        }
    }

    function endGame() {
        gameOver = true;
        if (loopId) { cancelAnimationFrame(loopId); loopId = null; }
        draw();
    }

    function setDirection(dx, dy) {
        if (direction.x === -dx && direction.y === -dy) return;
        nextDirection = { x: dx, y: dy };
    }

    function handleKey(e) {
        if (!modal.classList.contains("show")) return;
        const key = e.key.toLowerCase();
        if (["arrowup", "w"].includes(key)) { e.preventDefault(); setDirection(0, -1); }
        else if (["arrowdown", "s"].includes(key)) { e.preventDefault(); setDirection(0, 1); }
        else if (["arrowleft", "a"].includes(key)) { e.preventDefault(); setDirection(-1, 0); }
        else if (["arrowright", "d"].includes(key)) { e.preventDefault(); setDirection(1, 0); }
        else if (key === " " || key === "spacebar") {
            e.preventDefault();
            if (gameOver) {
                reset();
                if (!loopId) loopId = requestAnimationFrame(tick);
            } else {
                paused = !paused;
            }
        }
    }

    document.querySelectorAll("#dpad button").forEach(btn => {
        btn.addEventListener("click", () => {
            const dir = btn.dataset.dir;
            if (dir === "up") setDirection(0, -1);
            else if (dir === "down") setDirection(0, 1);
            else if (dir === "left") setDirection(-1, 0);
            else if (dir === "right") setDirection(1, 0);
        });
    });

    restartBtn.addEventListener("click", () => {
        reset();
        if (loopId) cancelAnimationFrame(loopId);
        lastTick = 0;
        loopId = requestAnimationFrame(tick);
    });

    canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
    document.addEventListener("keydown", handleKey);

    reset();
    loopId = requestAnimationFrame(tick);

    activeGame = {
        stop: () => {
            if (loopId) { cancelAnimationFrame(loopId); loopId = null; }
            document.removeEventListener("keydown", handleKey);
        },
        pause: () => { paused = true; },
        resume: () => { if (!gameOver) paused = false; }
    };
}

/* =====================================================
   WEATHER DEMO (inside modal)
===================================================== */
function buildWeatherDemo() {
    demoPanel.innerHTML = `
        <div class="weather-demo-wrap">
            <div class="weather-demo-search">
                <input type="text" id="modalCityInput" placeholder="Enter any city… e.g. Nairobi, Tokyo, Paris" aria-label="City name">
                <button id="modalWeatherBtn" type="button"><i class="fas fa-search"></i> Get Weather</button>
            </div>

            <div class="quick-cities">
                <button class="quick-city" data-city="Kisumu">Kisumu</button>
                <button class="quick-city" data-city="Nairobi">Nairobi</button>
                <button class="quick-city" data-city="Mombasa">Mombasa</button>
                <button class="quick-city" data-city="London">London</button>
                <button class="quick-city" data-city="New York">New York</button>
                <button class="quick-city" data-city="Tokyo">Tokyo</button>
            </div>

            <div id="modalWeatherContent">
                <div class="weather-loading">
                    <i class="fas fa-spinner"></i>
                    Loading weather…
                </div>
            </div>
        </div>
    `;

    const cityInput = document.getElementById("modalCityInput");
    const btn = document.getElementById("modalWeatherBtn");
    const content = document.getElementById("modalWeatherContent");

    const codeMap = {
        0: { icon: "fa-sun", label: "Clear sky" },
        1: { icon: "fa-sun", label: "Mainly clear" },
        2: { icon: "fa-cloud-sun", label: "Partly cloudy" },
        3: { icon: "fa-cloud", label: "Overcast" },
        45: { icon: "fa-smog", label: "Fog" },
        48: { icon: "fa-smog", label: "Rime fog" },
        51: { icon: "fa-cloud-rain", label: "Light drizzle" },
        53: { icon: "fa-cloud-rain", label: "Drizzle" },
        55: { icon: "fa-cloud-rain", label: "Dense drizzle" },
        61: { icon: "fa-cloud-rain", label: "Slight rain" },
        63: { icon: "fa-cloud-rain", label: "Rain" },
        65: { icon: "fa-cloud-showers-heavy", label: "Heavy rain" },
        71: { icon: "fa-snowflake", label: "Slight snow" },
        73: { icon: "fa-snowflake", label: "Snow" },
        75: { icon: "fa-snowflake", label: "Heavy snow" },
        80: { icon: "fa-cloud-rain", label: "Rain showers" },
        81: { icon: "fa-cloud-rain", label: "Rain showers" },
        82: { icon: "fa-cloud-showers-heavy", label: "Violent showers" },
        95: { icon: "fa-bolt", label: "Thunderstorm" },
        96: { icon: "fa-bolt", label: "Thunderstorm + hail" },
        99: { icon: "fa-bolt", label: "Thunderstorm + hail" }
    };
    const decode = c => codeMap[c] || { icon: "fa-cloud", label: "Unknown" };

    async function fetchWeather(city) {
        content.innerHTML = `<div class="weather-loading"><i class="fas fa-spinner"></i>Searching for "${city}"…</div>`;
        try {
            const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`).then(r => r.json());
            if (!geo.results || !geo.results.length) {
                content.innerHTML = `<div class="weather-loading" style="color:var(--danger);"><i class="fas fa-search" style="animation:none;color:var(--danger);"></i>City "${city}" not found. Try another.</div>`;
                return;
            }
            const place = geo.results[0];
            const lat = place.latitude;
            const lon = place.longitude;
            const placeName = place.name + (place.country ? ", " + place.country : "");

            const data = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`).then(r => r.json());

            const cur = data.current;
            const daily = data.daily;
            const info = decode(cur.weather_code);

            let forecastHTML = "";
            for (let i = 0; i < 5; i++) {
                const fc = decode(daily.weather_code[i]);
                const date = new Date(daily.time[i]);
                const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
                forecastHTML += `
                    <div class="forecast-day">
                        <small>${dayName}</small>
                        <i class="fas ${fc.icon}"></i>
                        <strong>${Math.round(daily.temperature_2m_max[i])}°</strong>
                    </div>`;
            }

            content.innerHTML = `
                <div class="weather-main">
                    <div class="weather-icon"><i class="fas ${info.icon}"></i></div>
                    <div class="weather-info">
                        <div class="weather-temp">${Math.round(cur.temperature_2m)}°C</div>
                        <div class="weather-city"><i class="fas fa-map-marker-alt" style="color:var(--red-light);font-size:0.8rem;margin-right:4px;"></i>${placeName}</div>
                        <div class="weather-desc">${info.label}</div>
                    </div>
                </div>

                <div class="weather-details">
                    <div class="weather-detail">
                        <i class="fas fa-temperature-half"></i>
                        <span>${Math.round(cur.temperature_2m)}°C</span>
                        <small>Temperature</small>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-droplet"></i>
                        <span>${cur.relative_humidity_2m}%</span>
                        <small>Humidity</small>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i>
                        <span>${Math.round(cur.wind_speed_10m)} km/h</span>
                        <small>Wind</small>
                    </div>
                </div>

                <div class="weather-forecast">${forecastHTML}</div>
            `;
        } catch (err) {
            content.innerHTML = `<div class="weather-loading" style="color:var(--danger);"><i class="fas fa-exclamation-triangle" style="animation:none;color:var(--danger);"></i>Failed to load weather. Check your connection and try again.</div>`;
        }
    }

    btn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    });

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (city) fetchWeather(city);
        }
    });

    document.querySelectorAll(".quick-city").forEach(q => {
        q.addEventListener("click", () => {
            cityInput.value = q.dataset.city;
            fetchWeather(q.dataset.city);
        });
    });

    fetchWeather("Kisumu");
}

/* =====================================================
   NETWORK DESIGN DEMO
===================================================== */
function buildNetworkDemo() {
    demoPanel.innerHTML = `
        <div class="network-demo-wrap">
            <svg class="network-svg" viewBox="0 0 700 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Campus network topology diagram">
                <defs>
                    <linearGradient id="netGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ff0033" />
                        <stop offset="50%" stop-color="#c77dff" />
                        <stop offset="100%" stop-color="#9d4edd" />
                    </linearGradient>
                    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g class="net-node">
                    <circle cx="350" cy="45" r="26" fill="#0a0008" stroke="url(#netGradient)" stroke-width="2.5" filter="url(#softGlow)"/>
                    <text x="350" y="52" text-anchor="middle" fill="#ff4d6d" font-size="20">&#xf0ac;</text>
                    <text class="net-label" x="350" y="90">Internet / ISP</text>
                </g>

                <g class="net-node">
                    <rect x="314" y="118" width="72" height="48" rx="10" fill="#0a0008" stroke="url(#netGradient)" stroke-width="2.5" filter="url(#softGlow)"/>
                    <text x="350" y="140" text-anchor="middle" fill="#ff4d6d" font-size="11" font-weight="700">FIREWALL</text>
                    <text x="350" y="155" text-anchor="middle" fill="#c77dff" font-size="8">ACL Rules</text>
                    <text class="net-label" x="350" y="182">Edge Firewall</text>
                </g>

                <g class="net-node">
                    <circle cx="350" cy="240" r="32" fill="#0a0008" stroke="url(#netGradient)" stroke-width="2.5" filter="url(#softGlow)"/>
                    <text x="350" y="238" text-anchor="middle" fill="#ff4d6d" font-size="10" font-weight="700">CORE</text>
                    <text x="350" y="252" text-anchor="middle" fill="#c77dff" font-size="10" font-weight="700">ROUTER</text>
                    <text class="net-label" x="350" y="288">Cisco ISR 4331</text>
                    <text class="net-sublabel" x="350" y="300">Inter-VLAN Routing</text>
                </g>

                <g class="net-node">
                    <rect x="290" y="330" width="120" height="44" rx="10" fill="#0a0008" stroke="url(#netGradient)" stroke-width="2.5" filter="url(#softGlow)"/>
                    <text x="350" y="350" text-anchor="middle" fill="#ff4d6d" font-size="10" font-weight="700">DISTRIBUTION</text>
                    <text x="350" y="364" text-anchor="middle" fill="#c77dff" font-size="9">SWITCH (L3)</text>
                    <text class="net-label" x="350" y="390">Core Switch</text>
                </g>

                <g class="net-node">
                    <rect x="30" y="400" width="130" height="46" rx="10" fill="#0a0008" stroke="#ff4d6d" stroke-width="2"/>
                    <text x="95" y="420" text-anchor="middle" fill="#ff4d6d" font-size="10" font-weight="700">VLAN 10 — ADMIN</text>
                    <text x="95" y="435" text-anchor="middle" fill="#c77dff" font-size="9">192.168.10.0/24</text>
                </g>

                <g class="net-node">
                    <rect x="180" y="400" width="120" height="46" rx="10" fill="#0a0008" stroke="#9d4edd" stroke-width="2"/>
                    <text x="240" y="420" text-anchor="middle" fill="#c77dff" font-size="10" font-weight="700">VLAN 20 — LABS</text>
                    <text x="240" y="435" text-anchor="middle" fill="#c77dff" font-size="9">192.168.20.0/24</text>
                </g>

                <g class="net-node">
                    <rect x="320" y="400" width="130" height="46" rx="10" fill="#0a0008" stroke="#ff4d6d" stroke-width="2"/>
                    <text x="385" y="420" text-anchor="middle" fill="#ff4d6d" font-size="10" font-weight="700">VLAN 30 — LIBRARY</text>
                    <text x="385" y="435" text-anchor="middle" fill="#c77dff" font-size="9">192.168.30.0/24</text>
                </g>

                <g class="net-node">
                    <rect x="470" y="400" width="200" height="46" rx="10" fill="#0a0008" stroke="#9d4edd" stroke-width="2"/>
                    <text x="570" y="420" text-anchor="middle" fill="#c77dff" font-size="10" font-weight="700">VLAN 40 — STUDENTS / WIFI</text>
                    <text x="570" y="435" text-anchor="middle" fill="#c77dff" font-size="9">192.168.40.0/24</text>
                </g>

                <line class="net-link" x1="350" y1="71" x2="350" y2="118" />
                <line class="net-link" x1="350" y1="166" x2="350" y2="208" />
                <line class="net-link" x1="350" y1="272" x2="350" y2="330" />
                <line class="net-link" x1="310" y1="374" x2="95"  y2="400" />
                <line class="net-link" x1="330" y1="374" x2="240" y2="400" />
                <line class="net-link" x1="370" y1="374" x2="385" y2="400" />
                <line class="net-link" x1="395" y1="374" x2="570" y2="400" />

                <g transform="translate(20, 20)">
                    <rect x="0" y="0" width="140" height="86" rx="10" fill="rgba(0,0,0,0.6)" stroke="rgba(199,125,255,0.3)"/>
                    <text x="10" y="20" fill="#ff4d6d" font-size="10" font-weight="700">LEGEND</text>
                    <circle cx="16" cy="38" r="4" fill="#ff0033" />
                    <text x="28" y="42" fill="#ffe4ec" font-size="9">Router / Firewall</text>
                    <circle cx="16" cy="58" r="4" fill="#c77dff" />
                    <text x="28" y="62" fill="#ffe4ec" font-size="9">Switch / VLAN</text>
                    <line x1="10" y1="76" x2="30" y2="76" stroke="url(#netGradient)" stroke-width="2" stroke-dasharray="4 4" />
                    <text x="36" y="79" fill="#ffe4ec" font-size="9">Data Link</text>
                </g>
            </svg>
        </div>
    `;
}

/* =====================================================
   DATABASE DEMO
===================================================== */
function buildDatabaseDemo() {
    demoPanel.innerHTML = `
        <div class="db-demo-wrap">
            <div class="db-query-btns">
                <button data-query="students" class="active">SELECT * FROM students</button>
                <button data-query="top">Top scorers</button>
                <button data-query="course">Students by course</button>
                <button data-query="inventory">Inventory items</button>
            </div>
            <div class="db-result" id="dbResult"></div>
        </div>
    `;

    const result = document.getElementById("dbResult");

    const queries = {
        students: {
            sql: `<span class="sql-keyword">SELECT</span> id, name, course, year <span class="sql-keyword">FROM</span> students;`,
            table: `
                <table class="db-table">
                    <thead><tr><th>id</th><th>name</th><th>course</th><th>year</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Elvis Odhiambo</td><td>ICT</td><td>1</td></tr>
                        <tr><td>2</td><td>Mary Achieng</td><td>ICT</td><td>1</td></tr>
                        <tr><td>3</td><td>John Otieno</td><td>Business</td><td>2</td></tr>
                        <tr><td>4</td><td>Grace Wanjiku</td><td>ICT</td><td>2</td></tr>
                        <tr><td>5</td><td>Brian Kamau</td><td>Engineering</td><td>1</td></tr>
                    </tbody>
                </table>
            `
        },
        top: {
            sql: `<span class="sql-keyword">SELECT</span> name, course, marks <span class="sql-keyword">FROM</span> students <span class="sql-keyword">ORDER BY</span> marks <span class="sql-keyword">DESC LIMIT</span> 3;`,
            table: `
                <table class="db-table">
                    <thead><tr><th>name</th><th>course</th><th>marks</th></tr></thead>
                    <tbody>
                        <tr><td>Elvis Odhiambo</td><td>ICT</td><td>92</td></tr>
                        <tr><td>Grace Wanjiku</td><td>ICT</td><td>88</td></tr>
                        <tr><td>Mary Achieng</td><td>ICT</td><td>85</td></tr>
                    </tbody>
                </table>
            `
        },
        course: {
            sql: `<span class="sql-keyword">SELECT</span> course, <span class="sql-keyword">COUNT</span>(*) <span class="sql-keyword">AS</span> total <span class="sql-keyword">FROM</span> students <span class="sql-keyword">GROUP BY</span> course;`,
            table: `
                <table class="db-table">
                    <thead><tr><th>course</th><th>total</th></tr></thead>
                    <tbody>
                        <tr><td>ICT</td><td>3</td></tr>
                        <tr><td>Business</td><td>1</td></tr>
                        <tr><td>Engineering</td><td>1</td></tr>
                    </tbody>
                </table>
            `
        },
        inventory: {
            sql: `<span class="sql-keyword">SELECT</span> item, quantity, price <span class="sql-keyword">FROM</span> inventory <span class="sql-keyword">WHERE</span> quantity &lt; 20;`,
            table: `
                <table class="db-table">
                    <thead><tr><th>item</th><th>quantity</th><th>price (KES)</th></tr></thead>
                    <tbody>
                        <tr><td>Wireless Mouse</td><td>12</td><td>850</td></tr>
                        <tr><td>USB Cable</td><td>8</td><td>250</td></tr>
                        <tr><td>HDMI Cable</td><td>15</td><td>600</td></tr>
                        <tr><td>Keyboard</td><td>6</td><td>1,500</td></tr>
                    </tbody>
                </table>
            `
        }
    };

    function render(queryKey) {
        const q = queries[queryKey];
        if (!q) return;
        result.innerHTML = `${q.sql}<br><br><span class="sql-comment">-- Result set:</span>${q.table || ""}`;
    }

    document.querySelectorAll(".db-query-btns button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".db-query-btns button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            render(btn.dataset.query);
        });
    });

    render("students");
}

/* =====================================================
   PAGE-LEVEL WEATHER WIDGET
===================================================== */
const weatherContent = document.getElementById("weatherContent");
const cityInput = document.getElementById("cityInput");
const searchWeatherBtn = document.getElementById("searchWeather");

function decodeWeatherCode(code) {
    const map = {
        0: { icon: "fa-sun", label: "Clear sky" },
        1: { icon: "fa-sun", label: "Mainly clear" },
        2: { icon: "fa-cloud-sun", label: "Partly cloudy" },
        3: { icon: "fa-cloud", label: "Overcast" },
        45: { icon: "fa-smog", label: "Fog" },
        48: { icon: "fa-smog", label: "Rime fog" },
        51: { icon: "fa-cloud-rain", label: "Light drizzle" },
        53: { icon: "fa-cloud-rain", label: "Drizzle" },
        55: { icon: "fa-cloud-rain", label: "Dense drizzle" },
        61: { icon: "fa-cloud-rain", label: "Slight rain" },
        63: { icon: "fa-cloud-rain", label: "Rain" },
        65: { icon: "fa-cloud-showers-heavy", label: "Heavy rain" },
        71: { icon: "fa-snowflake", label: "Slight snow" },
        73: { icon: "fa-snowflake", label: "Snow" },
        75: { icon: "fa-snowflake", label: "Heavy snow" },
        80: { icon: "fa-cloud-rain", label: "Rain showers" },
        81: { icon: "fa-cloud-rain", label: "Rain showers" },
        82: { icon: "fa-cloud-showers-heavy", label: "Violent showers" },
        95: { icon: "fa-bolt", label: "Thunderstorm" },
        96: { icon: "fa-bolt", label: "Thunderstorm + hail" },
        99: { icon: "fa-bolt", label: "Thunderstorm + hail" }
    };
    return map[code] || { icon: "fa-cloud", label: "Unknown" };
}

function dayName(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short" });
}

async function loadWeather(lat, lon, cityName) {
    weatherContent.innerHTML = `<div class="weather-loading"><i class="fas fa-spinner"></i>Fetching live weather…</div>`;
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
        const data = await fetch(url).then(r => r.json());

        const current = data.current;
        const daily = data.daily;
        const code = decodeWeatherCode(current.weather_code);

        let forecastHTML = "";
        for (let i = 0; i < 5; i++) {
            const fCode = decodeWeatherCode(daily.weather_code[i]);
            forecastHTML += `
                <div class="forecast-day">
                    <small>${i === 0 ? "Today" : dayName(daily.time[i])}</small>
                    <i class="fas ${fCode.icon}"></i>
                    <strong>${Math.round(daily.temperature_2m_max[i])}°</strong>
                </div>`;
        }

        weatherContent.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon"><i class="fas ${code.icon}"></i></div>
                <div class="weather-info">
                    <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
                    <div class="weather-city"><i class="fas fa-map-marker-alt" style="color:var(--red-light);font-size:0.8rem;margin-right:4px;"></i>${cityName}</div>
                    <div class="weather-desc">${code.label}</div>
                </div>
            </div>

            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-temperature-half"></i>
                    <span>${Math.round(current.temperature_2m)}°C</span>
                    <small>Temp</small>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-droplet"></i>
                    <span>${current.relative_humidity_2m}%</span>
                    <small>Humidity</small>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <span>${Math.round(current.wind_speed_10m)} km/h</span>
                    <small>Wind</small>
                </div>
            </div>

            <div class="weather-forecast">${forecastHTML}</div>
        `;
    } catch (err) {
        weatherContent.innerHTML = `<div class="weather-loading" style="color:var(--danger);"><i class="fas fa-exclamation-triangle" style="animation:none;color:var(--danger);"></i>Could not load weather. Check your connection and try again.</div>`;
    }
}

async function searchCity(city) {
    if (!city.trim()) return;
    weatherContent.innerHTML = `<div class="weather-loading"><i class="fas fa-spinner"></i>Searching for "${city}"…</div>`;
    try {
        const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`).then(r => r.json());
        if (!geo.results || !geo.results.length) {
            weatherContent.innerHTML = `<div class="weather-loading" style="color:var(--danger);"><i class="fas fa-search" style="animation:none;color:var(--danger);"></i>City "${city}" not found.</div>`;
            return;
        }
        const place = geo.results[0];
        const placeName = place.name + (place.country ? ", " + place.country : "");
        loadWeather(place.latitude, place.longitude, placeName);
    } catch (err) {
        weatherContent.innerHTML = `<div class="weather-loading" style="color:var(--danger);"><i class="fas fa-exclamation-triangle" style="animation:none;color:var(--danger);"></i>Search failed. Please try again.</div>`;
    }
}

loadWeather(-0.0917, 34.7680, "Kisumu, Kenya");
searchWeatherBtn.addEventListener("click", () => searchCity(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); searchCity(cityInput.value); }
});

/* =====================================================
   LIVE CALENDAR + DIGITAL CLOCK
===================================================== */
const calendarMonthEl = document.getElementById("calendarMonth");
const calendarGrid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const clockTimeEl = document.getElementById("clockTime");
const clockDateEl = document.getElementById("clockDate");

let viewDate = new Date();
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    calendarMonthEl.textContent = `${MONTHS[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

    let html = "";
    DAY_NAMES.forEach(d => html += `<div class="calendar-day-name">${d}</div>`);

    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dow = new Date(year, month, d).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isToday = isThisMonth && d === today.getDate();
        let classes = "calendar-day";
        if (isWeekend) classes += " weekend";
        if (isToday) classes += " today";
        html += `<div class="${classes}">${d}</div>`;
    }

    const totalCells = firstDay + daysInMonth;
    const remainder = totalCells % 7;
    if (remainder !== 0) {
        const trailing = 7 - remainder;
        for (let d = 1; d <= trailing; d++) {
            html += `<div class="calendar-day other-month">${d}</div>`;
        }
    }

    calendarGrid.innerHTML = html;
}

prevBtn.addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
nextBtn.addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });
renderCalendar();

function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h === 0 ? 12 : h;
    clockTimeEl.textContent = `${String(h).padStart(2, "0")}:${m}:${s} ${ampm}`;
    clockDateEl.textContent = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
updateClock();
setInterval(updateClock, 1000);

/* =====================================================
   CONTACT FORM
===================================================== */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.className = "form-message error";
        return;
    }
    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.className = "form-message error";
        return;
    }
    if (message.length < 10) {
        formMessage.textContent = "Your message should contain at least 10 characters.";
        formMessage.className = "form-message error";
        return;
    }

    formMessage.textContent = "Message validated successfully! Connect this form to a backend or email service to receive messages.";
    formMessage.className = "form-message success";
    contactForm.reset();
});

/* =====================================================
   THEME TOGGLE
===================================================== */
const themeToggle = document.getElementById("themeToggle");

function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    if (document.body.classList.contains("light")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light");
updateThemeIcon();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("portfolio-theme", theme);
    updateThemeIcon();
});

/* =====================================================
   BACK TO TOP + SCROLL PROGRESS
===================================================== */
const backTop = document.getElementById("backTop");
const progress = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 500);
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
    progress.style.width = percentage + "%";
});

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* =====================================================
   PARTICLES
===================================================== */
const particles = document.getElementById("particles");
const particleCount = window.innerWidth < 600 ? 15 : 30;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 8 + Math.random() * 15 + "s";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.opacity = 0.15 + Math.random() * 0.5;
    particles.appendChild(particle);
}

/* =====================================================
   CUSTOM CURSOR — THREE FOLLOWING CIRCLES
===================================================== */
(function initTripleCursor() {
    const isFinePointer = window.matchMedia("(pointer:fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReduced) return;

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorMid = document.querySelector(".cursor-mid");
    const cursorCircle = document.querySelector(".cursor-circle");
    if (!cursorDot || !cursorMid || !cursorCircle) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX, dotY = mouseY;
    let midX = mouseX, midY = mouseY;
    let ringX = mouseX, ringY = mouseY;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }, { passive: true });

   function animateCursor() {
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = dotX + "px";
        cursorDot.style.top = dotY + "px";

        midX += (mouseX - midX) * 0.20;
        midY += (mouseY - midY) * 0.20;
        cursorMid.style.left = midX + "px";
        cursorMid.style.top = midY + "px";

        ringX += (mouseX - ringX) * 0.10;
        ringY += (mouseY - ringY) * 0.10;
        cursorCircle.style.left = ringX + "px";
        cursorCircle.style.top = ringY + "px";

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll("a, button, input, .project-card, .skill-card").forEach(element => {
        element.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        element.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
})();