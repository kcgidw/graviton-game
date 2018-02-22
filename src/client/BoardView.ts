import {Board} from '../game-core/Board';
import {Block} from '../game-core/Block';

export class BoardView {
    board: Board;
    app: PIXI.Application;

    blockSprites: BlockSpriteRegistry = new BlockSpriteRegistry();

    constructor(board: Board, app: PIXI.Application) {
        this.board = board;
        this.app = app;
    }

    draw(): void {
        this.board.blocks.forEach((column) => {
            column.forEach((block) => {
                let existing: BlockSprite = this.blockSprites.get(block);
                if(existing) {
                    existing.draw();
                } else {
                    this.addBlock(block);
                }
            })
        });
        console.log(this.board.blocks[0][0].hitbox.y);
    }
    addBlock(block: Block): void {
        var spr: PIXI.Sprite = PIXI.Sprite.fromImage('assets/images/red.png');
        // TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
        this.app.stage.addChild(spr);
        var bs = new BlockSprite(block, spr);
        this.blockSprites.register(block, bs);
    }
    removeBlock(block: Block): void {
        var bs: BlockSprite = this.blockSprites.deregister(block);
        bs.destroy();      // TODO hide and reuse
    }
}

export class BlockSpriteRegistry {
    map: any = {};

    constructor() {

    }

    get(block: Block) {
        return this.map[block.id];
    }

    register(block: Block, blockSprite: BlockSprite) {
        this.map[block.id] = blockSprite;
    }
    deregister(block: Block): BlockSprite {
        var bs: BlockSprite = this.get(block);
        delete this.map[block.id];
        return bs;
    }
}

export class BlockSprite {
    block: Block;
    sprite: PIXI.Sprite;
    constructor(block: Block, sprite: PIXI.Sprite) {
        this.block = block;
        this.sprite = sprite;
    }
    draw() {
        this.sprite.y = this.block.hitbox.y;
    }
    destroy() {
        this.sprite.destroy();
    }
}