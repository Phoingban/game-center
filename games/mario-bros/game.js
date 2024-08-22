import {initAudio} from "./audio.js"
import {playAudio} from "./audio.js"
import { initSpritesheet} from "./spritesheet.js"
import {createAnimations} from "./animations.js"
import {checkControls} from "./controls.js"
import {initImage} from "./image.js"

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 800},
            debug: true
        }
    },
    scene: {
        preload,
        create,
        update,
    }
}

new Phaser.Game(config)

function addImages(scene, imageData) {
    imageData.forEach(data => {
        scene.add.image(data.x, data.y, data.key)
            .setScale(data.scale || 1)
            .setOrigin(data.originX || 0, data.originY || 1);
    });
}

function createFloor(scene, floorConfig) {
    const floor = scene.physics.add.staticGroup();
    floorConfig.intervals.forEach(interval => {
        for (let x = interval.start; x < interval.end; x += floorConfig.width) {
            floor.create(x, floorConfig.y, floorConfig.key)
                .setOrigin(0, 1)
                .refreshBody();
        }
    });
    return floor;
}

function createTubes(scene, tubeData) {
    const tubes = scene.physics.add.staticGroup({ immovable: true });
    tubeData.forEach(data => {
        tubes.create(data.x, data.y, data.key)
            .setOrigin(0, 1)
            .refreshBody();
    });
    return tubes;
}

function createBlocks(scene, blockConfig) {
    const blocks = scene.physics.add.staticGroup({immovable: true});
    blockConfig.intervals.forEach(interval => {
        let blockIndex = 0;
        for (let x = interval.start; x < interval.end; x += blockConfig.width) {
            const blockType = interval.types[blockIndex % interval.types.length];
            const y = typeof interval.y === 'function' ? interval.y(blockIndex) : (interval.y || blockConfig.defaultY);
            blocks.create(x, y, blockType)
                .setOrigin(0, 1)
                .refreshBody();
            blockIndex++;
        }
    });
    return blocks;
}


function preload() {

    initImage(this)
    initSpritesheet(this)
    initAudio(this)

}

function create () {
    createAnimations(this)

    //IMAGES
    const imageData = [
        { x: 140, y: 90, key: 'cloud1', scale: 0.15 },
        { x: 330, y: 30, key: 'cloud1', scale: 0.15 },
        { x: 610, y: 50, key: 'cloud1', scale: 0.15 },
        { x: 430, y: 80, key: 'cloud2', scale: 0.15 },
        { x: 730, y: 80, key: 'cloud2', scale: 0.15 },
        { x: 950, y: 50, key: 'cloud2', scale: 0.15 },
        { x: 1140, y: 90, key: 'cloud1', scale: 0.15 },
        { x: 1330, y: 30, key: 'cloud1', scale: 0.15 },
        { x: 1610, y: 50, key: 'cloud1', scale: 0.15 },
        { x: 1430, y: 80, key: 'cloud2', scale: 0.15 },
        { x: 1730, y: 80, key: 'cloud2', scale: 0.15 },
        { x: 1950, y: 50, key: 'cloud2', scale: 0.15 },
        { x: 256, y: 212, key: 'mountain1', scale: 0.5},
        { x: 0, y: 212, key: 'mountain2', scale: 0.5},
        { x: 768, y: 212, key: 'mountain2', scale: 0.5},
        { x: 1256, y: 212, key: 'mountain1', scale: 0.5},
        { x: 1768, y: 212, key: 'mountain2', scale: 0.5},
        { x: 186, y: 212, key: 'bush1', scale: 0.5},
        { x: 646, y: 212, key: 'bush1', scale: 0.5},
        { x: 954, y: 212, key: 'bush1', scale: 0.5},
        { x: 386, y: 212, key: 'bush2', scale: 0.5},
        { x: 1186, y: 212, key: 'bush1', scale: 0.5},
        { x: 1546, y: 212, key: 'bush1', scale: 0.5},
        { x: 1954, y: 212, key: 'bush1', scale: 0.5},
        { x: 1386, y: 212, key: 'bush2', scale: 0.5},
    ];
    addImages(this, imageData);

    //FLOOR
    this.floor = createFloor(this, {
        y: config.height,
        width: 128,
        key: 'floorbricks',
        intervals: [
            { start: 0, end: 1024 },
            { start: 1056, end: 1312 },
            { start: 1360, end: 2000 },
        ]
    });

    //TUBES
    const tubeData = [
        { x: 448, y: 212, key: 'vertical-small-tube' },
        { x: 608, y: 212, key: 'vertical-medium-tube' },
        { x: 736, y: 212, key: 'vertical-large-tube' },
        { x: 912, y: 212, key: 'vertical-large-tube' }
    ];
    this.tube = createTubes(this, tubeData);

    //BLOCKS
    this.blocks = createBlocks(this, {
        defaultY: 158,
        width: 16,
        intervals: [
            {start: 256, end: 272, types: ['empty-block']},
            {start: 304, end: 384, types: ['block', 'empty-block', 'block', 'empty-block', 'block']},
            {start: 336, end: 352, types: ['empty-block'], y: 96},
            {start: 1160, end: 1208, types: ['block', 'empty-block', 'block']},
            {start: 1208, end: 1336, types: ['block'], y:96},
            {start: 1384, end: 1448, types: ['block','empty-block'], y:96},
            {start: 1614, end: 1678, types: ['immovable-block'], y: (index) => 212 - (index % 4) * 16 },
            {start: 1710, end: 1774, types: ['immovable-block'], y: (index) => 164 + (index % 4) * 16 },     
        ]
    });

    //ENTITIES
    this.mario=this.physics.add.sprite(50, config.height-30, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        this.mario.body.setSize(18, 16) // Adjust these values as needed

    this.enemy=this.physics.add.sprite(20, config.height-30, 'goomba')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setVelocityX(-50)
    this.enemy.anims.play('goomba-walk', true)

    //COLLECTIBLES
    this.collectibles=this.physics.add.staticGroup()

    this.collectibles.create(150, 150, 'coin')
        .anims.play('coin-idle', true)
    this.collectibles.create(20, 204, 'super-mushroom')

    

    //WORLD PHYSICS & CAMERA

    this.physics.add.overlap(this.mario, this.collectibles, collectItem, null, this)

    this.physics.world.setBounds(0, 0, 2000, config.height)

    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)

    this.physics.add.collider(this.mario, this.blocks)

    this.physics.add.collider(this.mario, this.tube)
    this.physics.add.collider(this.enemy, this.tube)

    this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)

    this.keys=this.input.keyboard.createCursorKeys()
}

