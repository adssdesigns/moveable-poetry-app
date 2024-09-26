let activeWord = null;
let offsetX = 0;
let offsetY = 0;
let currentTimer = 20; // Default timer
let countdownInterval;

// Handle entering the poem
document.getElementById('enter-poem-btn').addEventListener('click', () => {
    const input = document.getElementById('poem-input');
    const wordContainer = document.getElementById('word-container');
    const words = input.value.trim().split(/\s+/).slice(0, 100); // Limit to 100 words

    wordContainer.innerHTML = ''; // Clear previous words

    words.forEach((word) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        wordDiv.innerText = word;

        // Set initial position for the new word
        wordDiv.style.left = `${Math.random() * (wordContainer.clientWidth - 100)}px`; // Randomly spread words
        wordDiv.style.top = `${Math.random() * (wordContainer.clientHeight - 40)}px`; // Randomly spread words

        wordContainer.appendChild(wordDiv);
        wordDiv.addEventListener('mousedown', dragMouseDown);
        wordDiv.addEventListener('touchstart', dragMouseDown); // Allow touch support
    });

    input.value = ''; // Clear input
    document.getElementById('poem-input').style.display = 'none'; // Hide input
    document.querySelector('.timer-section').style.display = 'block'; // Show timer section
});

// Timer functionality
document.getElementById('increase-timer-btn').addEventListener('click', () => {
    if (currentTimer < 60) {
        currentTimer += 10;
        updateTimerDisplay();
    }
});

document.getElementById('decrease-timer-btn').addEventListener('click', () => {
    if (currentTimer > 20) {
        currentTimer -= 10;
        updateTimerDisplay();
    }
});

document.getElementById('start-timer-btn').addEventListener('click', () => {
    startTimer();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    resetApp();
});

function updateTimerDisplay() {
    document.getElementById('timer-display').innerText = currentTimer < 10 ? `0${currentTimer}` : currentTimer;
}

function startTimer() {
    countdownInterval = setInterval(() => {
        currentTimer--;
        document.getElementById('countdown-display').innerText = currentTimer + " seconds remaining";
        
        if (currentTimer <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('start-timer-btn').innerText = "Time's up!";
            document.getElementById('start-timer-btn').classList.remove('start');
            document.getElementById('start-timer-btn').setAttribute('disabled', 'true');
            alert('Time is up! Your poem tiles are now fixed in place.');
        }
    }, 1000);
}

function resetApp() {
    clearInterval(countdownInterval);
    currentTimer = 20; // Reset to default
    updateTimerDisplay();
    document.getElementById('countdown-display').innerText = '';
    document.getElementById('start-timer-btn').innerText = 'Start Timer';
    document.getElementById('start-timer-btn').classList.add('start');
    document.getElementById('start-timer-btn').removeAttribute('disabled');
    document.getElementById('poem-input').style.display = 'block'; // Show input again
    document.getElementById('word-container').innerHTML = ''; // Clear words
}

// Drag-and-drop functionality
function dragMouseDown(e) {
    activeWord = e.target;
    offsetX = e.clientX - activeWord.getBoundingClientRect().left; // Calculate offset relative to element
    offsetY = e.clientY - activeWord.getBoundingClientRect().top;

    // Add event listeners for mouse and touch movement
    document.addEventListener('mousemove', moveWord);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', moveWord);
    document.addEventListener('touchend', stopDrag);
}

function moveWord(e) {
    if (activeWord) {
        const wordContainer = document.getElementById('word-container');
        const rect = wordContainer.getBoundingClientRect();

        // Calculate new position
        const newX = Math.min(rect.width - activeWord.offsetWidth, Math.max(0, e.clientX - offsetX - rect.left));
        const newY = Math.min(rect.height - activeWord.offsetHeight, Math.max(0, e.clientY - offsetY - rect.top));

        // Set the new position
        activeWord.style.left = `${newX}px`;
        activeWord.style.top = `${newY}px`;
    }
}

function stopDrag() {
    activeWord = null;
    document.removeEventListener('mousemove', moveWord);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', moveWord);
    document.removeEventListener('touchend', stopDrag);
}
