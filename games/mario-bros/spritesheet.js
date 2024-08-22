export const initSpritesheet=({load})=>{
    load.spritesheet('mario', 'assets/entities/mario.png', {frameWidth: 18, frameHeight: 16})
    load.spritesheet('goomba', 'assets/entities/overworld/goomba.png', {frameWidth: 16, frameHeight: 16})
    load.spritesheet('coin', 'assets/collectibles/coin.png', {frameWidth: 16, frameHeight: 16})
    load.spritesheet('mario-grown', 'assets/entities/mario-grown.png', {frameWidth: 18, frameHeight: 32})
    load.spritesheet('mistery-block', 'assets/blocks/overworld/misteryBlock.png', {frameWidth: 16, frameHeight:16})
}