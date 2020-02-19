import * as _ from 'underscore';
import { RIGHT } from 'phaser';

interface Position {
    x: number;
    y: number;
}

interface Adjacent {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

interface MazeTile {
    position: Position;
    adjacent: Adjacent;
    type: string;
}

/** This is the data type for the maze service. */
export interface MazeResponse {
    name: string;
    mazePath: string;
    startingPosition: number[];
    endingPosition: number[];
    map: string[][];
}

export class Maze {

    startingPosition: Position;
    endingPosition: Position;

    public constructor(
        private map: string[][],
        startingPosition: number[],
        endingPosition: number[],
        private wallSize: number,
        private offsetX: number,
        private offsetY: number) {
            
            this.startingPosition = { x: startingPosition[0]+1, y: startingPosition[1]+1 };
            this.endingPosition = { x: endingPosition[0]+1, y: endingPosition[1]+1 };

    }

    hasTile(x: number, y: number) {
        if ( x < 0 )
            return false;
        if ( y < 0 )
            return false;

        if (y >= this.map.length)
            return false;
        if (x >= this.map[y].length)
            return false;

        return this.map[y][x] == 'X';
    }

    getTiles(): MazeTile[] {
        
        let spaces = this.map.map(
            (a, y) => a.map(
                (b, x) => ({ 
                    position: { x, y }, 
                    type: b
                })
            )
        );

        return _.flatten(spaces) as MazeTile[];
    }

    getWalls(): MazeTile[] {
        return this.getTiles()
            .filter((t) => t.type == 'X')
            .map((t) => 
                ({
                    position: this.getTilePosition(t.position, this.wallSize, this.offsetX, this.offsetY),
                    adjacent: {
                        top: this.hasTile(t.position.x, t.position.y - 1),
                        left: this.hasTile(t.position.x-1, t.position.y),
                        right: this.hasTile(t.position.x+1, t.position.y),
                        bottom: this.hasTile(t.position.x, t.position.y +1)
                    },
                    type: t.type
                }));
    }

    getTilePosition(space: Position, size: number, offsetX: number, offsetY: number): Position {
        return this.getCenterPosition(space.x, space.y, size, offsetX, offsetY);
    }

    getStartPosition() {
        return this.getCenterPosition(this.startingPosition.x, this.startingPosition.y, this.wallSize, this.offsetX, this.offsetY);
    }

    getEndPosition() {
        return this.getCenterPosition(this.endingPosition.x, this.startingPosition.y, this.wallSize, this.offsetX, this.offsetY);
    }

    getHeight() {
        return this.map.length;
    }

    getWidth() {
        return this.map[0].length;
    }

    getCenterPosition(x: number, y: number, tileSize: number, offsetX: number, offsetY: number) {
        return {
            x: x * tileSize + (tileSize / 2) + offsetX,
            y: y * tileSize + (tileSize / 2) + offsetY
        };
    }


    // -----X-----

    //  |
    //  |
    //  X
    //  |
    //  |
}