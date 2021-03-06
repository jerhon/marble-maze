

export interface Position {
    x: number;
    y: number;
}

/** This is the data type for the maze service. */
export interface MazeFile {
    name: string;
    startPosition: Position;
    endPosition: Position;
    rows: string[][];
}

export class MazeLoader {

	parseMaze(name: string, mazeText: string): MazeFile {
		const lines = mazeText
			.replace('\r\n', '\n')
			.split('\n')
			.filter((r) => r !== "")

		const rows = lines.map((x) => x.split(""))
		let startPosition: Position = { x: 0, y: 0 }
		let endPosition: Position  = { x: 0, y: 0 }

		for ( let y = 0; y < rows.length; y++) {
			for (let x = 0; x < rows[y].length; x++)
			{
				const char = rows[y][x]
				if (char === 'S') {
					startPosition = { x, y }
				} else if (char === 'E') {
					endPosition = {x, y}
				}
			}
		}

		return {
			name,
			startPosition,
			endPosition,
			rows
		}
	}

	async loadMaze(filename: string): Promise<MazeFile> {
		const fileContents = await fetch(`/assets/mazes/${filename}`)
		const response = await fileContents.text()
		return this.parseMaze(filename, response)
	}
}
