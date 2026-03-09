(function() {
    if (window.rouletteWheelAppInitialized) {
        console.warn("wheel.js is already initialized. Skipping re-initialization.");
        return;
    }
    window.rouletteWheelAppInitialized = true;

    // --------- Налаштування -----------------

    const MAX_WHEEL_SEGMENTS = 16;

    const defaultExercises = {
        legs:       ["Присідання", "Випади", "Присідання-Пліє", "Стрибки", "Випади назад"],
        arms_chest: ["Віджимання", "Віджимання від лавки", "Планка з переходом на руки", "Віджимання від колін", "Зворотні віджимання"],
        core:       ["Прес", "Планка", "Велосипед", "Скручування", "Планка з підняттям рук", "Махи ногами"],
        cardio:     ["Бурпі", "Стрибки на скакалці", "Стрибки з зіркою", "Біг на місці"]
    };

    const superExercise = "Супер-вправа (30 сек макс. темп!)";

    const motivational = [
        "Ти зможеш більше, ніж думаєш!", "Ти молодець!", "Зроби ще крок до своєї цілі!",
        "Відпочинок — теж частина успіху!", "Сила в тобі!", "Залишайся на хвилі мотивації!",
        "Твої зусилля дають результат!", "Жоден підхід не марний!"
    ];

    const levels = {
        easy:   { min: 15, max: 25, plankMin: 10, plankMax: 15 },
        medium: { min: 25, max: 40, plankMin: 20, plankMax: 30 },
        hard:   { min: 35, max: 60, plankMin: 40, plankMax: 60 }
    };

    const langStrings = {
        uk: {
            level_label: "Рівень:",
            easy: "Легкий", medium: "Середній", hard: "Важкий", custom: "Свій",
            reps: "повторень",
            lang_label: "Мова:", theme_label: "Тема:",
            light: "Світла", dark: "Темна",
            press_spin: 'Натисни "Крутити!"',
            play: "▶", history: "Історія", ex_list: "Список вправ", spin_btn: "Крутити!",
            new_ex_placeholder: "Назва вправи", add_ex: "Додати",
            back_to_wheel: "Назад до колеса", reset_ex: "Скинути до стандартних",
            clear_history: "Очистити історію", timer_start: "Старт таймер", timer_done: "Готово!",
            custom_confirm_reset: "Ви впевнені, що хочете скинути всі вправи до стандартних?",
            custom_confirm_clear_history: "Ви впевнені, що хочете очистити історію?",
            confirm_yes: "Так", confirm_no: "Ні",
            category_label: "Категорія:", all_exercises: "Всі",
            category_legs: "Ноги", category_arms_chest: "Руки/Груди",
            category_core: "Корпус", category_cardio: "Кардіо",
            skin_label: "Скін рулетки:", upload_image: "Завантажити фото/GIF",
            clear_skin: "Очистити", ex_description: "Ви можете додавати або видаляти вправи.",
            no_exercises_in_category: "Немає вправ для обраної категорії!",
            history_empty: "Історія порожня.",
            paste_url_placeholder: "Або вставте посилання на GIF/фото",
            apply_url: "Застосувати URL", saved_skins_title: "Збережені скіни:",
            skins_management: "Керування скінами",
            skins_management_description: "Тут ви можете керувати збереженими скінами для рулетки.",
            today_sessions: "Серій сьогодні:",
            image_too_large: "Зображення занадто велике! Спробуйте файл до 2MB.",
            exercise_too_short: "Назва вправи занадто коротка (мін. 2 символи)!",
            exercise_exists: "Ця вправа вже є у списку!",
            delete_exercise_confirm: "Видалити вправу",
            delete_skin_confirm: "Видалити цей скін?",
            beep_mute: "🔔 Біп: Увімк.",
            beep_unmute: "🔇 Біп: Вимк.",
            beep_mute_title: "Вимкнути звук біпу",
            beep_unmute_title: "Увімкнути звук біпу",
            no_saved_skins: "Немає збережених скінів.",
            unlock_audio: "🔇 Звук",
            unlock_audio_done: "🔔 Звук увімк.",
            export_ex: "⬇ Експорт JSON",
            import_ex: "⬆ Імпорт JSON",
            import_success: "Вправи успішно імпортовані!",
            import_error: "Помилка імпорту файлу!",
            wheel_colors_title: "Кольори секторів:",
            reset_colors: "Скинути кольори"
        },
        en: {
            level_label: "Level:",
            easy: "Easy", medium: "Medium", hard: "Hard", custom: "Custom",
            reps: "reps",
            lang_label: "Language:", theme_label: "Theme:",
            light: "Light", dark: "Dark",
            press_spin: 'Press "Spin!"',
            play: "▶", history: "History", ex_list: "Exercise list", spin_btn: "Spin!",
            new_ex_placeholder: "Exercise name", add_ex: "Add",
            back_to_wheel: "Back to Wheel", reset_ex: "Reset to default",
            clear_history: "Clear history", timer_start: "Start timer", timer_done: "Done!",
            custom_confirm_reset: "Are you sure you want to reset all exercises to default?",
            custom_confirm_clear_history: "Are you sure you want to clear the history?",
            confirm_yes: "Yes", confirm_no: "No",
            category_label: "Category:", all_exercises: "All",
            category_legs: "Legs", category_arms_chest: "Arms/Chest",
            category_core: "Core", category_cardio: "Cardio",
            skin_label: "Roulette skin:", upload_image: "Upload photo/GIF",
            clear_skin: "Clear", ex_description: "You can add or remove exercises.",
            no_exercises_in_category: "No exercises for the selected category!",
            history_empty: "History is empty.",
            paste_url_placeholder: "Or paste GIF/photo URL",
            apply_url: "Apply URL", saved_skins_title: "Saved Skins:",
            skins_management: "Manage Skins",
            skins_management_description: "Here you can manage your saved roulette skins.",
            today_sessions: "Today's sessions:",
            image_too_large: "Image is too large! Try a file under 2MB.",
            exercise_too_short: "Exercise name is too short (min. 2 chars)!",
            exercise_exists: "This exercise is already in the list!",
            delete_exercise_confirm: "Delete exercise",
            delete_skin_confirm: "Delete this skin?",
            beep_mute: "🔔 Beep: On",
            beep_unmute: "🔇 Beep: Off",
            beep_mute_title: "Mute beep sound",
            beep_unmute_title: "Unmute beep sound",
            no_saved_skins: "No saved skins.",
            unlock_audio: "🔇 Sound",
            unlock_audio_done: "🔔 Sound on!",
            export_ex: "⬇ Export JSON",
            import_ex: "⬆ Import JSON",
            import_success: "Exercises imported successfully!",
            import_error: "Error importing file!",
            wheel_colors_title: "Sector colors:",
            reset_colors: "Reset colors"
        }
    };

    // --------- Audio -----------------

    const audioSpin = new Audio('spin.mp3');
    const audioBeep = new Audio('beep-07.mp3');
    audioSpin.loop   = true;
    audioSpin.volume = 0.6;
    audioBeep.volume = 0.8;

    let beepMuted = localStorage.getItem('beepMuted') === 'true';

    function playSpin() { try { audioSpin.currentTime = 0; audioSpin.play().catch(() => {}); } catch(e) {} }
    function stopSpin() { try { audioSpin.pause(); audioSpin.currentTime = 0; } catch(e) {} }
    function playBeep() {
        if (beepMuted) return;
        try { audioBeep.currentTime = 0; audioBeep.play().catch(() => {}); } catch(e) {}
    }

    function updateBeepToggleBtn() {
        const btn = document.getElementById('beep-toggle-btn');
        if (!btn) return;
        const lang = langStrings[currentLang];
        btn.textContent = beepMuted
            ? (lang.beep_unmute || '🔇 Звук біпу: Вимк.')
            : (lang.beep_mute   || '🔔 Звук біпу: Увімк.');
        btn.title = beepMuted
            ? (lang.beep_unmute_title || 'Увімкнути звук біпу')
            : (lang.beep_mute_title   || 'Вимкнути звук біпу');
    }

    // --------- DOM -----------------

    const wheelCanvas           = document.getElementById('wheel');
    const ctx                   = wheelCanvas ? wheelCanvas.getContext('2d') : null;
    const spinBtn               = document.getElementById('spin-btn');
    const resultDiv             = document.getElementById('result');
    const resultText            = document.getElementById('result-text');
    const repsText              = document.getElementById('reps-text');
    const levelSelect           = document.getElementById('level');
    const langSelect            = document.getElementById('lang-select');
    const themeSelect           = document.getElementById('theme-select');
    const newExInput            = document.getElementById('new-ex-input');
    const newExCategorySelect   = document.getElementById('new-ex-category');
    const addExBtn              = document.getElementById('addExBtn');
    const resetExBtn            = document.getElementById('resetExBtn');
    const exercisesList         = document.getElementById('exercises-list');
    const historyList           = document.getElementById('history');
    const clearHistoryBtn       = document.getElementById('clearHistoryBtn');
    const hamburger             = document.getElementById('hamburger');
    const mainNav               = document.getElementById('main-nav');
    const sections              = document.querySelectorAll('section');
    const backToWheelBtns       = document.querySelectorAll('.back-to-wheel-btn');
    const mainTitle             = document.getElementById('main-title');
    const fullscreenTimer       = document.getElementById('fullscreen-timer');
    const timerDisplay          = document.getElementById('fullscreen-timer-display');
    const timerStartBtn         = document.getElementById('timer-start-btn');
    const timerDoneBtn          = document.getElementById('timer-done-btn');
    const fullscreenTimerEx     = document.getElementById('fullscreen-timer-exercise');
    const fullscreenTimerMotiv  = document.getElementById('fullscreen-timer-motivation');
    const customConfirm         = document.getElementById('custom-confirm');
    const customConfirmText     = document.getElementById('custom-confirm-text');
    const customConfirmYes      = document.getElementById('custom-confirm-yes');
    const customConfirmNo       = document.getElementById('custom-confirm-no');
    const categorySelect        = document.getElementById('category');
    const skinInput             = document.getElementById('skin-input');
    const skinUploadBtn         = document.getElementById('skin-upload-btn');
    const skinClearBtn          = document.getElementById('skin-clear-btn');
    const customSkinImage       = document.getElementById('custom-skin-image');
    const skinUrlInput          = document.getElementById('skin-url-input');
    const skinApplyUrlBtn       = document.getElementById('skin-apply-url-btn');
    const savedSkinsList        = document.getElementById('saved-skins-list');
    const settingsAndControls   = document.querySelector('.settings-and-controls');
    const actionButtons         = document.querySelector('.action-buttons');
    const unlockAudioBtn        = document.getElementById('unlock-audio-btn');
    const exportExBtn           = document.getElementById('exportExBtn');
    const importExBtn           = document.getElementById('importExBtn');
    const importExInput         = document.getElementById('import-ex-input');
    const resetColorsBtn        = document.getElementById('reset-colors-btn');
    const colorInputs           = [1,2,3,4,5].map(i => document.getElementById(`color-${i}`));

    // --------- State -----------------

    let isSpinning           = false;
    let currentLang          = localStorage.getItem('lang')   || 'uk';
    let currentTheme         = localStorage.getItem('theme')  || 'light';
    let userExercises        = {};
    let history              = JSON.parse(localStorage.getItem('history'))    || [];
    let savedSkins           = JSON.parse(localStorage.getItem('savedSkins')) || [];
    let timerInterval        = null;
    let timerRunning         = false;
    let currentExercise      = '';
    let customSkinURL        = localStorage.getItem('customSkinURL') || '';
    let currentWheelAngle    = 0; // normalized cumulative angle

    // --------- Session Counter -----------------

    function getTodaySessions() {
        const today = new Date().toDateString();
        const data  = JSON.parse(localStorage.getItem('sessionData') || '{}');
        return data.date === today ? (data.count || 0) : 0;
    }

    function incrementTodaySessions() {
        const today = new Date().toDateString();
        const data  = JSON.parse(localStorage.getItem('sessionData') || '{}');
        const count = (data.date === today ? (data.count || 0) : 0) + 1;
        localStorage.setItem('sessionData', JSON.stringify({ date: today, count }));
        renderSessionCounter();
    }

    function renderSessionCounter() {
        let counter = document.getElementById('session-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'session-counter';
            counter.style.cssText = 'font-size:0.85em;color:var(--text-color-light);margin-top:6px;';
            if (resultDiv) resultDiv.appendChild(counter);
        }
        counter.textContent = `${langStrings[currentLang].today_sessions} ${getTodaySessions()}`;
    }

    // --------- CSS Var Helper -----------------

    function getCssVar(name, fallback = '#cccccc') {
        try {
            const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
            return v || fallback;
        } catch(e) { return fallback; }
    }

    // --------- Wheel Colors -----------------

    const defaultColors = ['#ff6347','#4682b4','#32cd32','#ffa500','#9370db'];

    function loadWheelColors() {
        const saved = JSON.parse(localStorage.getItem('wheelColors') || 'null');
        const colors = saved || defaultColors;
        colors.forEach((c, i) => {
            document.documentElement.style.setProperty(`--wheel-sector-${i+1}`, c);
            if (colorInputs[i]) colorInputs[i].value = c;
        });
    }

    function saveWheelColors() {
        const colors = colorInputs.map(inp => inp ? inp.value : defaultColors[0]);
        localStorage.setItem('wheelColors', JSON.stringify(colors));
        colors.forEach((c, i) => document.documentElement.style.setProperty(`--wheel-sector-${i+1}`, c));
        drawWheel(getExercisesForSpin());
    }

    function resetWheelColors() {
        localStorage.removeItem('wheelColors');
        defaultColors.forEach((c, i) => {
            document.documentElement.style.setProperty(`--wheel-sector-${i+1}`, c);
            if (colorInputs[i]) colorInputs[i].value = c;
        });
        drawWheel(getExercisesForSpin());
    }

    // --------- Audio Unlock -----------------

    let audioUnlocked = false;

    function tryUnlockAudio() {
        if (audioUnlocked) return;
        Promise.all([
            audioSpin.play().then(() => { audioSpin.pause(); audioSpin.currentTime = 0; }),
            audioBeep.play().then(() => { audioBeep.pause(); audioBeep.currentTime = 0; })
        ]).then(() => {
            audioUnlocked = true;
            if (unlockAudioBtn) {
                unlockAudioBtn.style.display = 'none';
                unlockAudioBtn.style.animation = 'none';
            }
        }).catch(() => {
            if (unlockAudioBtn) unlockAudioBtn.style.display = 'inline-flex';
        });
    }

    function checkAudioOnLoad() {
        // Try silently; if blocked, show the button
        const testPlay = audioBeep.play();
        if (testPlay !== undefined) {
            testPlay.then(() => {
                audioBeep.pause(); audioBeep.currentTime = 0;
                audioUnlocked = true;
            }).catch(() => {
                if (unlockAudioBtn) unlockAudioBtn.style.display = 'inline-flex';
            });
        }
    }

    // --------- Confetti -----------------

    function launchConfetti() {
        let canvas = document.getElementById('confetti-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confetti-canvas';
            document.body.appendChild(canvas);
        }
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx2    = canvas.getContext('2d');
        const pieces  = Array.from({ length: 120 }, () => ({
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height - canvas.height,
            w:     6 + Math.random() * 8,
            h:     10 + Math.random() * 8,
            color: `hsl(${Math.random()*360},90%,55%)`,
            rot:   Math.random() * 360,
            vx:    (Math.random() - 0.5) * 3,
            vy:    3 + Math.random() * 4,
            vr:    (Math.random() - 0.5) * 6
        }));
        let frame = 0;
        function draw() {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx2.save();
                ctx2.translate(p.x + p.w/2, p.y + p.h/2);
                ctx2.rotate(p.rot * Math.PI / 180);
                ctx2.fillStyle = p.color;
                ctx2.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx2.restore();
                p.x  += p.vx;
                p.y  += p.vy;
                p.rot += p.vr;
                p.vy += 0.07;
            });
            frame++;
            if (frame < 160) requestAnimationFrame(draw);
            else { ctx2.clearRect(0, 0, canvas.width, canvas.height); }
        }
        draw();
    }

    // --------- Export / Import Exercises -----------------

    function exportExercises() {
        const data = JSON.stringify(userExercises, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'exercises.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importExercises(file) {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const imported = JSON.parse(e.target.result);
                if (typeof imported !== 'object' || Array.isArray(imported)) throw new Error();
                for (const cat in imported) {
                    if (!Array.isArray(imported[cat])) throw new Error();
                }
                userExercises = imported;
                saveExercises();
                renderExercises();
                drawWheel(getExercisesForSpin());
                showCustomConfirm(langStrings[currentLang].import_success, () => {});
            } catch(err) {
                showCustomConfirm(langStrings[currentLang].import_error, () => {});
            }
        };
        reader.readAsText(file);
    }

    // --------- Text wrapping for wheel -----------------

    function wrapText(context, text, maxWidth) {
        const words = text.split(' ');
        if (words.length === 1) {
            return truncate(context, text, maxWidth);
        }
        const lines = [];
        let line = '';
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (context.measureText(test).width > maxWidth && line) {
                lines.push(truncate(context, line, maxWidth)[0]);
                line = word;
                if (lines.length >= 2) break;
            } else {
                line = test;
            }
        }
        if (line) lines.push(truncate(context, line, maxWidth)[0]);
        return lines;
    }

    function truncate(context, text, maxWidth) {
        if (context.measureText(text).width <= maxWidth) return [text];
        let t = '';
        for (const ch of text) {
            if (context.measureText(t + ch + '…').width < maxWidth) t += ch;
            else break;
        }
        return [t + '…'];
    }

    // --------- Draw Wheel -----------------

    function drawWheel(exercisesToDraw) {
        if (!ctx || !wheelCanvas) return;

        const exercises    = exercisesToDraw.slice(0, MAX_WHEEL_SEGMENTS);
        const n            = exercises.length;
        const arc          = (2 * Math.PI) / Math.max(n, 1);
        const radius       = wheelCanvas.width / 2;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

        if (n === 0) {
            ctx.fillStyle    = getCssVar('--text-color', '#000');
            ctx.font         = 'bold 16px Segoe UI';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(langStrings[currentLang].no_exercises_in_category, radius, radius);
            return;
        }

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-radius, -radius);

        for (let i = 0; i < n; i++) {
            const angle = i * arc;

            // Sector fill
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius - 2, angle, angle + arc);
            ctx.closePath();
            ctx.fillStyle = getCssVar(`--wheel-sector-${(i % 5) + 1}`, '#ccc');
            ctx.fill();

            // Sector border
            ctx.strokeStyle = 'rgba(0,0,0,0.18)';
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            // Text
            ctx.save();
            const textR  = radius * 0.68;
            const midAng = angle + arc / 2;
            ctx.translate(radius + Math.cos(midAng) * textR, radius + Math.sin(midAng) * textR);
            ctx.rotate(midAng);
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = getCssVar('--wheel-text-color', '#000');

            const fontSize = n <= 6 ? 15 : n <= 10 ? 13 : n <= 14 ? 11 : 9;
            ctx.font = `bold ${fontSize}px Segoe UI`;

            const maxW  = radius * 0.52;
            const lines = wrapText(ctx, exercises[i], maxW);
            const lh    = fontSize + 4;

            lines.forEach((line, idx) => {
                const yOffset = (idx - (lines.length - 1) / 2) * lh;
                ctx.fillText(line, 0, yOffset);
            });
            ctx.restore();
        }

        ctx.restore();

        // Center dot
        ctx.beginPath();
        ctx.arc(radius, radius, radius * 0.09, 0, 2 * Math.PI);
        ctx.fillStyle = getCssVar('--pointer-color', '#eb3b3b');
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth   = 2;
        ctx.stroke();
    }

    // --------- Render Lists -----------------

    function renderExercises() {
        if (!exercisesList) return;
        exercisesList.innerHTML = '';
        getAllExercisesWithCategories().forEach(item => {
            const li        = document.createElement('li');
            li.textContent  = `${item.exercise} (${langStrings[currentLang]['category_' + item.category] || item.category})`;
            const btn       = document.createElement('button');
            btn.textContent = '×';
            btn.classList.add('remove-btn');
            btn.addEventListener('click', () => {
                const msg = `${langStrings[currentLang].delete_exercise_confirm} "${item.exercise}"?`;
                showCustomConfirm(msg, () => removeExercise(item.exercise, item.category));
            });
            li.appendChild(btn);
            exercisesList.appendChild(li);
        });
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        if (!history.length) {
            historyList.innerHTML = `<li class="history-empty-message">${langStrings[currentLang].history_empty}</li>`;
            return;
        }
        history.forEach(item => {
            const li   = document.createElement('li');
            const date = item.date ? `<span style="font-size:0.72em;opacity:0.55;margin-left:8px;">${item.date}</span>` : '';
            li.innerHTML = `${item.exercise}: <b>${item.reps}</b>${date}`;
            historyList.appendChild(li);
        });
    }

    function renderSavedSkins() {
        if (!savedSkinsList) return;
        savedSkinsList.innerHTML = '';
        if (!savedSkins.length) {
            savedSkinsList.innerHTML = `<li style="text-align:center;width:100%;color:var(--text-color-light);">Немає збережених скінів.</li>`;
            return;
        }
        savedSkins.forEach(url => {
            const li  = document.createElement('li');
            const img = document.createElement('img');
            img.src   = url;
            img.alt   = 'Saved Skin';
            img.onerror = () => { img.src = 'https://placehold.co/100x100/cccccc/000?text=Error'; };

            const actions = document.createElement('div');
            actions.classList.add('skin-actions');

            const loadBtn       = document.createElement('button');
            loadBtn.textContent = langStrings[currentLang].play;
            loadBtn.classList.add('secondary-btn');
            loadBtn.style.cssText = 'padding:5px 10px;font-size:0.8em;';
            loadBtn.addEventListener('click', () => {
                customSkinURL = url;
                localStorage.setItem('customSkinURL', customSkinURL);
                applyCustomSkin();
            });

            const delBtn       = document.createElement('button');
            delBtn.textContent = '×';
            delBtn.classList.add('danger-btn');
            delBtn.style.cssText = 'padding:5px 10px;font-size:0.8em;';
            delBtn.addEventListener('click', () => {
                showCustomConfirm(langStrings[currentLang].delete_skin_confirm, () => removeSavedSkin(url));
            });

            actions.appendChild(loadBtn);
            actions.appendChild(delBtn);
            li.appendChild(img);
            li.appendChild(actions);
            savedSkinsList.appendChild(li);
        });
    }

    // --------- Storage -----------------

    function loadExercises() {
        try {
            userExercises = JSON.parse(JSON.stringify(defaultExercises));
            const saved   = JSON.parse(localStorage.getItem('exercises'));
            if (saved) {
                for (const cat in saved) {
                    if (!saved.hasOwnProperty(cat) || !Array.isArray(saved[cat])) continue;
                    if (userExercises.hasOwnProperty(cat)) {
                        const existing = new Set(userExercises[cat]);
                        saved[cat].forEach(ex => {
                            if (typeof ex === 'string' && ex.trim() && !existing.has(ex)) {
                                userExercises[cat].push(ex);
                                existing.add(ex);
                            }
                        });
                    } else {
                        userExercises[cat] = saved[cat].filter(ex => typeof ex === 'string' && ex.trim());
                    }
                }
            }
            const skin = localStorage.getItem('customSkinURL');
            if (skin) { customSkinURL = skin; applyCustomSkin(); }
            savedSkins = JSON.parse(localStorage.getItem('savedSkins')) || [];
            renderSavedSkins();
        } catch(e) {
            console.error("Error loading exercises:", e);
            userExercises = JSON.parse(JSON.stringify(defaultExercises));
        }
    }

    function saveExercises() { try { localStorage.setItem('exercises', JSON.stringify(userExercises)); } catch(e) {} }
    function saveHistory()   { try { localStorage.setItem('history',   JSON.stringify(history));       } catch(e) {} }
    function saveSkins()     { try { localStorage.setItem('savedSkins', JSON.stringify(savedSkins));   } catch(e) {} }

    // --------- Exercise Logic -----------------

    function getAllExercisesWithCategories() {
        const all = [];
        for (const cat in userExercises) {
            if (userExercises.hasOwnProperty(cat) && Array.isArray(userExercises[cat])) {
                userExercises[cat].forEach(ex => all.push({ exercise: ex, category: cat }));
            }
        }
        return all;
    }

    function getExercisesForSpin() {
        const sel = categorySelect ? categorySelect.value : 'all';
        let list;
        if (sel === 'all') {
            list = getAllExercisesWithCategories().map(i => i.exercise);
        } else {
            list = Array.isArray(userExercises[sel]) ? [...userExercises[sel]] : [];
        }
        return list.slice(0, MAX_WHEEL_SEGMENTS);
    }

    // --------- Spin -----------------

    function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

    function spinWheel() {
        if (isSpinning) return;
        const exercises = getExercisesForSpin();
        if (!exercises.length) {
            if (resultText) resultText.textContent = langStrings[currentLang].no_exercises_in_category;
            if (repsText)   repsText.textContent   = '';
            return;
        }

        isSpinning = true;
        if (spinBtn) { spinBtn.disabled = true; spinBtn.style.opacity = '0.7'; }

        playSpin();

        const n           = exercises.length;
        const arc         = (2 * Math.PI) / n;
        const spinMs      = 4500;
        const startTime   = performance.now();
        const targetIdx   = Math.floor(Math.random() * n);
        const winningEx   = exercises[targetIdx];

        // How many radians to rotate so targetIdx sector tops the pointer
        // The sector centre in the wheel's own frame = targetIdx * arc + arc/2
        // We need that point at 0 (top), so delta = that angle - current angle
        let delta = (targetIdx * arc + arc / 2) - (currentWheelAngle % (2 * Math.PI));
        if (delta < 0) delta += 2 * Math.PI;
        const fullSpins  = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
        const totalDelta = delta + fullSpins;

        const startAngle = currentWheelAngle;

        function animate() {
            const elapsed  = performance.now() - startTime;
            const progress = Math.min(elapsed / spinMs, 1);
            const eased    = easeOutQuint(progress);
            const angle    = startAngle + eased * totalDelta;

            if (wheelCanvas) wheelCanvas.style.transform = `rotate(-${angle}rad)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentWheelAngle = (startAngle + totalDelta) % (2 * Math.PI);
                if (wheelCanvas) wheelCanvas.style.transform = `rotate(-${currentWheelAngle}rad)`;
                stopSpin();
                playBeep();
                isSpinning = false;
                if (spinBtn) { spinBtn.disabled = false; spinBtn.style.opacity = '1'; }
                displayResult(winningEx);
            }
        }
        requestAnimationFrame(animate);
    }

    // --------- Display Result -----------------

    function displayResult(exercise) {
        const level      = levelSelect ? levelSelect.value : 'medium';
        const isTimeBased = exercise.includes("Планка") || exercise.includes("Plank") ||
                            exercise.includes("сек")    || exercise.includes("sec");
        let reps;
        if (isTimeBased) {
            const { plankMin, plankMax } = levels[level];
            const dur = exercise === superExercise ? 30 : Math.floor(Math.random() * (plankMax - plankMin + 1)) + plankMin;
            reps = `${dur} сек`;
        } else {
            const { min, max } = levels[level];
            reps = `${Math.floor(Math.random() * (max - min + 1)) + min} ${langStrings[currentLang].reps}`;
        }

        if (resultText) resultText.textContent = exercise;
        if (repsText)   repsText.textContent   = reps;

        launchConfetti();

        const now     = new Date();
        const dateStr = `${now.toLocaleDateString(currentLang === 'uk' ? 'uk-UA' : 'en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        history.unshift({ exercise, reps, date: dateStr });
        if (history.length > 50) history.pop();
        saveHistory();
        renderHistory();
        incrementTodaySessions();

        if (reps.includes("сек") || reps.includes("sec")) {
            prepareTimer(reps, exercise);
        }
    }

    // --------- Exercise Management -----------------

    function addExercise() {
        const name = newExInput ? newExInput.value.trim() : '';
        const cat  = newExCategorySelect ? newExCategorySelect.value : 'legs';
        if (!name || name.length < 2) {
            showCustomConfirm(langStrings[currentLang].exercise_too_short, () => {});
            return;
        }
        if (getAllExercisesWithCategories().some(i => i.exercise === name)) {
            showCustomConfirm(langStrings[currentLang].exercise_exists, () => {});
            return;
        }
        if (!userExercises[cat]) userExercises[cat] = [];
        userExercises[cat].push(name);
        saveExercises();
        renderExercises();
        drawWheel(getExercisesForSpin());
        if (newExInput) newExInput.value = '';
    }

    function removeExercise(ex, cat) {
        if (!userExercises[cat]) return;
        const idx = userExercises[cat].indexOf(ex);
        if (idx > -1) {
            userExercises[cat].splice(idx, 1);
            saveExercises();
            renderExercises();
            drawWheel(getExercisesForSpin());
        }
    }

    function resetExercises() {
        userExercises = JSON.parse(JSON.stringify(defaultExercises));
        saveExercises();
        renderExercises();
        drawWheel(getExercisesForSpin());
    }

    // --------- Skin Management -----------------

    function applyCustomSkin() {
        if (!customSkinImage) return;
        if (customSkinURL) {
            customSkinImage.src          = customSkinURL;
            customSkinImage.style.display = 'block';
        } else {
            customSkinImage.style.display = 'none';
            customSkinImage.src           = '';
        }
    }

    function addSavedSkin(url) {
        if (!savedSkins.includes(url)) {
            savedSkins.unshift(url);
            if (savedSkins.length > 10) savedSkins.pop();
            saveSkins();
            renderSavedSkins();
        }
    }

    function removeSavedSkin(url) {
        savedSkins = savedSkins.filter(u => u !== url);
        saveSkins();
        renderSavedSkins();
        if (customSkinURL === url) {
            customSkinURL = '';
            localStorage.removeItem('customSkinURL');
            applyCustomSkin();
        }
    }

    // --------- Timer -----------------

    function prepareTimer(repsString, exercise) {
        // Clear any running timer first
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        timerRunning = false;

        const duration = parseInt(repsString);
        if (isNaN(duration) || duration <= 0) return;

        currentExercise = exercise;

        if (fullscreenTimer)  fullscreenTimer.style.display   = 'flex';
        if (fullscreenTimerEx)     fullscreenTimerEx.textContent   = exercise;
        if (fullscreenTimerMotiv)  fullscreenTimerMotiv.textContent = motivational[Math.floor(Math.random() * motivational.length)];
        if (timerDisplay)          timerDisplay.textContent         = formatTime(duration);
        if (timerStartBtn)         timerStartBtn.style.display      = 'block';
        if (timerDoneBtn)          timerDoneBtn.style.display       = 'none';

        // Store pending duration for Start button
        if (timerStartBtn) timerStartBtn._pendingDuration = duration;
    }

    function runTimer(duration) {
        if (timerInterval) clearInterval(timerInterval);
        timerRunning = true;
        let timeLeft = duration;
        if (timerStartBtn) timerStartBtn.style.display = 'none';

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft > 0 && timeLeft <= 3) playBeep();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                timerRunning  = false;
                playBeep();
                if (timerDisplay) timerDisplay.textContent = '0:00';
                if (timerDoneBtn) timerDoneBtn.style.display = 'block';
            }
        }, 1000);
    }

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}:${r < 10 ? '0' : ''}${r}`;
    }

    // --------- Lang / Theme -----------------

    function setLang(lang) {
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.dataset.lang;
            if (langStrings[lang]?.[key]) el.textContent = langStrings[lang][key];
        });
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.dataset.langPlaceholder;
            if (langStrings[lang]?.[key]) el.placeholder = langStrings[lang][key];
        });
        if (newExInput   && langStrings[lang].new_ex_placeholder)    newExInput.placeholder   = langStrings[lang].new_ex_placeholder;
        if (skinUrlInput && langStrings[lang].paste_url_placeholder) skinUrlInput.placeholder = langStrings[lang].paste_url_placeholder;
        renderHistory();
        renderExercises();
        renderSavedSkins();
        renderSessionCounter();
        updateBeepToggleBtn();
    }

    function setTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('theme', theme);
        drawWheel(getExercisesForSpin());
    }

    // --------- Navigation -----------------

    function showMainContent() {
        sections.forEach(s => s.style.display = 'none');
        const mc = document.querySelector('.main-content');
        if (mc)                  mc.style.display = 'flex';
        if (settingsAndControls) settingsAndControls.style.display = 'flex';
        if (actionButtons)       actionButtons.style.display = 'flex';
        if (mainTitle)           mainTitle.style.display = 'block';
        if (fullscreenTimer)     fullscreenTimer.style.display = 'none';
        const wc = document.querySelector('.wheel-container');
        if (wc)        wc.style.display = 'block';
        if (resultDiv) resultDiv.style.display = 'block';
        drawWheel(getExercisesForSpin());
    }

    // --------- Custom Confirm -----------------

    function showCustomConfirm(message, onConfirm) {
        if (!customConfirm) { if (onConfirm) onConfirm(); return; }
        customConfirm.classList.remove('hidden');
        if (customConfirmText) customConfirmText.textContent = message;

        function yes() { onConfirm(); cleanup(); customConfirm.classList.add('hidden'); }
        function no()  {             cleanup(); customConfirm.classList.add('hidden'); }
        function cleanup() {
            customConfirmYes && customConfirmYes.removeEventListener('click', yes);
            customConfirmNo  && customConfirmNo.removeEventListener('click', no);
        }
        if (customConfirmYes) customConfirmYes.addEventListener('click', yes);
        if (customConfirmNo)  customConfirmNo.addEventListener('click', no);
    }

    // --------- Event Listeners -----------------

    if (spinBtn)         spinBtn.addEventListener('click', spinWheel);
    if (addExBtn)        addExBtn.addEventListener('click', addExercise);
    if (newExInput)      newExInput.addEventListener('keypress', e => { if (e.key === 'Enter') addExercise(); });
    if (resetExBtn)      resetExBtn.addEventListener('click', () => showCustomConfirm(langStrings[currentLang].custom_confirm_reset, resetExercises));
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () =>
        showCustomConfirm(langStrings[currentLang].custom_confirm_clear_history, () => { history = []; saveHistory(); renderHistory(); })
    );
    if (levelSelect)     levelSelect.addEventListener('change',    () => drawWheel(getExercisesForSpin()));
    if (langSelect)      langSelect.addEventListener('change',     e  => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        setLang(currentLang);
        drawWheel(getExercisesForSpin());
    });
    if (themeSelect)     themeSelect.addEventListener('change',    e  => setTheme(e.target.value));
    if (categorySelect)  categorySelect.addEventListener('change', () => drawWheel(getExercisesForSpin()));

    // Audio unlock
    if (unlockAudioBtn) unlockAudioBtn.addEventListener('click', () => {
        tryUnlockAudio();
        unlockAudioBtn.textContent = langStrings[currentLang].unlock_audio_done || '🔔 Звук увімк.';
        setTimeout(() => { unlockAudioBtn.style.display = 'none'; }, 1500);
    });

    // Export / Import exercises
    if (exportExBtn)   exportExBtn.addEventListener('click', exportExercises);
    if (importExBtn)   importExBtn.addEventListener('click', () => importExInput && importExInput.click());
    if (importExInput) importExInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) { importExercises(file); importExInput.value = ''; }
    });

    // Color pickers
    colorInputs.forEach((inp, i) => {
        if (inp) inp.addEventListener('input', saveWheelColors);
    });
    if (resetColorsBtn) resetColorsBtn.addEventListener('click', resetWheelColors);

    if (skinUploadBtn)   skinUploadBtn.addEventListener('click', () => skinInput && skinInput.click());

    const beepToggleBtn = document.getElementById('beep-toggle-btn');
    if (beepToggleBtn) {
        updateBeepToggleBtn();
        beepToggleBtn.addEventListener('click', () => {
            beepMuted = !beepMuted;
            localStorage.setItem('beepMuted', beepMuted);
            updateBeepToggleBtn();
        });
    }
    if (skinInput) skinInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showCustomConfirm(langStrings[currentLang].image_too_large, () => {});
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            customSkinURL = ev.target.result;
            localStorage.setItem('customSkinURL', customSkinURL);
            applyCustomSkin();
            addSavedSkin(customSkinURL);
        };
        reader.readAsDataURL(file);
    });
    if (skinClearBtn) skinClearBtn.addEventListener('click', () => {
        customSkinURL = '';
        localStorage.removeItem('customSkinURL');
        applyCustomSkin();
    });
    if (skinApplyUrlBtn) skinApplyUrlBtn.addEventListener('click', () => {
        const url = skinUrlInput ? skinUrlInput.value.trim() : '';
        if (url) {
            customSkinURL = url;
            localStorage.setItem('customSkinURL', customSkinURL);
            applyCustomSkin();
            addSavedSkin(customSkinURL);
            if (skinUrlInput) skinUrlInput.value = '';
        }
    });

    if (timerStartBtn) timerStartBtn.addEventListener('click', () => {
        const dur = timerStartBtn._pendingDuration;
        if (dur) runTimer(dur);
    });
    if (timerDoneBtn) timerDoneBtn.addEventListener('click', () => {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        timerRunning = false;
        showMainContent();
    });

    document.querySelectorAll('header nav ul li a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(s => s.style.display = 'none');
            const mc = document.querySelector('.main-content');
            if (mc)                  mc.style.display = 'none';
            if (settingsAndControls) settingsAndControls.style.display = 'none';
            if (actionButtons)       actionButtons.style.display = 'none';
            if (mainTitle)           mainTitle.style.display = 'none';
            const target = document.getElementById(targetId);
            if (target) target.style.display = 'flex';
            if (hamburger) hamburger.classList.remove('open');
            if (mainNav)   mainNav.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });

    if (hamburger) hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        if (mainNav) mainNav.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    backToWheelBtns.forEach(btn => { if (btn) btn.addEventListener('click', showMainContent); });

    // --------- Init -----------------

    document.addEventListener('DOMContentLoaded', () => {
        if (!wheelCanvas || !ctx) {
            console.error("Canvas not available.");
            return;
        }
        const size = Math.min(window.innerWidth * 0.8, 350);
        wheelCanvas.width  = size;
        wheelCanvas.height = size;

        showMainContent();
        loadExercises();
        renderExercises();
        renderHistory();
        setLang(currentLang);
        setTheme(currentTheme);
        loadWheelColors();
        checkAudioOnLoad();

        if (langSelect)  langSelect.value  = currentLang;
        if (themeSelect) themeSelect.value = currentTheme;

        setTimeout(() => drawWheel(getExercisesForSpin()), 100);
        applyCustomSkin();
        renderSessionCounter();
    });

    window.addEventListener('resize', () => {
        if (!wheelCanvas || !ctx) return;
        const size = Math.min(window.innerWidth * 0.8, 350);
        wheelCanvas.width  = size;
        wheelCanvas.height = size;
        drawWheel(getExercisesForSpin());
    });

})();