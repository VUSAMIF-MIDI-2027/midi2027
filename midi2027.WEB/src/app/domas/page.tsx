"use client";

import { useEffect, useReducer, useRef } from "react";
import Image from "next/image";
import domas from "../../../public/domas.jpg";

const SIZE = 16;
const SPEED = 150;

type Point = {
    x: number;
    y: number;
};

type Direction = "up" | "down" | "left" | "right";

type Game = {
    snake: Point[];
    food: Point | null;
    direction: Direction;
    turned: boolean;
    status: "ready" | "playing" | "over" | "won";
    score: number;
};

type Action =
    | { type: "start" }
    | { type: "turn"; direction: Direction }
    | { type: "tick"; random: number };

const vectors: Record<Direction, Point> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

const opposite: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
};

const controls: {
    direction: Direction;
    symbol: string;
    label: string;
    position: string;
}[] = [
    {
        direction: "up",
        symbol: "↑",
        label: "Aukštyn",
        position: "col-start-2 row-start-1",
    },
    {
        direction: "left",
        symbol: "←",
        label: "Kairėn",
        position: "col-start-1 row-start-2",
    },
    {
        direction: "down",
        symbol: "↓",
        label: "Žemyn",
        position: "col-start-2 row-start-2",
    },
    {
        direction: "right",
        symbol: "→",
        label: "Dešinėn",
        position: "col-start-3 row-start-2",
    },
];

function initialGame(): Game {
    return {
        snake: [
            { x: 5, y: 8 },
            { x: 4, y: 8 },
            { x: 3, y: 8 },
        ],
        food: { x: 11, y: 8 },
        direction: "right",
        turned: false,
        status: "ready",
        score: 0,
    };
}

function samePosition(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
}

function createFood(snake: Point[], random: number): Point | null {
    const empty: Point[] = [];

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const occupied = snake.some(
                (part) => part.x === x && part.y === y
            );

            if (!occupied) {
                empty.push({ x, y });
            }
        }
    }

    if (empty.length === 0) return null;

    return empty[Math.floor(random * empty.length)];
}

function reducer(game: Game, action: Action): Game {
    if (action.type === "start") {
        return {
            ...initialGame(),
            status: "playing",
        };
    }

    if (game.status !== "playing") return game;

    if (action.type === "turn") {
        // Leidžiame vieną posūkį per žingsnį ir neleidžiame
        // apsisukti tiesiai į savo kūną.
        if (
            game.turned ||
            action.direction === game.direction ||
            action.direction === opposite[game.direction]
        ) {
            return game;
        }

        return {
            ...game,
            direction: action.direction,
            turned: true,
        };
    }

    const vector = vectors[game.direction];

    const head: Point = {
        x: game.snake[0].x + vector.x,
        y: game.snake[0].y + vector.y,
    };

    const eating =
        game.food !== null && samePosition(head, game.food);

    // Nevalgant paskutinis uodegos langelis atsilaisvina.
    const body = eating
        ? game.snake
        : game.snake.slice(0, -1);

    const hitWall =
        head.x < 0 ||
        head.y < 0 ||
        head.x >= SIZE ||
        head.y >= SIZE;

    const hitBody = body.some((part) => samePosition(part, head));

    if (hitWall || hitBody) {
        return {
            ...game,
            status: "over",
        };
    }

    const snake = [head, ...body];

    const food = eating
        ? createFood(snake, action.random)
        : game.food;

    return {
        ...game,
        snake,
        food,
        turned: false,
        score: game.score + (eating ? 1 : 0),
        status: food === null ? "won" : "playing",
    };
}

function positionStyle(point: Point) {
    return {
        left: `${(point.x / SIZE) * 100}%`,
        top: `${(point.y / SIZE) * 100}%`,
        width: `${100 / SIZE}%`,
        height: `${100 / SIZE}%`,
    };
}

