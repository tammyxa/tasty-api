// the file to build the command line interface
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { playPoker, previous } from './app.js';

yargs(hideBin(process.argv))
    // $0 expands the file name
    // <> indicate that the command is manadatory
    // [] indicate that options are optional
    .usage('$0: Usage <command> [options]')
    .command(
        // command name with argument
        'play <game>',
        // description
        'play card games',
        // builder function to add a positional argument and option
        (yargs) => {
            yargs
                .positional('game', {
                    describe: 'name of the card game',
                    type: 'string',
                    choices: ['poker', 'blackjack']
                })
                .options('shuffle', {
                    alias: 's',
                    describe: 'a flag to shuffle cards',
                    default: true,
                    type: 'boolean'
                });
        },
        // handler function
        (args) => {
            if (args.game === 'poker') {
                playPoker(args);
            } else {
                console.log(`${args.game} is not ready. :(`);
            }
        }
    )
    .command(
        'previous',
        'view the last game of poker played',
        () => {},
        () => {
            previous();
        }
    )
    .help().argv;
