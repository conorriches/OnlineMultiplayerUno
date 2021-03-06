const cardRegex = new RegExp(
  /(NUMBER|SKIP|PICKUP2|PICKUP4|SETCOLOUR|SWITCHDIRECTION)(\/(R|G|B|Y))?(\/(\d))?/
);
const P2 = "PICKUP2",
  SK = "SKIP",
  SD = "SWITCHDIRECTION",
  P4 = "PICKUP4",
  SC = "SETCOLOUR",
  DC = "DRAWCARD",
  CC = "CHOOSECOLOUR",
  NC = "NOCOLOUR",
  SW = "SWAPWITH";
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbols = [P2, SK, SD];
const wild = [P4, SC];
const colours = ["RED", "GREEN", "BLUE", "YELLOW"];
const actions = [DC, CC, SW];
const tempNames = [
  "Sirius",
  "Vega",
  "Altair",
  "Arcturus",
  "Alcor",
  "Pollux",
  "Acrux",
  "Canopus",
  "Deneb",
  "Rigel",
];

const Config = require("../../config");
class Game {
  constructor({ id }) {
    this.id = id;
    this.started = false;
    this.direction = true;
    this.player = "";
    this.players = [];
    this.deck = [];
    this.discard = [];
    this.criteria = [];
    this.actions = [];
    this.messages = [];
    this.challenged = false;
    this.drawCount = 0;
  }

  status(token) {
    return {
      id: this.id,
      started: this.started,
      direction: this.direction,
      topCard: this.discard[this.discard.length - 1],
      discardLength: this.discard.length,
      discard: this.discard.filter((c, i) => i > this.discard.length - 4),
      deckLength: this.deck.length,
      lead: this.lead,
      players: this.players.map((p) => {
        return {
          id: p.id,
          name: p.name,
          deck:
            token === p.id
              ? p.deck
              : p.deck.map(() => {
                  "no peeking!";
                }),
          uno: p.uno,
        };
      }),
      player: this.players.filter((p) => p.id == this.player)[0] || false,
      criteria: this.criteria,
      messages: this.messages,
    };
  }

  get latestCard() {
    return this.discard[this.discard.length - 1];
  }

  setName(me, name) {
    let toReturn = false;
    this.players = this.players.map((p) => {
      if (p.id === me.token) {
        p.name = name;
        toReturn = true;
      }
      return p;
    });
    return toReturn;
  }

  addMessage(user, message) {
    if (this.messages.length >= 10) {
      this.messages.splice(0, 1);
    }
    this.messages.push({ user, message });
  }

  start() {
    if (!this.started && this.players.length >= 2) {
      this.started = true;

      this.addMessage(
        false,
        `game started with ${this.players.length} players!`
      );
      this.generateDeck();
      if (this.players.length >= Config.game.deckTwoThreshold) {
        this.generateDeck();
      }
      if (this.players.length >= Config.game.deckThreeThreshold) {
        this.generateDeck();
      }

      this.shuffleDeck();
      this.dealToPlayers();
      this.firstPlayer();
      this.firstCard();
      return true;
    }
    return false;
  }

  firstPlayer() {
    this.player = this.players[0].id;
  }

  firstCard() {
    let card;

    this.deck.some((c, i) => {
      if (c.symbol !== P4) {
        card = c;
        this.deck.splice(i, 1);
        this.discard.push(card);
        return true;
      }
      return false;
    });

    this.addMessage(
      false,
      `started game with ${card.colour !== "NOCOLOUR" ? card.colour : ""} ${
        card.symbol
      }`
    );

    if (card.symbol === P2) {
      this.criteria.push(DC);
      this.criteria.push(DC);
    } else if (card.symbol === SD) {
      this.direction = !this.direction;
    } else if (card.symbol === SK) {
      const nextPlayer = this.nextPlayer();
      this.addMessage(
        false,
        `${this.players.filter((p) => nextPlayer)[0].name} skips a go!`
      );
      this.shouldIncrementPlayer();
    } else if (card.symbol === SC) {
      this.criteria.push(CC);
    }
  }

  dealToPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      for (let c = 0; c < 7; c++) {
        const card = this.deck.pop();
        this.players[i].deck.push(card);
      }
    }
    this.addMessage(false, "dealt 7 cards to each player");
  }

  shuffleDeck() {
    this.addMessage(false, "shuffled the deck");

    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  generateDeck() {
    this.addMessage(false, "got a deck of cards");

    for (let i = 0; i <= 9; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push({
          symbol: i,
          colour: colours[c],
        });
      }
    }

    for (let i = 1; i <= 9; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push({
          symbol: i,
          colour: colours[c],
        });
      }
    }

    for (let i = 0; i < symbols.length; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push({
          symbol: symbols[i],
          colour: colours[c],
        });
        this.deck.push({
          symbol: symbols[i],
          colour: colours[c],
        });
      }
    }

    for (let i = 0; i < wild.length; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push({
          symbol: wild[i],
          colour: NC,
        });
      }
    }
  }

  addPlayer({ id, name }) {
    if (!this.started) {
      this.players.push({
        id,
        name: name || tempNames[this.players.length],
        deck: [],
        uno: false,
      });
      if (this.players.length === 1) {
        this.lead = this.players[0].id;
      }
      return true;
    }
    return false;
  }

  removePlayer(id, name) {
    this.addMessage(name, `has left the game, cards going into deck`);

    let cards;
    this.players.map((p) => {
      if (p.id === id) {
        cards = p.deck;
      }
    });

    if (this.player === id) {
      this.player = this.nextPlayer();
    }

    if (cards) {
      this.deck = this.deck.concat(cards);
      this.shuffleDeck();
    }

    this.players = this.players.filter((p) => {
      return p.id !== id;
    });
  }

  drawCard(id) {
    if (this.players.some((p) => p.deck.length === 0)) return false;

    let res = false;
    this.players.map((p) => {
      if (p.id === id) {
        if (this.deck.length > 0) {
          p.deck.push(this.deck.pop());
          p.uno = false;
          this.drawCount = this.drawCount + 1;

          if (this.messages[this.messages.length - 1].user === p.name) {
            this.messages[this.messages.length - 1] = {
              user: p.name,
              message: `drew ${this.drawCount} cards`,
            };
          } else {
            this.addMessage(p.name, `drew a card`);
            this.drawCount = 1;
          }

          const criteriaToDraw = this.criteria.indexOf(DC);

          if (criteriaToDraw > -1) {
            this.criteria.splice(criteriaToDraw, 1);
            if (this.criteria.length == 0) {
              this.shouldIncrementPlayer();
            }
          }
          res = true;
        }
      }
    });

    if (this.deck.length < 1) {
      this.shuffleDiscardIntoDraw();
    }
    return res;
  }

  shuffleDiscardIntoDraw() {
    const old = this.discard.splice(0, this.discard.length - 1);
    this.deck = this.deck.concat(old).map((c) => {
      if (c) {
        if ([P4, SC].indexOf(c.symbol) > -1) {
          c.colour = NC;
        }
      }
      return c;
    });
    this.shuffleDeck();
  }

  isNumber(c) {
    return numbers.indexOf(c.symbol) > -1;
  }
  isSymbol(c) {
    return symbols.indexOf(c.symbol) > -1;
  }
  isWild(c) {
    return wild.indexOf(c.symbol) > -1;
  }

  matches(ownGo, c1, c2) {
    if (!c1 || !c2) return false;

    // Anyone can jump in on an exact match
    if (c1.colour === c2.colour && c1.symbol === c2.symbol) {
      return true;
    }

    if (ownGo) {
      if (this.isNumber(c2)) {
        if (this.isNumber(c1)) {
          // Number on Number
          if (c1.symbol === c2.symbol) return true;
          if (c1.colour === c2.colour) {
            if (Math.abs(c1.symbol - c2.symbol) < 2) {
              return true;
            }
            if (
              (c1.symbol === 0 && c2.symbol === 9) ||
              (c2.symbol === 0 && c1.symbol === 9)
            ) {
              return true;
            }
            // Playing on symbol / wild
            if (
              wild.indexOf(c1.symbol) > -1 ||
              symbols.indexOf(c1.symbol) > -1
            ) {
              return true;
            }
            return false;
          } else {
            return false;
          }
        }
        if (this.isSymbol(c1)) {
          // Number on Symbol
          return c1.colour == c2.colour;
        }
        if (this.isWild(c1)) {
          // Number on wild (change colour / +4)
          return c1.colour == c2.colour;
        }
      }

      //User is playing a symbol
      if (this.isSymbol(c2)) {
        if (this.isNumber(c1)) {
          return c1.colour === c2.colour;
        }
        if (this.isSymbol(c1)) {
          return c1.symbol === c2.symbol || c1.colour === c2.colour;
        }
        if (this.isWild(c1)) {
          return c1.colour == c2.colour;
        }
      }

      //User is playing a wildcard
      if (this.isWild(c2)) {
        return true;
      }
    }

    return false;
  }

  playCard(card, user) {
    const topCard = this.discard[this.discard.length - 1];
    const usersName = this.getPlayerByToken(user).name;

    if (this.players.some((p) => p.deck.length === 0)) return false;

    //TODO user === this.player
    if (this.matches(user === this.player, topCard, card)) {
      if (user !== this.player) {
        this.player = user;
        this.addMessage(usersName, `jumps in!`);
      }
      if (this.criteria.filter((c) => c !== SC).length) {
        //cards to pick up
        if (card.symbol !== topCard.symbol || card.colour !== topCard.colour) {
          return false;
        }
      }
      const taken = this.takeCardFromPlayer(card, user);

      if (taken) {
        this.challenged = false;
        this.discard.push(card);

        this.addMessage(
          usersName,
          `played a ${card.colour !== "NOCOLOUR" ? card.colour : ""} ${
            card.symbol
          }`
        );

        // Actions
        if (card.symbol === 0) {
          this.addMessage(false, `Rotating cards in direction of play`);
          const decks = this.players.map((p) => p.deck);

          if (this.direction) {
            decks.unshift(decks.pop());
          } else {
            decks.push(decks.shift());
          }

          decks.forEach((d, i) => {
            this.players[i].deck = d;
          });
        }

        if (card.symbol === 7) {
          const choice = this.players.length % 2 !== 0;

          if (true || choice) {
            this.addMessage(
              false,
              `Swap hands! ${usersName} must choose who to swap with`
            );
            this.criteria.push(SW);
          } else {
            let myIndex;
            this.players.forEach((p, i) => {
              if (p.id === user) {
                myIndex = i;
              }
            });
            const oppositeIndex = this.players.length - 1 - myIndex;
            let oppositePlayer = this.players[oppositeIndex];
            this.addMessage(
              false,
              `Swap hands! ${usersName} swaps with ${oppositePlayer.name}, who is opposite`
            );

            const playerOneCards = [].concat(this.players[myIndex].deck);
            const playerTwoCards = [].concat(this.players[oppositeIndex].deck);

            this.players[myIndex].deck = playerTwoCards;
            this.players[oppositeIndex].deck = playerOneCards;
          }
        }
        if (card.symbol == SD) {
          this.direction = !this.direction;
        }

        this.players.forEach((p) => {
          if (p.deck.length > 1) p.uno = false;
        });

        // Add criteria to stack
        if (card.symbol === P4) {
          for (let i = 0; i < 4; i++) this.criteria.push(DC);
        }
        if (card.symbol === P2) {
          for (let i = 0; i < 2; i++) this.criteria.push(DC);
        }
        if (card.symbol === SC || card.symbol === P4) {
          this.criteria.push(CC);
        }
        if (card.symbol == SK) {
          this.addMessage(
            false,
            ` ${this.getPlayerByToken(this.nextPlayer()).name} skips a go!`
          );
          this.shouldIncrementPlayer();
        }

        return true;
      }
    }
    return false;
  }

  takeCardFromPlayer(card, user) {
    let taken = -1;
    this.players = this.players.map((p) => {
      if (p.id !== user) {
        return {
          ...p,
        };
      }

      return {
        id: p.id,
        name: p.name,
        deck: p.deck.filter((c) => {
          if (taken === -1) {
            if (c.colour === card.colour && c.symbol === card.symbol) {
              taken = true;
              return false;
            }
          }
          return true;
        }),
      };
    });
    return taken;
  }

  shouldIncrementPlayer() {
    const card = this.discard[this.discard.length - 1];

    const unchosenColour =
      (card.symbol === P4 || card.symbol === SC) && card.colour == NC;

    if (!unchosenColour && this.criteria.indexOf(SW) === -1) {
      this.player = this.nextPlayer();
    }
  }

  playerToSide(inDirectionOfPlay) {
    let currentIndex;

    this.players.forEach((p, i) => {
      if (p.id === this.player) {
        currentIndex = i;
      }
    });

    if (inDirectionOfPlay ? this.direction : !this.direction) {
      if (currentIndex === this.players.length - 1) {
        return this.players[0].id;
      } else {
        return this.players[currentIndex + 1].id;
      }
    } else {
      if (currentIndex === 0) {
        return this.players[this.players.length - 1].id;
      } else {
        return this.players[currentIndex - 1].id;
      }
    }
  }

  nextPlayer() {
    return this.playerToSide(true);
  }

  previousPlayer() {
    return this.playerToSide(false);
  }

  setColour(me, colour) {
    if (this.player === me.token) {
      const topCard = this.discard[this.discard.length - 1];
      if (topCard.symbol === SC || topCard.symbol === P4) {
        if (colours.indexOf(colour) > -1) {
          this.criteria = this.criteria.filter((c) => c !== CC);
          topCard.colour = colour;
          return true;
        }
      }
    }
    return false;
  }

  swapDecks(id1, id2) {
    let p1Index = -1,
      p2Index = -1;

    if (this.criteria.indexOf(SW) === -1) {
      return false;
    }

    this.players.forEach((p, i) => {
      if (p.id === id1) p1Index = i;
      if (p.id === id2) p2Index = i;
    });

    if (p1Index > -1 && p2Index > -1) {
      const playerOneCards = [].concat(this.players[p1Index].deck);
      const playerTwoCards = [].concat(this.players[p2Index].deck);

      this.players[p1Index].deck = playerTwoCards;
      this.players[p2Index].deck = playerOneCards;
      return true;
    }

    return false;
  }

  getPlayerByToken(token) {
    let player;
    this.players.some((p) => {
      if (p.id === token) {
        player = p;
      }
      return !!player;
    });
    return player;
  }

  declareUno(me) {
    if (this.players.some((p) => p.deck.length === 0)) return false;

    let changed = false;
    this.players = this.players.map((p) => {
      if (p.id === me.token && p.deck.length === 1) {
        p.uno = true;
        changed = true;
      }
      return p;
    });
    return changed;
  }

  challenge() {
    if (this.players.some((p) => p.deck.length === 0)) return false;

    const previousPlayer = this.previousPlayer();

    this.players = this.players.map((p) => {
      if (
        p.id === previousPlayer &&
        this.discard[this.discard.length - 1].symbol === P4 &&
        !this.challenged
      ) {
        this.addMessage(false, "CHALLENGE!");
        const prevCard = this.discard[this.discard.length - 2];
        const wasMatch = p.deck.some(
          (c) => this.matches(true, prevCard, c) && c.symbol !== P4
        );

        if (!wasMatch) {
          this.criteria = this.criteria.concat([DC, DC]);
          this.addMessage(
            false,
            "Challenge rejected - plaintiff must now draw 6 cards instead of 4."
          );
        } else {
          this.addMessage(
            false,
            "Challenge successful - defendant has been handed 4 cards."
          );
          this.criteria = [];
          // give four cards to accuser
          for (let i = 0; i < 4; i++) {
            this.drawCard(previousPlayer.token);
          }
        }
        this.challenged = true;
      }

      return p;
    });
    return true;
  }

  callout() {
    if (this.players.some((p) => p.deck.length === 0)) return false;

    this.players.forEach((p) => {
      if (p.deck.length === 1 && !p.uno) {
        this.addMessage(
          false,
          `${p.name} didn't declare Uno and was called out!`
        );

        for (let i = 0; i < 4; i++) {
          this.drawCard(p.id);
        }
      }
      return p;
    });
  }
}

module.exports = Game;
