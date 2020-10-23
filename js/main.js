const game = [
    [0,1,3],
    [4,2,5],
    [7,8,6]
]

const tileSize = 96

let moves = 0

const scale = window.devicePixelRatio
const canvas = document.createElement('canvas')
const w = game[0].length * tileSize
const h =  game.length * tileSize
canvas.width = w * scale
canvas.height = h * scale
canvas.style.width = `${w}px`
canvas.style.height = `${h}px`
const c = canvas.getContext('2d')
c.scale(scale, scale)
c.textAlign = "center"
const fontSize = 24
c.font = `${fontSize}px Arial`

const scrambleBtn = document.createElement('button')
scrambleBtn.innerText = "Scramble"
scrambleBtn.addEventListener('click', () => scramble(Math.floor(Math.random()*100)))

const status = document.createElement('div')
status.id = 'status'

document.body.appendChild(status)
document.body.appendChild(canvas)
document.body.appendChild(scrambleBtn)

const getPos = e => {
    return {x: Math.floor(e.offsetX / tileSize), y: Math.floor(e.offsetY / tileSize)}
}

const draw = () => {
    c.clearRect(0,0,w,h)
    c.strokeStyle = "black"
    for(let i = 0; i < game.length; i++){
        for(let j = 0; j < game[0].length; j++){
            const piece = game[i][j]
            if(!piece)
                continue
            const x = j * tileSize
            const y = i * tileSize
            c.fillStyle = "white"
            c.fillRect(x, y, tileSize, tileSize)
            c.strokeRect(x, y, tileSize, tileSize)
            c.fillStyle = "black"
            c.fillText(piece, x+tileSize/2, y+(tileSize+fontSize-2)/2)
        }
    }
}

const findEmptyPos = () => {
    for(let i = 0; i < game.length; i++){
        for(let j = 0; j < game[0].length; j++){
            if(!game[i][j]){
                return {x: j, y: i}
            }
        }
    }
}

const getNeighbour = pos => {
    let n = []
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(pos.y+i < 0 || pos.y+i > game.length-1 || pos.x+j < 0 || pos.x+j > game[0].length-1 || i+j === 0 || i === j) 
                continue
            if(game[pos.y+i][pos.x+j])
                n.push({x: pos.x+j, y: pos.y+i})
        }
    }
    return n
}

const scramble = (num = 1) => {
    moves = 0
    for(let i = 0; i < num; i++){
        const emptyPos = findEmptyPos()
        const n = getNeighbour(emptyPos)
        const move = n[Math.floor(Math.random() * n.length)]
        tradePos(move, emptyPos)
    }
    draw()
    if(!checkGameWin()){
        status.innerText = ''
    }
}

const lookEmptyPos = pos => {
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(pos.y+i < 0 || pos.y+i > game.length-1 || pos.x+j < 0 || pos.x+j > game[0].length-1 || i+j == 0)   
                continue
            if(!game[pos.y+i][pos.x+j])
                return {x: pos.x+j, y: pos.y+i}
        }
    }
    return null
}

const tradePos = (pos, newPos) => {
    if(!newPos) 
        return
    game[newPos.y][newPos.x] = game[pos.y][pos.x]
    game[pos.y][pos.x] = 0
}

const checkGameWin = () => {
    for(let i = 0; i < game.length * game[0].length - 1; i++){
        const x = i % game[0].length
        const y = Math.floor( i / game[0].length )
        if(game[y][x] != i+1)
            return false
    }
    return true
}

const move = e => {
    const pos = getPos(e)
    const newPos = lookEmptyPos(pos)
    tradePos(pos, newPos)
    if(checkGameWin())
        status.innerText = `Win - ${moves} moves`
    draw()
    moves += 1
}

canvas.addEventListener('click', move)

scramble(1000)
