async function fetchSortSteps(numbers) {
    const response = await fetch("/api/visualize/sort", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            array: numbers,
            algorithm: "bubble"
        })
    });

    if (!response.ok) {
        throw new Error("Ошибка сервера");
    }

    const data = await response.json();
    return data; // массив шагов
}

document.addEventListener("DOMContentLoaded", () => {
    const arrayInput = document.getElementById("array-input");
    const visualizeBtn = document.getElementById("visualize-btn");

    visualizeBtn.addEventListener("click", async () => {
        const raw = arrayInput.value;
        const numbers = raw
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
            .map(Number);

        if (numbers.some(n => Number.isNaN(n))) {
            alert("Пожалуйста, введите только числа, разделённые запятыми.");
            return;
        }

        try {
            const steps = await fetchSortSteps(numbers);
            console.log("Получены шаги:", steps);
            function renderArrayStep(step, container) {
                const { array, compare, swap } = step;
                const maxVal = Math.max(...array, 1);

                container.innerHTML = "";

                array.forEach((value, index) => {
                    const bar = document.createElement("div");
                    bar.className = "bar";

                    const heightPercent = (value / maxVal) * 100;
                    bar.style.height = `${heightPercent}%`;

                    // Подсветка сравниваемых элементов
                    if (compare && compare.includes(index)) {
                        bar.classList.add("bar-compare");
                    }

                    // Подсветка меняющихся элементов
                    if (swap && swap.includes(index)) {
                        bar.classList.add("bar-swap");
                    }

                    container.appendChild(bar);
                });
            }

            document.addEventListener("DOMContentLoaded", () => {
                const arrayInput = document.getElementById("array-input");
                const visualizeBtn = document.getElementById("visualize-btn");
                const vizContainer = document.getElementById("visualization-container");

                let steps = [];
                let currentIndex = 0;
                let playing = false;
                let timerId = null;
                let speed = 500;

                const playBtn = document.getElementById("play-btn");
                const pauseBtn = document.getElementById("pause-btn");
                const stepBtn = document.getElementById("step-btn");
                const speedRange = document.getElementById("speed-range");

                speedRange.addEventListener("input", () => {
                    speed = Number(speedRange.value);
                    if (playing) {
                        clearInterval(timerId);
                        startPlaying();
                    }
                });

                function showStep(index) {
                    if (!steps.length) return;
                    currentIndex = Math.min(Math.max(index, 0), steps.length - 1);
                    renderArrayStep(steps[currentIndex], vizContainer);
                }

                function startPlaying() {
                    playing = true;
                    timerId = setInterval(() => {
                        if (currentIndex >= steps.length - 1) {
                            clearInterval(timerId);
                            playing = false;
                            return;
                        }
                        showStep(currentIndex + 1);
                    }, speed);
                }

                function pausePlaying() {
                    playing = false;
                    if (timerId) {
                        clearInterval(timerId);
                        timerId = null;
                    }
                }

                playBtn.addEventListener("click", () => {
                    if (!steps.length) return;
                    if (!playing) {
                        startPlaying();
                    }
                });

                pauseBtn.addEventListener("click", () => {
                    pausePlaying();
                });

                stepBtn.addEventListener("click", () => {
                    pausePlaying();
                    if (!steps.length) return;
                    if (currentIndex < steps.length - 1) {
                        showStep(currentIndex + 1);
                    }
                });

                visualizeBtn.addEventListener("click", async () => {
                    const raw = arrayInput.value;
                    const numbers = raw
                        .split(",")
                        .map(s => s.trim())
                        .filter(s => s !== "")
                        .map(Number);

                    if (numbers.some(n => Number.isNaN(n))) {
                        alert("Пожалуйста, введите только числа, разделённые запятыми.");
                        return;
                    }

                    try {
                        const resSteps = await fetchSortSteps(numbers);
                        steps = resSteps;
                        currentIndex = 0;
                        showStep(0);
                    } catch (err) {
                        console.error(err);
                        alert("Ошибка при запросе к серверу.");
                    }
                });
            });
        } catch (err) {
            console.error(err);
            alert("Произошла ошибка при запросе к серверу.");
        }
    });
});