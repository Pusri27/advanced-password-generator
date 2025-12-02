/**
 * Calculates the entropy of a password.
 * Formula: Entropy = log2(poolSize ** length)
 * 
 * @param {string} password - The password to analyze.
 * @returns {number} - The entropy in bits.
 */
function calculateEntropy(password) {
    if (!password) return 0;

    let poolSize = 0;

    // Determine pool size based on character sets present
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

    if (poolSize === 0) return 0;

    const entropy = Math.log2(Math.pow(poolSize, password.length));
    return Math.floor(entropy);
}

/**
 * Estimates time to crack based on entropy.
 * Assumes 100 billion guesses per second (high-end GPU array).
 * 
 * @param {number} entropy - Entropy in bits.
 * @returns {string} - Human readable time.
 */
function estimateCrackTime(entropy) {
    if (entropy < 28) return "Instant";
    
    const seconds = Math.pow(2, entropy) / 100000000000;
    
    if (seconds < 60) return "Instant";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.floor(seconds / 31536000)} years`;
    
    return "Centuries";
}

// Export for use in other files (ES6 modules not strictly used here to keep it simple for browser)
window.Entropy = {
    calculate: calculateEntropy,
    estimateCrackTime: estimateCrackTime
};
