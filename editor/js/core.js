function Blocks() {
    this.x = 0;
    this.y = 0;
    this.width = Core.Config.tileWidth;
    this.height = Core.Config.tileHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.brick = null;
    this.forest = null;
    this.steel = null;
    this.water = null;
    return this;
}

Blocks.prototype = {
    loadOneImage: function(src) {
        var image = new Image();
        image.src = src;
        return image;
    },
    loadAllImages: function() {
        this.brick = this.loadOneImage(Core.Config.tileBrickSrc);
        this.forest = this.loadOneImage(Core.Config.tileForestSrc);
        this.steel = this.loadOneImage(Core.Config.tileSteelSrc);
        this.water = this.loadOneImage(Core.Config.tileWaterSrc);
        return true;
    }
};
function Editor(id) {
    this.width = 800;
    this.height = 600;
    this.offsetXEditor = 0;
    this.offsetYEditor = 0;
    this.widthCountCells = 10;
    this.heightCountCells = 10;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.currentBlock = -1;
    this.timer = null;
    return this;
}

Editor.prototype = {
    drawGrid: function() {
        for (var i = 0; i <= this.widthCountCells; i++) {
            var x = i * Core.Config.tileWidth + this.offsetXEditor;
            var y_start = this.offsetYEditor;
            var y_finish = this.editorHeight + this.offsetYEditor;
            this.context.beginPath();
            this.context.strokeStyle = Core.Config.editorLineGridStyle;
            this.context.moveTo(x, y_start);
            this.context.lineTo(x, y_finish);
            this.context.stroke();
            this.context.closePath();
        }
        for (var i = 0; i <= this.heightCountCells; i++) {
            var x_start = this.offsetXEditor;
            var x_finish = this.offsetXEditor + this.editorWidth;
            var y = i * Core.Config.tileHeight + this.offsetYEditor;
            this.context.beginPath();
            this.context.strokeStyle = Core.Config.editorLineGridStyle;
            this.context.moveTo(x_start, y);
            this.context.lineTo(x_finish, y);
            this.context.stroke();
            this.context.closePath();
        }
    },
    drawBlocks: function(blocks) {
        switch (this.currentBlock) {
            case 0:
                this.context.drawImage(blocks.brick, blocks.centerX, blocks.centerY, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 1:
                this.context.drawImage(blocks.forest, blocks.centerX, blocks.centerY, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 2:
                this.context.drawImage(blocks.steel, blocks.centerX, blocks.centerY, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 3:
                this.context.drawImage(blocks.water, blocks.centerX, blocks.centerY, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            default:
                break;
        }
    },
    clearEditor: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    drawEditor: function() {
        this.clearEditor();
        this.drawGrid();
        this.drawBlocks(Core.Variables.Blocks);
    },
    calculateSize: function() {
        this.width = window.innerWidth - 200;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.editorWidth = this.widthCountCells * Core.Config.tileWidth;
        this.editorHeight = this.heightCountCells * Core.Config.tileHeight;
        this.offsetXEditor = this.width / 2 - this.editorWidth / 2;
        this.offsetYEditor = this.height / 2 - this.editorHeight / 2;
        Core.Variables.Console.writeDebug('Editor offsetX = ' + this.offsetXEditor + ', Editor offsetY = ' + this.offsetYEditor);
        return true;
    },
    startTimer: function() {
        var self = this;
        this.timer = setInterval(function() {
            self.drawEditor();
        }, Core.Config.timerInterval);
    }
};
function Events() {
    this.brickButton = document.getElementById(Core.Config.brickButtonId);
    this.forestButton = document.getElementById(Core.Config.forestButtonId);
    this.steelButton = document.getElementById(Core.Config.steelButtonId);
    this.waterButton = document.getElementById(Core.Config.waterButtonId);
    this.editorCanvas = Core.Variables.Editor.canvas;
    this.widthCountTilesInput = document.getElementById(Core.Config.widthCountTilesInputId);
    this.heightCountTilesInput = document.getElementById(Core.Config.heightCountTilesInputId);
    this.createNewMapButton = document.getElementById(Core.Config.createNewMapButtonId);
    return this;
}

Events.prototype = {
    brickButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 0;
        return true;
    },
    forestButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 1;
        return true;
    },
    steelButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 2;
        return true;
    },
    waterButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 3;
        return true;
    },
    editorCanvasOnMouseMove: function(e) {
        //Core.Variables.Console.writeDebug(e);
        var maxX = Core.Variables.Editor.offsetXEditor + Core.Variables.Editor.editorWidth;
        var minX = Core.Variables.Editor.offsetXEditor;
        var maxY = Core.Variables.Editor.offsetYEditor + Core.Variables.Editor.editorHeight;
        var minY = Core.Variables.Editor.offsetYEditor;
        if (e.clientX < maxX && e.clientX > minX && e.clientY < maxY && e.clientY > minY) {
            Core.Variables.Blocks.x = e.clientX - Core.Variables.Editor.offsetXEditor;
            Core.Variables.Blocks.y = e.clientY - Core.Variables.Editor.offsetYEditor;
            var widthIndexBlock = Math.floor(Core.Variables.Blocks.x / Core.Config.tileWidth);
            var heightIndexBlock = Math.floor(Core.Variables.Blocks.y / Core.Config.tileHeight);
            Core.Variables.Blocks.centerX = widthIndexBlock * Core.Config.tileWidth + Core.Variables.Editor.offsetXEditor;
            Core.Variables.Blocks.centerY = heightIndexBlock * Core.Config.tileHeight + Core.Variables.Editor.offsetYEditor;
            //Core.Variables.Console.writeDebug('Index X = ' + widthIndexBlock + ', Index Y = ' + heightIndexBlock);            
        } else {
            //TODO: realize hiding block on mouseout
        }
        return true;
    },
    editorCanvasOnMouseDown: function(e) {
        Core.Variables.Console.writeDebug(e);
        return true;
    },
    createNewMapButtonDown: function(e) {
        Core.Variables.Console.writeDebug(e);
        return true;
    },
    bindAllEvents: function() {
        var self = this;
        this.brickButton.onmousedown = function() {
            self.brickButtonOnMouseDown();
        };
        this.forestButton.onmousedown = function() {
            self.forestButtonOnMouseDown();
        };
        this.steelButton.onmousedown = function() {
            self.steelButtonOnMouseDown();
        };
        this.waterButton.onmousedown = function() {
            self.waterButtonOnMouseDown();
        };
        this.editorCanvas.onmousemove = function(e) {
            self.editorCanvasOnMouseMove(e);
        };
        this.editorCanvas.onmousedown = function(e) {
            self.editorCanvasOnMouseDown(e);
        };
        this.createNewMapButton.onmousedown = function(e) {
            self.createNewMapButtonDown(e);
        };
        return true;
    }

};
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
        if (console) {
            console.info(text);
            return true;
        } else {
            return false;
        }
    },
    writeDebug: function(text) {
        if (console && this.checkDebugMode()) {
            console.debug(text);
            return true;
        } else {
            return false;
        }
    }
};
var Core = {
    Config: {
        debugMode: true,
        brickButtonId: 'brick-button',
        forestButtonId: 'forest-button',
        steelButtonId: 'steel-button',
        waterButtonId: 'water-button',
        widthCountTilesInputId: 'widthCountTiles-input',
        heightCountTilesInputId: 'heightCountTiles-input',
        createNewMapButtonId: 'createMap-button',
        tileWidth: 48,
        tileHeight: 48,
        tileBrickSrc: '../images/brick.png',
        tileForestSrc: '../images/forest.png',
        tileSteelSrc: '../images/steel.png',
        tileWaterSrc: '../images/water.png',
        timerInterval: 50,
        editorLineGridStyle: 'red'
    },
    Variables: {
        Console: null,
        Events: null,
        Editor: null,
        Blocks: null
    },
    InitializeEditor: function() {
        Core.Variables.Console = new Console(); //DONE
        Core.Variables.Console.writeInfo('Entry point was triggered'); //DONE
        Core.Variables.Editor = new Editor('scene'); //DONE
        Core.Variables.Editor.calculateSize(); //DONE
        Core.Variables.Events = new Events(); //DONE
        Core.Variables.Events.bindAllEvents(); //DONE
        Core.Variables.Blocks = new Blocks();
        Core.Variables.Blocks.loadAllImages();
        Core.Variables.Editor.startTimer();
    },
    EntryPoint: function() {
        Core.InitializeEditor();
    }
};
var documentReadyInterval = setInterval(function() {
    if (document.readyState == 'complete') {
        clearInterval(documentReadyInterval);
        Core.EntryPoint();
    }
}, 10);