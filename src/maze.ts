import * as _ from 'underscore';

interface Dimension {
    x: number;
    y: number;
}

interface MazeTile {
    x: number;
    y: number;
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

    startingPosition: MazeTile;
    endingPosition: MazeTile;

    public constructor(
        private map: string[][],
        startingPosition: number[],
        endingPosition: number[],
        private wallSize: number,
        private offsetX: number,
        private offsetY: number) {
            
            this.startingPosition = { x: startingPosition[0]+1, y: startingPosition[1]+1, type: 'S' };
            this.endingPosition = { x: endingPosition[0]+1, y: endingPosition[1]+1, type: 'E' };

    }

    getTiles(): MazeTile[] {
        
        let spaces = this.map.map(
            (a, y) => a.map(
                (b, x) => ({ 
                    x,
                    y, 
                    type: b
                })
            )
        );

        return _.flatten(spaces) as MazeTile[];
    }

    getWalls(): Dimension[] {
        return this.getTiles()
            .filter((t) => t.type == 'X')
            .map((t) => this.getTilePosition(t, this.wallSize, this.offsetX, this.offsetY));
    }

    getTilePosition(space: MazeTile, size: number, offsetX: number, offsetY: number): Dimension {
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