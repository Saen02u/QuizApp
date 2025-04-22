let _qarrs = [];

fetch("/getproblems")
  .then(response => response.json())
    .then(data => {
      _qarrs = JSON.parse(decryptData(data));
      shuffle(_qarrs);
      console.log("load success");
      startQuiz();
    })
  .catch(error => console.error("error:",error));

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const countdownElement = document.getElementById("countdown");
const questionElement = document.getElementById("question");
const question2BoxElement = document.getElementById("question2-box");
const question2Element = document.getElementById("question2");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const warpButton = document.getElementById("warp-btn");
const maxQuestion = _qarrs.length;

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 1200;

function countdown() {
  console.log("Countdown!!!!");
  var timerVar = setInterval(function() {
    if (timeLeft < 0) {
      clearInterval(timerVar);
      showScore(1);
    } else if (nextButton.innerHTML === "Play Again") {
      clearInterval(timerVar);
      showScore(0);
    }else {
      countdownElement.innerHTML = timeLeft;
    }
    timeLeft--;
  }, 1000);
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 360;
  nextButton.innerHTML = "Next";
  countdown();
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = _qarrs[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo+". "+currentQuestion._qstr2;
  question2Element.innerHTML = currentQuestion._qstr2;
  if (currentQuestion._qstr2 == "") {
    question2BoxElement.style.display = "none";
  }
  shuffle(currentQuestion._ansx);
  currentQuestion._ansx.forEach((_ansx) => {
    const button = document.createElement("button");
    button.innerHTML = _ansx.__msg;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (_ansx.__chk) {
      button.dataset.correct = _ansx.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  warpButton.style.display = "none";
  question2BoxElement.style.display = "block";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore(code) {
  resetState();
  
  if (code == 1) {
    questionElement.innerHTML = `Timeout!!!\nYou scored ${score} out of ${maxQuestion}!`;
  }
  else {
    questionElement.innerHTML = `You scored ${score} out of ${maxQuestion}!`;
  }
  question2Element.innerHTML = "";
  question2BoxElement.style.display = "none";
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "inline-block";
  warpButton.style.display = "inline-block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < maxQuestion) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < maxQuestion) {
    handleNextButton();
  } else {
    location.href='/';
  }
});

warpButton.onclick = function() {
  usr_name = document.getElementById('usr-name').value;
  location.href = `/saveScore?name=${usr_name}&score=${score}&countdown=${timeLeft}`;
}


startQuiz();
