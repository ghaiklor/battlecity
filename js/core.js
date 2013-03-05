////////////////////////////////////////////////////////////////////////////////
//////////////////Class: Scene//////////////////////////////////////////////////
/////////////This is a class of scene, where will drawing game objects//////////
//Attributes: canvas, context, width, height////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Scene(id) {
    this.recalcSize = function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };

    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.recalcSize();
}
////////////////////////////////////////////////////////////////////////////////
///////////////////////////Class: Game//////////////////////////////////////////
/////////////It's main class of game. Here is redrawing and timer of game///////
//Attributes: gameTimer and all others it's functions///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Game() {
    this.gameTimer = null;

    this.globalUpdateValues = function() {
        if (Core.Variables.Keyboard.keyPressed) {
            Core.Variables.PlayerTank.moveTank();
        }
    };

    this.drawMap = function(scene, map) {
        for (var w_index = 0; w_index < Core.Variables.Map.countTilesWidth; w_index++) {
            for (var h_index = 0; h_index < Core.Variables.Map.countTilesHeight; h_index++) {
                /////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////TODO://////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////
                var random = Math.floor(Math.random() * 4);
                switch (random) {
                    case 0:
                        scene.context.drawImage(map.environment.brick, Core.Config.tileEnvironmentWidth * w_index, Core.Config.tileEnvironmentHeight * h_index, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 1:
                        scene.context.drawImage(map.environment.forest, Core.Config.tileEnvironmentWidth * w_index, Core.Config.tileEnvironmentHeight * h_index, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 2:
                        scene.context.drawImage(map.environment.steel, Core.Config.tileEnvironmentWidth * w_index, Core.Config.tileEnvironmentHeight * h_index, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case 3:
                        scene.context.drawImage(map.environment.water, Core.Config.tileEnvironmentWidth * w_index, Core.Config.tileEnvironmentHeight * h_index, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                }
                /////////////////////////////////////////////////////////////////////////////TODO: OpenThisFuncAfterDeleteUppersFuckingShit
                //scene.context.drawImage(map.environment.forest, Core.Config.tileEnvironmentWidth * w_index, Core.Config.tileEnvironmentHeight * h_index, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
            }
        }
    };
    this.drawTank = function(scene, tank) {
        scene.context.beginPath();
        scene.context.drawImage(tank.image, tank.direction * tank.width, 0, tank.width, tank.height, tank.x, tank.y, tank.width, tank.height);
        scene.context.closePath();
    };
    this.clearScene = function(scene) {
        scene.context.clearRect(0, 0, scene.width, scene.height);
    };
    this.drawScene = function() {
        this.globalUpdateValues();
        this.clearScene(Core.Variables.MainScene);
        this.drawMap(Core.Variables.MainScene, Core.Variables.Map);
        this.drawTank(Core.Variables.MainScene, Core.Variables.PlayerTank);
    };
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////Class: Keyboard/////////////////////////////
///////////////Here I'm check input and parse it////////////////////////////////
///////////Attributes: keyPressed and all's other it's functions////////////////
////////////////////////////////////////////////////////////////////////////////
function Keyboard() {
    var self = this;

    this.convertCodeToDirection = function(code) {
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
    };
    this.keyPressed = false;
    this.keyDown = function(e) {
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
            Core.Variables.PlayerTank.setDirection(direction);
            this.keyPressed = true;
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
            //Core.Variables.Console.writeDebug('Current direction: ' + direction);
        }
    };
    this.keyUp = function(e) {
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
            this.keyPressed = false;
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
        }
    };
    this.hookEvent = function() {
        document.onkeydown = function(e) {
            self.keyDown(e);
        };
        document.onkeyup = function(e) {
            self.keyUp(e);
        };
    };
    this.hookEvent();
}
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Class: Game Timer////////////////////////////////
//////////////////It's a main timer of game. We can start or stop game//////////
////////////////////////////////////////////////////////////////////////////////
function GameTimer() {
    this.startGame = function(game) {
        game.gameTimer = setInterval(function() {
            game.drawScene();
        }, Core.Config.UpdateTimerInterval);
        Core.Variables.Console.writeInfo('Game is start');
    };
    this.stopGame = function(game) {
        clearInterval(game.gameTimer);
        Core.Variables.Console.writeInfo('Game is stoped');
    };
}
////////////////////////////////////////////////////////////////////////////////
/////////////////////////Class: Tank////////////////////////////////////////////
////////Here a class of Tank. All functions inside works with tank./////////////
///Attributes: image (object), x, y, width, height//////////////////////////////
///strDirection ('up', 'right', 'left', 'down'), direction (integer), speed/////
////////////////////////////////////////////////////////////////////////////////
function Tank(imageSrc, x, y, width, height, direction, speed) {
    this.moveTank = function() {
        switch (this.strDirection) {
            case 'up':
                this.y = this.y - this.speed;
                break;
            case 'down':
                this.y = this.y + this.speed;
                break;
            case 'left':
                this.x = this.x - this.speed;
                break;
            case 'right':
                this.x = this.x + this.speed;
                break;
        }
    };
    this.convertDirectionToInteger = function(direction) {
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
    };

    this.setDirection = function(direction) {
        this.strDirection = direction;
        this.direction = this.convertDirectionToInteger(direction);
    };

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
}
////////////////////////////////////////////////////////////////////////////////
//////////////////////////Class: Map////////////////////////////////////////////
///////////////In this class images, loader, array, etc/////////////////////////
////////Attributes: countTilesWidth, countTilesHeight///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Map() {
    this.calculateTilesCount = function() {
        this.countTilesWidth = Core.Variables.MainScene.width / 24;
        this.countTilesHeight = Core.Variables.MainScene.height / 24;
    };
    this.loadImage = function(src) {
        var image = new Image();
        image.src = src;
        return image;
    };
    this.environment = {
        brick: this.loadImage(Core.Config.tileBrickSrc),
        forest: this.loadImage(Core.Config.tileForestSrc),
        steel: this.loadImage(Core.Config.tileSteelSrc),
        water: this.loadImage(Core.Config.tileWaterSrc)
    };
    this.calculateTilesCount();
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Class: Console//////////////////////////////////
/////////////////////////////Just for Debugging/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Console() {
    this.checkDebugMode = function() {
        if (Core.Config.debugMode) {
            return true;
        } else {
            return false;
        }
    };
    this.writeInfo = function(text) {
        console.info(text);
    };
    this.writeDebug = function(text) {
        if (this.checkDebugMode()) {
            console.debug(text);
        }
    };
}
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CORE OF MY GAME////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var Core = {
    Config: {
        debugMode: true, //Debug mode enabled
        tileTankWidth: 48, //Width of one sprite (tank)
        tileTankHeight: 48, //Height of one sprite (tank)
        tileEnvironmentWidth: 24, //Width of one tile (environment)
        tileEnvironmentHeight: 24, //Height of one tile (environment)
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
        Core.Variables.MainScene = new Scene('scene'); //DONE
        Core.Variables.Map = new Map(); //TODO: CreateMapObject and realize reading of Map Object
        Core.Variables.PlayerTank = new Tank(Core.Config.tileTankSrc, 0, 0, Core.Config.tileTankWidth, Core.Config.tileTankHeight, Core.Config.tankDirection, Core.Config.tankSpeed); //DONE
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