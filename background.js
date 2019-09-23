let firebaseConfig = {
    apiKey: "AIzaSyDChmgE-mgDR_Ed96iRY-p1HznvU2LDHSw",
    authDomain: "drpciv-helper.firebaseapp.com",
    databaseURL: "https://drpciv-helper.firebaseio.com",
    projectId: "drpciv-helper",
    storageBucket: "drpciv-helper.appspot.com",
    messagingSenderId: "919428724542",
    appId: "1:919428724542:web:1787002d270bb566"
};

let questions = [];

let db = null;

firebase.initializeApp(firebaseConfig);
function getQuestions() {
    questions = [];
    db.collection("questions")
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id;

                questions.push(data);
            });
        });
}
function initApp() {
    db = firebase.firestore();

    getQuestions();
}

window.onload = function () {
    initApp();

    chrome.runtime.onMessage.addListener(
        (message, sender, sendResponse) => {
            switch (message.action) {
                case "questions":
                    sendResponse({questions: questions});
                    break;
                case "add":
                    db.collection("questions").doc().set(message.question)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });

                    sendResponse({});
                    break;
                case "increment":
                    let docRef = db.collection("questions").doc(message.id);
                    let data = docRef.get().data();
                    let asked = data.asked === undefined ? 1 : data.asked++;

                    docRef.set({asked: asked})
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });

                    sendResponse({});
                    break;
            }
        });
};
