export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isSimilar(otherPosition: Position): boolean {
        return this.x === otherPosition.x &&
            this.y === otherPosition.y;
    }

    clone(): Position {
        return new Position(this.x, this.y);
    }

    normalize(): Position {
        let x = this.x;
        let y = this.y;
        const temp = y;
        y = Math.abs(x - 7);
        x = temp;
        return new Position(x, y);
    }
}