const apikey = "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";
const examButton = document.getElementById("exam-button");
const examStatus = document.getElementById("exam-status");
const examResult = document.getElementById("exam-result");
const inputQuestions = document.getElementById("num-questions");
const inputRegression = document.getElementById("regression");
const inputGradient = document.getElementById("gradient-descent");
const inputMLP = document.getElementById("mlp");
const inputBackprop = document.getElementById("backpropagation");
const inputAutoregression = document.getElementById("autoregression");
const inputTransformers = document.getElementById("transformers");
const downloadButton = document.getElementById("download-button");
const examTitle = document.getElementById("exam-title");
const examTest = document.getElementById("exam-test");

async function generateExam() {
    let numQuestions = "" + inputQuestions.value;
    let numRegression = parseInt(inputRegression.value);
    let numGradient = parseInt(inputGradient.value);
    let numMLP = parseInt(inputMLP.value);
    let numBackprop = parseInt(inputBackprop.value);
    let numAutoregression = parseInt(inputAutoregression.value);
    let numTransformers = parseInt(inputTransformers.value);
    let currSum = numRegression + numGradient + numMLP + numBackprop + numAutoregression + numTransformers;
    if (currSum != 0) {
        numRegression = Math.floor(numRegression/currSum * numQuestions);
        numGradient = Math.floor(numGradient/currSum * numQuestions);
        numMLP = Math.floor(numMLP/currSum * numQuestions);
        numBackprop = Math.floor(numBackprop/currSum * numQuestions);
        numAutoregression = Math.floor(numAutoregression/currSum * numQuestions);
        numTransformers = numQuestions - numRegression - numGradient - numMLP - numBackprop - numAutoregression;
        numTransformers = (numTransformers > 0) ? numTransformers : 0;
    }
    else {
        numRegression = Math.floor(numQuestions/6);
        numGradient = numRegression;
        numMLP = numRegression;
        numBackprop = numRegression;
        numAutoregression = numRegression;
        numTransformers = numQuestions - numRegression - numGradient - numMLP - numBackprop - numAutoregression;
        numTransformers = (numTransformers > 0) ? numTransformers : 0;
    }
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apikey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages: [
                {role: "system", content: "You are a helpful assistant who is knowledgeable on the " +
                 "topic of neural networks and deep learning, specifically relating to natural language " +
                 "processing."
                },
                {role: "user", content: "Create a " + numQuestions + " question practice exam covering the following " +
                 "topics: linear/logistic regression, gradient descent, multilayer perceptrons, " +
                 "backpropagation, autoregressive models, and transformers. Include an equal mix of both " +
                 "computational questions with specific numbers and functions and conceptual questions. " +
                 "Include" + numRegression + "linear/logistic regression questions, " +
                 numGradient + "gradient descent questions, " +
                 numMLP + "multilayer perceptron questions, " +
                 numBackprop + "backpropagation regression questions, " +
                 numAutoregression + "autoregressive model questions, and " +
                 numTransformers + "transformer questions. " +
                 "Only include the questions themselves, with no introduction or conclusion text. " +
                 "Remember to only generate " + numQuestions + " questions. " +
                 "Do not mention which topics correspond to which question in your response."/*+
                 "Tag each question with the topic(s) it covers and provide the tag in parentheses in full" +
                 "capitalization at the beginning of each question (e.g. (Topic) 1. )."*/
                }
            ]
        })
    };
    try {
        examStatus.innerHTML = "Generating exam, please wait...";
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        examStatus.innerHTML = "Done!";
        examResult.innerHTML = data["choices"][0]["message"]["content"];
        downloadButton.style.display = "block";
        examTitle.style.display = "block";
    }
    catch (error) {
        console.log(error);
    }
}

