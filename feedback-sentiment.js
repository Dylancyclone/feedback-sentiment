var sentiment = new Sentiment();
let badSentiment = false;
var fallingLetters = [];
let feedbackInput = document.querySelector("#feedback-input");
let feedbackInputCap = document.querySelector("#feedback-input-cap");
let trashWrapper = document.querySelector(".trash-wrapper");
let sentamentBar = document.querySelector(".sentament-bar-indicator__progress");

// Autofocus field
window.onload = function () {
  focusInput();
};

function focusInput() {
  feedbackInput.focus();
}

// Remap helper function
function mapRange(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function clickSend() {
  if (badSentiment) {
    alert(
      "We don't appreciate your tone of voice, please try again before sending"
    );
  } else {
    alert("Thank you for your kind feedback");
  }
}

feedbackInput.addEventListener("keydown", (e) => {
  // If the letters are going to the trash, intercept unless it's backspace, ctrl+a, or ctrl+r
  if (
    badSentiment &&
    !(e.code === "KeyA" && e.ctrlKey) && // Select all
    !(e.code === "KeyR" && e.ctrlKey) && // Reload page
    ![
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Backspace",
      "Delete",
    ].includes(e.code) // Allowed keys, including deleting offending word
  ) {
    e.preventDefault(); // Stop it from going to the field

    // If it's a letter or number make it fall
    if (
      (e.keyCode > 64 && e.keyCode < 91) || // Letters
      (e.keyCode > 47 && e.keyCode < 58) // Numbers
    ) {
      let fallingLetter = document.createElement("div");
      fallingLetter.innerText = e.key;

      fallingLetter.classList.add("falling-letter");
      fallingLetter.style.top =
        feedbackInput.getBoundingClientRect().top + "px";
      fallingLetter.style.left =
        feedbackInput.getBoundingClientRect().right + 1 + "px";

      document.body.append(fallingLetter);
      fallingLetters.push(fallingLetter);
    }
  }
});
feedbackInput.addEventListener("keyup", (e) => {
  let result = sentiment.analyze(feedbackInput.innerHTML);
  sentamentBar.style.width = mapRange(result.score, -5, 5, 0, 100) + "%";
  if (result.score < 0) {
    badSentiment = true;
    feedbackInputCap.className = "rotated";
    trashWrapper.style.marginLeft =
      window.getComputedStyle(feedbackInput).width;
  } else if (badSentiment) {
    badSentiment = false;
    feedbackInputCap.className = "";
    trashWrapper.style.marginLeft = "";
  }
});

setInterval(() => {
  fallingLetters.forEach((fallingLetter) => {
    // If letter is still falling
    if (
      Number(fallingLetter.style.top.slice(0, -2)) <
      trashWrapper.getBoundingClientRect().top + 90
    ) {
      fallingLetter.style.top =
        Number(fallingLetter.style.top.slice(0, -2)) + 4 + "px";
      fallingLetter.style.transform =
        "rotate(" +
        (Number(
          fallingLetter.style.transform.slice(
            7,
            fallingLetter.style.transform.indexOf("d")
          )
        ) +
          4) +
        "deg)";
    } else {
      // The letter has hit the trash, remove it
      fallingLetter.remove();
    }
  });
}, 30);
