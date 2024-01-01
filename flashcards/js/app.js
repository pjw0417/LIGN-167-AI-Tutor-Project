const question = document.querySelector('.question');
const checkButton = document.querySelector('.check');
const nextButton = document.querySelector('.next');
const answer = document.querySelector('.answer');
const generateButton = document.getElementById('generate');
const numberOfFlashCards = document.getElementById("number_of_flashcards");
const loading = document.getElementById("loading");

loading.style.display = 'none';


const apikey = "Your Own API Keys"



//let flashcardData = "";
let flashcardDict = {};

generateButton.addEventListener('click', async () => {
    loading.style.display = 'block';
    //get the stuff from chatgpt
    let numcards = numberOfFlashCards.value;
    let numTopics = 0;
    let topics = [];
    for(let i = 1; i <=6; i++){
        let checkbox = document.getElementById(`checkbox${i}`);
        if(checkbox.checked){
            let label = document.querySelector(`label[for='checkbox${i}']`).textContent;
            topics.push(label);
            numTopics++; // Increment the counter
        }
    }
    let textString = topics.join(', ');
    console.log(textString); // Output the text string
    console.log("Number of topics selected: " + numTopics);

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
                {role: "user", content: "Create" + numcards + " flashcards covering the following topics" +
                 textString + "Include an equal mix of both computational questions with specific numbers" +
                 "and functions and conceptual questions. Only include the questions themselves, with no" +
                 "introduction or conclusion text. I need each item formatted as" +
                 "'Front: [question or key term]' followed by a newline, then 'Back: [answer or explanation]' followed by another newline." +
                 "Please ensure there are no additional words or numbers, just this structure." +
                 "Remember to only generate " + numcards + " questions. " +
                 "Do not mention which topics correspond to which question in your response."
                }
            ]
        })
    };
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const jsondata = await response.json();
        let gptdata = jsondata.choices[0].message.content;
        //let flashcardData = JSON.stringify(gptdata);
        let flashcardParts = gptdata.split("\n\n");
        console.log(flashcardParts);
        flashcardParts.forEach(part => {
            let lines = part.split("\n"); // Split each part into Front and Back
            if (lines.length === 2) {
                let front = lines[0].replace("Front: ", "").trim();
                let back = lines[1].replace("Back: ", "").trim();
                flashcardDict[front] = back;
            }
        });
        data = Object.entries(flashcardDict);
        loading.style.display = 'none';
    }
    catch (error) {
        console.log(error);
    }

});

function getRandomQuestion(){
    randomQuestion = data[Math.floor(Math.random()*data.length)]
    question.innerHTML = `<h3>${randomQuestion[0]}</h3>`
    answer.innerHTML = `<h3>${randomQuestion[1]}</h3>`
    answer.style.display = 'none'

};
checkButton.addEventListener('click', function(){
    console.log("Clicked check answer");
    answer.style.display = 'block';
})

nextButton.addEventListener('click', function(){
    console.log("Clicked next card");
    getRandomQuestion();
});

