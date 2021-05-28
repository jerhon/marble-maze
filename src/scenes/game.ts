import { SceneManager } from "./scene-manager";
import { MazeBuilder } from "../maze/maze-builder";
import {MazeFile} from "../maze/maze-loader";
import Phaser from "phaser"


export interface GameData {
  maze: MazeFile;
}

export const GAME_SCENE = 'Game';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: GAME_SCENE,
};

export class GameScene extends Phaser.Scene {
  private marble1: Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } ;
  private endSquare: Phaser.GameObjects.Rectangle  & { body : Phaser.Physics.Arcade.Body };
  private walls: Phaser.GameObjects.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private dimensions: { stage: number };

  private beta: number = 0;
  private gamma: number = 0;

  private gameData: GameData;
  private sceneManager: SceneManager;

  private pointer: Phaser.Input.Pointer;

  maze: MazeBuilder;

  constructor() {
    super(sceneConfig);
  }


  public preload() {
    this.load.image('wall', 'assets/wall.jpg' );
  }

  public create(data: GameData) {

    this.gameData = data;
    this.sceneManager = new SceneManager(this);
    if ((window as any).DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
    };

    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.pointer = this.input.pointer1;

    this.input.enabled = true;

    // calculate the dimensions for positioning
    const dimensions = this.calculateDimensions(this.gameData.maze.rows[0].length);
    this.dimensions = dimensions;

    this.maze = new MazeBuilder(this.gameData.maze, dimensions.wall, 0, 0);
    const { walls } = this.maze.addWalls(this);
    this.walls = walls;

    this.marble1 = this.createMarble(dimensions.marble);
    this.endSquare = this.createEndSquare(dimensions.wall);

    this.physics.add.collider(this.marble1, this.walls);
    this.physics.add.overlap(this.marble1, this.endSquare, this.nextLevel.bind(this));
  }

  /** Calculates dimensions needed to place game sprites and assets */
  calculateDimensions(tileCount: number) {
    const stage = Math.min(this.game.canvas.height, this.game.canvas.width);
    const wall = Math.ceil(stage / tileCount);
    const marble = Math.floor(wall / 4);
    return { stage, wall, marble }
  }


  /** Creates a marble. */
  createMarble(marbleRadius: number) : Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } {
    let {x,y} = this.maze.getStartPosition();
    let marble = this.add.rectangle(x, y, marbleRadius,marbleRadius, 0xFF0000) as any;
    let ret = this.physics.add.existing(marble) as Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body };
    ret.body.setCollideWorldBounds(true);
    ret.body.setBounce(0.6, 0.6);
    ret.body.setDrag(5, 5);

    console.log(marbleRadius);
    console.log({x,y})
    return marble;
  }

  createEndSquare(wallSize: number) :  Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } {
    let {x,y} = this.maze.getEndPosition();
    let end = this.add.rectangle(x, y, wallSize, wallSize, 0xFF3300);
    this.physics.add.existing(end, true);
    return end as Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } ;
  }

  /** Moves to the next maze. */
  nextLevel() {
    this.sceneManager.startLoadingLevel({ });
  }

  /** Update the motion of objects when a frame tick occurs. */
  updateMotion() {

    for (let marble of [this.marble1]) {
      if (this.pointer.isDown) {
        let halfStage = this.dimensions.stage / 2;
        marble.body.setAccelerationY( ( halfStage - this.pointer.y) / halfStage * -100  );
        marble.body.setAccelerationX( ( halfStage - this.pointer.x) / halfStage * -100  );
      } else {
        marble.body.setAccelerationY( (this.beta / 180) * 150 );
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
