const cardRegex = new RegExp(
  /(NUMBER|SKIP|PICKUP2|PICKUP4|SETCOLOUR|SWITCHDIRECTION)(\/(R|G|B|Y))?(\/(\d))?/
);
const symbols = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "SKIP",
  "SWITCHDIRECTION",
  "PICKUP4",
  "PICKUP2",
  "SETCOLOUR",
];
const colours = ["red", "green", "blue", "yellow"];
const wild = ["PICKUP4", "SETCOLOUR"];

class Game {
  constructor({ id }) {
    this.id = id;
    this.started = false;
    this.direction = 1;
    this.player = 0;
    this.players = [];
    this.deck = [];
    this.discard = [];
  }

  status(me) {
    console.log("STATUS REQ FROM", me);
    return {
      id: this.id,
      started: this.started,
      direction: this.direction,
      topCard: this.deck[this.deck.length - 1],
      discardLength: this.discard.length,
      deckLength: this.deck.length,
      lead: this.lead,
      players: this.players.map((p) => {
        return {
          id: p.id,
          name: p.name,
          deck: me.token === p.id ? p.deck : p.deck.map(() => "no peeking!"),
        };
      }),
      player: this.player,
    };
  }

  get latestCard() {
    return this.discard[this.discard.length - 1];
  }

  start() {
    if (!this.started && this.players.length >= 3) {
      this.started = true;
      console.log("GAME- starting");
      this.generateDeck();
      this.shuffleDeck();
      this.dealToPlayers();
    }
    return this.started;
  }

  dealToPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      for (let c = 0; c < 7; c++) {
        const card = this.deck.pop();
        this.players[i].deck.push(card);
      }
    }
  }
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    // TODO, what if top card is a wildcard?
  }

  generateDeck() {
    console.log("GAME- gen deck starting");

    for (let i = 0; i < symbols.length; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push(
          Object.assign(
            {
              symbol: symbols[i],
            },
            wild.indexOf(symbols[i]) === -1 && { colour: colours[c] }
          )
        );
      }
    }
    for (let i = 1; i < 10; i++) {
      for (let c = 0; c < colours.length; c++) {
        this.deck.push({
          symbol: symbols[i],
          colour: colours[c],
        });
      }
    }
  }

  addPlayer({ id, name }) {
    if (!this.started) {
      this.players.push({ id, name, deck: [] });
      if (this.players.length === 1) {
        this.lead = this.players[0].id;
      }
      return true;
    }
    return false;
  }

  playCard(card) {
    console.log("PLAY");
    const { type, colour, value } = this.decodeCard(card);

    console.log(type, colour, value);
  }

  decodeCard(card) {
    const decoded = cardRegex.exec(card);
    const type = decoded[1];
    const colour = decoded[3];
    const value = decoded[5];

    return { type, colour, value };
  }

  isValid(card) {
    const { type, colour, value } = this.decodeCard(card);
    return false;
  }
}

module.exports = Game;
