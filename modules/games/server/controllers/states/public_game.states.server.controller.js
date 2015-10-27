'use strict';

import * as GameRoomManager from '../game_room_manager.server.controller';
import {getIO} from '../queue.server.controller';

export class Establishing {
	constructor(GameRoom) {
		this.GameRoom = GameRoom;
		console.log('ESTABLISHING', GameRoom._id);
		this.name = 'ESTABLISHING';
		GameRoom.players = shuffle(GameRoom.players);
		GameRoom.judge = GameRoom.players[0];
		this.connectPlayers();
		// TODO: show phrases to judge
		// changes to drawing state when judge selects a phrase <--- handled by GameSocketManager
	}

	connectPlayers() {
		var player_names = [];
		this.GameRoom.players.forEach(function(player) {
			player_names.push(player.request.user.username);
		});
		console.log('players', player_names);
		this.GameRoom.players.forEach(function(player) {
			player.join(this.GameRoom._id);
			// player.broadcast.to(this.GameRoom._id).emit('update game', 'SERVER', player + ' has connected to this room');
		}, this);
		var emit_msg = {id: this.GameRoom._id, state: this.GameRoom.state.getName(), players: this.GameRoom.players};
		getIO().to(this.GameRoom._id).emit('ESTABLISHED', emit_msg);
	}

	getName() {
		return this.name;
	}
}

export class Drawing {
	constructor(GameRoom) {
		console.log('DRAWING');
		this.name = 'DRAWING';
		this.GameRoom = GameRoom;
	}

	getName() {
		return this.name;
	}
}

export class SelectingWinner {
	constructor(GameRoom) {
		console.log('SELECTING_WINNER');
		this.name = 'SELECTING_WINNER';

		// Prompt judge to select winner

		if (GameRoom.players.length < GameRoom.max_players) {
			// Add game room id to Queue's available games array
		}
		// After winner selected, go to ending <== Handled by game socket manager
	}

	getName() {
		return this.name;
	}
}

export class Ending {
	constructor(GameRoom) {
		console.log('ENDING');
		this.name = 'ENDING';

		// display results
		// save game info to game history schema
		// go to establishing after 15s
	}

	getName() {
		return this.name;
	}
}

export class Terminating {
	constructor(GameRoom) {
		console.log('TERMINATING');
		this.name = 'TERMINATING';
		GameRoomManager.removeGameRoom(GameRoom._id);
	}

	getName() {
		return this.name;
	}
}

/**
Establishing Helpers
*/

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
