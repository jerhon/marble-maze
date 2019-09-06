import { Physics } from "phaser";


/**
 * This is the data type for the maze service.
 */
export interface maze {
  name: string;
  mazePath: string;
  startingPosition: number[];
  endingPosition: number[];
  map: string[][];
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

interface Point {
  x: number;
  y: number;
}

export class GameScene extends Phaser.Scene {
  private marble1: Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } ;
  private marble2: Phaser.GameObjects.Arc  & { body : Phaser.Physics.Arcade.Body };
  private walls: Phaser.GameObjects.Group;
  private height: number;
  private width: number;
  private wallWidth: number;
  private wallHeight: number;
  private wallXOffset: number;
  private wallYOffset: number;
  private radius: number;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private beta: number = 0;
  private gamma: number = 0;
  private collider: Phaser.Physics.Arcade.Collider;
  private collider2: Phaser.Physics.Arcade.Collider;

  constructor() {
    super(sceneConfig);
  }
  
  public create(data: maze) {
    if ((window as any).DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
    }

    this.cursorKeys = this.input.keyboard.createCursorKeys()

    this.height = this.game.canvas.height;
    this.width = this.game.canvas.width;
    this.wallWidth = this.width / data.map[0].length;
    this.wallHeight = this.height / data.map.length;
    this.wallXOffset = this.wallWidth / 2;
    this.wallYOffset = this.wallHeight / 2;

    this.input.enabled = true;
    
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < data.map.length; y++) {
      for (let x = 0; x < data.map[y].length; x++) {
        if (data.map[y][x] === 'X') {
          var coords = this.getCoordinates({x, y});
          this.walls.add(this.add.rectangle(coords.x, coords.y, this.wallWidth, this.wallHeight, 0xFFFFFF));
        }
      }
    }

    this.radius = Math.min( this.wallWidth / 3, this.wallHeight / 3);
    
    let startCoords = this.getCoordinates({x: data.startingPosition[0], y: data.startingPosition[1]});
    this.marble1 = this.add.circle(startCoords.x, startCoords.y, this.radius, 0xAAAAAA) as any;
    this.physics.add.existing(this.marble1);
    this.marble1.body.setCollideWorldBounds(true);

    let endCoords = this.getCoordinates({x: data.endingPosition[0], y: data.endingPosition[1]});
    this.marble2 = this.add.circle(endCoords.x, endCoords.y, this.radius, 0xFF0000) as any;
    this.physics.add.existing(this.marble2);
    this.marble2.body.setCollideWorldBounds(true);

    this.physics.add.collider([this.marble1, this.marble2], this.walls);
    this.physics.add.overlap(this.marble1, this.marble2);
  }

  getCoordinates(p: Point): Point {
    return { 
        x: p.x * this.wallWidth + this.wallXOffset, 
        y: p.y * this.wallHeight + this.wallYOffset 
      }
  }
  
  public update(time: number, delta: number) {
    // TODO: add motion of player, and end goal of combining the marbles
    for (let marble of [this.marble1, this.marble2]) {
      marble.body.setVelocityX( (this.gamma / 180) * 300 );
      marble.body.setVelocityY( (this.beta / 180) * 300 );

      if (this.cursorKeys.down.isDown) {
        marble.body.setVelocityY(300);
      } else if (this.cursorKeys.up.isDown) {
        marble.body.setVelocityY(-300);
      }
      
      if (this.cursorKeys.left.isDown) {
        marble.body.setVelocityX(-300);
      } else if (this.cursorKeys.right.isDown) {
        marble.body.setVelocityX(300);
      }
    }

  }

  public deviceOrientationChanged(evt: DeviceOrientationEvent) {
    this.beta = evt.beta;
    this.gamma = evt.gamma;
  }
}