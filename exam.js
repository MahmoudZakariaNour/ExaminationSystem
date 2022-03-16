const categories = ["Linux", "DevOps", "Code", "CMS", "Docker", "SQL"];

const timerLbl = document.getElementById("timerLbl");
const userLbl = document.getElementById("userLbl");
const questionLbl = document.getElementById("questionLbl");
const questionTypeLbl = document.getElementById("questionTypeLbl");
const questionNoLbl = document.getElementById("questionNoLbl");
const gradeLbl = document.getElementById("gradeLbl");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const stopBtn = document.getElementById("stop");
const answersRadios = document.getElementsByName("answers");
const answersLabels = document.getElementsByName("answersLbl");

const selectedCategory = sessionStorage.getItem("Category");
const LoggedUser = sessionStorage.getItem("User");
const selectedDifficulty = sessionStorage.getItem("Difficulty");

let requestURL = 'https://quizapi.io/api/v1/questions?apiKey=CjpszrbUynVKWrkVQXbT681Dj4jfNNf3z5hNwMCF&limit=20';
let examJSON;
let timerInterval;
let selectedQuestion = 0;
let selectedAnswers = [];
let examFinished = false;
let remainingTime = 120;

if (selectedCategory > 0) {
    requestURL += `&category=${categories[selectedCategory - 1]}`;
}
if (selectedDifficulty != null) {
    if (selectedDifficulty == "Easy" || selectedDifficulty == "Medium" || selectedDifficulty == "Hard") {
        requestURL += `&difficulty=${selectedDifficulty}`;
    }
    console.log(selectedDifficulty);
}
userLbl.innerText = `Student Name : ${LoggedUser}`;


nextBtn.addEventListener("click", function () {
    selectedQuestion++;
    if (selectedQuestion > 19) selectedQuestion = 0;
    UpdateQuestion();
});
prevBtn.addEventListener("click", function () {

    selectedQuestion--;
    if (selectedQuestion < 0) selectedQuestion = 19;
    UpdateQuestion();
});

stopBtn.addEventListener("click", FinishExam);

for (let index = 0; index < answersRadios.length; index++) {
    const radio = answersRadios[index];
    radio.addEventListener("click", function () {
        if (examJSON[selectedQuestion]["multiple_correct_answers"] == 'true') {
            var multiSelected = [];
            for (let index = 0; index < 6; index++) {
                multiSelected[index] = answersRadios[index].checked;
            }
            selectedAnswers[selectedQuestion] = multiSelected;
        } else {
            selectedAnswers[selectedQuestion] = this.value;

        }
    });
}

fetch(requestURL, { method: 'GET', redirect: 'follow' })
    .then(response => response.text())
    .then(result => {
        examJSON = JSON.parse(result);
        UpdateQuestion();
        TimerTick();
        timerInterval = setInterval(TimerTick, 1000);
        console.log(examJSON);
    })
    .catch(error => console.log('error', error));


function UpdateQuestion() {
    let question = examJSON[selectedQuestion];
    questionNoLbl.innerText = `Question ${selectedQuestion + 1} of 20`;
    questionTypeLbl.innerText = `${question.difficulty} Question in ${question.category}|${question.tags[0]['name']}`

    questionLbl.innerText = question.question;
    answersLabels[0].innerText = question.answers["answer_a"];
    answersLabels[1].innerText = question.answers["answer_b"];
    answersLabels[2].innerText = question.answers["answer_c"];
    answersLabels[3].innerText = question.answers["answer_d"];
    answersLabels[4].innerText = question.answers["answer_e"];
    answersLabels[5].innerText = question.answers["answer_f"];

    for (let index = 0; index < 6; index++) {

        answersRadios[index].checked = false;

        if (question["multiple_correct_answers"] == 'true') {
            answersRadios[index].type = "checkbox";
            if (selectedAnswers[selectedQuestion])
                answersRadios[index].checked = selectedAnswers[selectedQuestion][index];

        } else {
            answersRadios[index].type = "radio";
            if (selectedAnswers[selectedQuestion] - 1 == index) {
                answersRadios[index].checked = true;
            }
        }
        if (answersLabels[index].innerText == "") {
            answersRadios[index].style.visibility = "hidden";
        } else {
            answersRadios[index].style.visibility = "visible";
        }

    }
    if (examFinished) {
        ShowCorrect();

    }
}

