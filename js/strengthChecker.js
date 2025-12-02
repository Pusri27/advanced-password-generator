/**
 * Evaluates password strength based on multiple factors.
 */
const StrengthChecker = (function () {

    const PATTERNS = {
        sequences: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789|890)/i,
        keyboard: /(qwerty|asdf|zxcv|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p|1qaz|2wsx|3edc|4rfv|5tgb|6yhn|7ujm|8ik|9ol|0p)/i,
        repeat: /(.)\1{2,}/, // Matches 3 or more same chars
        weakWords: /password|admin|hello|welcome|123456|qwerty/i
    };

    function evaluate(password) {
        if (!password) return { score: 0, label: 'Very Weak', suggestions: [] };

        let score = 0;
        let suggestions = [];
        const length = password.length;
        const entropy = window.Entropy.calculate(password);

        // 1. Base Score from Entropy
        if (entropy > 120) score += 50;
        else if (entropy > 80) score += 40;
        else if (entropy > 60) score += 30;
        else if (entropy > 40) score += 20;
        else score += 10;

        // 2. Length Bonus
        if (length >= 16) score += 20;
        else if (length >= 12) score += 10;
        else if (length < 8) {
            score -= 10;
            suggestions.push("Increase length to at least 12 characters.");
        }

        // 3. Character Variety
        let varietyCount = 0;
        if (/[a-z]/.test(password)) varietyCount++;
        if (/[A-Z]/.test(password)) varietyCount++;
        if (/[0-9]/.test(password)) varietyCount++;
        if (/[^a-zA-Z0-9]/.test(password)) varietyCount++;

        if (varietyCount >= 3) score += 20;
        else if (varietyCount >= 2) score += 10;
        else {
            suggestions.push("Add more character types (UPPER, lower, #, symbols).");
        }

        // 4. Penalties & Pattern Detection
        if (PATTERNS.sequences.test(password)) {
            score -= 15;
            suggestions.push("Avoid sequential characters (e.g., 'abc', '123').");
        }
        if (PATTERNS.keyboard.test(password)) {
            score -= 15;
            suggestions.push("Avoid keyboard patterns (e.g., 'qwerty').");
        }
        if (PATTERNS.repeat.test(password)) {
            score -= 10;
            suggestions.push("Avoid repeated characters (e.g., 'aaa').");
        }
        if (PATTERNS.weakWords.test(password)) {
            score -= 30;
            suggestions.push("Avoid common weak words.");
        }

        // Clamp Score
        score = Math.max(0, Math.min(100, score));

        // Determine Level
        let level = 0; // 0-4
        let label = "Very Weak";

        if (score >= 90) { level = 4; label = "Very Strong"; }
        else if (score >= 70) { level = 3; label = "Strong"; }
        else if (score >= 50) { level = 2; label = "Medium"; }
        else if (score >= 30) { level = 1; label = "Weak"; }
        else { level = 0; label = "Very Weak"; }

        return {
            score,
            level,
            label,
            suggestions,
            entropy
        };
    }

    return {
        evaluate
    };

})();
