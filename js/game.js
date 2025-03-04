/* Main JS module for the gameplay handling */

import { handleMute, handleReturnToMain, handleRestart } from "./utils.js";
import { wordLists } from "./words.js";
import { shopHandler } from "./shop.js";

// Initializing the elements, audios and declaring the variables
let lastLevel = localStorage.getItem("lastLevel");
const level = localStorage.getItem("selectedLevel");
const title = document.querySelector("#title");
const muteButton = document.querySelector("#mute");
const returnToMainButton = document.querySelector("#returnToMainMenu");
const restartButton = document.querySelector("#restart");
const dropBox = document.querySelector(".words");
const otherOptions = document.querySelector(".otherOptions");
const currentScoreDisplay = document.querySelector("#currentScore");
const totalScoreDisplay = document.querySelector("#totalScore");
const shop = document.querySelector(".shop");
const shopButton = document.querySelector("#shop");
// Healthbar elements
const hpContainer = document.querySelector(".hpContainer");
let hp;
// Sound elements
const victorySound = new Audio("../assets/sounds/win.mp3");
const gameOverSound = new Audio("../assets/sounds/game-over.mp3");
const hurtSound = new Audio("../assets/sounds/Oof.mp3");
const scoreSound = new Audio("../assets/sounds/orb.mp3");
const explosionSound = new Audio("../assets/sounds/explosion.mp3");
// Game elements
let velocity = 1;       // Velocity
let animateInterval = 1; // Variable that allows elements to move slower than velocity 1
let style = "simple";
const styles = ["simple", "colorful", "vertical", "spin", "bouncy", "glitched"];
let words = []; // List of generated words
let hearts = [];
const defaultHP = 10;
let tick = 0;
let score = 0;
let totalScore = 0;
let paused = false;
let musicPaused = false;
let isInvincible = false;
let music;
let isLevelUp = false;
let vmax; // Max velocity cap
if (lastLevel > level) isLevelUp = true; // If the last unlocked level is superior than player's current level

// ================================ BELOW IS GAME CALLSTACK ===================================

console.log("LEVEL: "+level);

// Display score
currentScoreDisplay.innerHTML = `Score: ${score}`;
totalScoreDisplay.innerHTML = `Total score: ${totalScore}`;

// Initialize the level
initLevel(level);

// Play music on loop
music.loop = true;
music.play();

// Initialize hp bar
updateHealth(0);

// Handling the extra buttons
handleMute(muteButton, music, musicPaused);
handleReturnToMain(returnToMainButton, fade);
handleRestart(restartButton, fade);
shopHandler(shop, shopButton);

inputHandler();
gameLoop();
handlePowerUps();

// ================================ BELOW ARE CORE GAME FUNCTIONS ================================

// Game loop
function gameLoop() {

    // If shop is open, game is paused
    if (document.querySelector(".shop").style.display == "flex") {
        paused = true;
    } else {
        paused = false;
    }

    // If game is not paused and player isn't dead
    if (hp != 0 && !paused) {

        const randNum = Math.floor(Math.random() * (100 - 50 + 1) + 50); // Random game ticks between 50 and 100

        // Level up logics
        if (score >= 15 && !isLevelUp && level < 3) {
            victorySound.play();

            // Unlock the next level for the user
            currentScoreDisplay.innerHTML = `YOU HAVE UNLOCKED THE NEXT LEVEL!`;
            localStorage.setItem("lastLevel", parseInt(level) + 1);

            // Warn the user with a text
            setTimeout(() => {
                currentScoreDisplay.innerHTML = `Score: ${score}`;
            }, 2000);

            isLevelUp = true;
        }

        // Reward the user with different text styles depending on the score
        switch (true) {
            case score == 5:
                style = "colorful";
                break;
            case score == 10:
                style = "vertical";
                break;
            case score == 15:
                style = "spin";
                break;
            case score == 20:
                style = "bouncy";
                break;
            case score == 25:
                style = "glitched";
                break;
            case score >= 30:
                // Change to a random falling style
                if (tick % 500 == 0)
                    style = styles[Math.floor(Math.random() * (styles.length))];
                break;
        }

        // Animate word
        animateWord(style, velocity);

        if (tick % randNum == 0) {
            generateWord();
        }
        tick++;
    }

    window.requestAnimationFrame(gameLoop); // Infinite animating loop
}

// Handle user's input
function inputHandler() {
    // Listen for keypress 'enter' events
    document.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            // Retrieve user input
            let input = document.querySelector("#input");

            increaseAttempt();

            // If user got a word right, exit the function
            if (checkWord(input)) return;

            // If user didn't get a word right, update health and input
            updateHealth(-1);
            input.style.animation = "shake 0.5s linear";

            // Reset animation after 500ms, to allow it to be animated again
            setTimeout(() => {
                input.style.animation = "";
            }, 500);
        }
    });
}

