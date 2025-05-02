//const _qarrs = JSON.parse(JSON.stringify(_qarr));

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const countdownElement = document.getElementById("countdown");
const questionElement = document.getElementById("question");
const question2BoxElement = document.getElementById("question2-box");
const question2Element = document.getElementById("question2");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const warpButton = document.getElementById("warp-btn")

let _qarrs = [];
let currentQuestionIndex = 0;
let currentAnsx = '';
let score = 0;
let timeLeft = 900;
const maxQuestion = 30;

async function getProblems() {
	try {
		const res = await fetch('/getProblems');
		const enc = await res.text();
    //console.log("key.");
    const parts = enc.split('.')
		const key = CryptoJS.enc.Hex.parse(parts[0]);
    //console.log("key.");
		const iv = CryptoJS.enc.Hex.parse(parts[1]);
    //console.log("iv.");
    const ciphertext = CryptoJS.enc.Base64.parse(parts[2]);
    //console.log("ciphertext.");
		const decrypted = CryptoJS.AES.decrypt(
			{ ciphertext: ciphertext },
			key,
			{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}
		);
    //console.log("decrypted (raw):", decrypted);
    _qarrs = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    //console.log(_qarrs.length);
    shuffle(_qarrs);
		console.log("problem load success");

    startQuiz();
	} catch (error) {
		console.log("problem load error");
		location.href = '/';
  }
};

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
  timeLeft = 900;
  nextButton.innerHTML = "Next";
  countdown();
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = _qarrs[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo+". "+currentQuestion._qstr;
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
      currentAnsx = _ansx.__msg;
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
  let currentQuestion = _qarrs[currentQuestionIndex];
  const selectedBtn = e.target;
  const selectedText = selectedBtn.innerHTML;
  const isCorrect = selectedText === currentAnsx;
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.innerHTML === currentAnsx) {
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

warpButton.addEventListener("click", () => {
  usr_name = document.getElementById('nickname').innerHTML;
  location.href = `/saveScore?name=${usr_name}&t2NvWG8=${score}&countdown=${timeLeft}`;
});


getProblems();
