/////////////////////////////////TODO://////////////////////////////////////////
///////1. Fix the bug on check collision tank with map (right and down)/////////
///////2. Realize map editor////////////////////////////////////////////////////
///////3. Realize check tank on collision with blocks///////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////Class: Scene//////////////////////////////////////////////////
/////////////This is a class of scene, where will drawing game objects//////////
//Attributes: canvas, context, width, height////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Scene(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    return this;
}

Scene.prototype = {
    recalcSize: function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
};
////////////////////////////////////////////////////////////////////////////////
///////////////////////////Class: Game//////////////////////////////////////////
/////////////It's main class of game. Here is redrawing and timer of game///////
//Attributes: gameTimer and all others it's functions///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Game() {
    this.gameTimer = null;
    return this;
}

Game.prototype = {
    globalUpdateValues: function() {
        if (Core.Variables.Keyboard.keyPressed) {
            Core.Variables.PlayerTank.moveTank();
            //Core.Variables.Console.writeDebug('Key is Pressed in globalUpdateValues');
        }
    },
    drawMap: function(scene, map) {
        for (var h_index = 0; h_index < map.countTilesHeight; h_index++) {
            for (var w_index = 0; w_index < map.countTilesWidth; w_index++) {
                switch (map.mask[h_index][w_index]) {
                    case 0:
                        scene.context.drawImage(map.environment.brick, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 1:
                        scene.context.drawImage(map.environment.forest, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 2:
                        scene.context.drawImage(map.environment.steel, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 3:
                        scene.context.drawImage(map.environment.water, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                }
            }
        }
    },
    drawTank: function(scene, tank) {
        scene.context.beginPath();
        scene.context.drawImage(tank.image, tank.direction * tank.width, 0, tank.width, tank.height, tank.x, tank.y, tank.width, tank.height);
        scene.context.closePath();
    },
    clearScene: function(scene) {
        scene.context.clearRect(0, 0, scene.width, scene.height);
        scene.context.beginPath();
        scene.context.fillStyle = 'rgba(70, 70, 70, 0.5)';
        scene.context.rect(0, 0, scene.width, scene.height);
        scene.context.fill();
        scene.context.closePath();
    },
    drawScene: function() {
        this.globalUpdateValues();
        this.clearScene(Core.Variables.MainScene);
        this.drawMap(Core.Variables.MainScene, Core.Variables.Map);
        this.drawTank(Core.Variables.MainScene, Core.Variables.PlayerTank);
    }
};
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////Class: Keyboard/////////////////////////////
///////////////Here I'm check input and parse it////////////////////////////////
///////////Attributes: keyPressed and all's other it's functions////////////////
////////////////////////////////////////////////////////////////////////////////
function Keyboard() {
    this.keyPressed = false;
    return this;
}

Keyboard.prototype = {
    convertCodeToDirection: function(code) {
        switch (code) {
            case 37:
                return 'left';
            case 38:
                return 'up';
            case 39:
                return 'right';
            case 40:
                return 'down';
            default:
                return false;
        }
    },
    keyDown: function(e) {
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
            Core.Variables.PlayerTank.setDirection(direction);
            this.keyPressed = true;
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
            //Core.Variables.Console.writeDebug('Current direction: ' + direction);
        }
    },
    keyUp: function(e) {
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
            this.keyPressed = false;
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
        }
    },
    hookEvent: function() {
        var self = this;
        document.onkeydown = function(e) {
            self.keyDown(e);
        };
        document.onkeyup = function(e) {
            self.keyUp(e);
        };
    }
};
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Class: Game Timer////////////////////////////////
//////////////////It's a main timer of game. We can start or stop game//////////
////////////////////////////////////////////////////////////////////////////////
function GameTimer() {
    return this;
}

GameTimer.prototype = {
    startGame: function(game) {
        game.gameTimer = setInterval(function() {
            game.drawScene();
        }, Core.Config.UpdateTimerInterval);
        Core.Variables.Console.writeInfo('Game is start');
    },
    stopGame: function(game) {
        clearInterval(game.gameTimer);
        Core.Variables.Console.writeInfo('Game is stoped');
    }
};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////Class: Tank////////////////////////////////////////////
////////Here a class of Tank. All functions inside works with tank./////////////
///Attributes: image (object), x, y, width, height//////////////////////////////
///strDirection ('up', 'right', 'left', 'down'), direction (integer), speed/////
////////////////////////////////////////////////////////////////////////////////
function Tank(imageSrc, x, y, width, height, direction, speed) {
    var image = new Image();
    image.src = imageSrc;
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.strDirection = direction;
    this.setDirection(direction);
    this.speed = speed;
    return this;
}

Tank.prototype = {
    checkInsideMapUp: function(map) {
        if (this.y - this.speed >= map.offsetYMap) {
            Core.Variables.Console.writeDebug('Tank inside map up');
            return true;
        } else {
            return false;
        }
    },
    checkInsideMapRight: function(map) {
        if (this.x + this.speed <= map.offsetXMap + map.mapWidth - this.width + this.speed - 6) { //TODO: fix this bug
            Core.Variables.Console.writeDebug('Tank inside map right');
            return true;
        } else {
            return false;
        }
    },
    checkInsideMapDown: function(map) {
        if (this.y + this.speed < map.offsetYMap + map.mapHeight - this.height) { //TODO: fix this bug
            Core.Variables.Console.writeDebug('Tank inside map down');
            return true;
        } else {
            return false;
        }
    },
    checkInsideMapLeft: function(map) {
        if (this.x >= map.offsetXMap + this.speed) {
            Core.Variables.Console.writeDebug('Tank inside map left');
            return true;
        } else {
            return false;
        }
    },
    checkCollisionBlocks: function() { //TODO: realize check for driving and collise with blocks
        var tankInsideMap = this.checkInsideMap(Core.Variables.Map);
        if (!tankInsideMap) {
            return false;
        } else {
            return true;
        }
        //Core.Variables.Console.writeDebug('Collision is checked');
    },
    setDirection: function(direction) {
        this.strDirection = direction;
        this.direction = this.convertDirectionToInteger(direction);
    },
    convertDirectionToInteger: function(direction) {
        switch (direction) {
            case 'up':
                return 2;
                break;
            case 'down':
                return 3;
                break;
            case 'left':
                return 1;
                break;
            case 'right':
                return 0;
                break;
        }
    },
    moveTank: function() {
        Core.Variables.Console.writeDebug('Tank X = ' + this.x + ', Tank Y = ' + this.y);
        switch (this.strDirection) {
            case 'up':
                if (this.checkInsideMapUp(Core.Variables.Map)) {
                    this.y = this.y - this.speed;
                }
                break;
            case 'down':
                if (this.checkInsideMapDown(Core.Variables.Map)) {
                    this.y = this.y + this.speed;
                }
                break;
            case 'left':
                if (this.checkInsideMapLeft(Core.Variables.Map)) {
                    this.x = this.x - this.speed;
                }
                break;
            case 'right':
                if (this.checkInsideMapRight(Core.Variables.Map)) {
                    this.x = this.x + this.speed;
                }
                break;
        }
    }
};
////////////////////////////////////////////////////////////////////////////////
//////////////////////////Class: Map////////////////////////////////////////////
///////////////In this class images, loader, array, etc/////////////////////////
////////Attributes: countTilesWidth, countTilesHeight///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Map() {
    this.countTilesHeight = 8;
    this.countTilesWidth = 8;
    this.offsetXMap = 100;
    this.offsetYMap = 100;
    return this;
}

Map.prototype = {
    calculateOffsetMap: function() {
        this.mapWidth = this.countTilesWidth * Core.Config.tileEnvironmentWidth;
        this.mapHeight = this.countTilesHeight * Core.Config.tileEnvironmentHeight;
        var centerMapX = Core.Variables.MainScene.width / 2;
        var centerMapY = Core.Variables.MainScene.height / 2;
        this.offsetXMap = centerMapX - this.mapWidth / 2;
        this.offsetYMap = centerMapY - this.mapHeight / 2;
    },
    loadImage: function(src) {
        var image = new Image();
        image.src = src;
        return image;
    },
    loadResources: function() {
        this.environment.brick = this.loadImage(Core.Config.tileBrickSrc);
        this.environment.forest = this.loadImage(Core.Config.tileForestSrc);
        this.environment.steel = this.loadImage(Core.Config.tileSteelSrc);
        this.environment.water = this.loadImage(Core.Config.tileWaterSrc);
    },
    environment: {
        brick: null,
        forest: null,
        steel: null,
        water: null
    },
    loadMask: function(src) { //TODO: create Map Editor and realize saving
        this.mask = localStorage.getItem(src);
        //[[0, 1, 0, 2, 2, 3, 1, 0], [0, 3, 0, 2, 3, 2, 3, 1], [0, 2, 2, 1, 2, 1, 2, 3], [0, 3, 3, 1, 2, 3, 1, 3], [0, 2, 3, 2, 1, 1, 2, 0]];
        this.countTilesHeight = 7;
        this.countTilesWidth = 15;
    }
};
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Class: Console//////////////////////////////////
/////////////////////////////Just for Debugging/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Console() {
    return this;
}

