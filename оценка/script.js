const sliders = document.querySelectorAll('input[type="range"]');
const calcBtn = document.getElementById('calcBtn');
const exportBtn = document.getElementById('exportBtn');
const totalScoreDisplay = document.getElementById('totalScore');
const resultArea = document.getElementById('resultArea');
const historyList = document.getElementById('historyList');

// Память для истории
let evaluations = JSON.parse(localStorage.getItem('animeRates')) || [];

// Обновление интерфейса истории
function renderHistory() {
    historyList.innerHTML = '';
    evaluations.slice().reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <b>${item.name}</b>
            <div class="score-badge" style="color: ${item.color}">${item.score}</div>
        `;
        historyList.appendChild(div);
    });
}

// Заполнение цвета ползунков
function updateSliderColor(slider) {
    const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #2563EB ${percent}%, #cbd5e1 ${percent}%)`;
}

// Инициализация ползунков
sliders.forEach(slider => {
    slider.addEventListener('input', () => {
        document.getElementById(slider.id + 'Val').textContent = slider.value;
        updateSliderColor(slider);
    });
    updateSliderColor(slider);
});

// Логика расчета
calcBtn.addEventListener('click', () => {
    const name = document.getElementById('titleInput').value.trim() || "Без названия";
    let sum = 0;
    sliders.forEach(s => sum += parseFloat(s.value));
    
    const finalScore = sum * 2;
    let statusColor = "#ef4444"; // Красный (<50)
    if (finalScore >= 80) statusColor = "#10b981"; // Зеленый
    else if (finalScore >= 50) statusColor = "#2563EB"; // Синий

    // Показываем результат
    resultArea.classList.remove('hidden');
    totalScoreDisplay.textContent = finalScore;
    totalScoreDisplay.style.color = statusColor;

    // Сохраняем
    const entry = { name, score: finalScore, color: statusColor, date: new Date().toISOString() };
    evaluations.push(entry);
    localStorage.setItem('animeRates', JSON.stringify(evaluations));
    
    renderHistory();
    resultArea.scrollIntoView({ behavior: 'smooth' });
});

// Продвинутый экспорт в JSON-файл
exportBtn.addEventListener('click', () => {
    if (evaluations.length === 0) return alert("История пуста!");
    
    const dataStr = JSON.stringify(evaluations, null, 4);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "my_evaluations.json";
    link.click();
    
    URL.revokeObjectURL(url); // Очистка памяти
});

// Первый запуск
renderHistory();