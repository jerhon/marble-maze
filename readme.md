# Marble MazeBuilder

This is a simple game written in Phaser 3.

The goal is to get a marble through a maze either using the orientation of a phone, or by the cursor keys on a computer.

# Design

The game is divided up into 3 Phaser game Scenes.

* Menu
* Loading
* Game

## Menu Scene
The Menu scene displays the main menu on the game.  

## Loading Scene
The Loading scene makes the API call to the No-ops MazeBuilder service.  This passes the data along to the Game scene.


## Game Scene
The Game scene is where the game is played.

The Game usese the maze data and creates a set of static sprites as walls.
An End Sprite is used to mark where the player needs to get to.
The Marble can be controlled via a gyroscope or arrow keys.
