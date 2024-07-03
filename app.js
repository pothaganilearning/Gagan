document.addEventListener("DOMContentLoaded", function() {
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const submitButton = document.getElementById("submit-btn");
    const timeLeftSpan = document.getElementById("time-left");

    let quizData = [
        {
        "question": "Which of the following is an irrational number?",
        "options": ["4", "3", "52", "23"],
        "correct_answer": "23",
        "reason": "23 is not a perfect square and cannot be expressed as a simple fraction, making it an irrational number."
    },
    {
        "question": "Which of the following is a rational number?",
        "options": ["2−3", "2+3", "4−25", "5−9"],
        "correct_answer": "4−25",
        "reason": "4−25 is a rational number because it can be expressed as a fraction."
    },
    {
        "question": "The rational number that lies in between 2 and 3 is:",
        "options": ["32", "52", "12", "1"],
        "correct_answer": "32",
        "reason": "32 (1.5) lies between 2 and 3 on the number line."
    },
    {
        "question": "Which of the following rational numbers does not lie between 12 and 1?",
        "options": ["35", "710", "34", "65"],
        "correct_answer": "65",
        "reason": "65 (1.2) does not lie between 0.5 and 1 on the number line."
    },
    {
        "question": "Which of the following is not a factor of rational number 5005?",
        "options": ["11", "7", "5", "3"],
        "correct_answer": "3",
        "reason": "5005 is not divisible by 3."
    },
    {
        "question": "The product of prime factors of 3825 is:",
        "options": ["32×52×17", "32×53×13", "33×52×17", "33×51×7"],
        "correct_answer": "33×52×17",
        "reason": "The prime factorization of 3825 is 3^3 * 5^2 * 17."
    },
    {
        "question": "If 8232=21×3×7∗ then the value of n is:",
        "options": ["1", "2", "3", "4"],
        "correct_answer": "1",
        "reason": "Solving for n in the given equation results in n = 1."
    },
    {
        "question": "If 156=22×3×k then the value of k is:",
        "options": ["5", "7", "13", "11"],
        "correct_answer": "13",
        "reason": "Solving for k in the prime factorization of 156 gives k = 13."
    },
    {
        "question": "The H.C.F of 23×32×5 and 22×33×52 is:",
        "options": ["21×31×52", "21×32×5", "21×32×5", "2×3×5"],
        "correct_answer": "21×32×5",
        "reason": "The highest common factor is the product of the lowest powers of all common prime factors."
    },
    {
        "question": "The H.C.F of 120150 and 210 is k2−6 then the value of k is:",
        "options": ["6", "9", "36", "30"],
        "correct_answer": "6",
        "reason": "Solving the equation k^2 - 6 = H.C.F of 120, 150, and 210 results in k = 6."
    },
    {
        "question": "The H.C.F of 1723 and 29 is:",
        "options": ["1", "23", "17", "17×23×29"],
        "correct_answer": "1",
        "reason": "17, 23, and 29 are prime numbers with no common factors other than 1."
    },
    {
        "question": "The L.C.M of 23×3×5 and 22×5×7 is:",
        "options": ["1680", "420", "280", "840"],
        "correct_answer": "1680",
        "reason": "The lowest common multiple is the product of the highest powers of all prime factors."
    },
    {
        "question": "The product of two numbers is 1600 and their H.C.F is 5 then L.C.M is:",
        "options": ["8000", "1595", "320", "1605"],
        "correct_answer": "320",
        "reason": "Using the relationship H.C.F * L.C.M = product of the numbers, the L.C.M is 320."
    },
    {
        "question": "The L.C.M of two numbers is 216 and their H.C.F is 36. One number is 72, then the second number is:",
        "options": ["108", "180", "156", "144"],
        "correct_answer": "108",
        "reason": "Using the relationship H.C.F * L.C.M = product of the numbers, the second number is 108."
    },
    {
        "question": "The decimal form of 2125 is:",
        "options": ["0.8", "8.4", "0.48", "0.84"],
        "correct_answer": "0.8",
        "reason": "Dividing 21 by 25 gives 0.8."
    },
    {
        "question": "The decimal form of 2321S2 is:",
        "options": ["0.115", "0.023", "0.0115", "0.1015"],
        "correct_answer": "0.115",
        "reason": "Dividing 23 by 21 and converting to decimal form gives 0.115."
    },
    {
        "question": "π is a/an:",
        "options": ["irrational number", "rational number", "whole number", "natural number"],
        "correct_answer": "irrational number",
        "reason": "π is an irrational number as it cannot be expressed as a simple fraction."
    },
    {
        "question": "1.120120012000… is a:",
        "options": ["irrational number", "rational number", "whole number", "natural number"],
        "correct_answer": "irrational number",
        "reason": "The sequence does not terminate or repeat, making it an irrational number."
    },
    {
        "question": "Which of the following is an irrational number?",
        "options": ["227", "3.1416", "3.1416", "3.141141114…"],
        "correct_answer": "3.141141114…",
        "reason": "The sequence does not terminate or repeat, making it an irrational number."
    },
    {
        "question": "The decimal form of 137 is:",
        "options": ["0857142", "1.7857142", "1857142", "2.857142"],
        "correct_answer": "2.857142",
        "reason": "Dividing 137 gives the repeating decimal 2.857142."
    },
    {
        "question": "p is a prime number, then p is a:",
        "options": ["irrational number", "rational number", "whole number", "natural number"],
        "correct_answer": "whole number",
        "reason": "Prime numbers are whole numbers greater than 1."
    }
    ];

    let timerInterval;
    let quizDuration = quizData.length * 60; // Duration of the quiz in seconds
    let timeLeft = quizDuration;

    // Function to shuffle array elements randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to start the timer
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

    // Function to display questions and options
    function displayQuestions() {
        randomizeQuiz(); // Randomize quiz questions and options

        questionContainer.innerHTML = ''; // Clear previous questions

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

            // Add event listener for options selection
            const options = questionElement.querySelectorAll("li");
            options.forEach(option => {
                option.addEventListener("click", function() {
                    // Clear previous selection
                    options.forEach(opt => opt.classList.remove("selected"));
                    // Mark the selected option
                    option.classList.add("selected");
                });
            });
        });

        // Start timer once questions are displayed
        startTimer();
    }

    // Event listener for submit button
    submitButton.addEventListener("click", function() {
        if (timeLeft > 0) {
            // Allow submission only if time is up
            submitQuiz();
        }
    });

    // Function to submit quiz and calculate score
    function submitQuiz() {
        clearInterval(timerInterval); // Stop the timer
        let score = 0;
        const questionItems = document.querySelectorAll(".question-item");

        questionItems.forEach((item, index) => {
            const options = item.querySelectorAll("li");
            const correctAnswer = quizData[index].correct_answer;

            options.forEach(option => {
                option.style.pointerEvents = "none"; // Disable further clicks

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

    // Function to disable options once time is up
    function disableOptions() {
        const options = document.querySelectorAll(".question-item li");
        options.forEach(option => {
            option.style.pointerEvents = "none";
        });
    }

    // Function to randomize quizData array and options within each question
    function randomizeQuiz() {
        quizData = shuffleArray(quizData);
        quizData.forEach(question => {
            question.options = shuffleArray(question.options);
        });
    }

    // Initial function call to display randomized questions
    displayQuestions();
});
