/**
 * Main UI Controller
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const els = {
        passwordOutput: document.getElementById('password-output'),
        copyBtn: document.getElementById('copy-btn'),
        regenerateBtn: document.getElementById('regenerate-btn'),
        generateBtn: document.getElementById('generate-btn'),

        strengthText: document.getElementById('strength-text'),
        strengthBar: document.getElementById('strength-bar'),
        entropyValue: document.getElementById('entropy-value'),
        crackTime: document.getElementById('crack-time'),
        suggestionsList: document.getElementById('suggestions-list'),

        presetSelect: document.getElementById('preset-select'),
        savePresetBtn: document.getElementById('save-preset-btn'),
        deletePresetBtn: document.getElementById('delete-preset-btn'),

        lengthSlider: document.getElementById('length-slider'),
        lengthValue: document.getElementById('length-value'),

        inputs: {
            includeUppercase: document.getElementById('include-uppercase'),
            includeLowercase: document.getElementById('include-lowercase'),
            includeNumbers: document.getElementById('include-numbers'),
            includeSymbols: document.getElementById('include-symbols'),
            excludeAmbiguous: document.getElementById('exclude-ambiguous'),
            preventSequential: document.getElementById('prevent-sequential'),
            preventRepeat: document.getElementById('prevent-repeat')
        },

        themeToggle: document.getElementById('theme-toggle'),
        clearHistoryBtn: document.getElementById('clear-history-btn')
    };

    // --- State ---
    let currentConfig = getConfigFromUI();

    // --- Initialization ---
    initTheme();
    HistoryManager.render();
    PresetManager.render();
    generateAndRender(); // Initial generation

    // --- Event Listeners ---

    // Generate Button
    els.generateBtn.addEventListener('click', generateAndRender);
    els.regenerateBtn.addEventListener('click', generateAndRender);

    // Copy Button
    els.copyBtn.addEventListener('click', () => {
        const password = els.passwordOutput.innerText;
        if (password) {
            navigator.clipboard.writeText(password);
            showTooltip(els.copyBtn, "Copied!");
        }
    });

    // Sliders & Inputs
    els.lengthSlider.addEventListener('input', (e) => {
        els.lengthValue.textContent = e.target.value;
        updateConfig();
    });

    Object.values(els.inputs).forEach(input => {
        input.addEventListener('change', updateConfig);
    });

    // Presets
    els.presetSelect.addEventListener('change', (e) => {
        const config = PresetManager.load(e.target.value);
        if (config) {
            applyConfigToUI(config);
            updateConfig(); // Trigger generation
        }
    });

    els.savePresetBtn.addEventListener('click', () => {
        const name = prompt("Enter preset name:");
        if (name) {
            PresetManager.save(name, getConfigFromUI());
            alert("Preset saved!");
        }
    });

    els.deletePresetBtn.addEventListener('click', () => {
        const selected = els.presetSelect.value;
        if (!selected) {
            alert("No preset selected.");
            return;
        }
        if (confirm(`Delete preset "${selected}"?`)) {
            PresetManager.delete(selected);
            els.presetSelect.value = ""; // Reset selection
        }
    });

    // History
    els.clearHistoryBtn.addEventListener('click', () => {
        if (confirm("Clear history?")) {
            HistoryManager.clear();
        }
    });

    // Theme Toggle
    els.themeToggle.addEventListener('click', toggleTheme);


    // --- Functions ---

    function getConfigFromUI() {
        return {
            length: parseInt(els.lengthSlider.value),
            includeUppercase: els.inputs.includeUppercase.checked,
            includeLowercase: els.inputs.includeLowercase.checked,
            includeNumbers: els.inputs.includeNumbers.checked,
            includeSymbols: els.inputs.includeSymbols.checked,
            excludeAmbiguous: els.inputs.excludeAmbiguous.checked,
            preventSequential: els.inputs.preventSequential.checked,
            preventRepeat: els.inputs.preventRepeat.checked
        };
    }

    function applyConfigToUI(config) {
        els.lengthSlider.value = config.length;
        els.lengthValue.textContent = config.length;

        els.inputs.includeUppercase.checked = config.includeUppercase;
        els.inputs.includeLowercase.checked = config.includeLowercase;
        els.inputs.includeNumbers.checked = config.includeNumbers;
        els.inputs.includeSymbols.checked = config.includeSymbols;
        els.inputs.excludeAmbiguous.checked = config.excludeAmbiguous;
        els.inputs.preventSequential.checked = config.preventSequential;
        els.inputs.preventRepeat.checked = config.preventRepeat;
    }

    function updateConfig() {
        currentConfig = getConfigFromUI();
        // Optional: Auto-generate on change? 
        // Let's do it for better UX
        generateAndRender();
    }

    function generateAndRender() {
        // Validate at least one char type is selected
        if (!currentConfig.includeUppercase && !currentConfig.includeLowercase &&
            !currentConfig.includeNumbers && !currentConfig.includeSymbols) {
            els.passwordOutput.innerText = "Select at least one option";
            return;
        }

        const password = Generator.generate(currentConfig);
        els.passwordOutput.innerText = password;
        els.passwordOutput.classList.remove('copied');

        // Analyze
        const analysis = StrengthChecker.evaluate(password);
        updateStrengthUI(analysis);

        // Add to history
        HistoryManager.add(password, analysis.label);
    }

    function updateStrengthUI(analysis) {
        els.strengthText.textContent = analysis.label;

        // Update Bar Color & Width
        const colors = [
            'var(--strength-very-weak)',
            'var(--strength-weak)',
            'var(--strength-medium)',
            'var(--strength-strong)',
            'var(--strength-very-strong)'
        ];

        els.strengthBar.style.width = `${(analysis.score)}%`;
        els.strengthBar.style.backgroundColor = colors[analysis.level];

        // Stats
        els.entropyValue.textContent = `${analysis.entropy} bits`;
        els.crackTime.textContent = window.Entropy.estimateCrackTime(analysis.entropy);

        // Suggestions
        els.suggestionsList.innerHTML = '';
        analysis.suggestions.forEach(sug => {
            const li = document.createElement('li');
            li.textContent = sug;
            els.suggestionsList.appendChild(li);
        });
    }

    function showTooltip(element, message) {
        const originalTooltip = element.getAttribute('data-tooltip');
        element.setAttribute('data-tooltip', message);
        setTimeout(() => {
            element.setAttribute('data-tooltip', originalTooltip);
        }, 2000);
    }

    // Theme Logic
    function initTheme() {
        const savedTheme = localStorage.getItem('passguard_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('passguard_theme', next);
    }

});
