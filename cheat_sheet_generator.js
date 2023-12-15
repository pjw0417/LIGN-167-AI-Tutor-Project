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
const feedbackForm = document.getElementById('feedback-form');
const feedbackInput = document.getElementById('feedback-input');

function convertLatexToPlainText(latexContent) {
  let plainText = latexContent
      // Remove bold and italics symbols
      .replace(/[\*_]{2}(.*?)[\*_]{2}/g, '$1') // Bold and Italics
      // Convert LaTeX equations to readable format
      .replace(/\$\$(.*?)\$\$/g, 'Equation: $1') // Display Math
      .replace(/\$(.*?)\$/g, '$1') // Inline Math
      // Remove LaTeX specific commands
      .replace(/\\textbf\{(.*?)\}/g, '$1') // Bold
      .replace(/\\textit\{(.*?)\}/g, '$1') // Italics
      .replace(/\\begin\{.*?\}(.*?)\\end\{.*?\}/gs, 'List: $1') // Lists
      .replace(/\\item/g, ' -') // List items
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)') // Fractions
      .replace(/\\left\[(.*?)\\right\]/g, '[$1]') // Brackets
      .replace(/\\sqrt\{(.*?)\}/g, 'sqrt($1)') // Square root
      .replace(/\\overline\{(.*?)\}/g, 'Mean of $1') // Overline (mean)
      .replace(/\\underline\{(.*?)\}/g, '$1') // Underline
      .replace(/_\\?{(.*?)}/g, ' subscript $1') // Convert subscripts
      .replace(/\^\\?{(.*?)}/g, ' to the power of $1') // Convert superscripts
      .replace(/\\text\{(.*?)\}/g, '$1') // Convert \text{} to plain text
      .replace(/\\(?:right|left)/g, '') // Remove \right and \left
      .replace(/\\[a-zA-Z]+\{(.*?)\}/g, '$1') // Generic command \command{content}
      .replace(/\\[a-zA-Z]+/g, '') // Standalone LaTeX command \command
      .replace(/[\$]{1,2}/g, '') // Remove $ symbols
      // Remove Markdown heading symbols
      .replace(/^#+\s+/gm, '') // Remove hash symbols used for headings
      // Additional patterns can be added here
  return plainText;
}



async function generateCheatsheet(feedback = "") {
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
  let userContent = `Create a ${numPages}-page cheatsheet for UCSD LIGN167: Deep Learning for Natural Language Understanding, covering these topics: ${topics.join(", ")}.`;

  if (feedback) {
    userContent += ` Feedback: ${feedback}`;
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
              {role: "user", content: `Assuming you are writing on a A4 size double space with 12 fonts size 'Times New Roman' font, create a ${numPages}-pages (set 1,000 words per each page.) cheatsheet for UCSD LIGN167: Deep Learning for Natural Language Understanding, 
              covering these topics: ${topicsString}. Remember each page has to be at least 1,000 words.
              The content should include clear and concise definitions and formulas, essential for exam preparation. 
              Each formula and concept should be accompanied by step-by-step explanations to facilitate understanding.
              
              Key points and formulas should use all capital letters. Start a new line for every new topic, using line breaks for separation. 
              Use bullet points (•) for listing items. Ensure the layout is clean, organized, and easy on the eyes, with ample spacing and clear section headings. 
              Avoid using Latex formatting.

              Include example problems with solutions to illustrate the practical application of the theories and formulas. 
              Each topic should conclude with a summary section, recapping the most important points for quick revision.
              
              Focus on making the cheatsheet informative, student-friendly, and especially useful for exam preparation, with all information presented in a readable and visually appealing manner. 
              Always end with a motivational message to do well on a exam!`}
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

        cheatSheetStatus.innerHTML = "Review and Provide Feedback!";
        cheatSheetResult.innerHTML = plainTextContent
        document.getElementById('feedback-status').innerHTML = "Incorporated feedback! Feel free to suggest better feedback!";
        downloadButton.style.display = "block";
        cheatsheetTitle.style.display = "block";
        feedbackForm.style.display = "block";
    }
    catch (error) {
        console.log(error);
    }
}

function handleFeedbackSubmit(event) {
  event.preventDefault(); // Prevent page reload
  const feedback = feedbackInput.value.trim();
  if (feedback) {
    document.getElementById('feedback-status').innerHTML = "Incorporating feedback and regenerating cheatsheet, please wait...";
    generateCheatsheet(feedback);
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
feedbackForm.addEventListener("submit", handleFeedbackSubmit);
downloadButton.addEventListener("click", downloadPDF);