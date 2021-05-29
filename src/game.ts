import Phaser from "phaser";
import {serviceWorker} from "./index";
import { GameScene } from './scenes/game';
import { LoadingScene } from './scenes/loading';
import { MenuScene } from './scenes/menu';
import { MessageScene } from './scenes/message';

import "./style.css"

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Marble Maze',
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        fullscreenTarget: 'game',
    },
    height: 704,
    width: 704,
    scene: [MenuScene, LoadingScene, GameScene, MessageScene],
    parent: 'game',
    backgroundColor: '#000000',
    disableContextMenu: true,

};

export function run() {

    if (process.env.NODE_ENV === 'prod') {
        serviceWorker();
    }


    let g =  new Phaser.Game(gameConfig);
}
