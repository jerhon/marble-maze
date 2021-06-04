import {MazeLoader} from "./maze-loader"

it('MazeBuilder Loader - Simple MazeBuilder with \\r\\n endings', () => {

	const mazeLoader = new MazeLoader()
	const maze = mazeLoader.parseMaze("maze1", "ESX\r\nXXX\r\nXXX\r\n");

	expect(maze.name).toBe("maze1")
	expect(maze.startPosition).toMatchObject({ x:1, y: 0 })
	expect(maze.endPosition).toMatchObject({x:0, y:0})
	expect(maze.rows.length).toBe(3)
	expect(maze.rows[0]).toMatchObject(['E','S','X'])
})



it('MazeBuilder Loader - Simple MazeBuilder with \\n endings', () => {

	const mazeLoader = new MazeLoader()
	const maze = mazeLoader.parseMaze("maze1", "ESX\nXXX\nXXX\n");

	expect(maze.name).toBe("maze1")
	expect(maze.startPosition).toMatchObject({ x:1, y: 0 })
	expect(maze.endPosition).toMatchObject({x:0, y:0})
	expect(maze.rows.length).toBe(3)
	expect(maze.rows[0]).toMatchObject(['E','S','X'])
})
