let questions = [];
let state = {
    rightAnswerCount: 0,
    wrongAnswerCount: 0
};

function clean(t) {
    t = t.replace(/ă/g, 'a');
    t = t.replace(/â/g, 'a');
    t = t.replace(/ș/g, 's');
    t = t.replace(/ş/g, 's');
    t = t.replace(/ţ/g, 't');
    t = t.replace(/ț/g, 't');
    t = t.replace(/þ/g, 't');
    t = t.replace(/î/g, 'i');
    t = t.replace(/Î/g, 'I');
    t = t.replace(/„/g, '\"');
    t = t.replace(/“/g, '\"');
    t = t.replace(/autovehicul/g, 'vehicul');
    t = t.replace(/Autovehicul/g, 'Vehicul');

    return t;
}

function check(question) {
    console.log(question);

    let userAnswers = question.answers.filter((answer) => {
        return answer.isCorrect;
    });

    let found = false;
    questions.forEach((q) => {
        let matched = (
            q.title === question.title
            && q.answers.length === question.answers.length
            && q.answers.every((value, index) => value.text === question.answers[index].text)
        );

        if (matched) {
            console.log(q);

            found = true;
            chrome.runtime.sendMessage({action: "increment", id: q.id}, (response) => {});

            let correctAnswers = [];
            q.answers.forEach((value) => {
                if (value.isCorrect) {
                    correctAnswers.push(value.text);
                }
            });

            if (!(
                userAnswers.length === correctAnswers.length
                && userAnswers.every((value, index) => value.text === correctAnswers[index])
            )) {
                alert("Raspunsuri corecte: \n\n"+correctAnswers.join("\n\n"));
            }
        }
    });

    if (!found) {
        setTimeout(addQuestion,1000,state.rightAnswerCount,question);
    }

    console.log("=====================");
}

function addQuestion(rightAnswerCount, question) {
    updateCounts();

    if (state.rightAnswerCount > rightAnswerCount) {
        console.log("add");
 
        chrome.runtime.sendMessage({action: "add", question: question}, function(response) {});
    }
}
function updateCounts() {
    if (document.querySelector('.correct-answers span') !== null) {
        state.rightAnswerCount = parseInt(document.querySelector('.correct-answers span').innerText);
    }
    if (document.querySelector('.wrong-answers span') !== null) {
        state.wrongAnswerCount = parseInt(document.querySelector('.wrong-answers span').innerText);
    }

    console.log(state);
}

function getCurrentQuestion() {
    return {
        title: clean(document.querySelector('h1.questions-title').innerText),
        answers: [...document.querySelectorAll('.question')].map((el) => {
            let text = clean(el.querySelector('.question-title').innerText);
            let isCorrect = el.className.indexOf('selected') !== -1;

            return {
                text: text,
                isCorrect: isCorrect
            };
        })
    };
}

window.addEventListener('load', (event) => {
    chrome.runtime.sendMessage({action: "questions"}, function(response) {
        questions = response.questions;
    });

    document.addEventListener('click', (event) => {
        // If the clicked element doesn't have the right selector, bail
        if (
            event.target.className === 'btn btn-4'
            || event.target.parentElement.className === 'btn btn-4'
        ) {
            updateCounts();

            let question = getCurrentQuestion();
            check(question);
        }

    }, false);
});
