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
    one: player => -50,
    two: player => -2,
    three: player => -3,
    four: player => -10,
    five: player => -5,
    six: player => -6,
    seven: player => -7,
    eight: player => -8,
    nine: player => -9,
    ten: player => -10,
    jack: player => -20,
    queen: player => -30,
    king: player => -40
  },
  diamonds: {
    jack: player => 100
  },
  spades: {
    queen: player => -100
  }
};