// Increase current&global score by one and update score display
function increaseScore() {
    score++;
    totalScore++;

    currentScoreDisplay.innerHTML = `Score: ${score}`;
    totalScoreDisplay.innerHTML = `Owned scores: ${totalScore}`;
    // Increase current score and total score by 1
    localStorage.setItem("currentScore", score);
    // Increase total right words count by 1, if the value exists 
    localStorage.setItem("totalScore", totalScore);
    // Increases all scored scores by 1 (also counted used scores for purchasing items)
    localStorage.setItem("rawScore", parseInt(localStorage.getItem("rawScore")) + 1);
}

// Function that handles total attempts count increase
function increaseAttempt() {
    // If player has no attempts, set it to 0
    if (localStorage.getItem("attempts") == null) localStorage.setItem("attempts", 0);

    let attempts = localStorage.getItem("attempts");
    localStorage.setItem("attempts", ++attempts); // Increase total attempts by 1
}

// Game function
function generateWord() {
    const div = document.createElement("div"); // Creating a new div containing the word
    dropBox.appendChild(div); // Add the easy word into the word dropping div 
    words.push(div); // Add the div into the list of spawned words
    switch (level) {
        // Inserts an easy word in the div
        case "1":
            div.textContent = wordLists.easy[Math.floor(Math.random() * wordLists.easy.length)];
            break;
        // Inserts a medium word in the div
        case "2":
            div.textContent = wordLists.medium[Math.floor(Math.random() * wordLists.medium.length)];
            break;
        // Inserts a hard word in the div
        case "3":
            div.textContent = wordLists.hard[Math.floor(Math.random() * wordLists.hard.length)];
            break;
    }
    div.style.position = "absolute";
    div.style.top = "0px";
    div.style.left = `${Math.floor(Math.random() * (85 - 15 + 1) + 15)}%`; // Generate a random position between 15% and 15% of the viewport
    div.style.textShadow = "1px 1px 1px black";
}

// Check if player got the word right, destroy the word and update score
function checkWord(input) {
            
    // Searching the word through the list of spawned words
    for (let i = 0; i < words.length; i++) {
        // If player gets a word right
        if (words[i].textContent == input.value) {
            words[i].remove(); // Wipe the word from the screen
            words.splice(i, 1); // Remove the word from the word list
            increaseScore();

            // Empty the input box
            input.value = "";
            scoreSound.play();

            if (velocity > vmax) velocity = vmax; // Cap max velocity at 5
            velocity += 0.1; // Increase velocity by 0.1 every word hit.
            return true;
        }
    }
    // Empty the input box
    input.value = "";
    // Player didn't get the word right
    return false;
}

/*
 * Function that ensures the animation of each word in each game loop
 * Styles:
 * - Simple: simply words falling slowly
 * - Colorful: simple style + random text color
 * - Vertical: words falling vertically
 * - Spin: words spinning while falling
 * - Bouncy: words falling but with rebounding physics, user has 3 bounces of time to type the word
 * - Glitched: words falling vertically and in different sizes, with random speed variation
 */
function animateWord(style, velocity) {
    // For each existing word
    words.forEach((element) => {

        // Detect if element falls over the bottom of the screen
        collisionDetection(element);

        switch (style) {
            case "simple":
                // Take the previous position and move it down by velocity number of pixels
                if (tick % animateInterval == 0)
                    element.style.top = `${parseInt(element.style.top.slice(0, element.style.top.length - 2)) + velocity}px`;
                break;
            case "colorful":
                // Randomize text color
                if (tick % 10 == 0)
                    element.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
                if (tick % animateInterval == 0)
                    element.style.top = `${parseInt(element.style.top.slice(0, element.style.top.length - 2)) + velocity}px`;
                break;
            case "vertical":
                // Rotate text to vertical
                element.style.transform = `rotate(90deg)`;
                if (tick % animateInterval == 0)
                    element.style.top = `${parseInt(element.style.top.slice(0, element.style.top.length - 2)) + velocity}px`;
                break;
            case "spin":
                // Apply spin animation
                element.style.animation = `rotate 1s linear infinite`;
                if (tick % animateInterval == 0)
                    element.style.top = `${parseInt(element.style.top.slice(0, element.style.top.length - 2)) + velocity}px`;
                break;
            case "bouncy":
                // Initialize physics custom properties with dataset
                if (!element.dataset.velocityY) {
                    element.dataset.velocityY = velocity;
                    element.dataset.bounceCount = 0;
                }
                
                // Get current physics state
                let currentTop = parseInt(element.style.top.slice(0, -2)); // Current top position
                let velY = parseFloat(element.dataset.velocityY);   // Current velocity
                const gravity = 0.5;
                const damping = 0.7;
                const bottomBoundary = window.innerHeight * 0.95;

                // Apply physics (increase velocity each tick)
                velY += gravity;
                currentTop += velY;

                // Bounce logic
                // If current position is below the bottom boundary, set it to the bottom boundary
                if (currentTop > bottomBoundary - element.offsetHeight) {
                    currentTop = bottomBoundary - element.offsetHeight;
                    // Apply damping (text bounces back up)
                    velY *= -damping;
                    // Increase bounce count
                    element.dataset.bounceCount = parseInt(element.dataset.bounceCount) + 1;

                    // Remove word after 3 bounces, so the user has 3 bounces of time to type the word
                    if (element.dataset.bounceCount >= 3) {
                        // Remove word and update health
                        words.splice(words.indexOf(element), 1);
                        element.remove();
                        updateHealth(-1);
                        return;
                    }
                }

                // Update element position and state
                element.style.top = `${currentTop}px`;
                element.dataset.velocityY = velY;
                break;

            case "glitched":
                element.style.transform = `scale(${Math.floor(Math.random() * 5 - 1)}, ${Math.floor(Math.random() * 5 - 1)})`;
                if (tick % animateInterval == 0)
                    element.style.top = `${parseInt(element.style.top.slice(0, element.style.top.length - 2)) + velocity}px`;
                velocity = Math.floor(Math.random() * 10 + 1); // Randomize velocity between 1 and 10
                if (tick % 5 == 0)
                    element.style.fontSize = `${Math.floor(Math.random() * 10 + 20)}px`;
                break;
        }
    });
}

