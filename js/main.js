// JS module handling elements from the home page only

import { handleMute, handleStats } from "./utils.js";
import { shopHandler } from "./shop.js";

// Grab the elements
const fade = document.querySelector("#fade");
const muteButton = document.querySelector("#mute");
const statsButton = document.querySelector("#stats");
const lobbyMusic = new Audio("../assets/sounds/theWatchfulIvoryTowers.mp3");
const shop = document.querySelector(".shop");
const shopButton = document.querySelector("#shop");
let musicPaused = false;
let level;
if (localStorage.getItem("lastLevel") == null) localStorage.setItem("lastLevel", 1); // If no last level, set it to 1
const lastLevel = localStorage.getItem("lastLevel");
// If raw score isn't defined, set it to 0
if (localStorage.getItem("rawScore") == null) localStorage.setItem("rawScore", 0);
const buttons = Array.from(document.querySelectorAll('.levels > *')); // Append all children of .levels into an array to ease access

// Disallow player from playing levels higher than the last level passed
buttons.forEach((element) => {
    if (lastLevel < parseInt(element.id[0])) element.disabled = true;
});

// Enable loop and autoplay
lobbyMusic.loop = true;
lobbyMusic.play();
console.log("Now playing: The Watchful Ivory Towers.mp3");

// Level selector handling and send level number to game.js by exporting
document.querySelector(".levels").addEventListener("click", (e) => {
    // Only if button is clicked
    if (e.target.tagName === "BUTTON") {
        // Level grabber
        level = e.target.id; // Level = selected level
        // Set the level in local storage to be used in game.js
        localStorage.setItem("selectedLevel", level[0]); 

        // Fade out the page
        fade.style.animation = "fadeOut 1s linear forwards";
        setTimeout(() => {
            window.location.href = "../html/game.html"; // Redirect to game page
        }, 1500);
    }
});

// Mute button handling
handleMute(muteButton, lobbyMusic, musicPaused);
// Handle stats button
handleStats(statsButton);
// Handle shop
shopHandler(shop, shopButton);