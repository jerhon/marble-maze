export interface MazeInfoFile {
	mazes: MazeInfo[]
	order: string[]
}

export interface MazeInfo {
	id: string,
	filename: string,
	title: string,
	next: string
}

export class MazeInfoLoader {

	_mazeInfo: MazeInfoFile;

	async loadMazeInfo(): Promise<void> {
		if (!this._mazeInfo) {
			const response = await fetch('/assets/maze-info.json')
			this._mazeInfo = await response.json() as MazeInfoFile
		}
	}

	async getMazeInfoById(id: string): Promise<MazeInfo> {
		await this.loadMazeInfo();

		return this._mazeInfo.mazes.find((m) => m.id === id)
	}

	async getNextMazeId(id: string): Promise<string> {
		await this.loadMazeInfo();

		let mazeIdx = this._mazeInfo.order.findIndex((x) => x === id) + 1
		if (mazeIdx < 0 || mazeIdx >= this._mazeInfo.order.length) {
			mazeIdx = 0
		}

		return this._mazeInfo.order[mazeIdx];
	}
}
