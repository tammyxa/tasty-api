// the file for our application logic (aka logic to play 5 card poker)
import { checkbox } from '@inquirer/prompts';
import * as api from './api.js';
import * as db from './db.js';

// helper functions for printing
const _printConsole = (cards, remaining) => {
    console.log('- - - - - - - - - - - - - - - - - - - - -');
    cards.forEach((card) => {
        console.log(`${card.value} of ${card.suit}`);
    });
    console.log(`Remaining Cards: ${remaining}`);
    console.log('- - - - - - - - - - - - - - - - - - - - -');
};

const _discardPrompt = async (cards) => {
    const displayCards = cards.map((card) => {
        return { name: `${card.value} of ${card.suit}`, value: card.code };
    });

    return await checkbox({
        message: 'Select cards to throw away',
        choices: displayCards,
        validate: (cards) => {
            if (cards.length > 4) {
                return 'Your may only select up to 4 cards';
            } else {
                return true;
            }
        }
    });
};

const _findAndRemove = (original, throwaway) => {
    return original.filter((card) => {
        return !throwaway.includes(card.code);
    });
};

// this is the function to house our playing 5 card poker logic
export const playPoker = async (args) => {
    try {
        // hard code 5 because five card draw always starts with 5 cards
        const CARDS = 5;

        // get a deck of cards
        const deckOfCards = await api.buildDeck(args.shuffle);
        // console.log(deckOfCards);

        // deal 5 cards from the deck requested above
        const originalCards = await api.drawCards(deckOfCards.deck_id, CARDS);

        // prompt the user to select cards to discard/throwaway
        const throwaway = await _discardPrompt(originalCards.cards);

        // find and remove the users selected throwaway cards from the original card hand
        const filtered = _findAndRemove(originalCards.cards, throwaway);

        // draw the same number of cards that were thrown away
        const replaceCards = await api.drawCards(
            deckOfCards.deck_id,
            throwaway.length
        );

        // add the new cards and the remaining original cards to create a final hand
        const finalHand = filtered.concat(replaceCards.cards);

        // display to user
        _printConsole(finalHand, replaceCards.remaining);

        // create entry to include cards and remaining
        const entry = {
            original: originalCards,
            // finalHand has only cards array. the remaining is on the replaceCards response
            final: { cards: finalHand, remaining: replaceCards.remaining }
        };
        // save game to mock database
        await db.create('poker_games', entry);
    } catch (error) {
        console.error(error);
    }
};

export const previous = async () => {
    // get all the poker games played from the mock database
    const pokerGames = await db.find('poker_games');

    // pop out the last game
    const previousGame = pokerGames.pop();

    // print results to console -
    console.log('Original Hand');
    _printConsole(previousGame.original.cards, previousGame.original.remaining);

    console.log('Final Hand');
    _printConsole(previousGame.final.cards, previousGame.final.remaining);
};