async function generateExamAlt() {
    let numQuestions = parseInt(inputQuestions.value);
    let numRegression = parseInt(inputRegression.value);
    let numGradient = parseInt(inputGradient.value);
    let numMLP = parseInt(inputMLP.value);
    let numBackprop = parseInt(inputBackprop.value);
    let numAutoregression = parseInt(inputAutoregression.value);
    let numTransformers = parseInt(inputTransformers.value);
    let currSum = numRegression + numGradient + numMLP + numBackprop + numAutoregression + numTransformers;
    if (currSum != 0) {
        numRegression = Math.floor(numRegression/currSum * numQuestions);
        numGradient = Math.floor(numGradient/currSum * numQuestions);
        numMLP = Math.floor(numMLP/currSum * numQuestions);
        numBackprop = Math.floor(numBackprop/currSum * numQuestions);
        numAutoregression = Math.floor(numAutoregression/currSum * numQuestions);
        numTransformers = numQuestions - numRegression - numGradient - numMLP - numBackprop - numAutoregression;
        numTransformers = (numTransformers > 0) ? numTransformers : 0;
    }
    else {
        numRegression = Math.floor(numQuestions/6);
        numGradient = numRegression;
        numMLP = numRegression;
        numBackprop = numRegression;
        numAutoregression = numRegression;
        numTransformers = numQuestions - numRegression - numGradient - numMLP - numBackprop - numAutoregression;
        numTransformers = (numTransformers > 0) ? numTransformers : 0;
    }
    let topicList = [
        {topic: "linear/logistic regression", count: numRegression},
        {topic: "gradient descent", count: numRegression},
        {topic: "multilayer perceptrons", count: numMLP},
        {topic: "backpropagation", count: numBackprop},
        {topic: "autoregressive models", count: numAutoregression}, 
        {topic: "transformers", count: numTransformers}
    ];
    try {
        examTest.innerHTML = "";
        downloadButton.style.display = "none";
        examTitle.style.display = "none";
        examStatus.innerHTML = "Generating exam, please wait...";
        let examBlock = document.createDocumentFragment();
        let currTopic, currOption;
        let questionNumber = 1;
        while (numQuestions > 0) {
            if (topicList[0].count === 0) {
                topicList = topicList.slice(1);
            }
            currTopic = topicList[0].topic;
            currOption = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apikey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4-1106-preview",
                    messages: [
                        {role: "system", content: "You are a helpful assistant who is knowledgeable on the " +
                         "topic of neural networks and deep learning, specifically relating to natural language " +
                         "processing."
                        },
                        {role: "user", content: "Create a practice exam question on the topic of " + currTopic + ". " +
                         "Make this question" + ((Math.random() < 0.5) ? "conceptual" : "computational with specific numbers and functions") + ". " +
                         "Only include the question itself, with no introduction or conclusion text. " +
                         "Remember to only generate 1 question. " +
                         "Do not mention which topic the current question is about in your response."
                        }
                    ]
                })
            };
            let response = await fetch("https://api.openai.com/v1/chat/completions", currOption);
            let data = await response.json();
            let questionBlock = document.createElement("div");
            questionBlock.id = "q-block" + questionNumber;
            let currQuestion = document.createElement("p");
            currQuestion.id = "exam-q" + questionNumber;
            currQuestion.innerHTML = questionNumber + ". " + data["choices"][0]["message"]["content"];
            let answerSpace = document.createElement("textarea");
            answerSpace.id = "exam-a" + questionNumber;
            answerSpace.setAttribute("cols", "75");
            answerSpace.setAttribute("rows", "5");
            let currSubmit = document.createElement("button");
            currSubmit.id = "check-q" + questionNumber;
            currSubmit.innerHTML = "Check Answer";
            questionBlock.appendChild(currQuestion);
            questionBlock.appendChild(answerSpace);
            questionBlock.appendChild(document.createElement("br"));
            questionBlock.appendChild(currSubmit);
            examBlock.appendChild(questionBlock);
            numQuestions--;
            topicList[0].count--;
            questionNumber++;
        }
        examTest.appendChild(examBlock);
        downloadButton.style.display = "block";
        examTitle.style.display = "block";
        examStatus.innerHTML = "Done!";
    }
    catch (error) {
        console.log(error);
    }
}

function downloadPDF() {
    let currWindow = window.open("", "PRINT");
    let currExam = document.getElementById("exam-result").innerHTML;
    currWindow.document.write(currExam);
    currWindow.document.close();
    currWindow.focus();
    currWindow.print();
    currWindow.close();
    return true;
}

async function gradeQuestion(event) {
    if (event.target.id.includes("check-q")) {
        let questionNumber = event.target.id.substring(7);
        let currBlock = document.getElementById("q-block" + questionNumber);
        let currQuestion = document.getElementById("exam-q" + questionNumber).innerHTML.substring(3);
        let currAnswer = document.getElementById("exam-a" + questionNumber).value;
        let currSubmit = document.getElementById("check-q" + questionNumber);
        let evaluation = document.getElementById("evaluation-q" + questionNumber);
        if (!evaluation) {
            evaluation = document.createElement("p");
            evaluation.id = "evaluation-q" + questionNumber;
        }
        evaluation.innerHTML = "Grading response...";
        currBlock.appendChild(evaluation);
        console.log(currQuestion);
        console.log(currAnswer);
        let currOption = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apikey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4-1106-preview",
                messages: [
                    {role: "system", content: "You are a helpful assistant who is knowledgeable on the " +
                     "topic of neural networks and deep learning, specifically relating to natural language " +
                     "processing."
                    },
                    {role: "user", content: "The following question was included as part of an exam " +
                     "on the subject of neural networks and deep learning for natural language processing: " +
                     currQuestion + ". The following answer was then provided: " + currAnswer +
                     ". State whether this answer was correct or incorrect, provide a detailed " +
                     "explanation of the correct answer, and note down errors/flaws in the answer" +
                     "if it was incorrect."
                    }
                ]
            })
        };
        let response = await fetch("https://api.openai.com/v1/chat/completions", currOption);
        let data = await response.json();
        evaluation.innerHTML = currAnswer.length === 0 ? "No answer given." : data["choices"][0]["message"]["content"];
        currSubmit.innerHTML = "Recheck Answer";
    }
}

examButton.addEventListener("click", generateExamAlt);
downloadButton.addEventListener("click", downloadPDF);
examTest.addEventListener("click", gradeQuestion);
