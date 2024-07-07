document.addEventListener("DOMContentLoaded", function() {
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const submitButton = document.getElementById("submit-btn");
    const downloadButton = document.createElement('button');
    downloadButton.id = 'download-btn';
    downloadButton.style.display = 'none';
    downloadButton.textContent = 'Download Incorrect Answers';
    document.body.appendChild(downloadButton);
    const timeLeftSpan = document.getElementById("time-left");

    let quizData = [];
    let timerInterval;
    let quizDuration;
    let timeLeft;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        timeLeftSpan.textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                timeLeftSpan.textContent = timeLeft;
            } else {
                clearInterval(timerInterval);
                timeLeftSpan.textContent = 'Time Up!';
                disableOptions();
                submitQuiz();
            }
        }, 1000);
    }

    function displayQuestions() {
        randomizeQuiz();

        questionContainer.innerHTML = '';

        quizData.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.classList.add("question-item");
            questionElement.innerHTML = `
                <h2>Question ${index + 1}:</h2>
                <p>${question.question}</p>
                <ul>
                    ${question.options.map((option, i) => `
                        <li>
                            <label>
                                <input type="radio" name="question-${index}" value="${option}">
                                ${option}
                            </label>
                        </li>
                    `).join('')}
                </ul>
                <div class="explanation" style="display: none;">Explanation: ${question.reason}</div>
            `;
            questionContainer.appendChild(questionElement);
        });

        startTimer();
    }

    submitButton.addEventListener("click", function() {
        if (timeLeft > 0) {
            submitQuiz();
        }
    });

    function submitQuiz() {
        clearInterval(timerInterval);
        let score = 0;
        const questionItems = document.querySelectorAll(".question-item");
        const incorrectAnswers = [];

        questionItems.forEach((item, index) => {
            const options = item.querySelectorAll("input[type='radio']");
            const correctAnswer = quizData[index].correct_answer;
            let selectedOption;

            options.forEach(option => {
                option.disabled = true;

                if (option.checked) {
                    selectedOption = option.value;
                }

                if (option.value === correctAnswer) {
                    option.parentElement.style.fontWeight = "bold";
                    option.parentElement.style.color = "green";
                }

                if (option.checked && option.value !== correctAnswer) {
                    option.parentElement.style.color = "red";
                }
            });

            item.querySelector(".explanation").style.display = "block";

            if (selectedOption !== correctAnswer) {
                incorrectAnswers.push({
                    question: quizData[index].question,
                    options: quizData[index].options,
                    correct_answer: quizData[index].correct_answer,
                    reason: quizData[index].reason
                });
            } else {
                score++;
            }
        });

        const totalQuestions = quizData.length;
        const percentageScore = ((score / totalQuestions) * 100).toFixed(2);

        resultContainer.innerHTML = `
            <p>Score: ${score} / ${totalQuestions}</p>
            <p>Percentage Score: ${percentageScore}%</p>
            <p>Time Taken: ${quizDuration - timeLeft} seconds</p>
            <h2>Incorrect Answers:</h2>
            <div id="incorrect-answers-container">
                ${incorrectAnswers.map(incorrect => `
                    <div class="incorrect-answer-item">
                        <h3>Question: ${incorrect.question}</h3>
                        <ul>
                            ${incorrect.options.map(option => `<li>${option}</li>`).join('')}
                        </ul>
                        <p>Correct answer: ${incorrect.correct_answer}</p>
                        <p>Explanation: ${incorrect.reason}</p>
                    </div>
                `).join('')}
            </div>
        `;

        if (incorrectAnswers.length > 0) {
            downloadButton.style.display = 'block';
            downloadButton.addEventListener('click', function() {
                generateDownloadableJSON(incorrectAnswers);
            });
        }
    }

    function disableOptions() {
        const options = document.querySelectorAll(".question-item input[type='radio']");
        options.forEach(option => {
            option.disabled = true;
        });
    }

    function randomizeQuiz() {
        quizData = shuffleArray(quizData);
        quizData.forEach(question => {
            question.options = shuffleArray(question.options);
        });
    }

    function fetchQuizData() {
        fetch('real3.json')
            .then(response => response.json())
            .then(data => {
                quizData = data;
                quizDuration = quizData.length * 60;
                timeLeft = quizDuration;
                displayQuestions();
            })
            .catch(error => console.error('Error fetching quiz data:', error));
    }

    function generateDownloadableJSON(incorrectAnswers) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incorrectAnswers, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "incorrect_answers.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    fetchQuizData();
});
