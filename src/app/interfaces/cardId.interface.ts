export interface CardId {
  card: CardClass;
}

export interface CardClass {
  name:          string;
  manaCost:      string;
  cmc:           number;
  colors:        string[];
  colorIdentity: string[];
  type:          string;
  supertypes:    string[];
  types:         string[];
  subtypes:      string[];
  rarity:        string;
  set:           string;
  setName:       string;
  text:          string;
  artist:        string;
  number:        string;
  power:         string;
  toughness:     string;
  layout:        string;
  multiverseid:  string;
  imageUrl:      string;
  watermark:     string;
  rulings:       Ruling[];
  foreignNames:  ForeignName[];
  printings:     string[];
  originalText:  string;
  originalType:  string;
  legalities:    LegalityElement[];
  id:            string;
}

export interface ForeignName {
  name:         string;
  text:         string;
  type:         string;
  flavor:       null;
  imageUrl:     string;
  language:     string;
  identifiers:  Identifiers;
  multiverseid: number;
}

export interface Identifiers {
  scryfallId:   string;
  multiverseId: number;
}

export interface LegalityElement {
  format:   string;
  legality: LegalityEnum;
}

export enum LegalityEnum {
  Legal = "Legal",
}

export interface Ruling {
  date: Date;
  text: string;
}
