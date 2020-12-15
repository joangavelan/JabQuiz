import Quiz from "./quiz.js"
import Question from "./question.js";

const App = (() => {
    //cache the DOM
    const quizQuestion = document.querySelector('.jabquiz__question');
    const tracker = document.querySelector('.jabquiz__tracker');
    const tagline = document.querySelector('.jabquiz__tagline');
    const progressBar = document.querySelector('.progress__inner');
    const choices = document.querySelector('.jabquiz__choices');
    const nextButton = document.querySelector('.next');
    const restartButton = document.querySelector('.restart'); 

    //Questions
    const q1 = new Question(
        "Who's the first president of the United States?",
        ['Martin Luther King', 'Abraham Lincoln', 'George Washington', 'Barack Obama'],
        2
    );
    const q2 = new Question(
        "When was Javascript created?",
        ["June 1995", "May 1995", "July 1885", "Sep 1996"],
        1
      )
    const q3 = new Question(
        "What does CSS stand for?",
        ["County Sheriff Service", "Cascading sexy sheets", "Cascading style sheets"],
        2
      )
    const q4 = new Question(
        "The full form of HTML is...",
        ["Hyper Text Markup Language", "Hold The Mic", "ERROR"],
        0
      )
    const q5 = new Question(
        "console.log(typeof []) would return what?",
        ["Array", "Object", "null", "array"],
        1
      )

    //quiz
    const quiz = new Quiz([q1, q2, q3, q4, q5]);

    //render helper
    const setValue = (elem, value) => {
      elem.innerHTML = value;
    }

    //RENDER PROCESS
    // 1. Render the question
    const renderQuestion = () => {
      const question = quiz.getCurrentQuestion().question;
      setValue(quizQuestion, question);
    }

    // 2. Render choices elements
    const renderChoicesElements = () => {
      let markup = '';
      const currentChoices = quiz.getCurrentQuestion().choices;
      currentChoices.forEach((elem, index) => {
        markup += `
        <li class="jabquiz__choice">
        <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
        <label for="choice${index}" class="jabquiz__label">
          <i></i>
          <span>${elem}</span>
        </label>
        </li>
        `
        setValue(choices, markup);
      });
    }

    // 3. Render tracker
    const renderTracker = () => {
      const index = quiz.currentIndex;
      setValue(tracker, `${index+1} of ${quiz.questions.length}`);
    } 

    // 4. Render progress
    //get percentage helper
    const getPercentage = (num1, num2) => {
      return Math.round((num1/num2) * 100);
    }

    //launch
    const launch = (width, maxPercent) => {
      let loadingBar = setInterval(() => {
        if(width > maxPercent) {
          clearInterval(loadingBar);
        } else {
          width++;
          progressBar.style.width = `${width}%`;
        }
      }, 3);
    } 

    const renderProgress = () => {
      //width
      const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
      //launch(0, width)
      launch(0, currentWidth);
    }


    // End screen
    const renderEndScreen = () => {
      if(quiz.score > (quiz.questions.length / 2)) {
        setValue(quizQuestion, 'Good job!')
      } else {
        setValue(quizQuestion, 'You can do it better!');
      }
      setValue(tagline, 'Completed!');
      setValue(tracker, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}`);
      nextButton.style.opacity = 0;
      renderProgress();
    }

    //RENDERING DYNAMIC ELEMENTS
    const renderAll = () => {
      if(quiz.hasEnded()) {
        //render end screen
        renderEndScreen();
      } else {
        // 1. render the question
        renderQuestion();
        // 2. render the choices elements
        renderChoicesElements();
        // 3. render tracker
        renderTracker();
        // 4. render progress
        renderProgress();
      }
    }

    //LISTENERS
    const listeners = () => {
      //when next button is clicked
      nextButton.addEventListener('click', () => {
        const selectedChoice = document.querySelector(`input[name="choice"]:checked`);
        if(selectedChoice) {
          const answerKey = Number(selectedChoice.getAttribute("data-order"));
          quiz.guess(answerKey);
          renderAll();
        }
      })

      //when restart button is clicked
      restartButton.addEventListener('click', () => {
        // 1. reset the quiz
        quiz.reset();
        // 2. render elements
        renderAll();
        // 3. restore the next button
        nextButton.style.opacity = 1;
        // 4. restore tag line message
        tagline.textContent = 'Pick an option below!';
      })
    } 

    return {
      renderAll,
      listeners
    }


})();


App.renderAll();
App.listeners()