Console.prototype = {
    checkDebugMode: function() {
        if (Core.Config.debugMode) {
            return true;
        } else {
            return false;
        }
    },
    writeInfo: function(text) {
        console.info(text);
    },
    writeDebug: function(text) {
        if (this.checkDebugMode()) {
            console.debug(text);
        }
    }
};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CORE OF MY GAME////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var Core = {
    Config: {
        debugMode: true, //Debug mode enabled
        tileTankWidth: 48, //Width of one sprite (tank)
        tileTankHeight: 48, //Height of one sprite (tank)
        tileEnvironmentWidth: 50, //Width of one tile (environment)
        tileEnvironmentHeight: 50, //Height of one tile (environment)
        tilesCount: 8, //Count of tiles in one line (in this case size of field 8 * 8)
        tileTankSrc: './images/tank.png', //Source to Tank Image
        tankSpeed: 10, //Default speed of tank
        tankDirection: 'up', //Default direction of tank
        tileBrickSrc: './images/brick.png', //Brick tile src
        tileForestSrc: './images/forest.png', //Forest tile src
        tileSteelSrc: './images/steel.png', //Steel tile src
        tileWaterSrc: './images/water.png', //Water tile src
        UpdateTimerInterval: 50 //Interval of redrawing of scene
    },
    Variables: {
        MainScene: null, //Object of Scene
        Game: null, //Object of Game
        GameTimer: null, //Object of GameTimer
        PlayerTank: null, //Object of player's tank
        Console: null, //Object of Console
        Map: null, //Object of Map
        Keyboard: null //Object of Keyboard
    },
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////////ENTRY POINT OF GAME///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    InitializeGame: function() {
        Core.Variables.Console = new Console(); //DONE
        Core.Variables.Keyboard = new Keyboard(); //DONE
        Core.Variables.Keyboard.hookEvent(); //DONE
        Core.Variables.MainScene = new Scene('scene'); //DONE
        Core.Variables.MainScene.recalcSize(); //DONE
        Core.Variables.Map = new Map(); //DONE
        Core.Variables.Map.loadMask('Test Map'); //TODO: realize param in object, which shows src to file with map
        Core.Variables.Map.calculateOffsetMap(); //DONE
        Core.Variables.Map.loadResources(); //DONE
        Core.Variables.PlayerTank = new Tank(Core.Config.tileTankSrc, Core.Variables.Map.offsetXMap, Core.Variables.Map.offsetYMap, Core.Config.tileTankWidth, Core.Config.tileTankHeight, Core.Config.tankDirection, Core.Config.tankSpeed); //DONE
        Core.Variables.Game = new Game(); //DONE
        Core.Variables.GameTimer = new GameTimer(); //DONE
        Core.Variables.GameTimer.startGame(Core.Variables.Game); //DONE
        Core.Variables.Console.writeInfo('Entry Point triggered'); //DONE
    },
    EntryPoint: function() {
        Core.InitializeGame();
    }
};

var documentReadyInterval = setInterval(function() {
    if (document.readyState === 'complete') {
        Core.EntryPoint();
        clearInterval(documentReadyInterval);
    }
}, 10);