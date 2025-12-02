/**
 * Manages user presets for generator configuration.
 */
const PresetManager = (function () {

    const STORAGE_KEY = 'passguard_presets';

    const DEFAULT_PRESETS = [
        {
            name: "High Security",
            config: {
                length: 24,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSymbols: true,
                excludeAmbiguous: true,
                preventSequential: true,
                preventRepeat: true
            }
        },
        {
            name: "Balanced",
            config: {
                length: 16,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSymbols: true,
                excludeAmbiguous: false,
                preventSequential: false,
                preventRepeat: false
            }
        },
        {
            name: "PIN Mode",
            config: {
                length: 6,
                includeUppercase: false,
                includeLowercase: false,
                includeNumbers: true,
                includeSymbols: false,
                excludeAmbiguous: false,
                preventSequential: true,
                preventRepeat: true
            }
        }
    ];

    function getPresets() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with defaults if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
        return DEFAULT_PRESETS;
    }

    function savePreset(name, config) {
        const presets = getPresets();
        // Check if exists, update or add
        const existingIndex = presets.findIndex(p => p.name === name);
        if (existingIndex >= 0) {
            presets[existingIndex].config = config;
        } else {
            presets.push({ name, config });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
        renderPresets();
    }

    function deletePreset(name) {
        let presets = getPresets();
        presets = presets.filter(p => p.name !== name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
        renderPresets();
    }

    function loadPreset(name) {
        const presets = getPresets();
        const preset = presets.find(p => p.name === name);
        return preset ? preset.config : null;
    }

    function renderPresets() {
        const select = document.getElementById('preset-select');
        if (!select) return;

        // Keep the first default option
        select.innerHTML = '<option value="" disabled selected>Load Preset</option>';

        const presets = getPresets();
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }

    return {
        save: savePreset,
        delete: deletePreset,
        load: loadPreset,
        render: renderPresets
    };

})();
