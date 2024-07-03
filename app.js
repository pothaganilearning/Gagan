document.addEventListener("DOMContentLoaded", function() {
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const submitButton = document.getElementById("submit-btn");
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
                    ${question.options.map(option => `<li>${option}</li>`).join('')}
                </ul>
                <div class="explanation">Explanation: ${question.reason}</div>
            `;
            questionContainer.appendChild(questionElement);

            const options = questionElement.querySelectorAll("li");
            options.forEach(option => {
                option.addEventListener("click", function() {
                    options.forEach(opt => opt.classList.remove("selected"));
                    option.classList.add("selected");
                });
            });
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

        questionItems.forEach((item, index) => {
            const options = item.querySelectorAll("li");
            const correctAnswer = quizData[index].correct_answer;

            options.forEach(option => {
                option.style.pointerEvents = "none";

                if (option.textContent === correctAnswer) {
                    option.style.fontWeight = "bold";
                    option.style.color = "green";
                }

                if (option.classList.contains("selected")) {
                    if (option.textContent === correctAnswer) {
                        score++;
                    } else {
                        option.style.color = "red";
                    }
                }
            });

            item.querySelector(".explanation").style.display = "block";
        });

        const totalQuestions = quizData.length;
        const percentageScore = ((score / totalQuestions) * 100).toFixed(2);

        resultContainer.innerHTML = `
            <p>Score: ${score} / ${totalQuestions}</p>
            <p>Percentage Score: ${percentageScore}%</p>
            <p>Time Taken: ${quizDuration - timeLeft} seconds</p>
        `;
    }

    function disableOptions() {
        const options = document.querySelectorAll(".question-item li");
        options.forEach(option => {
            option.style.pointerEvents = "none";
        });
    }

    function randomizeQuiz() {
        quizData = shuffleArray(quizData);
        quizData.forEach(question => {
            question.options = shuffleArray(question.options);
        });
    }

    function fetchQuizData() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                quizData = data;
                quizDuration = quizData.length * 60;
                timeLeft = quizDuration;
                displayQuestions();
            })
            .catch(error => console.error('Error fetching quiz data:', error));
    }

    fetchQuizData();
});
