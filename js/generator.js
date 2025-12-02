/**
 * Generates passwords based on user configuration.
 */
const Generator = (function () {

    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    const AMBIGUOUS = /[il1Lo0]/g;

    function generate(options) {
        const {
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
            excludeAmbiguous,
            preventSequential,
            preventRepeat
        } = options;

        let charPool = '';
        if (includeUppercase) charPool += CHAR_SETS.uppercase;
        if (includeLowercase) charPool += CHAR_SETS.lowercase;
        if (includeNumbers) charPool += CHAR_SETS.numbers;
        if (includeSymbols) charPool += CHAR_SETS.symbols;

        if (excludeAmbiguous) {
            charPool = charPool.replace(AMBIGUOUS, '');
        }

        if (charPool === '') return '';

        let password = '';
        let attempts = 0;
        const maxAttempts = length * 10; // Prevent infinite loops

        while (password.length < length && attempts < maxAttempts) {
            const charIndex = Math.floor(Math.random() * charPool.length);
            const char = charPool[charIndex];

            // Check constraints
            let isValid = true;

            if (preventRepeat && password.length > 0) {
                if (char === password[password.length - 1]) isValid = false;
            }

            if (preventSequential && password.length > 0) {
                const prevChar = password[password.length - 1];
                if (isSequential(prevChar, char)) isValid = false;
            }

            if (isValid) {
                password += char;
            }
            attempts++;
        }

        // Fallback if strict rules prevent generation (rare but possible)
        if (password.length < length) {
            // Fill remaining with random chars ignoring strict rules to ensure length
            while (password.length < length) {
                password += charPool[Math.floor(Math.random() * charPool.length)];
            }
        }

        return password;
    }

    function isSequential(char1, char2) {
        const code1 = char1.charCodeAt(0);
        const code2 = char2.charCodeAt(0);
        return Math.abs(code1 - code2) === 1;
    }

    return {
        generate
    };

})();
