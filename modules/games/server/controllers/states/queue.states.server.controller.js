'use strict';

import {
    min_players, max_players
}
from '../game_room.server.controller';
import * as GameRoomManager from '../game_room_manager.server.controller';

// No Available Games and not enough players to create a new game
export class NotEnough {
    constructor(queue) {
        this.name = 'NOT_ENOUGH';
        this.queue = queue;
        if (this.queue.numPlayers()) this.addPlayer();
    }

    addPlayer() {
        console.log('number of players before add player =', this.queue.numPlayers());
        if (this.queue.numPlayers() >= min_players) {
            while (this.queue.numPlayers() >= min_players) {
                this.queue.createGame();
            }
        }
    }
}

// // No Available Games, but enough players to create a new game
// export class Enough {
//     constructor(queue) {
//         this.name = 'ENOUGH';
//         this.queue = queue;
//         while (this.queue.numPlayers() >= min_players) {
//             this.queue.createGame();
//         }
//     }

// }

export class AvailableGames {
    constructor(queue) {
        this.name = 'AVAILABLE_GAMES';
        this.queue = queue;
        console.log(this.queue.players.length);
        if (this.queue.numPlayers()) {
            for (var player of this.queue.players) {
                if (!this.queue.numPlayers()) break;
                this.addPlayer();
            }
        }
    }

    addPlayer() {
        console.log('Adding player during available game state');
        var added = false;
        for (var id of this.queue.available_games) {
            var GameRoom = GameRoomManager.getGameRoom(id);
            if (GameRoom && !GameRoom.isFull()) {
                var player = this.queue.players.shift();
                GameRoom.addWaitingPlayer(player);
                added = true;
                if (GameRoom.isFull()) this.queue.removeAvailableGame(id);
                player.emit('ESTABLISHED');
                break;
            } else {
                GameRoomManager.removeGameRoom(id);
            }
        }

        if (!added) this.queue.setState('NOT_ENOUGH');
        //TODO: If available game rooms is empty change state to not enough and add player again
    }
}
