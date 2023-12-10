const apikey = "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"
const generateCheatSheetButton = document.getElementById('generate-cheatsheet');
const cheatSheetStatus = document.getElementById('cheatsheet-status');
const cheatSheetResult = document.getElementById('cheatsheet-result');
const cheatSheetType = document.getElementById('cheatsheet-type');
const inputPages = document.getElementById("num-pages");
const inputSupervisedLearning = document.getElementById("supervised-learning")
const inputLinearRegression= document.getElementById("linear-regression");
const inputLogisticRegression = document.getElementById("logistic-regression")
const inputGradient = document.getElementById("gradient-descent");
const inputOptimization = document.getElementById("optimization-through-gradient-descent");
const inputPytorch = document.getElementById("deep-learning-using-Pytorch");
const inputMLP = document.getElementById("mlp");
const inputBackprop = document.getElementById("backpropagation");
const inputAutoregressionmodel = document.getElementById("autoregressive-models");
const inputAutoregressivelangmodel = document.getElementById("autoregressive-langueage-modeling");
const inputTransformers = document.getElementById("transformers");
const inputAttention = document.getElementById("attention-in-transformers");
const inputMask = document.getElementById("masked-language-modeling");
const inputFuture= document.getElementById("the-future-of-language-modeling");
const downloadButton = document.getElementById("download-button");
const cheatsheetTitle = document.getElementById("cheatsheet-title");
const pdfRegex = /\([A-Z/]\)/g;

function convertLatexToPlainText(latexContent) {
  let plainText = latexContent
      .replace(/\\textbf\{(.*?)\}/g, '**$1**') // Bold
      .replace(/\\textit\{(.*?)\}/g, '*$1*')   // Italics
      .replace(/\$\$(.*?)\$\$/g, '$1')         // Display Math
      .replace(/\$(.*?)\$/g, '$1')             // Inline Math
      .replace(/^## (.*$)/gim, '$1')           // Header
      // Add more replacements here for other LaTeX commands as needed

  return plainText;
}


async function generateCheatsheet() {
  let numPages = Math.max(1, Math.min(parseInt(inputPages.value, 10), 5));
  let topics = [];

  if (inputSupervisedLearning.checked) topics.push("supervised learning");
  if (inputLinearRegression.checked) topics.push("linear regression");
  if (inputLogisticRegression.checked) topics.push ("logistic regression")
  if (inputGradient.checked) topics.push ("gradient-descent")
  if (inputOptimization.checked) topics.push ("optimization through gradient-descent")
  if (inputPytorch.checked) topics.push ("deep learning using Pytorch")
  if (inputMLP.checked) topics.push ("mlp")
  if (inputBackprop.checked) topics.push ("backpropagation")
  if (inputAutoregressionmodel.checked) topics.push ("autoregressive models")
  if (inputAutoregressivelangmodel.checked) topics.push ("autoregressive langueage modeling")
  if (inputTransformers.checked) topics.push ("trasnformers")
  if (inputAttention.checked) topics.push ("attention in transformers")
  if (inputMask.checked) topics.push ("the future of language modeling")

  let topicsString = topics.join(", ");

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
              {role: "user", content: `Create a ${numPages} pages cheatsheet covering the following topics: ${topicsString}. 
              Include an equal mix of both computational questions with specific numbers and functions and conceptual questions. 
              Remember to only generate ${numPages} pages.`}
            ]
        })
      };

      try {
        cheatSheetStatus.innerHTML = "Generating Cheatsheet, please wait...";
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();

        const latexContent = data["choices"][0]["message"]["content"];
        // Convert LaTeX content to plain text
        const plainTextContent = convertLatexToPlainText(latexContent);

        cheatSheetStatus.innerHTML = "Done!";
        cheatSheetResult.innerHTML = plainTextContent
        downloadButton.style.display = "block";
        cheatsheetTitle.style.display = "block";
    }
    catch (error) {
        console.log(error);
    }
}

function downloadPDF() {
  let currWindow = window.open("", "PRINT");
  let currSheet = document.getElementById("cheatsheet-result").innerHTML;
  currWindow.document.write(currSheet);
  currWindow.document.close();
  currWindow.focus();
  currWindow.print();
  currWindow.close();
  return true;
}

generateCheatSheetButton.addEventListener("click", generateCheatsheet);
downloadButton.addEventListener("click", downloadPDF);