const readlineSync = require("readline-sync");

const main = () => {
  const selection = readlineSync.question(
    "How do you import players, JSON or INPUT? \n"
  );
  let tennisPlayers;

  if (selection.toUpperCase() == "JSON") {
    tennisPlayers = require("./tennisPlayers.json");

    const rankings = [];

    for (let i = 0; i < tennisPlayers.length; i++) {
      rankings.push(tennisPlayers[i].ranking);
    }

    if (rankings.length !== new Set(rankings).size) {
      console.log("Found duplicate rankings!");
      return;
    }
  } else if (selection.toUpperCase() === "INPUT") {
    const N = readlineSync.question(
      "Enter number of players (Must be (4,8,16,32,64))(N): "
    );
    const rankings = [];

    tennisPlayers = [];

    for (var i = 0; i < N; i++) {
      const tempTennisPlayer = readlineSync.question(
        "Enter player data in form: [name],[lastName],[country],[ranking]: "
      );

      const tempTennisPlayerData = tempTennisPlayer.split(",");

      // Input validation
      if (tempTennisPlayerData.length !== 4) {
        console.log(
          "Please input all of the fields: [name],[lastName],[country],[ranking]"
        );
        i--;
      } else {
        if (rankings.includes(tempTennisPlayerData[3])) {
          console.log("Ranking already exists! Try again.");
          i--;
        } else if (
          !tempTennisPlayerData[0].match(/^[a-zA-Z]+$/) ||
          !tempTennisPlayerData[1].match(/^[a-zA-Z]+$/)
        ) {
          console.log("Name and Surname must be letters");
          i--;
        } else if (
          tempTennisPlayerData[2].length !== 3 ||
          !tempTennisPlayerData[2].match(/^[a-zA-Z]+$/)
        ) {
          console.log("Country must be only 3 letters");
          i--;
        } else if (!tempTennisPlayerData[3].match(/^[0-9]+$/)) {
          console.log("Ranking must be number");
          i--;
        } else {
          tennisPlayers.push({
            firstName: tempTennisPlayerData[0],
            lastName: tempTennisPlayerData[1],
            country: tempTennisPlayerData[2],
            ranking: parseInt(tempTennisPlayerData[3]),
          });

          rankings.push(tempTennisPlayerData[3]);
        }
      }
    }
  } else {
    console.log("Invalid input, please try again!");
    return;
  }

  const generateRounds = (players) => {
    const rounds = [];

    for (let i = 0; i < players.length / 2; i++) {
      rounds.push([players[i], players[players.length / 2 + i]]);
    }
    return rounds;
  };

  const printRound = (round) => {
    const [round1, round2] = round;

    console.log(
      `${round1.firstName} ${round1.lastName} (${round1.ranking}, ${round1.country}) vs ${round2.firstName} ${round2.lastName} (${round2.ranking}, ${round2.country}) `
    );
  };

  const printWinner = (winner) => {
    console.log(
      `Winner: #${winner.firstName} ${winner.lastName} (${winner.ranking}, ${winner.country})\n`
    );
  };

  //Recursively go through all of the rounds and generate winners and new rounds
  const runTournament = (rounds) => {
    const winners = [];
    const newRounds = [];

    // Base condition for the final round
    if (rounds.length <= 1) {
      console.log("THE FINALS: \n");
      printRound(rounds[0]);
      console.log("The Tournament Winner: ");
      printWinner(rounds[0][Math.round(Math.random())]);
      return;
    }

    // Choose winners randomly
    rounds.forEach((round, i) => {
      const winner = Math.round(Math.random());
      winners.push(round[winner]);

      console.log(`Round #${i + 1}: `);
      printRound(round);
      printWinner(round[winner]);
    });

    // Add new rounds
    for (let i = 0; i < winners.length; i += 2) {
      newRounds.push([winners[i], winners[i + 1]]);
    }

    runTournament(newRounds);
  };

  const rounds = generateRounds(tennisPlayers);
  runTournament(rounds);
};

main();
