export const initAudio=({load})=>{
    load.audio('gameover', 'assets/sound/music/gameover.mp3')
    load.audio('jump', 'assets/sound/effects/jump.mp3')
    load.audio('goomba-stomp', 'assets/sound/effects/goomba-stomp.wav')
    load.audio('coin-get', 'assets/sound/effects/coin.mp3')
    load.audio('powerup', 'assets/sound/effects/consume-powerup.mp3')
}

export const playAudio =(id, {sound}, {volume=1}={})=>{
    try{
        return sound.add(id, {volume}).play()
    } catch (e){
        console.error(e)
    }
}