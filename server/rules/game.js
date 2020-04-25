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
  NC = "NOCOLOUR";
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbols = [P2, SK, SD];
const wild = [P4, SC];
const colours = ["RED", "GREEN", "BLUE", "YELLOW"];
const actions = [DC, CC];

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
  }

  status(token) {
    return {
      id: this.id,
      started: this.started,
      direction: this.direction,
      topCard: this.discard[this.discard.length - 1],
      discardLength: this.discard.length,
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
      this.players[i].deck.push({ symbol: P4, colour: NC });
    }
    this.addMessage(false, "dealt 7 cards to each player");
  }

  shuffleDeck() {
    this.addMessage(false, "shuffled the deck");

    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    // TODO, what if top card is a wildcard?
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
    this.addMessage(name, `has joined the game`);
    if (!this.started) {
      this.players.push({ id, name, deck: [], uno: false });
      if (this.players.length === 1) {
        this.lead = this.players[0].id;
      }
      return true;
    }
    return false;
  }

  drawCard(me) {
    let res = false;
    if (me.token === this.player) {
      this.players.map((p) => {
        if (p.id === me.token) {
          if (this.deck.length > 0) {
            p.deck.push(this.deck.pop());
            const criteriaToDraw = this.criteria.indexOf(DC);
            if (criteriaToDraw > -1) {
              this.criteria.splice(criteriaToDraw, 1);
            }
            res = true;
          }
        }
      });
    }

    if (this.deck.length === 1) {
      this.shuffleDiscardIntoDraw();
    }
    return res;
  }

  shuffleDiscardIntoDraw() {
    const old = this.discard.splice(0, this.discard.length - 1);
    this.deck = this.deck.concat(old);
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

  matches(user, c1, c2) {
    if (!c1 || !c2) return false;

    // Anyone can jump in on an exact match
    if (c1.colour === c2.colour && c1.symbol === c2.symbol) {
      if (user !== this.player) {
        this.player = user;
      }
      return true;
    }

    if (user === this.player) {
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

    //TODO user === this.player
    if (this.matches(user, topCard, card)) {
      if (this.criteria.filter((c) => c !== SC).length) {
        //cards to pick up
        if (card.symbol !== topCard.symbol || card.colour !== topCard.colour) {
          return false;
        }
      }
      const taken = this.takeCardFromPlayer(card, user);

      if (taken) {
        this.discard.push(card);

        this.addMessage(
          this.getPlayerByToken(user).name,
          `played a ${card.colour !== "NOCOLOUR" ? card.colour : ""} ${
            card.symbol
          }`
        );

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
        if (card.symbol == SD) {
          this.direction = !this.direction;
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

    if (!((card.symbol === P4 || card.symbol === SC) && card.colour == NC)) {
      this.player = this.nextPlayer();
    }
  }

  nextPlayer() {
    let currentIndex;

    this.players.forEach((p, i) => {
      if (p.id === this.player) {
        currentIndex = i;
      }
    });

    if (this.direction) {
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
}

module.exports = Game;
