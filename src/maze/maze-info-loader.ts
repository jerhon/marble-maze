
export interface MazeInfoFile {
    mazes: MazeInfo[]
}

export interface MazeInfo {
    id: string,
    filename: string,
    title: string,
    next: string
}

export class MazeInfoLoader {

    _mazeInfo: MazeInfoFile;

    async loadMazeInfo() {
        const response = await fetch('/assets/maze-info.json')
        this._mazeInfo = await response.json() as MazeInfoFile
    }

    async getMazeInfoById(id: string) {
        if (!this._mazeInfo) {
            await this.loadMazeInfo();
        }

        return this._mazeInfo.mazes.find((m) => m.id === id)
    }
}
