////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CLASS: Blocks//////////////////////////////////
/////////This is a class of blocks (brick, steel, water, forest)////////////////
/////////////All this saved here (in this class) with other/////////////////////
////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////CLASS: Editor////////////////////////////////
/////////////It's a main class of editor. Here situated most of all/////////////
/////////////////////////////properties and functions///////////////////////////
function Editor(id) {
    this.width = 800;
    this.height = 600;
    this.offsetXEditor = 0;
    this.offsetYEditor = 0;
    this.widthCountCells = Core.Config.widthTilesCount;
    this.heightCountCells = Core.Config.heightTilesCount;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.currentBlock = -1;
    this.timer = null;
    this.mapMask = [];
    for (var i = 0; i < this.heightCountCells; i++) {
        var tempArray = [];
        for (var j = 0; j < this.widthCountCells; j++) {
            tempArray.push(-1);
        }
        this.mapMask.push(tempArray);
    }
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
    drawMapMaskBlock: function(blockIndex, x, y) {
        var block = Core.Variables.Blocks;
        switch (blockIndex) {
            case 0:
                this.context.drawImage(block.brick, x, y, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 1:
                this.context.drawImage(block.forest, x, y, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 2:
                this.context.drawImage(block.steel, x, y, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            case 3:
                this.context.drawImage(block.water, x, y, Core.Config.tileWidth, Core.Config.tileHeight);
                break;
            default:
                break;
        }
    },
    drawMapMask: function() {
        for (var i = 0; i < Core.Variables.Editor.heightCountCells; i++) {
            for (var j = 0; j < Core.Variables.Editor.widthCountCells; j++) {
                var x = j * Core.Config.tileWidth + Core.Variables.Editor.offsetXEditor;
                var y = i * Core.Config.tileHeight + Core.Variables.Editor.offsetYEditor;
                this.drawMapMaskBlock(this.mapMask[i][j], x, y);
            }
        }
    },
    clearEditor: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    drawEditor: function() {
        this.clearEditor();
        this.drawGrid();
        this.drawBlocks(Core.Variables.Blocks);
        this.drawMapMask();
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
    },
    stopTimer: function() {
        var self = this;
        clearInterval(self.timer);
        self.timer = null;
    },
    convertMapMaskToString: function(mask) {
        var widthCountTiles = this.widthCountCells;
        var heightCountTiles = this.heightCountCells;
        var maskInString = widthCountTiles + ',' + heightCountTiles + ',' + mask.join(',');
        Core.Variables.Console.writeDebug(maskInString);
        return maskInString;
    },
    saveMapMaskToLocalStorage: function(name) {
        var mapName = name;
        localStorage.setItem(mapName, this.convertMapMaskToString(this.mapMask));
        Core.Variables.Console.writeDebug('Map Name = ' + mapName);
        Core.Variables.Console.writeDebug('Map Mask from Object: ' + this.mapMask);
        Core.Variables.Console.writeDebug('Map Mask from LocalStorage: ' + localStorage.getItem(mapName));
    }
};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////CLASS: Events//////////////////////////////
////////////////It's just a class for realize events in DOM/////////////////////
////////////////////////////////////////////////////////////////////////////////
function Events() {
    this.brickButton = document.getElementById(Core.Config.brickButtonId);
    this.forestButton = document.getElementById(Core.Config.forestButtonId);
    this.steelButton = document.getElementById(Core.Config.steelButtonId);
    this.waterButton = document.getElementById(Core.Config.waterButtonId);
    this.editorCanvas = Core.Variables.Editor.canvas;
    this.widthCountTilesInput = document.getElementById(Core.Config.widthCountTilesInputId);
    this.heightCountTilesInput = document.getElementById(Core.Config.heightCountTilesInputId);
    this.createNewMapButton = document.getElementById(Core.Config.createNewMapButtonId);
    this.saveMapNameInput = document.getElementById(Core.Config.saveMapNameInputId);
    this.saveMapButton = document.getElementById(Core.Config.saveMapButtonId);
    this.editorMousePressed = false;
    return this;
}

Events.prototype = {
    checkMouseInEditor: function(x, y) {
        var maxX = Core.Variables.Editor.offsetXEditor + Core.Variables.Editor.editorWidth;
        var minX = Core.Variables.Editor.offsetXEditor;
        var maxY = Core.Variables.Editor.offsetYEditor + Core.Variables.Editor.editorHeight;
        var minY = Core.Variables.Editor.offsetYEditor;
        if (x < maxX && x > minX && y < maxY && y > minY) {
            return true;
        } else {
            return false;
        }
    },
    calculateIndexOfCellX: function(x) {
        var widthIndexBlock = Math.floor((x - Core.Variables.Editor.offsetXEditor) / Core.Config.tileWidth);
        return widthIndexBlock;
    },
    calculateIndexOfCellY: function(y) {
        var heightIndexBlock = Math.floor((y - Core.Variables.Editor.offsetYEditor) / Core.Config.tileHeight);
        return heightIndexBlock;
    },
    imagesButtonOnChange: function(domElement) {
        this.brickButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.forestButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.steelButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.waterButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        domElement.className += ' one-image-active';
    },
    brickButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 0;
        this.imagesButtonOnChange(this.brickButton);
        return true;
    },
    forestButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 1;
        this.imagesButtonOnChange(this.forestButton);
        return true;
    },
    steelButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 2;
        this.imagesButtonOnChange(this.steelButton);
        return true;
    },
    waterButtonOnMouseDown: function() {
        Core.Variables.Editor.currentBlock = 3;
        this.imagesButtonOnChange(this.waterButton);
        return true;
    },
    editorCanvasOnMouseMove: function(e) {
        if (this.checkMouseInEditor(e.clientX, e.clientY)) {
            var widthIndexBlock = this.calculateIndexOfCellX(e.clientX);
            var heightIndexBlock = this.calculateIndexOfCellY(e.clientY);
            Core.Variables.Blocks.centerX = widthIndexBlock * Core.Config.tileWidth + Core.Variables.Editor.offsetXEditor;
            Core.Variables.Blocks.centerY = heightIndexBlock * Core.Config.tileHeight + Core.Variables.Editor.offsetYEditor;
            if (this.editorMousePressed) {
                Core.Variables.Editor.mapMask[this.calculateIndexOfCellY(e.clientY)][this.calculateIndexOfCellX(e.clientX)] = Core.Variables.Editor.currentBlock;
            }
            Core.Variables.Console.writeDebug('Index X = ' + widthIndexBlock + ', Index Y = ' + heightIndexBlock);
        }
        return true;
    },
    editorCanvasOnMouseDown: function(e) {
        if (this.checkMouseInEditor(e.clientX, e.clientY)) {
            Core.Variables.Editor.mapMask[this.calculateIndexOfCellY(e.clientY)][this.calculateIndexOfCellX(e.clientX)] = Core.Variables.Editor.currentBlock;
            this.editorMousePressed = true;
        }
        return true;
    },
    editorCanvasOnMouseUp: function(e) {
        this.editorMousePressed = false;
        return true;
    },
    createNewMapButtonDown: function(e) {
        var widthCountTiles = this.widthCountTilesInput.value;
        var heightCountTiles = this.heightCountTilesInput.value;
        Core.Config.widthTilesCount = widthCountTiles;
        Core.Config.heightTilesCount = heightCountTiles;
        Core.Variables.Console.writeDebug('Map size: ' + widthCountTiles + ' x ' + heightCountTiles);
        Core.EntryPoint();
        return true;
    },
    saveMapButtonDown: function(e) {
        Core.Variables.Editor.saveMapMaskToLocalStorage(this.saveMapNameInput.value);
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
        this.editorCanvas.onmouseup = function(e) {
            self.editorCanvasOnMouseUp(e);
        };
        this.createNewMapButton.onmousedown = function(e) {
            self.createNewMapButtonDown(e);
        };
        this.saveMapButton.onmousedown = function(e) {
            self.saveMapButtonDown(e);
        };
        return true;
    }

};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CLASS: Console/////////////////////////////////
////////////////////////It's just a class for debugging/////////////////////////
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
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////CORE OF THE EDITOR//////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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
        saveMapNameInputId: 'nameMap-input',
        saveMapButtonId: 'saveMap-button',
        tileWidth: 48,
        tileHeight: 48,
        tileBrickSrc: '../images/brick.png',
        tileForestSrc: '../images/forest.png',
        tileSteelSrc: '../images/steel.png',
        tileWaterSrc: '../images/water.png',
        timerInterval: 50,
        editorLineGridStyle: 'red',
        widthTilesCount: 15,
        heightTilesCount: 7
    },
    Variables: {
        Console: null,
        Events: null,
        Editor: null,
        Blocks: null
    },
    InitializeEditor: function() {
        if (Core.Variables.Editor != null && Core.Variables.Editor.timer != null) {
            Core.Variables.Editor.stopTimer();
            Core.Variables.Console = null;
            Core.Variables.Events = null;
            Core.Variables.Editor = null;
            Core.Variables.Blocks = null;
        }
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
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Waiting for document loaded////////////////////////
////////////////////////////////////////////////////////////////////////////////
var documentReadyInterval = setInterval(function() {
    if (document.readyState == 'complete') {
        clearInterval(documentReadyInterval);
        Core.EntryPoint();
    }
}, 10);
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////COPYRIGHT by ghaiklor//////////////////////////////
////////////////////////////////////////////////////////////////////////////////