// Detect if element falls over the bottom of the screen
function collisionDetection(element) {
    // Detect if element's position is superior than 95% of the window's height
    if (parseInt(element.style.top.replace("px", "")) > window.innerHeight * 0.95) {
        words[words.indexOf(element)].remove(); // Wipe the word from the screen
        words.splice(words.indexOf(element), 1); // Remove the word from the word list
        
        updateHealth(-1);

        return true;
    }
    return false;
}

// Determine the AI difficulty based on the level
// Also updates the contents of the page (images, audio...) according to the level.
function initLevel(level) {
    // Set the current score to 0
    localStorage.setItem("currentScore", 0);
    // If user doesn't have a total score, set it to 0
    if (localStorage.getItem("totalScore") == null) {
        localStorage.setItem("totalScore", 0)
    } else {
        // Grab the total score from local storage
        totalScore = localStorage.getItem("totalScore");
    }

    // Display total score
    totalScoreDisplay.innerHTML = `Total score: ${totalScore}`;

    switch (level) {
        // Easy
        case "1":

            // Changing background image
            document.querySelector(".game").style.backgroundImage = 'url("../assets/images/countryside.gif")';

            // Changing audio
            music = new Audio("../assets/sounds/bigBigWorld.mp3");
            console.log("Now playing: Big Big World");

            // Changing title
            title.innerHTML = "Level 1";

            // Velocity limit
            vmax = 5;

            break;

        // Medium
        case "2":
            // Changing background image
            document.querySelector(".game").style.backgroundImage = 'url("../assets/images/waterfall.gif")';

            // Changing audio
            music = new Audio("../assets/sounds/BuriedSecret.mp3");
            console.log("Now playing: Buried Secret");

            // Changing title
            title.innerHTML = "Level 2";

            // Velocity limit
            vmax = 3;

            break;

        // Hard
        case "3":
            // Changing background image
            document.querySelector(".game").style.backgroundImage = 'url("../assets/images/lava.gif")';

            // Changing audio
            music = new Audio("../assets/sounds/LavaWorkshop.mp3");
            console.log("Now playing: Lava Workshop");

            // Changing title
            title.innerHTML = "Level 3";

            // Velocity limit
            vmax = 2;

            // Velocity animation interval
            animateInterval = 2;

            break;
    }
}

// Function that handles hp initialization, when a character takes damage and when they heal
function updateHealth(hpChange) {
    // Init hp bar
    if (hpChange == 0) {
        hp = localStorage.getItem("hp");
        if (hp == null) hp = defaultHP; // If no previous hp is recorded, set it to default (10)
        // Create hp bar
        for (let i = 0; i < hp; i++) {
            createHeart(hpContainer, "heart");
        }

    // Player receives damage
    } else if (hpChange < 0) {
        // If user is invincible, exit function
        if (isInvincible) return;

        hurtSound.play();

        // Change hpChange number of hearts to hollow hearts
        for (let i = hp - 1; i > (hp + hpChange - 1); i--) {
            // If heart is hollow
            if (hearts[i].src.includes("gHeart")) {
                hearts[i].remove(); // Remove the hollow hearts
                hearts.splice(i, 1); // Remove the heart from the hearts list
            } else {
                hearts[i].src = "../assets/images/hollowHeart.png"; // Change the hearts to hollow
            }
        }
        hp += hpChange;

        // Player dies, game over
        if (hp <= 0) gameOver();

    // Player heals
    } else {
        for (let i = hp - 1; i <= (hp + hpChange - 1); i++) {
            // If player heals over the limit, only heal to the limit
            if (hearts.length >= 20) {
                hp += (20 - hp); // Add the addable hpChange to hp (<20)
                return;
            // Add extra hearts if player's has 10hp already
            } else if (hearts[i] == null) {
                createHeart(hpContainer, "gHeart");
            // If heart is hollow, change it to normal
            } else if (hearts[i].src.includes("hollow")) {
                hearts[i].src = "../assets/images/heart.png";
            }
        }
        hp += hpChange;
    }
}

