import { GameStateMachine } from "./gameStateMachine";
import { MazeResponse } from "./loading";
import { Maze } from "../maze";

export interface GameData {
  maze: MazeResponse;
}

export const GAME_SCENE = 'Game';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: GAME_SCENE,
};

interface Point {
  x: number;
  y: number;
}

export class GameScene extends Phaser.Scene {
  private marble1: Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } ;
  private endSquare: Phaser.GameObjects.Rectangle  & { body : Phaser.Physics.Arcade.Body };
  private walls: Phaser.GameObjects.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  private beta: number = 0;
  private gamma: number = 0;

  private gameData: GameData;
  private stateMachine: GameStateMachine;

  maze: Maze;

  constructor() {
    super(sceneConfig);
  }

  private stageDim : number;
  private wallDim : number;
  private marbleRadius : number;

  public preload() {
    this.load.image('wall', 'assets/wall.jpg' );
  }

  public create(data: GameData) {

    this.gameData = data;
    this.stateMachine = new GameStateMachine(this);
    if ((window as any).DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
    };

    this.cursorKeys = this.input.keyboard.createCursorKeys()

    this.input.enabled = true;
    
    // calculate the dimensions for positioning
    this.calculateDimensions(this.gameData.maze.map.length);
    
    this.maze = new Maze(this.gameData.maze.map, this.gameData.maze.startingPosition, this.gameData.maze.endingPosition, this.wallDim, 0, 0);

    // create everything else
    this.createWalls();

    this.marble1 = this.createMarble();
    this.endSquare = this.createEndSquare();

    this.physics.add.collider(this.marble1, this.walls);
    let gameEndCollider = this.physics.add.overlap(this.marble1, this.endSquare, this.nextLevel.bind(this));
  }

  /** Calculates dimensions needed to place game sprites and assets */
  calculateDimensions(tileCount: number) {
    this.stageDim = Math.min(this.game.canvas.height, this.game.canvas.width);
    this.wallDim = Math.ceil(this.stageDim / tileCount);
    this.marbleRadius = Math.floor(this.wallDim / 4);
  }

  /** Creates the walls for the game. */
  createWalls() {
    this.walls = this.physics.add.staticGroup();
    for (let coords of this.maze.getWalls()) {
      let wall = this.physics.add.staticImage(coords.x, coords.y, 'wall');
      wall.setDisplaySize(this.wallDim, this.wallDim);
      wall.enableBody(true, coords.x, coords.y, true, true);
      wall.body.setSize(this.wallDim, this.wallDim);
      wall.body.immovable = true;
      
      this.walls.add(wall);
    }
  }

  /** Creates a marble. */
  createMarble() : Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } {
    let {x,y} = this.maze.getStartPosition();
    let marble = this.add.circle(x, y, this.marbleRadius, 0xFF0000) as any;
    let ret = this.physics.add.existing(marble) as Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body };
    ret.body.setCollideWorldBounds(true);
    ret.body.setBounce(0.5, 0.5);
    ret.body.setDrag(10, 10);
    return ret;
  }

  createEndSquare() :  Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } {
    let {x,y} = this.maze.getEndPosition();
    let end = this.add.rectangle(x, y, this.wallDim, this.wallDim, 0xFF3300);
    this.physics.add.existing(end, true);
    return end as Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } ;
  }

  /** Moves to the next level. */
  nextLevel() {
    this.stateMachine.startLoadingLevel({ });
  }

  /** Update the motion of objects when a frame tick occurs. */
  updateMotion() {
    for (let marble of [this.marble1]) {
      if (this.cursorKeys.down.isDown) {
        marble.body.setAccelerationY(20);
      } else if (this.cursorKeys.up.isDown) {
        marble.body.setAccelerationY(-20);
      } else {
        marble.body.setAccelerationY( (this.beta / 180) * 150 );
      } 
      
      if (this.cursorKeys.left.isDown) {
        marble.body.setAccelerationX(-20);
      } else if (this.cursorKeys.right.isDown) {
        marble.body.setAccelerationX(20);
      } else {
        marble.body.setAccelerationX( (this.gamma / 180) * 150 )
      }
    }
  }
  
  /** Update for a single frame. */
  public update(time: number, delta: number) {
    this.updateMotion();
  }

  public deviceOrientationChanged(evt: DeviceOrientationEvent) {
    this.beta = evt.beta;
    this.gamma = evt.gamma;
  }
}