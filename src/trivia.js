import chalk from "chalk"
import { select } from "@inquirer/prompts"
import gameStats from "./gameStats.js"
import triviaQuestions from "./questions.js"

// Main function to display game choices
export async function showMainMenu(gameStats) {
    const selection = await select({
        message: chalk.underline.bgMagenta("==== Trivia Main Menu ===="),
        choices: [
            { name: chalk.green("1. Play Trivia"), value: "play" },
            { name: chalk.cyan("2. Show stats"), value: "stats" },
            { name: chalk.yellow("3. Reset stats"), value: "reset" },
            { name: chalk.red("4. Quit"), value: "quit" },
        ],
    });

    switch (selection) {
        case "play":
            await playTrivia(gameStats);
            break;
        case "stats":
            displayStats(gameStats);
            await select({
                message: "Return to main menu",
                choices: [{ name: "Return", value: "return" }],
            });
            await showMainMenu(gameStats);
            break;
        case "reset":
            await resetGame(gameStats);
            console.log("Game stats have been reset")
            await showMainMenu(gameStats);
            break;
        case "quit":
            console.log("Thanks for playing! Bye!")
            process.exit(0);
    };
};

// Main function to play trivia
async function playTrivia(gameStats) {
    console.log("It's time to play the gameeee");
    // Loop through the array of trivia questions and print out the question with the answer choices
    const randomNumberArray = []; // array to store random numbers to only display a question once. 
    while (randomNumberArray.length < triviaQuestions.length) {
        // Randomize the question being asked
        const randomNumber = Math.floor(Math.random() * triviaQuestions.length);
        
        
        // Check if the current random is in the random number array and do nothing if it is.
        if (randomNumberArray.includes(randomNumber)) {
            continue;
        };
        // if it's not in the array add it to it the use it as the index for the trivia question
        randomNumberArray.push(randomNumber);
        const question = triviaQuestions[randomNumber];

        

        // Wait for user to respond until they select an answer
        const userSelection = await select({
          message: question.question,
          choices: question.options.map((answer) => ({
            name: ` ${answer}`,
            value: answer,
          })),
        });

        // Check user selection and increment the scores for correct, incorrect, and total
        if (userSelection === question.answer) {
            console.log(chalk.green.bold("Correct"))
            gameStats.questions.correct++
            gameStats.questions.total++
        }
        else {
            console.log(chalk.red.bold("Incorrect"));
            gameStats.questions.incorrect++;
            gameStats.questions.total++;
        };
        
    };
    // Simulate processing of results before displaying
    const interval = setInterval(() => {
        console.log("Processing your results...");

    }, 500);

    // Show the end result after finishing the questions
    setTimeout(() => {
        clearInterval(interval);
        displayStats(gameStats);
        showMainMenu(gameStats);
    }, 2000);

};

// Function to display the statistics of the game
async function displayStats(gameStats) {
    console.log(chalk.blue.bold(chalk.underline("Game Statistics:")));
    console.log(chalk.green(`Correct answers: ${gameStats.questions.correct}`));
    console.log(chalk.red(`Incorrect answers: ${gameStats.questions.incorrect}`));
    console.log(chalk.bold(`Total questions answered: ${gameStats.questions.total}`));
};

// Function to reset the game statistics
async function resetGame(gameStats) {
    gameStats.questions = {
        correct: 0,
        incorrect: 0,
        total: 0
    };
};

// Testing area
showMainMenu(gameStats);