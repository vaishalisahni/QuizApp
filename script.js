import { quizQuestions } from "./questions.js";

let levelMap=[
    {
        level:"basic",
        time:40,
        waitTime:4000
    },
    {
        level:"easy",
        time:25,
        waitTime:4000
    },
    {
        level:"medium",
        time:14,
        waitTime:4000
    },
    {
        level:"hard",
        time:10,
        waitTime:4000
    },
    {
        level:"veryHard",
        time:8,
        waitTime:2000
    },
    {
        level:"extreme",
        time:5,
        waitTime:1000
    },
    {
        level:"ultimate",
        time:3,
        waitTime:1000
    }
]

function startApp(){
    const startContainer=document.querySelector(".start-screen");
    const playBtn=document.querySelector(".play-btn");
    const level=document.getElementById("difficultyLevel");
    const numQuestions=document.getElementById("numQuestions");
    const quizApp=document.querySelector(".quiz-app");
    quizApp.style.display="none";
    startContainer.style.display="flex";
    
        playBtn.addEventListener("click",()=>{
            if(level.value!=="" && numQuestions.value!=="")
            runApp(numQuestions.value , level.value);
        });
        
    
}

function runApp(totalQuestionsCount,levelSelected){
    const startContainer=document.querySelector(".start-screen");
    const quizTimer=document.querySelector(".quiz-timer");
    const timerValue = document.querySelector(".quiz-timer-value");
    const progressBar = document.querySelector(".quiz-progress");
    const question = document.querySelector(".quiz-question-text");
    const options = document.querySelector(".quiz-options");
    const currentQuestion = document.querySelectorAll(".quiz-questions-current");
    const totalQuestions = document.querySelector(".quiz-questions-total");
    const questionContainer=document.querySelector(".quiz-question-container");
    const resultContainer=document.querySelector(".quiz-question-answers-container");
    const quizApp=document.querySelector(".quiz-app");
    quizApp.style.display="flex";
    startContainer.style.display="none";
    resultContainer.style.display="none";

    const selectedLevel = levelMap.find(lvl => lvl.level === levelSelected);

    let quizResult=[];
    let timer = selectedLevel.time; // timer base value in seconds
    let currentTimer = timer+1; // reset timer
    let waitTime=selectedLevel.waitTime;
    let currentQuestionIndex = -1;
    let isPaused=false;
    let numberOfQuestions=totalQuestionsCount;
    let questions = randomQuestions(numberOfQuestions);

    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex + 1) / numberOfQuestions) * 100;
        progressBar.style.width = progressPercentage + "%"; // Update progress bar width
    }

    function updateQuestion() {
        currentTimer=timer+1; //reset timer
        currentQuestionIndex++;
        const newQuestion = questions[currentQuestionIndex];
        currentQuestion.forEach((que) => {
            que.innerText = currentQuestionIndex + 1;
        });

        totalQuestions.innerText = questions.length;
        question.innerText = newQuestion.question;
        options.innerHTML = "";
        newQuestion.options.forEach(option => {
            const optionBtn = document.createElement("button");
            optionBtn.classList.add("quiz-option");
            const optionText = document.createElement("div");
            optionText.classList.add("quiz-option-text");
            optionText.innerText = option;
            const optionImage = document.createElement("img");
            optionImage.classList.add("quiz-option-image");
            optionBtn.append(optionText, optionImage);
            optionBtn.addEventListener('click', (e) => checkOption(e, newQuestion));
            options.append(optionBtn);
        });
        updateProgressBar();
    }
    function controlLogic(userAnswer=""){
        timerValue.innerText=timer;
        const currentQues=questions[currentQuestionIndex];
            quizResult.push(
                {
                    question:currentQues.question,
                    answer:currentQues.answer,
                    selectedAnswer:userAnswer.length>0?userAnswer:null,
                }
            );
            if (currentQuestionIndex === numberOfQuestions - 1){
                displayResult();
                quizTimer.style.display="none";
                clearInterval(interval);
            } 
        else{
            updateQuestion();
        }
    }
    function checkOption(event, question) {

        const optionText = event.currentTarget.querySelector(".quiz-option-text").innerText;
        const correctAnswer = question.answer;
        if (optionText === correctAnswer) {
            event.currentTarget.classList.add("correct");
        }
        else {
            event.currentTarget.classList.add("incorrect");
        }
        const allOptions = document.querySelectorAll(".quiz-option");
        allOptions.forEach(option => {
            if (option.innerText === question.answer) {
                option.classList.add("correct");
            }
        });
        options.querySelectorAll(".quiz-option").forEach(option => option.disabled = true);
        
        isPaused = true;
        setTimeout(() =>{
            isPaused = false;
            controlLogic(optionText)
        }, waitTime);
    }

    function randomQuestions(numberOfQues) {
        let newQuestions = [];
        for (let i = 0; i < numberOfQues; i++) {
            const randomIndex = Math.floor(Math.random() * quizQuestions.length);
            newQuestions.push(quizQuestions[randomIndex]);
        }
        return newQuestions;
    }

    timerValue.innerText=currentTimer-1;

    let interval=setInterval(()=>{
        if(!isPaused){
            currentTimer--;
            if(currentTimer===0) controlLogic();
            else timerValue.innerText=currentTimer-1;
        }
    },1000);

    function displayResult(){
        questionContainer.style.display="none";

        resultContainer.style.display="flex";
        resultContainer.innerHTML="";

        const scoreContainer=document.createElement("div");

        const scoreSpan=document.createElement("span");

        const score=quizResult.filter((result)=>result.selectedAnswer===result.answer).length;

        scoreSpan.innerHTML=`Score </br> ${score} / ${numberOfQuestions}`;
        scoreSpan.classList.add("resultant-quiz-score-text");
        if(score < (50*numberOfQuestions/100)){
            scoreSpan.style.color="#721c24";
            scoreSpan.style.backgroundColor="#f8d7da";
            scoreSpan.style.border="1px solid #f5c6cb";
        }
        else{
            scoreSpan.style.color="#155724";
            scoreSpan.style.backgroundColor="#b2ebbf";
            scoreSpan.style.border="1px solid #c3e6cb";
        }

        scoreContainer.append(scoreSpan);
        scoreContainer.classList.add("resultant-quiz-score");

        resultContainer.append(scoreContainer);

        quizResult.forEach((result, index)=>{
            const resultantQuestion=document.createElement("div");
            resultantQuestion.classList.add("resultant-quiz-question");
            
            const resultantQuestionText=document.createElement("h2");
            resultantQuestionText.classList.add("resultant-quiz-question-text");
            resultantQuestionText.innerText=`${index + 1}. ${result.question}`;
            resultantQuestion.append(resultantQuestionText);

            if( result.answer!==result.selectedAnswer)
            {
                const wrongOption=document.createElement("div");
                wrongOption.classList.add("correct-quiz-options","quiz-option","incorrect-answer");

                if(result.selectedAnswer!=null){
                    wrongOption.innerText="Selected:"+ result.selectedAnswer;
                }
                else{
                    wrongOption.innerText="Not Attempted";
                }
                resultantQuestion.append(wrongOption);
            }
        
            const correctOption=document.createElement("div");
            correctOption.classList.add("correct-quiz-options","quiz-option","correct-answer");
            correctOption.innerText="Correct:"+result.answer;

            resultantQuestion.append(correctOption);
            
            resultContainer.append(resultantQuestion);
        });
        
    }
    updateQuestion();
}

document.addEventListener("DOMContentLoaded",startApp);

