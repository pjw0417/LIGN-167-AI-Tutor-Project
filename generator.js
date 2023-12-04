const apikey = "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";
const examButton = document.getElementById("exam-button");
const examStatus = document.getElementById("exam-status");
const examResult = document.getElementById("exam-result");

async function generateExam() {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apikey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {role: "system", content: "You are a helpful assistant who is knowledgeable on the" +
                 "topic of neural networks and deep learning, specifically relating to natural language" +
                 "processing."},
                {role: "user", content: "Create a 20 question practice exam covering the following" +
                 "topics: linear/logistic regression, gradient descent, multilayer perceptrons," +
                 "backpropagation, autoregressive models, and transformers. Include an equal mix of both" +
                 "computational questions with specific numbers and functions and conceptual questions." +
                 "Only include the questions themselves, with no introduction or conclusion text." +
                 "Add the title 'LIGN 167 Practice Exam' at the beginning. Remember to only generate 20 questions."}
            ]
        })
    };
    try {
        examStatus.innerHTML = "Generating exam, please wait...";
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        examStatus.innerHTML = "Done!";
        examResult.innerHTML = data["choices"][0]["message"]["content"];
    }
    catch (error) {
        console.log(error);
    }
}

examButton.addEventListener("click", generateExam);