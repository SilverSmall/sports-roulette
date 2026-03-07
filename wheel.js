// Wrap the entire script in an IIFE to create a private scope
(function() {
    // Add a guard to prevent re-declaration if the script is run multiple times
    if (window.rouletteWheelAppInitialized) {
        console.warn("wheel.js is already initialized. Skipping re-initialization.");
        return; // This return is now inside the IIFE, so it's valid
    }
    window.rouletteWheelAppInitialized = true;

    // --------- Налаштування -----------------

    // Оновлена структура даних для вправ з категоріями
    const defaultExercises = {
        legs: [
            "Присідання", "Випади", "Присідання-Пліє", "Стрибки", "Випади назад"
        ],
        arms_chest: [
            "Віджимання", "Віджимання від лавки", "Планка з переходом на руки", "Віджимання від колін", "Зворотні віджимання"
        ],
        core: [
            "Прес", "Планка", "Велосипед", "Скручування", "Планка з підняттям рук", "Махи ногами"
        ],
        cardio: [
            "Бурпі", "Стрибки на скакалці", "Стрибки з зіркою", "Біг на місці"
        ]
    };
    const superExercise = "Супер-вправа (30 сек макс. темп!)";
    const motivational = [
        "Ти зможеш більше, ніж думаєш!", "Ти молодець!", "Зроби ще крок до своєї цілі!",
        "Відпочинок — теж частина успіху!", "Сила в тобі!", "Залишайся на хвилі мотивації!",
        "Твої зусилля дають результат!", "Жоден підхід не марний!"
    ];
    const levels = {
        easy: { min: 15, max: 25, plankMin: 10, plankMax: 15 },
        medium: { min: 25, max: 40, plankMin: 20, plankMax: 30 },
        hard: { min: 35, max: 60, plankMin: 40, plankMax: 60 }
    };

    const langStrings = {
        uk: {
            level_label: "Рівень:",
            easy: "Легкий", medium: "Середній", hard: "Важкий", custom: "Свій",
            reps: "повторень",
            lang_label: "Мова:",
            theme_label: "Тема:",
            press_spin: 'Натисни "Крутити!"',
            play: '▶',
            history: "Історія",
            ex_list: "Список вправ",
            spin_btn: "Крутити!",
            new_ex_placeholder: "Назва вправи",
            add_ex: "Додати",
            back_to_wheel: "Назад до колеса",
            reset_ex: "Скинути до стандартних",
            clear_history: "Очистити історію",
            timer_start: "Старт таймер",
            timer_done: "Готово!",
            custom_confirm_reset: "Ви впевнені, що хочете скинути всі вправи до стандартних?",
            custom_confirm_clear_history: "Ви впевнені, що хочете очистити історію?",
            confirm_yes: "Так",
            confirm_no: "Ні",
            category_label: "Категорія:",
            all_exercises: "Всі",
            category_legs: "Ноги",
            category_arms_chest: "Руки/Груди",
            category_core: "Корпус",
            category_cardio: "Кардіо",
            skin_label: "Скін рулетки:",
            upload_image: "Завантажити фото/GIF",
            clear_skin: "Очистити",
            ex_description: "Ви можете додавати або видаляти вправи.",
            no_exercises_in_category: "Немає вправ для обраної категорії!",
            history_empty: "Історія порожня.",
            paste_url_placeholder: "Або вставте посилання на GIF/фото",
            apply_url: "Застосувати URL",
            saved_skins_title: "Збережені скіни:",
            skins_management: "Керування скінами",
            skins_management_description: "Тут ви можете керувати збереженими скінами для рулетки."
        },
        en: {
            level_label: "Level:",
            easy: "Easy", medium: "Medium", hard: "Hard", custom: "Custom",
            reps: "reps",
            lang_label: "Language:",
            theme_label: "Theme:",
            press_spin: 'Press "Spin!"',
            play: '▶',
            history: "History",
            ex_list: "Exercise list",
            spin_btn: "Spin!",
            new_ex_placeholder: "Exercise name",
            add_ex: "Add",
            back_to_wheel: "Back to Wheel",
            reset_ex: "Reset to default",
            clear_history: "Clear history",
            timer_start: "Start timer",
            timer_done: "Done!",
            custom_confirm_reset: "Are you sure you want to reset all exercises to default?",
            custom_confirm_clear_history: "Are you sure you want to clear the history?",
            confirm_yes: "Yes",
            confirm_no: "No",
            category_label: "Category:",
            all_exercises: "All",
            category_legs: "Legs",
            category_arms_chest: "Arms/Chest",
            category_core: "Core",
            category_cardio: "Cardio",
            skin_label: "Roulette skin:",
            upload_image: "Upload photo/GIF",
            clear_skin: "Clear",
            ex_description: "You can add or remove exercises.",
            no_exercises_in_category: "No exercises for the selected category!",
            history_empty: "History is empty.",
            paste_url_placeholder: "Or paste GIF/photo URL",
            apply_url: "Apply URL",
            saved_skins_title: "Saved Skins:",
            skins_management: "Manage Skins",
            skins_management_description: "Here you can manage your saved roulette skins."
        }
    };

    // --------- Отримання DOM-елементів -----------------
    const wheelCanvas = document.getElementById('wheel');
    if (!wheelCanvas) {
        console.error("Error: Canvas element with ID 'wheel' not found! Please ensure your index.html has <canvas id=\"wheel\"></canvas>");
    }
    const ctx = wheelCanvas ? wheelCanvas.getContext('2d') : null;
    if (!ctx && wheelCanvas) {
        console.error("Error: Could not get 2D rendering context for canvas!");
    }

    const spinBtn = document.getElementById('spin-btn');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const repsText = document.getElementById('reps-text');
    const levelSelect = document.getElementById('level');
    const langSelect = document.getElementById('lang-select');
    const themeSelect = document.getElementById('theme-select');
    const newExInput = document.getElementById('new-ex-input');
    const newExCategorySelect = document.getElementById('new-ex-category');
    const addExBtn = document.getElementById('addExBtn');
    const resetExBtn = document.getElementById('resetExBtn');
    const exercisesList = document.getElementById('exercises-list');
    const historyList = document.getElementById('history');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('section');
    const backToWheelBtns = document.querySelectorAll('.back-to-wheel-btn');
    const mainContentElements = document.querySelectorAll('.main-content > div:not(#settings), .main-content > button, .main-content > div:not(#settings) > p');
    const mainTitle = document.getElementById('main-title');

    const fullscreenTimer = document.getElementById('fullscreen-timer');
    const timerDisplay = document.getElementById('fullscreen-timer-display');
    const timerStartBtn = document.getElementById('timer-start-btn');
    const timerDoneBtn = document.getElementById('timer-done-btn');
    const fullscreenTimerExercise = document.getElementById('fullscreen-timer-exercise');
    const fullscreenTimerMotivation = document.getElementById('fullscreen-timer-motivation');
    const customConfirm = document.getElementById('custom-confirm');
    const customConfirmText = document.getElementById('custom-confirm-text');
    const customConfirmYes = document.getElementById('custom-confirm-yes');
    const customConfirmNo = document.getElementById('custom-confirm-no');
    const categorySelect = document.getElementById('category');
    const skinInput = document.getElementById('skin-input');
    const skinUploadBtn = document.getElementById('skin-upload-btn');
    const skinClearBtn = document.getElementById('skin-clear-btn');
    const customSkinContainer = document.getElementById('custom-skin-container');
    const customSkinImage = document.getElementById('custom-skin-image');
    const skinUrlInput = document.getElementById('skin-url-input');
    const skinApplyUrlBtn = document.getElementById('skin-apply-url-btn');
    const savedSkinsList = document.getElementById('saved-skins-list');

    const settingsAndControls = document.querySelector('.settings-and-controls');
    const actionButtons = document.querySelector('.action-buttons');


    let isSpinning = false;
    let currentLang = localStorage.getItem('lang') || 'uk';
    let currentTheme = localStorage.getItem('theme') || 'light';
    let userExercises = {};
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let savedSkins = JSON.parse(localStorage.getItem('savedSkins')) || [];
    let spinTimeout;
    let timerTimeout;
    let timerRunning = false;
    let currentExercise;
    let currentReps;
    let customSkinURL = localStorage.getItem('customSkinURL') || '';

    function getCssVariable(variableName, defaultValue = '#000000') {
        try {
            const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
            if (!value) {
                console.warn(`CSS variable ${variableName} is empty or not found. Using default: ${defaultValue}`);
                return defaultValue;
            }
            console.log(`Getting CSS variable: ${variableName}, Value: ${value}`);
            return value;
        } catch (e) {
            console.error(`Error getting CSS variable ${variableName}:`, e);
            return defaultValue;
        }
    }

    // --------- Функції рендерингу -----------------

    function drawWheel(exercisesToDraw) {
        if (!ctx) {
            console.error("drawWheel: Canvas rendering context is not available.");
            return;
        }

        const numExercises = exercisesToDraw.length;
        const arc = (2 * Math.PI) / numExercises;
        const radius = wheelCanvas.width / 2;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

        if (numExercises === 0) {
            ctx.fillStyle = getCssVariable('--text-color', '#000000');
            ctx.font = 'bold 20px Segoe UI';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(langStrings[currentLang].no_exercises_in_category, radius, radius);
            console.log("No exercises to draw. Displaying message.");
            return;
        }

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(-Math.PI / 2); // Rotate by -90 degrees (counter-clockwise) to align 0-radian with 12 o'clock
        ctx.translate(-radius, -radius);

        for (let i = 0; i < numExercises; i++) {
            const angle = i * arc;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, angle, angle + arc);
            ctx.lineTo(radius, radius);

            const fillColor = getCssVariable(`--wheel-sector-${(i % 5) + 1}`, '#CCCCCC');
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.save();

            const textRadius = radius * 0.7;
            ctx.translate(
                radius + Math.cos(angle + arc / 2) * textRadius,
                radius + Math.sin(angle + arc / 2) * textRadius
            );
            ctx.rotate(angle + arc / 2); // Keep text vertical relative to sector
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textColor = getCssVariable('--wheel-text-color', '#000000');
            ctx.fillStyle = textColor;
            ctx.font = 'bold 16px Segoe UI';

            const maxTextWidth = radius * 0.6;
            let text = exercisesToDraw[i];
            if (ctx.measureText(text).width > maxTextWidth) {
                let tempText = '';
                for (let j = 0; j < text.length; j++) {
                    if (ctx.measureText(tempText + text[j] + '...').width < maxTextWidth) {
                        tempText += text[j];
                    } else {
                        text = tempText + '...';
                        break;
                    }
                }
            }
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }

    function renderExercises() {
        if (!exercisesList) {
            console.error("renderExercises: exercisesList element not found.");
            return;
        }
        exercisesList.innerHTML = '';
        const allExercises = getAllExercisesWithCategories();
        allExercises.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.exercise} (${langStrings[currentLang][`category_${item.category}`] || item.category})`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', () => {
                const confirmMsg = currentLang === 'uk' ? `Видалити вправу "${item.exercise}"?` : `Delete exercise "${item.exercise}"?`;
                showCustomConfirm(confirmMsg, () => {
                    removeExercise(item.exercise, item.category);
                });
            });
            li.appendChild(removeBtn);
            exercisesList.appendChild(li);
        });
    }

    function renderHistory() {
        if (!historyList) {
            console.error("renderHistory: historyList element not found.");
            return;
        }
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = `<li class="history-empty-message">${langStrings[currentLang].history_empty}</li>`;
            return;
        }
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.exercise}: ${item.reps}`;
            historyList.appendChild(li);
        });
    }

    function renderSavedSkins() {
        if (!savedSkinsList) {
            console.error("renderSavedSkins: savedSkinsList element not found.");
            return;
        }
        savedSkinsList.innerHTML = '';
        if (savedSkins.length === 0) {
            savedSkinsList.innerHTML = `<li style="text-align: center; width: 100%; color: var(--text-color-light);">Немає збережених скінів.</li>`;
            return;
        }
        savedSkins.forEach(skinUrl => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = skinUrl;
            img.alt = "Saved Skin";
            img.onerror = () => {
                img.src = 'https://placehold.co/100x100/cccccc/000000?text=Error';
                img.alt = "Error loading image";
            };

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('skin-actions');

            const loadBtn = document.createElement('button');
            loadBtn.textContent = langStrings[currentLang].play;
            loadBtn.classList.add('secondary-btn');
            loadBtn.style.padding = '5px 10px';
            loadBtn.style.fontSize = '0.8em';
            loadBtn.addEventListener('click', () => {
                customSkinURL = skinUrl;
                localStorage.setItem('customSkinURL', customSkinURL);
                applyCustomSkin();
            });

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.classList.add('danger-btn');
            removeBtn.style.padding = '5px 10px';
            removeBtn.style.fontSize = '0.8em';
            removeBtn.addEventListener('click', () => {
                const confirmMsg = currentLang === 'uk' ? "Видалити цей скін?" : "Delete this skin?";
                showCustomConfirm(confirmMsg, () => {
                    removeSavedSkin(skinUrl);
                });
            });

            actionsDiv.appendChild(loadBtn);
            actionsDiv.appendChild(removeBtn);
            li.appendChild(img);
            li.appendChild(actionsDiv);
            savedSkinsList.appendChild(li);
        });
    }


    // --------- Логіка збереження та завантаження -----------------

    function loadExercises() {
        try {
            // Start with a clean copy of default exercises to ensure all categories are arrays
            userExercises = JSON.parse(JSON.stringify(defaultExercises));

            const savedExercises = JSON.parse(localStorage.getItem('exercises'));

            if (savedExercises) {
                // Iterate over the saved exercises and merge them into the default structure
                for (const category in savedExercises) {
                    if (savedExercises.hasOwnProperty(category) && Array.isArray(savedExercises[category])) {
                        // If the category exists in default and the saved data for it is an array
                        if (userExercises.hasOwnProperty(category)) {
                            // Filter out duplicates and add new exercises
                            const existingExercises = new Set(userExercises[category]);
                            savedExercises[category].forEach(ex => {
                                if (typeof ex === 'string' && ex.trim() !== '' && !existingExercises.has(ex)) {
                                    userExercises[category].push(ex);
                                    existingExercises.add(ex); // Add to set to prevent future duplicates in this session
                                }
                            });
                        } else {
                            // If it's a new category not in default, add it if it's an array of strings
                            // Ensure exercises are strings and not empty
                            userExercises[category] = savedExercises[category].filter(ex => typeof ex === 'string' && ex.trim() !== '');
                        }
                    } else {
                        console.warn(`Skipping malformed saved exercise category: ${category}. Expected an array.`);
                    }
                }
            }

            const savedSkin = localStorage.getItem('customSkinURL');
            if (savedSkin) {
                customSkinURL = savedSkin;
                applyCustomSkin();
            }
            savedSkins = JSON.parse(localStorage.getItem('savedSkins')) || [];
            renderSavedSkins();

            console.log("Exercises loaded:", userExercises);
        } catch (e) {
            console.error("Error loading exercises from localStorage:", e);
            // Fallback to default exercises if parsing or any other error occurs during loading
            userExercises = JSON.parse(JSON.stringify(defaultExercises));
        }
    }

    function saveExercises() {
        try {
            localStorage.setItem('exercises', JSON.stringify(userExercises));
            console.log("Exercises saved:", userExercises);
        } catch (e) {
            console.error("Error saving exercises to localStorage:", e);
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem('history', JSON.stringify(history));
            console.log("History saved:", history);
        } catch (e) {
            console.error("Error saving history to localStorage:", e);
        }
    }

    function saveSavedSkins() {
        try {
            localStorage.setItem('savedSkins', JSON.stringify(savedSkins));
            console.log("Saved skins saved:", savedSkins);
        } catch (e) {
            console.error("Error saving saved skins to localStorage:", e);
        }
    }


    // --------- Логіка програми -----------------

    function getAllExercisesWithCategories() {
        const all = [];
        for (const category in userExercises) {
            if (userExercises.hasOwnProperty(category)) { // Ensure it's not a prototype property
                // Ensure userExercises[category] is an array before calling forEach
                if (Array.isArray(userExercises[category])) {
                    userExercises[category].forEach(ex => {
                        all.push({ exercise: ex, category: category });
                    });
                } else {
                    console.warn(`Category "${category}" in userExercises is not an array. Skipping.`);
                }
            }
        }
        return all;
    }

    function getExercisesForSpin() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory === 'all') {
            return getAllExercisesWithCategories().map(item => item.exercise);
        }
        // Ensure userExercises[selectedCategory] is an array before returning
        return Array.isArray(userExercises[selectedCategory]) ? userExercises[selectedCategory] : [];
    }

    function spinWheel() {
        if (isSpinning) return;
        isSpinning = true;
        if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.style.opacity = 0.7;
        }

        const exercisesToSpin = getExercisesForSpin();
        if (exercisesToSpin.length === 0) {
            if (resultText) resultText.textContent = langStrings[currentLang].no_exercises_in_category;
            if (repsText) repsText.textContent = "";
            isSpinning = false;
            if (spinBtn) {
                spinBtn.disabled = false;
                spinBtn.style.opacity = 1;
            }
            return;
        }

        const numExercises = exercisesToSpin.length;
        const arc = (2 * Math.PI) / numExercises;
        const spinTime = 5000;
        const startTime = performance.now();

        // Choose a random winning index first
        const targetWinningIndex = Math.floor(Math.random() * numExercises);
        const winningExercise = exercisesToSpin[targetWinningIndex];

        // Calculate the exact angle to stop at, so the center of the winning sector is at 12 o'clock.
        // The center of sector `targetWinningIndex` is at `targetWinningIndex * arc + arc / 2` (clockwise from 12 o'clock).
        // Since the wheel rotates counter-clockwise, the wheel needs to rotate by this amount.
        let targetRotation = (targetWinningIndex * arc + arc / 2);

        // Add several full rotations to ensure a smooth, visible spin
        const numFullSpins = 5; // Spin at least 5 full rotations
        targetRotation += numFullSpins * (2 * Math.PI);

        // NEW: Apply a small visual correction offset (in radians)
        // This value might need fine-tuning based on visual inspection.
        // A positive value means rotating more counter-clockwise.
        // A negative value means rotating less counter-clockwise (or more clockwise).
        const visualCorrectionOffset = -0.05; // Example: a small negative offset (clockwise shift)
        targetRotation += visualCorrectionOffset;


        function animate() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / spinTime, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            // Calculate current rotation towards the targetRotation
            const currentRotation = easeOut * targetRotation;
            if (wheelCanvas) wheelCanvas.style.transform = `rotate(-${currentRotation}rad)`;

            if (progress < 1) {
                spinTimeout = requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                if (spinBtn) {
                    spinBtn.disabled = false;
                    spinBtn.style.opacity = 1;
                }
                displayResult(winningExercise); // Display the pre-determined winning exercise
            }
        }
        animate();
    }

    function displayResult(exercise) {
        let reps;
        const level = levelSelect.value;
        if (exercise.includes("Планка") || exercise.includes("сек") || exercise.includes("Plank") || exercise.includes("sec")) {
            const { plankMin, plankMax } = levels[level];
            const duration = (exercise === superExercise) ? 30 : Math.floor(Math.random() * (plankMax - plankMin + 1)) + plankMin;
            reps = `${duration} сек`;
        } else {
            const { min, max } = levels[level];
            reps = `${Math.floor(Math.random() * (max - min + 1)) + min} ${langStrings[currentLang].reps}`;
        }
        if (resultText) resultText.textContent = exercise;
        if (repsText) repsText.textContent = reps;

        history.unshift({ exercise: exercise, reps: reps });
        if (history.length > 50) {
            history.pop();
        }
        saveHistory();
        renderHistory();

        if (reps.includes("сек") || reps.includes("sec")) {
            startTimer(reps, exercise);
        }
    }

    // --------- Управління вправами -----------------

    function addExercise() {
        const newEx = newExInput.value.trim();
        const newExCategory = newExCategorySelect.value;
        if (newEx && newExCategory) {
            const allExercises = getAllExercisesWithCategories().map(item => item.exercise);
            if (!allExercises.includes(newEx)) {
                if (!userExercises[newExCategory]) {
                    userExercises[newExCategory] = [];
                }
                userExercises[newExCategory].push(newEx);
                saveExercises();
                renderExercises();
                const exercisesToDraw = getExercisesForSpin();
                drawWheel(exercisesToDraw);
                newExInput.value = '';
            } else {
                showCustomConfirm("Ця вправа вже є у списку!", () => {});
            }
        }
    }

    function removeExercise(exerciseToRemove, categoryToRemove) {
        if (userExercises[categoryToRemove]) {
            const index = userExercises[categoryToRemove].indexOf(exerciseToRemove);
            if (index > -1) {
                userExercises[categoryToRemove].splice(index, 1);
                saveExercises();
                renderExercises();
                const exercisesToDraw = getExercisesForSpin();
                drawWheel(exercisesToDraw);
            }
        }
    }

    function resetExercises() {
        userExercises = JSON.parse(JSON.stringify(defaultExercises));
        saveExercises();
        renderExercises();
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    }

    // --------- Управління скінами (новий функціонал) -----------------

    function applyCustomSkin() {
        if (customSkinImage) {
            if (customSkinURL) {
                customSkinImage.src = customSkinURL;
                customSkinImage.style.display = 'block';
            } else {
                customSkinImage.style.display = 'none';
                customSkinImage.src = '';
            }
        } else {
            console.warn("customSkinImage element not found for applyCustomSkin.");
        }
    }

    function addSavedSkin(url) {
        if (!savedSkins.includes(url)) {
            savedSkins.unshift(url);
            if (savedSkins.length > 10) {
                savedSkins.pop();
            }
            saveSavedSkins();
            renderSavedSkins();
        }
    }

    function removeSavedSkin(urlToRemove) {
        savedSkins = savedSkins.filter(url => url !== urlToRemove);
        saveSavedSkins();
        renderSavedSkins();
        if (customSkinURL === urlToRemove) {
            customSkinURL = '';
            localStorage.removeItem('customSkinURL');
            applyCustomSkin();
        }
    }

    // --------- Інші функції -----------------

    function setLang(lang) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.dataset.lang;
            if (langStrings[lang] && langStrings[lang][key]) {
                element.textContent = langStrings[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.dataset.langPlaceholder;
            if (langStrings[lang] && langStrings[lang][key]) {
                element.placeholder = langStrings[lang][key];
            } else {
                console.warn(`Placeholder translation for key "${key}" not found in language "${lang}".`);
            }
        });
        const newExInputPlaceholder = langStrings[lang].new_ex_placeholder;
        if(newExInputPlaceholder && newExInput) {
            newExInput.placeholder = newExInputPlaceholder;
        } else if (newExInput) {
            console.warn(`Translation for new_ex_placeholder not found in language "${lang}".`);
        }
        if (skinUrlInput && langStrings[lang] && langStrings[lang].paste_url_placeholder) {
            skinUrlInput.placeholder = langStrings[lang].paste_url_placeholder;
        }
        renderHistory();
        renderExercises();
        renderSavedSkins();
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    }

    function showMainContent() {
        sections.forEach(section => section.style.display = 'none');

        const mainContentDiv = document.querySelector('.main-content');
        if (mainContentDiv) mainContentDiv.style.display = 'flex';

        if (settingsAndControls) settingsAndControls.style.display = 'flex';
        if (actionButtons) actionButtons.style.display = 'flex';
        if (mainTitle) mainTitle.style.display = 'block';
        if (fullscreenTimer) fullscreenTimer.style.display = 'none';

        const wheelContainer = document.querySelector('.wheel-container');
        if (wheelContainer) wheelContainer.style.display = 'block';
        if (resultDiv) resultDiv.style.display = 'block';

        // Redraw wheel in case canvas was resized or context lost while in another section
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    }

    function startTimer(repsString, exercise) {
        if (timerRunning) {
            clearInterval(timerTimeout);
            timerRunning = false;
        }

        const duration = parseInt(repsString.split(' ')[0]);
        if (isNaN(duration)) {
            console.error("Invalid timer duration:", repsString);
            return;
        }

        currentExercise = exercise;
        timerRunning = true;
        if (timerStartBtn) timerStartBtn.style.display = 'none';
        if (timerDoneBtn) timerDoneBtn.style.display = 'none';
        if (fullscreenTimer) fullscreenTimer.style.display = 'flex';
        if (fullscreenTimerExercise) fullscreenTimerExercise.textContent = currentExercise;
        if (fullscreenTimerMotivation) fullscreenTimerMotivation.textContent = motivational[Math.floor(Math.random() * motivational.length)];

        let timeLeft = duration;
        if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);

        function timerTick() {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerTimeout);
                timerRunning = false;
                if (timerDoneBtn) timerDoneBtn.style.display = 'block';
                if (timerDisplay) timerDisplay.textContent = '0:00';
            }
        }
        timerTimeout = setInterval(timerTick, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // --------- Event Listeners -----------------

    if (spinBtn) spinBtn.addEventListener('click', spinWheel);
    if (addExBtn) addExBtn.addEventListener('click', addExercise);
    if (newExInput) newExInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addExercise();
        }
    });
    if (resetExBtn) resetExBtn.addEventListener('click', () => {
        showCustomConfirm(langStrings[currentLang].custom_confirm_reset, resetExercises);
    });
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => {
        showCustomConfirm(langStrings[currentLang].custom_confirm_clear_history, () => {
            history = [];
            saveHistory();
            renderHistory();
        });
    });
    if (levelSelect) levelSelect.addEventListener('change', () => {
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    });
    if (langSelect) langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        setLang(currentLang);
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    });
    if (themeSelect) themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        setTheme(theme);
    });
    if (categorySelect) categorySelect.addEventListener('change', () => {
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    });
    if (skinUploadBtn) skinUploadBtn.addEventListener('click', () => {
        if (skinInput) skinInput.click();
    });
    if (skinInput) skinInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                customSkinURL = e.target.result;
                localStorage.setItem('customSkinURL', customSkinURL);
                applyCustomSkin();
                addSavedSkin(customSkinURL);
            };
            reader.readAsDataURL(file);
        }
    });
    if (skinClearBtn) skinClearBtn.addEventListener('click', () => {
        customSkinURL = '';
        localStorage.removeItem('customSkinURL');
        applyCustomSkin();
    });
    if (skinApplyUrlBtn) {
        skinApplyUrlBtn.addEventListener('click', () => {
            const url = skinUrlInput.value.trim();
            if (url) {
                customSkinURL = url;
                localStorage.setItem('customSkinURL', customSkinURL);
                applyCustomSkin();
                addSavedSkin(customSkinURL);
                skinUrlInput.value = '';
            } else {
                console.warn("URL input for skin is empty.");
            }
        });
    }


    document.querySelectorAll('header nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => section.style.display = 'none');

            const mainContentDiv = document.querySelector('.main-content');
            if (mainContentDiv) mainContentDiv.style.display = 'none';
            if (settingsAndControls) settingsAndControls.style.display = 'none';
            if (actionButtons) actionButtons.style.display = 'none';
            if (mainTitle) mainTitle.style.display = 'none';


            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'flex';
            }

            if (hamburger) hamburger.classList.remove('open');
            if (mainNav) mainNav.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });

    if (hamburger) hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mainNav.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    backToWheelBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', showMainContent);
    });

    if (timerStartBtn) timerStartBtn.addEventListener('click', () => {
        startTimer(currentReps, currentExercise);
    });
    if (timerDoneBtn) timerDoneBtn.addEventListener('click', () => {
        timerRunning = false;
        showMainContent();
    });

    function showCustomConfirm(message, onConfirm) {
        if (!customConfirm || !customConfirmText || !customConfirmYes || !customConfirmNo) {
            console.error("Custom confirm dialog elements not found. Cannot show confirm dialog.");
            if (onConfirm) onConfirm();
            return;
        }
        customConfirm.classList.remove('hidden');
        customConfirmText.textContent = message;
        const handleYes = () => {
            onConfirm();
            hideCustomConfirm();
            customConfirmYes.removeEventListener('click', handleYes);
            customConfirmNo.removeEventListener('click', handleNo);
        };
        const handleNo = () => {
            hideCustomConfirm();
            customConfirmYes.removeEventListener('click', handleYes);
            customConfirmNo.removeEventListener('click', handleNo);
        };
        customConfirmYes.addEventListener('click', handleYes);
        customConfirmNo.addEventListener('click', handleNo);
    }

    function hideCustomConfirm() {
        if (customConfirm) {
            customConfirm.classList.add('hidden');
        }
    }


    // --------- Ініціалізація програми -----------------

    document.addEventListener('DOMContentLoaded', () => {
        if (!wheelCanvas || !ctx) {
            console.error("Initialization aborted: Canvas element or its 2D context is not available. Please check index.html.");
            return;
        }

        const wheelSize = Math.min(window.innerWidth * 0.8, 350);
        wheelCanvas.width = wheelSize;
        wheelCanvas.height = wheelSize;

        showMainContent();
        loadExercises();
        renderExercises();
        renderHistory();
        setLang(currentLang);
        setTheme(currentTheme);

        setTimeout(() => {
            const exercisesToDraw = getExercisesForSpin();
            drawWheel(exercisesToDraw);
        }, 100);
        applyCustomSkin();
    });

    window.addEventListener('resize', () => {
        if (!wheelCanvas || !ctx) {
            console.warn("Resize event: Canvas element or its 2D context is not available. Skipping redraw.");
            return;
        }
        const wheelSize = Math.min(window.innerWidth * 0.8, 350);
        wheelCanvas.width = wheelSize;
        wheelCanvas.height = wheelSize;
        const exercisesToDraw = getExercisesForSpin();
        drawWheel(exercisesToDraw);
    });
})(); // End of IIFE