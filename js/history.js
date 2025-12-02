/**
 * Manages password history in LocalStorage.
 */
const HistoryManager = (function () {

    const STORAGE_KEY = 'passguard_history';
    const MAX_HISTORY = 10;

    function getHistory() {
        const history = localStorage.getItem(STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    }

    function addEntry(password, strengthLabel) {
        let history = getHistory();

        const newEntry = {
            password,
            strength: strengthLabel,
            timestamp: Date.now()
        };

        // Add to beginning
        history.unshift(newEntry);

        // Limit to MAX_HISTORY
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        renderHistory();
    }

    function clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
    }

    function renderHistory() {
        const listElement = document.getElementById('history-list');
        if (!listElement) return;

        const history = getHistory();
        listElement.innerHTML = '';

        if (history.length === 0) {
            listElement.innerHTML = '<li style="text-align:center; color:var(--text-secondary); padding:1rem;">No history yet</li>';
            return;
        }

        history.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'history-item';

            const passSpan = document.createElement('span');
            passSpan.className = 'history-pass';
            passSpan.textContent = entry.password;

            const metaDiv = document.createElement('div');
            metaDiv.style.display = 'flex';
            metaDiv.style.gap = '0.5rem';
            metaDiv.style.alignItems = 'center';

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = entry.strength;

            // Color code badge
            if (entry.strength === 'Very Weak') badge.style.color = 'var(--strength-very-weak)';
            else if (entry.strength === 'Weak') badge.style.color = 'var(--strength-weak)';
            else if (entry.strength === 'Medium') badge.style.color = 'var(--strength-medium)';
            else if (entry.strength === 'Strong') badge.style.color = 'var(--strength-strong)';
            else if (entry.strength === 'Very Strong') badge.style.color = 'var(--strength-very-strong)';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn-icon';
            copyBtn.innerHTML = '<img src="assets/icons/copy.svg" width="16" height="16" alt="Copy">';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(entry.password);
                // Optional: show small toast
            };

            metaDiv.appendChild(badge);
            metaDiv.appendChild(copyBtn);

            li.appendChild(passSpan);
            li.appendChild(metaDiv);

            listElement.appendChild(li);
        });
    }

    return {
        add: addEntry,
        clear: clearHistory,
        render: renderHistory
    };

})();
