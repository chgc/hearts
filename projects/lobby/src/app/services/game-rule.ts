export interface Rule {
  cardPoint: any;
  specialRule: any;
}

export interface Card {
  face: string;
  number: string;
  value: number;
}

export const CARD_SCORE = {
  hearts: {
    one: -50,
    two: -2,
    three: -3,
    four: -10,
    five: -5,
    six: -6,
    seven: -7,
    eight: -8,
    nine: -9,
    ten: -10,
    jack: -20,
    queen: -30,
    king: -40
  },
  diamonds: {
    jack: 100
  },
  spades: {
    queen: -100
  }
};
