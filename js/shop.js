// File for handling all shop actions

export { shopHandler };

// Function that initializes / updates a shop's texts
function shopUpdater() {
    // Grab necessary elements
    const scoreCounter = document.querySelector("#scoreCounter");
    const shop = document.querySelector(".shop");
    // Purchased items
    const purchasedGoldenApple = localStorage.getItem("goldenApple");
    const purchasedSlowPotion = localStorage.getItem("slowPotion");
    const purchasedTNT = localStorage.getItem("TNT");
    const purchasedGodPotion = localStorage.getItem("godPotion");
    // H2 texts
    const goldenAppleH2 = shop.querySelector("#goldenAppleH2");
    const slowPotionH2 = shop.querySelector("#slowPotionH2");
    const TNTH2 = shop.querySelector("#TNTH2");
    const godPotionH2 = shop.querySelector("#godPotionH2");
    // Buttons
    const goldenAppleButton = shop.querySelector("#buyGoldenApple");
    const slowPotionButton = shop.querySelector("#buySlowPotion");
    const TNTButton = shop.querySelector("#buyTNT");
    const godPotionButton = shop.querySelector("#buyGodPotion");

    const totalScore = localStorage.getItem("totalScore");

    // Re-enable buy buttons if player hasn't bought to the limit yet
    if (purchasedGoldenApple == null || purchasedGoldenApple < 2) goldenAppleButton.disabled = false;
    if (purchasedSlowPotion == null || purchasedSlowPotion < 2) slowPotionButton.disabled = false;
    if (purchasedTNT == null || purchasedTNT < 5) TNTButton.disabled = false;
    if (purchasedGodPotion == null || purchasedGodPotion < 1) godPotionButton.disabled = false;

    // Update H2 texts
    goldenAppleH2.innerHTML = `Golden Apple (${purchasedGoldenApple}/2)`;
    slowPotionH2.innerHTML = `Slow Potion (${purchasedSlowPotion}/2)`;
    TNTH2.innerHTML = `TNT (${purchasedTNT}/5)`;
    godPotionH2.innerHTML = `God Potion (${purchasedGodPotion}/1)`;

    // Disables buttons if player has bought to the limit or player doesn't have enough score
    if (purchasedGoldenApple >= 2 || totalScore < 25) goldenAppleButton.disabled = true;
    if (purchasedSlowPotion >= 2 || totalScore < 25) slowPotionButton.disabled = true;
    if (purchasedTNT >= 5 || totalScore < 50) TNTButton.disabled = true;
    if (purchasedGodPotion >= 1 || totalScore < 200) godPotionButton.disabled = true;

    // Update score counter
    scoreCounter.innerHTML = `You have ${totalScore} score.`;

    // Quit shop
    shop.querySelector("#quitShop").addEventListener("click", () => {
        shop.style.display = "none";
    });
}

function shopHandler(shop, shopButton) {
    
    // If any of the stored data is null, set it to 0
    if (localStorage.getItem("goldenApple") == null) localStorage.setItem("goldenApple", 0);
    if (localStorage.getItem("slowPotion") == null) localStorage.setItem("slowPotion", 0);
    if (localStorage.getItem("TNT") == null) localStorage.setItem("TNT", 0);
    if (localStorage.getItem("godPotion") == null) localStorage.setItem("godPotion", 0);
    if (localStorage.getItem("totalScore") == null) localStorage.setItem("totalScore", 0);

    // Shop button listener
    shopButton.addEventListener("click", () => {
        shop.style.display = "flex";
        // Initialize shop
        shopUpdater();
    });

    // Golden apple
    shop.querySelector("#buyGoldenApple").addEventListener("click", () => {
        console.log("test")
        // Remove 25 score
        localStorage.setItem("totalScore", parseInt(localStorage.getItem("totalScore")) - 25);
        // Add x1 Golden apple into player's inventory
        localStorage.setItem("goldenApple", parseInt(localStorage.getItem("goldenApple")) + 1);
        shopUpdater();
    });
    // Slow potion
    shop.querySelector("#buySlowPotion").addEventListener("click", () => {
        // Remove 25 score
        localStorage.setItem("totalScore", parseInt(localStorage.getItem("totalScore")) - 25);
        // Add x1 Slow Potion into player's inventory
        localStorage.setItem("slowPotion", parseInt(localStorage.getItem("slowPotion")) + 1);
        shopUpdater();
    });
    // TNT
    shop.querySelector("#buyTNT").addEventListener("click", () => {
        // Remove 50 score
        localStorage.setItem("totalScore", parseInt(localStorage.getItem("totalScore")) - 50);
        // Add x1 TNTinto player's inventory
        localStorage.setItem("TNT", parseInt(localStorage.getItem("TNT")) + 1);
        shopUpdater();
    });
    // God potion
    shop.querySelector("#buyGodPotion").addEventListener("click", () => {
        // Remove 50 score
        localStorage.setItem("totalScore", parseInt(localStorage.getItem("totalScore")) - 200);
        //Add 1 God Potion into player's inventory
        localStorage.setItem("godPotion", 1);
        shopUpdater();
    });
}