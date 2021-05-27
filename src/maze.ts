import * as _ from 'underscore';
import {MazeAsset} from "./maze/maze-loader";

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

export class Maze {

    public constructor(

        private _maze: MazeAsset,
        private wallSize: number,
        private offsetX: number,
        private offsetY: number) {
    }

    hasTile(x: number, y: number) {
        if ( x < 0 )
            return false;
        if ( y < 0 )
            return false;

        if (y >= this.getHeight())
            return false;
        if (x >= this.getWidth())
            return false;

        return this._maze.rows[y][x] == 'X';
    }

    getTiles(): MazeTile[] {

        let spaces = this._maze.rows.map(
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
        return this.getCenterPosition(this._maze.startPosition.x, this._maze.startPosition.y, this.wallSize, this.offsetX, this.offsetY);
    }

    getEndPosition() {
        return this.getCenterPosition(this._maze.endPosition.x, this._maze.endPosition.y, this.wallSize, this.offsetX, this.offsetY);
    }

    getHeight() {
        return this._maze.rows.length;
    }

    getWidth() {
        return this._maze.rows[0].length;
    }

    getCenterPosition(x: number, y: number, tileSize: number, offsetX: number, offsetY: number) {
        return {
            x: (x * tileSize) + (tileSize / 2) + offsetX,
            y: (y * tileSize) + (tileSize / 2) + offsetY
        };
    }


    // -----X-----

    //  |
    //  |
    //  X
    //  |
    //  |
}
