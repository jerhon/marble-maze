import {MazeLoader} from "./maze-loader"

it('Maze Loader - Simple Maze', () => {

    const mazeLoader = new MazeLoader()
    const maze = mazeLoader.parseMaze("maze1", "XXX\t\nXXX\r\nXXX\r\n");

})
