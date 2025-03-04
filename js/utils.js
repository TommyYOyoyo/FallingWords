/* Utilities for all files */

export { handleMute, handleReturnToMain, handleRestart, handleStats };

// Handle mute button
function handleMute(muteButton, music, paused) {
    // Mute button onclick -> pause music, reset to 0 and set paused to true.
    // Otherwise, play music and set paused to false
    muteButton.addEventListener("click", () => {
        if (paused) {
            music.play();
            muteButton.src = "../assets/images/unmute.png";
            paused = false;
            console.log("Music resumed");
        } else {
            music.pause();
            music.currentTime = 0;
            muteButton.src = "../assets/images/mute.png";
            paused = true;
            console.log("Music stopped");
        }
    });
}

// Handling the "return to main menu" button
function handleReturnToMain(btn, fade) {
    btn.addEventListener("click", () => {
        // Fade out the page
        fade.style.animation = "fadeOut 1s linear forwards";
        setTimeout(() => {
            window.location.href = "../html/menu.html"; // Return to main menu
        }, 1500);
    });
}

// Handling the "restart" button
function handleRestart(btn, fade) {
    btn.addEventListener("click", () => {
        // Fade out the page
        fade.style.animation = "fadeOut 1s linear forwards";
        setTimeout(() => {
            window.location.reload();   // Restart level
        }, 1500);
    });
}

// Get stats of the player
function handleStats(btn) {
    // Grab elements from localStorage
    let topScore = localStorage.getItem("topScore");
    let lastLevel = localStorage.getItem("lastLevel");
    let rawScore = localStorage.getItem("rawScore");
    let attempts = localStorage.getItem("attempts");
    let currentScore = localStorage.getItem("totalScore");
    let accuracy = rawScore/attempts*100; // In percentage

    // If no stats, set them to 0
    if (topScore == null) topScore = 0;
    if (lastLevel == null) lastLevel = 0;
    if (rawScore == null) rawScore = 0;
    if (attempts == null) attempts = 0;
    if (accuracy == null) accuracy = 0;
    if (currentScore == null) currentScore = 0;

    // Get stats texts
    const statsMenu = document.querySelector(".statistics");
    const statsTitle = document.querySelector("#statsTitle");
    const topScoreText = document.querySelector("#topScore");
    const rawScoreText = document.querySelector("#rawScore");
    const attemptsText = document.querySelector("#attempts");
    const accuracyText = document.querySelector("#accuracy");
    const lastLevelText = document.querySelector("#lastLevel");
    const currentScoreText = document.querySelector("#currentScore");

    // Button event listener
    document.querySelector("#stats").addEventListener("click", () => {
        if (statsMenu.style.display != "block") {
            // Display stats
            statsMenu.style.display = "block";

            // Change stats
            statsTitle.innerHTML = "USER STATISTICS:";
            topScoreText.innerHTML = "Top Score til' death: " + topScore;
            rawScoreText.innerHTML = "Total scored: " + rawScore;
            attemptsText.innerHTML = "Total attempts: " + attempts;
            accuracyText.innerHTML = "Accuracy: " + accuracy.toFixed(2) + "%";
            lastLevelText.innerHTML = "Last unlocked level: " + lastLevel;
            currentScoreText.innerHTML = "Currently owned scores: " + currentScore;
        } else {
            // Hide stats
            statsMenu.style.display = "none";
        }
    });
}