function FinishExam() {
    if (examFinished) {
        window.location.replace("index.html");

    } else {

        examFinished = true;
        clearInterval(timerInterval);
        ShowCorrect();
        stopBtn.innerText = "Take a new Quiz";
        for (let index = 0; index < answersRadios.length; index++) {
            const radio = answersRadios[index];
            radio.disabled = true;
        }
        var grade = 0;
        for (let index = 0; index < examJSON.length; index++) {
            const question = examJSON[index];
            // console.log(question["correct_answers"]);
            if (question["multiple_correct_answers"] == 'true') {
                let quesAnswers = selectedAnswers[index];
                if (quesAnswers) {
                    let correct = true;
                    for (let i = 0; i < quesAnswers.length; i++) {
                        const isChecked = quesAnswers[i];

                        switch (i + 1) {
                            case 1:
                                // console.log(isChecked ^ question["correct_answers"]["answer_a_correct"] == "true");
                                if (isChecked ^ question["correct_answers"]["answer_a_correct"] == "true") {
                                    correct = false;

                                }
                                break;
                            case 2:
                                // console.log(isChecked ^ question["correct_answers"]["answer_b_correct"] == "true");

                                if (isChecked ^ question["correct_answers"]["answer_b_correct"] == "true") {
                                    correct = false;

                                }
                                break;
                            case 3:
                                // console.log(isChecked ^ question["correct_answers"]["answer_c_correct"] == "true");

                                if (isChecked ^ question["correct_answers"]["answer_c_correct"] == "true") {
                                    correct = false;
                                }
                                break;
                            case 4:
                                // console.log(isChecked ^ question["correct_answers"]["answer_d_correct"] == "true");

                                if (isChecked ^ question["correct_answers"]["answer_d_correct"] == "true") {
                                    correct = false;
                                }
                                break;
                            case 5:
                                // console.log(isChecked ^ question["correct_answers"]["answer_e_correct"] == "true");

                                if (isChecked ^ question["correct_answers"]["answer_e_correct"] == "true") {
                                    correct = false;
                                }
                                break;
                            case 6:
                                // console.log(isChecked ^ question["correct_answers"]["answer_f_correct"] == "true");

                                if (isChecked ^ question["correct_answers"]["answer_f_correct"] == "true") {
                                    correct = false;
                                }
                                break;

                        }
                        if (!correct) break;
                    }
                    if (correct)
                        grade++;
                }

            } else {

                switch (selectedAnswers[index]) {
                    case '1':
                        if (question["correct_answers"]["answer_a_correct"] == "true") {
                            grade++;
                        }
                        break;
                    case '2':
                        if (question["correct_answers"]["answer_b_correct"] == "true") {
                            grade++;
                        }
                        break;
                    case '3':
                        if (question["correct_answers"]["answer_c_correct"] == "true") {
                            grade++;
                        }
                        break;
                    case '4':
                        if (question["correct_answers"]["answer_d_correct"] == "true") {
                            grade++;
                        }
                        break;
                    case '5':
                        if (question["correct_answers"]["answer_e_correct"] == "true") {
                            grade++;
                        }
                        break;
                    case '6':
                        if (question["correct_answers"]["answer_f_correct"] == "true") {
                            grade++;
                        }
                        break;
                }
            }

        }
        gradeLbl.innerText = `Grade is ${grade} out of 20 (${Math.floor(grade/20*100)}%)`;
        if (grade > 9) {
            userLbl.style.backgroundColor = "green";
        } else {
            userLbl.style.backgroundColor = "red";

        }
        console.log(`Grade is ${grade} out of 20`);
    }
}

function ShowCorrect() {
    let question = examJSON[selectedQuestion];
    if (question["correct_answers"]["answer_a_correct"] == "true") {
        answersLabels[0].style.background = "green";
    } else {
        answersLabels[0].style.background = "red";

    }
    if (question["correct_answers"]["answer_b_correct"] == "true") {
        answersLabels[1].style.background = "green";
    } else {
        answersLabels[1].style.background = "red";

    }
    if (question["correct_answers"]["answer_c_correct"] == "true") {
        answersLabels[2].style.background = "green";
    } else {
        answersLabels[2].style.background = "red";

    }
    if (question["correct_answers"]["answer_d_correct"] == "true") {
        answersLabels[3].style.background = "green";
    } else {
        answersLabels[3].style.background = "red";

    }
    if (question["correct_answers"]["answer_e_correct"] == "true") {
        answersLabels[4].style.background = "green";
    } else {
        answersLabels[4].style.background = "red";

    }
    if (question["correct_answers"]["answer_f_correct"] == "true") {
        answersLabels[5].style.background = "green";
    } else {
        answersLabels[5].style.background = "red";

    }
}

function TimerTick() {
    remainingTime--;
    let remMin = Math.floor(remainingTime / 60);
    let remSec = remainingTime % 60;
    timerLbl.innerText = `${remMin}:${remSec}`;
    if (remainingTime < 1) {
        FinishExam();
    }
}