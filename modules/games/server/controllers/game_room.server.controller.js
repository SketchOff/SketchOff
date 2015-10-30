'use strict';

import * as PublicGameStates from './states/public_game.states.server.controller';
import * as PrivateGameStates from './states/private_game.states.server.controller';

// Set min and max players
export var min_players = 2;
export var max_players = 7;

export default class GameRoom {

    constructor(players, is_public_room, game_id) {
        // Set players prop, return error if not array
        if (Array.isArray(players)) this.players = players;
        else throw 'Attempted to create game without correct players param';
        // Set the game_id generated from the game_rooms controller
        this._id = game_id;
        // Is game public, if not then game is private
        this.RoomStates = is_public_room ? PublicGameStates : PrivateGameStates;
        // Set to true if judge leaves
        this.first_game = true;
        this.available = true;
        this.State = new this.RoomStates.Establishing(this);
        this.judge = this.players[0];
        this.finished_drawing_players = [];
        this.ready_for_new_game_players = [];
        this.winner = null;

        // console.log(this.players);

        // console.log(this.players[0].request.user);
    }

    // Emits _data_ to everyone
    emitToEveryone(type, data) {
        console.log('emitting data to everyone');
        this.players.forEach(function (player) {
            player.emit(type, data);
        });
    }

    // Emits _data_ to player_id (Authentication.user._uid)
    emitToPlayer(type, player_id, data) {
        console.log('emitting data to specific player ' + player_id);
        this.players.forEach(function (player) {
            if(player.request.user._uid === player_id) {
                player.emit(type, data);
            }
        });
    }

    // Emits _data_ to everyone except player_id (Authentication.user._uid)
    emitToEveryoneExcept(type, player_id, data) {
        console.log('emitting data to everyone except ' + player_id);
        this.players.forEach(function (player) {
            if(player.request.user._uid !== player_id) {
                player.emit(type, data);
            }
        });
    }

    setState(State) {
        this.State = new this.RoomStates[State](this);
    }

    getStateName() {
        return this.State.getName();
    }

    isFull() {
        return this.players.length === max_players;
    }

    // When a player presses leave game
    playerExits(player) {
        // Delete player from players array
        this.players.splice(this.players.indexOf(player), 1);

        // If theres not enough players to continue, terminate game
        if (this.players.length < min_players) {
            this.CurrState = this.is_public_room ? new PublicGameStates.Terminating(this).state_name : new PrivateGameStates.Terminating(this).state_name;
        }
        // Enough players to keep game open
        else {
            // The judge left the game, no winner can be determined
            // TODO: Flag judge for leaving mid-game!
            if (player === this.judge) this.winner = null;
        }
    }

    // Add a player to the game
    addPlayer(player) {
        var index = getRandomIntInclusive(0, this.players.length - 1);
        this.players.splice(index, 0, player);
    }

    getPlayerUserNames() {
        var player_names = [];
        this.players.forEach(function(player) {
            player_names.push(player.request.user.username);
        });
        return player_names;
    }

    getJudgeUserName() {
        return this.judge.request.user.username;
    }

    getJudge() {
        return this.judge;
    }

    getPhrases() {
        var phrases = ['pregnant pencils', 'tall people', 'smelly clothes', 'pesty pelicans'];
        return phrases;
    }

    setPhrase(phrase) {
        this.phrase = phrase;
        this.setState('Drawing');
    }

    getPhrase() {
        return this.phrase;
    }

    getNumPlayers() {
        return this.players.length;
    }

    noWinner() {
        this.winner = null;
    }

    setWinner(winner) {
        this.winner = winner;
    }

    allPlayersFinishedDrawing() {
        return (this.finished_drawing_players.length === this.getNumPlayers() - 1);
    }

    everyoneIsReadyForNewGame() {
        return (this.ready_for_new_game_players.length === this.getNumPlayers());
    }

    isAvailable() {
        return this.available;
    }

    // TODO: Add a cleanup function that unregisters all callbacks (methods of the Game object) that were registered on socket events.
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