function update () {
    const {mario, scene}=this

    checkControls(this)

    if (mario.y >= config.height) {
        killMario(this)
    }
}


function collectItem (mario, item){
    const {texture: {key}} = item
    item.destroy()

    if(key === 'coin'){
        playAudio('coin-get', this, {volume:.1})
        addToScore(100, item, this)

    } else if (key === 'super-mushroom') {
        this.physics.world.pause()
        this.anims.pauseAll()
    
        playAudio('powerup', this, {volume:.1})
    
        let i = 0
        const interval = setInterval(() => {
          i++
          mario.anims.play(i % 2 === 0
            ? 'mario-grown-idle'
            : 'mario-idle'
          )
        }, 100)
    
        mario.isBlocked = true
        mario.isGrown = true
    
        setTimeout(() => {
          mario.setDisplaySize(18, 32)
          mario.body.setSize(18, 32)
    
          this.anims.resumeAll()
          mario.isBlocked = false
          clearInterval(interval)
          this.physics.world.resume()
        }, 1000)
      }
    }

function addToScore (scoreToAdd, origin, game){
    const coinText = game.add.text(
        origin.x,
        origin.y,
        scoreToAdd,
        {
            fontFamily: 'pixel',
            fontSize: config.width/35,
        }
    )

    game.tweens.add({
        targets: coinText,
        duration: 500,
        y: coinText.y-20,
        onComplete:()=>{
            game.tweens.add({
                targets: coinText,
                duration: 100,
                alpha: 0,
                onComplete:()=>{
                    coinText.destroy()
                }
            })
        }
    })
}

function onHitEnemy(mario, enemy){
    if (mario.body.touching.down && enemy.body.touching.up){
        enemy.anims.play('goomba-dead', true)
        enemy.setVelocityX(0)
        mario.setVelocityY(-250)
        playAudio('goomba-stomp', this)
        addToScore(200, enemy, this)
        setTimeout(()=>{
            enemy.destroy()
        },500)        
    } else {
        killMario(this)
    }
}

function killMario (game){
    const {mario, scene}= game

    if (mario.isDead) return

    mario.isDead = true
    mario.anims.play('mario-dead')
    mario.setCollideWorldBounds(false)
    playAudio('gameover', game, {volume:.1})

    mario.body.checkCollision.none=true
    mario.setVelocityX(0)

    setTimeout(() => {
        mario.setVelocityY(-300)
    }, 100)
    setTimeout(() =>{
        scene.restart()
    }, 2000)
}
