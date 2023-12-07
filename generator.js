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
const pdfRegex = /\([A-Z/]\)/g;

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
                {role: "system", content: "You are a helpful assistant who is knowledgeable on the" +
                 "topic of neural networks and deep learning, specifically relating to natural language" +
                 "processing."
                },
                {role: "user", content: "Create a " + numQuestions + " question practice exam covering the following" +
                 "topics: linear/logistic regression, gradient descent, multilayer perceptrons, " +
                 "backpropagation, autoregressive models, and transformers. Include an equal mix of both" +
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

examButton.addEventListener("click", generateExam);
downloadButton.addEventListener("click", downloadPDF);