// Function that creates a new heart element
function createHeart(container, type) {
    // Create a new heart element and append it into the hearts list
    const heart = document.createElement("img");
    heart.src = `../assets/images/${type}.png`;
    hearts.push(heart);
    container.appendChild(heart);
}

// Function that handles power ups player has bought
function handlePowerUps(powerUps) {
    document.addEventListener("keypress", (e) => {
        // Golden apple power up
        if (e.key == "1") {
            // If user doesn't have previous record, set the amount owned to 0
            if (localStorage.getItem("goldenApple") == null) localStorage.setItem("goldenApple", 0);
            const purchasedGoldenApple = localStorage.getItem("goldenApple");
            // If user is in posession of a golden apple
            if (purchasedGoldenApple > 0) {
                updateHealth(5); // Heal
                localStorage.setItem("goldenApple", parseInt(purchasedGoldenApple) - 1); // Update gApple count
            };
        // Slow potion power up
        } else if (e.key == "2") {
            // If user doesn't have previous record, set the amount owned to 0
            if (localStorage.getItem("slowPotion") == null) localStorage.setItem("slowPotion", 0);
            const purchasedSlowPotion = localStorage.getItem("slowPotion");
            // If user is in posession of a slow potion
            if (purchasedSlowPotion > 0) {
                animateInterval = animateInterval * 2; // Slow down
                setTimeout(() => {
                    animateInterval = 1; // Reset speed after 10 seconds
                }, 10000);
                localStorage.setItem("slowPotion", parseInt(purchasedSlowPotion) - 1); // Update slow potion count
            };
        // TNT power up
        } else if (e.key == "3") {
            // If user doesn't have previous record, set the amount owned to 0
            if (localStorage.getItem("TNT") == null) localStorage.setItem("TNT", 0);
            const purchasedTNT = localStorage.getItem("TNT");
            // If user is in posession of a TNT
            if (purchasedTNT > 0) {
                // Remove every word from the screen
                explosionSound.play();
                words.forEach((element) => {
                    element.remove();
                });
                words = [];
                localStorage.setItem("TNT", parseInt(purchasedTNT) - 1); // Update TNT count
            };
        // God potion power up
        } else if (e.key == "4") {
            // If user doesn't have previous record, set the amount owned to 0
            if (localStorage.getItem("godPotion") == null) localStorage.setItem("godPotion", 0);
            const purchasedGodPotion = localStorage.getItem("godPotion");
            // If user is in posession of a god potion
            if (purchasedGodPotion > 0) {
                // Gain invincibility for 60 seconds
                isInvincible = true;
                setTimeout(() => {
                    isInvincible = false;
                }, 60000);
                localStorage.setItem("godPotion", parseInt(purchasedGodPotion) - 1); // Update god potion count
            };
        }
    });
}

// Lose function
function gameOver() {
    paused = true;
    
    music.pause();       // Pause current music to hear the game over sound effect
    gameOverSound.play(); // Game over sound effect

    // If top score doesn't exist, add a new top score attribute
    if (localStorage.getItem("topScore") == null) localStorage.setItem("topScore", score);
    const topScore = localStorage.getItem("topScore");
    if (score > topScore) localStorage.setItem("topScore", score); // new top score

    // Victory text, buttons, scores displays, all others are hidden
    input.style.display = "none";
    dropBox.style.display = "none";
    hpContainer.style.display = "none";
    muteButton.style.display = "none";

    // Change title content to game over message
    title.innerHTML = `Game Over! You died!`;

    title.style.position = "absolute !important";
    title.style.left = "50%";
    title.style.top = "50%";                    // Center vertically
    title.style.transform = "translate(50%, -70%)";  // Center vertically
    title.style.color = "rgb(255, 66, 66)";
    title.style.fontSize = "150px";

    otherOptions.style.display = "absolute !important";
    otherOptions.style.left = "50%";
    otherOptions.style.bottom = "20%";                    // Center vertically
    otherOptions.style.transform = "translate(-50%)";  // Center vertically
}