export default function DomasPage() {
    const [game, dispatch] = useReducer(
        reducer,
        undefined,
        initialGame
    );

    const touchStart = useRef<Point | null>(null);

    useEffect(() => {
        if (game.status !== "playing") return;

        const timer = window.setInterval(() => {
            dispatch({
                type: "tick",
                random: Math.random(),
            });
        }, SPEED);

        return () => window.clearInterval(timer);
    }, [game.status]);

    useEffect(() => {
        if (game.status !== "playing") return;

        const keys: Record<string, Direction> = {
            arrowup: "up",
            arrowdown: "down",
            arrowleft: "left",
            arrowright: "right",
            w: "up",
            s: "down",
            a: "left",
            d: "right",
        };

        function handleKey(event: KeyboardEvent) {
            const target = event.target;

            if (
                target instanceof HTMLElement &&
                (
                    target.isContentEditable ||
                    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
                )
            ) {
                return;
            }

            const direction = keys[event.key.toLowerCase()];

            if (!direction) return;

            event.preventDefault();

            dispatch({
                type: "turn",
                direction,
            });
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [game.status]);

    function startGame() {
        touchStart.current = null;
        dispatch({ type: "start" });
    }

    return (
        <main className="flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center bg-zinc-950 px-4 py-6 text-white sm:py-10">
            <div className="w-full max-w-[520px]">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-red-400 sm:text-xs">
                            MIDI mini žaidimai
                        </p>

                        <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                            DOMAS SNAKE
                        </h1>

                        <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
                            Domas alkanas. Surink 🇵🇱!
                        </p>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-center sm:px-5 sm:py-3">
                        <p className="text-[10px] font-bold tracking-widest text-zinc-400">
                            TAŠKAI
                        </p>

                        <p className="text-3xl font-black tabular-nums">
                            {game.score}
                        </p>
                    </div>
                </div>

                <div
                    role="group"
                    aria-label="Snake žaidimo lenta"
                    className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #ffffff07 1px, transparent 1px), linear-gradient(to bottom, #ffffff07 1px, transparent 1px)",
                        backgroundSize: `${100 / SIZE}% ${100 / SIZE}%`,
                    }}
                    onTouchStart={(event) => {
                        if (
                            game.status !== "playing" ||
                            event.touches.length !== 1
                        ) {
                            touchStart.current = null;
                            return;
                        }

                        const touch = event.touches[0];

                        touchStart.current = {
                            x: touch.clientX,
                            y: touch.clientY,
                        };
                    }}
                    onTouchEnd={(event) => {
                        const start = touchStart.current;
                        touchStart.current = null;

                        if (!start || game.status !== "playing") return;

                        const touch = event.changedTouches[0];
                        if (!touch) return;

                        const dx = touch.clientX - start.x;
                        const dy = touch.clientY - start.y;

                        if (Math.max(Math.abs(dx), Math.abs(dy)) < 15) {
                            return;
                        }

                        let direction: Direction;

                        if (Math.abs(dx) > Math.abs(dy)) {
                            direction = dx > 0 ? "right" : "left";
                        } else {
                            direction = dy > 0 ? "down" : "up";
                        }

                        dispatch({
                            type: "turn",
                            direction,
                        });
                    }}
                    onTouchCancel={() => {
                        touchStart.current = null;
                    }}
                >
                    {game.food && (
                        <div
                            className="pointer-events-none absolute flex items-center justify-center text-lg leading-none sm:text-2xl"
                            style={{
                                ...positionStyle(game.food),
                                fontFamily:
                                    '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                            }}
                            role="img"
                            aria-label="Maistas: Lenkijos vėliava"
                        >
                            🇵🇱
                        </div>
                    )}

                    {game.snake.map((part, index) => (
                        <div
                            key={`${part.x}-${part.y}`}
                            className={`pointer-events-none absolute p-[1px] sm:p-[2px] ${
                                index === 0 ? "z-10" : ""
                            }`}
                            style={positionStyle(part)}
                        >
                            {index === 0 ? (
                                <div className="relative h-full w-full overflow-hidden rounded-md ring-2 ring-white">
                                    <Image
                                        src={domas}
                                        alt="Domo veidas"
                                        fill
                                        sizes="34px"
                                        draggable={false}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`h-full w-full rounded-md ${
                                        index % 2 === 0
                                            ? "bg-red-500"
                                            : "bg-white"
                                    }`}
                                />
                            )}
                        </div>
                    ))}

                    {game.status !== "playing" && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 p-5 text-center backdrop-blur-sm">
                            <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-2xl ring-4 ring-red-500 sm:h-24 sm:w-24">
                                <Image
                                    src={domas}
                                    alt="Domas"
                                    fill
                                    sizes="96px"
                                    draggable={false}
                                    className="object-cover"
                                />
                            </div>

                            <h2 className="text-2xl font-black sm:text-3xl">
                                {game.status === "ready"
                                    ? "Domas alkanas."
                                    : game.status === "won"
                                      ? "Visos vėliavos surinktos!"
                                      : "Domas atsitrenkė."}
                            </h2>

                            <p className="mb-5 mt-2 text-sm text-zinc-300">
                                {game.status === "ready"
                                    ? "Pamaitink jį 🇵🇱"
                                    : `Surinkta vėliavų: ${game.score}`}
                            </p>

                            <button
                                type="button"
                                onClick={startGame}
                                className="min-h-12 cursor-pointer rounded-xl bg-red-600 px-7 py-3 font-bold transition hover:bg-red-500 active:scale-95"
                            >
                                {game.status === "ready"
                                    ? "Pradėti žaidimą"
                                    : "Bandyti dar kartą"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-4 text-center text-xs text-zinc-400 sm:text-sm">
                    <p>Telefone brauk per lentą arba spausk rodykles.</p>
                    <p className="mt-1 text-zinc-500">
                        Kompiuteryje: rodyklės arba W A S D.
                    </p>
                </div>

                <div className="mx-auto mt-4 grid w-fit grid-cols-3 gap-2">
                    {controls.map((control) => (
                        <button
                            key={control.direction}
                            type="button"
                            aria-label={control.label}
                            disabled={game.status !== "playing"}
                            onPointerDown={(event) => {
                                if (
                                    event.pointerType === "mouse" &&
                                    event.button !== 0
                                ) {
                                    return;
                                }

                                event.preventDefault();

                                dispatch({
                                    type: "turn",
                                    direction: control.direction,
                                });
                            }}
                            onClick={(event) => {
                                // Valdymas klaviatūra ir pagalbinėmis priemonėmis.
                                if (event.detail === 0) {
                                    dispatch({
                                        type: "turn",
                                        direction: control.direction,
                                    });
                                }
                            }}
                            className={`${control.position} h-14 w-16 touch-none select-none rounded-xl border border-zinc-700 bg-zinc-800 text-2xl font-bold transition hover:bg-zinc-700 active:bg-red-600 disabled:opacity-30`}
                        >
                            {control.symbol}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}