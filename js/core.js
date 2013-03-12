/////////////////////////////////TODO://////////////////////////////////////////
///////1. Realize check tank on collision with blocks///////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////Class: Scene//////////////////////////////////////////////////
/////////////This is a class of scene, where will drawing game objects//////////
//Attributes: canvas, context, width, height////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Scene(id) {
    this.canvas = document.getElementById(id); //ИД элемента с канвой
    this.context = this.canvas.getContext('2d'); //контекст рендера
    return this;
}

Scene.prototype = {
//ф-ция пересчитывает размеры сцены и рендера под размеры браузера
    recalcSize: function() {
        this.width = window.innerWidth - 200;
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
    this.gameTimer = null; //идентификатор на таймер игры
    return this;
}

Game.prototype = {
//ф-ция запрашивает каждый объект на обновление свойств
    globalUpdateValues: function() {
        if (Core.Variables.Keyboard.keyPressed) {
            Core.Variables.PlayerTank.moveTank();
            //Core.Variables.Console.writeDebug('Key is Pressed in globalUpdateValues');
        }
    },
    //ф-ция рисует карту
    drawMap: function(scene, map) {
        for (var h_index = 0; h_index < map.countTilesHeight; h_index++) {
            for (var w_index = 0; w_index < map.countTilesWidth; w_index++) {
                switch (map.mask[h_index][w_index]) { //в зависимости от значения в маске он рисует нужное
//0 - кирпич
//1 - лес
//2 - сталь
//3 - вода
                    case '0':
                        scene.context.drawImage(map.environment.brick, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case '1':
                        scene.context.drawImage(map.environment.forest, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case '2':
                        scene.context.drawImage(map.environment.steel, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                    case '3':
                        scene.context.drawImage(map.environment.water, Core.Config.tileEnvironmentWidth * w_index + Core.Variables.Map.offsetXMap, Core.Config.tileEnvironmentHeight * h_index + Core.Variables.Map.offsetYMap, Core.Config.tileEnvironmentWidth, Core.Config.tileEnvironmentHeight);
                        break;
                }
            }
        }
    },
    //ф-ция рисует объект танка
    drawTank: function(scene, tank) {
        scene.context.beginPath();
        //в зависимости от направления танка, он копирует участок изображения со всего изображения
        scene.context.drawImage(tank.image, tank.direction * tank.width, 0, tank.width, tank.height, tank.x, tank.y, tank.width, tank.height);
        scene.context.closePath();
    },
    //ф-ция очищает контекст рендера
    clearScene: function(scene) {
        scene.context.clearRect(0, 0, scene.width, scene.height);
        scene.context.beginPath();
        scene.context.fillStyle = 'rgba(70, 70, 70, 0.5)';
        scene.context.rect(0, 0, scene.width, scene.height);
        scene.context.fill();
        scene.context.closePath();
    },
    //главная ф-ция отрисовки сцены
    //на эту ф-ция вешается глобальный таймер игры
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
    this.keyPressed = false; //нажата ли клавиша в текущий момент
    return this;
}

Keyboard.prototype = {
//ф-ция конвертирует код клавиши в текстовое представление направления
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
    //ф-ция обрабатывает нажатие клавиши вниз
    keyDown: function(e) {
//конвертирует с кода в текстовое направление
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
//и если было изменено направление, то задаем игровому танку новое направление
            Core.Variables.PlayerTank.setDirection(direction);
            this.keyPressed = true; //и еще поставим флаг нажатой клавиши
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
            //Core.Variables.Console.writeDebug('Current direction: ' + direction);
        }
    },
    //ф-ция обрабатывает отпускание клавиши
    keyUp: function(e) {
//проверяем для начала, нажата ли клавиша со стрелками
//да, туповато TODO: optimize this function
        var direction = this.convertCodeToDirection(e.keyCode);
        if (direction) {
//просто снимаем флаг нажатой клавиши при отпускании
            this.keyPressed = false;
            //Core.Variables.Console.writeDebug('Key is press: ' + this.keyPressed);
        }
    },
    //ф-ция вешает обработки клавиш на ф-ции
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
//ф-ция записывает на объект игры созданный таймер игры
//запускает ф-цию прорисовки сцены в переданном объекте игры
    startGame: function(game) {
        game.gameTimer = setInterval(function() {
            game.drawScene();
        }, Core.Config.UpdateTimerInterval);
        Core.Variables.Console.writeInfo('Game is start');
    },
    //ф-ция останавливает таймер в объекте игры
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
    this.image = image; //объект изображения с танком
    this.x = x; //положение танка на рендере по Х
    this.y = y; //положение танка на рендере по У
    this.width = width; //ширина изображения танка
    this.height = height; //высота изображения танка
    this.strDirection = direction; //строковое представление направления танка
    this.setDirection(direction); //инкапсулированный метод задания направления
    this.speed = speed; //текущая скорость танка (на сколько px продвигать танк)
    this.currentCell = -1;
    return this;
}

Tank.prototype = {
    calculateCurrentCell: function(x, y) {
        var indexX = Math.floor((x - Core.Variables.Map.offsetXMap) / Core.Config.tileEnvironmentWidth);
        var indexY = Math.floor((y - Core.Variables.Map.offsetYMap) / Core.Config.tileEnvironmentHeight);
        if (Core.Variables.Map.mask[indexY] != undefined) {
            return Core.Variables.Map.mask[indexY][indexX];
        } else {
            return false;
        }
    },
    //ф-ция проверяет, находится ли танк внутри карты (верхняя грань)
    checkInsideMapUp: function(map) {
        if (this.y - this.speed >= map.offsetYMap) {
            Core.Variables.Console.writeDebug('Tank inside map up');
            return true;
        } else {
            return false;
        }
    },
    //ф-ция проверяет, находится ли танк внутри карты (правая грань)
    checkInsideMapRight: function(map) {
        if (this.x + this.speed <= map.offsetXMap + map.mapWidth - this.width + this.speed - 6) { //TODO: fix this bug
            Core.Variables.Console.writeDebug('Tank inside map right');
            return true;
        } else {
            return false;
        }
    },
    //ф-ция проверяет, находится ли танк внутри карты (нижняя грань)
    checkInsideMapDown: function(map) {
        if (this.y + this.speed < map.offsetYMap + map.mapHeight - this.height) { //TODO: fix this bug
            Core.Variables.Console.writeDebug('Tank inside map down');
            return true;
        } else {
            return false;
        }
    },
    //ф-ция проверяет, находится ли танк внутри карты (левая грань)
    checkInsideMapLeft: function(map) {
        if (this.x >= map.offsetXMap + this.speed) {
            Core.Variables.Console.writeDebug('Tank inside map left');
            return true;
        } else {
            return false;
        }
    },
    //ф-ция проверяет на какой клетке находится танк
    //пять типов клеток
    //-1 - пустая
    //0 - кирпич
    //1 - лес
    //2 - сталь
    //3 - вода
    //TODO: реализовать здесь проверку коллизий и изменения скорости танка
    getBlockDown: function() {
        var bottomCell = this.calculateCurrentCell(this.x + this.width / 2, this.y + this.speed + this.height);
        return bottomCell;
    },
    getBlockUp: function() {
        var upperCell = this.calculateCurrentCell(this.x + this.width / 2, this.y - this.speed);
        return upperCell;
    },
    getBlockLeft: function() {
        var leftCell = this.calculateCurrentCell(this.x - this.speed, this.y + this.height / 2);
        return leftCell;
    },
    getBlockRight: function() {
        var rightCell = this.calculateCurrentCell(this.x + this.speed + this.width, this.y + this.height / 2);
        return rightCell;
    },
    getBlockFromLeftUpAndRightUp: function() {
        return {
            leftUp: this.calculateCurrentCell(this.x, this.y),
            rightUp: this.calculateCurrentCell(this.x + this.width, this.y)
        };
    },
    getBlockFromLeftDownAndRightDown: function() {
        return {
            leftDown: this.calculateCurrentCell(this.x, this.y + this.height),
            rightDown: this.calculateCurrentCell(this.x + this.width, this.y + this.height)
        };
    },
    getBlockFromUpLeftAndDownLeft: function() {
        return {
            upLeft: this.calculateCurrentCell(this.x, this.y),
            downLeft: this.calculateCurrentCell(this.x, this.y + this.height)
        };
    },
    getBlockFromUpRightAndDownRight: function() {
        return {
            upRight: this.calculateCurrentCell(this.x + this.width, this.y),
            downRight: this.calculateCurrentCell(this.x + this.width, this.y + this.height)
        };
    },
//это инкапсулированное свойство для направления танка
//в direction передается строка направления танка
//возможны 4 варианта "up", "down", "right", "left"
//ф-ция задает строковое и цифровое представление направления
    setDirection: function(direction) {
        this.strDirection = direction;
        this.direction = this.convertDirectionToInteger(direction);
    },
    //ф-ция конвертирует из строкового представления направления в цифровое
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
    //ф-ция обновляет значения положения танка на карте
    //в зависимости от направления происходит инкрементация или декрементация
    //изменяет значения относительно текущей скорости танка
    moveTank: function() {
        var self = this;
        function calculateNewPosition(direction) {
            switch (direction) {
                case 'up':
                    if (self.checkInsideMapUp(Core.Variables.Map)) {
                        if (['-1', '1', '3'].indexOf(self.getBlockFromLeftUpAndRightUp().leftUp) != -1 && ['-1', '1', '3'].indexOf(self.getBlockFromLeftUpAndRightUp().rightUp) != -1) {
                            self.y = self.y - self.speed;
                        }
                    }
                    break;
                case 'down':
                    if (self.checkInsideMapDown(Core.Variables.Map)) {
                        if (['-1', '1', '3'].indexOf(self.getBlockFromLeftDownAndRightDown().leftDown) != -1 && ['-1', '1', '3'].indexOf(self.getBlockFromLeftDownAndRightDown().rightDown) != -1) {
                            self.y = self.y + self.speed;
                        }
                    }
                    break;
                case 'left':
                    if (self.checkInsideMapLeft(Core.Variables.Map)) {
                        if (['-1', '1', '3'].indexOf(self.getBlockFromUpLeftAndDownLeft().upLeft) != -1 && ['-1', '1', '3'].indexOf(self.getBlockFromUpLeftAndDownLeft().downLeft) != -1) {
                            self.x = self.x - self.speed;
                        }
                    }
                    break;
                case 'right':
                    if (self.checkInsideMapRight(Core.Variables.Map)) {
                        if (['-1', '1', '3'].indexOf(self.getBlockFromUpRightAndDownRight().upRight) != -1 && ['-1', '1', '3'].indexOf(self.getBlockFromUpRightAndDownRight().downRight) != -1) {
                            self.x = self.x + self.speed;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
//Core.Variables.Console.writeDebug('Current Cell = [' + this.currentCell + ']');
//Core.Variables.Console.writeDebug('Tank X = ' + this.x + ', Tank Y = ' + this.y);
        switch (this.strDirection) {
            case 'up':
                var blockUp = this.getBlockUp();
                Core.Variables.Console.writeDebug('Block up = ' + blockUp);
                switch (blockUp) {
                    case '-1':
                        if (this.currentCell != -1) {
                            this.currentCell = -1;
                            this.speed = Core.Config.tankSpeed;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '0':
                        break;
                    case '1':
                        if (this.currentCell != 1) {
                            this.currentCell = 1;
                            this.speed = Core.Config.decrementSpeedOnForest;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '2':
                        break;
                    case '3':
                        if (this.currentCell != 3) {
                            this.currentCell = 3;
                            this.speed = Core.Config.decrementSpeedOnWater;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    default:
                        break;
                }
                break;
            case 'down':
                var blockDown = this.getBlockDown();
                Core.Variables.Console.writeDebug('Block down = ' + blockDown);
                switch (blockDown) {
                    case '-1':
                        if (this.currentCell != -1) {
                            this.currentCell = -1;
                            this.speed = Core.Config.tankSpeed;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '0':
                        break;
                    case '1':
                        if (this.currentCell != 1) {
                            this.currentCell = 1;
                            this.speed = Core.Config.decrementSpeedOnForest;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '2':
                        break;
                    case '3':
                        if (this.currentCell != 3) {
                            this.currentCell = 3;
                            this.speed = Core.Config.decrementSpeedOnWater;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    default:
                        break;
                }
                break;
            case 'left':
                var blockLeft = this.getBlockLeft();
                Core.Variables.Console.writeDebug('Block left = ' + blockLeft);
                switch (blockLeft) {
                    case '-1':
                        if (this.currentCell != -1) {
                            this.currentCell = -1;
                            this.speed = Core.Config.tankSpeed;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '0':
                        break;
                    case '1':
                        if (this.currentCell != 1) {
                            this.currentCell = 1;
                            this.speed = Core.Config.decrementSpeedOnForest;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '2':
                        break;
                    case '3':
                        if (this.currentCell != 3) {
                            this.currentCell = 3;
                            this.speed = Core.Config.decrementSpeedOnWater;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    default:
                        break;
                }
                break;
            case 'right':
                var blockRight = this.getBlockRight();
                Core.Variables.Console.writeDebug('Block right = ' + blockRight);
                switch (blockRight) {
                    case '-1':
                        if (this.currentCell != -1) {
                            this.currentCell = -1;
                            this.speed = Core.Config.tankSpeed;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '0':
                        break;
                    case '1':
                        if (this.currentCell != 1) {
                            this.currentCell = 1;
                            this.speed = Core.Config.decrementSpeedOnForest;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    case '2':
                        break;
                    case '3':
                        if (this.currentCell != 3) {
                            this.currentCell = 3;
                            this.speed = Core.Config.decrementSpeedOnWater;
                        }
                        calculateNewPosition(this.strDirection);
                        break;
                    default:
                        break;
                }
                break;
        }
    },
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    }
};
////////////////////////////////////////////////////////////////////////////////
//////////////////////////Class: Map////////////////////////////////////////////
///////////////In this class images, loader, array, etc/////////////////////////
////////Attributes: countTilesWidth, countTilesHeight///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Map() {
    this.countTilesHeight = 8; //количество спрайтов по высоте
    this.countTilesWidth = 8; //количество спрайтов по ширине
    this.offsetXMap = 100; //сдвиг отрисовки карты относительно оси Х
    this.offsetYMap = 100; //сдвиг отрисовки карты относительно оси У
    return this;
}

Map.prototype = {
//ф-ция заполняет маску карты значениями "-1"
//эти значения означают пустую карту, то есть никаких блоков нету
//эти же значения используются для отрисовки дороги
//TODO: на -1 нужно добавить еще спрайт дороги
    fillMaskWithZero: function(width, height) {
        this.mask = []; //инициализировали пустой массив в объекте
        for (var i = 0; i < height; i++) {
            this.mask[i] = []; //инициализируем пустой массив в текущем слоте
            for (var j = 0; j < width; j++) {
                this.mask[i][j] = -1; //и забиваем всю маску "-1"
            }
        }
        return true;
    },
    //ф-ция расчитывает сдвиг карты относительно левого верхнего угла
    calculateOffsetMap: function() {
//ширина карты = количество спрайтов по ширине * ширину самого спрайта (его размер)
        this.mapWidth = this.countTilesWidth * Core.Config.tileEnvironmentWidth;
        //высота карты = количество спрайтов по высоте * высоту самого спрайта (его размер)
        this.mapHeight = this.countTilesHeight * Core.Config.tileEnvironmentHeight;
        //центр карты = ширина главной сцены / 2
        var centerMapX = Core.Variables.MainScene.width / 2;
        //центр карты = высота главной сцены / 2
        var centerMapY = Core.Variables.MainScene.height / 2;
        //сдвиг карты по Х = центр карты по Х - ширину карты / 2
        this.offsetXMap = centerMapX - this.mapWidth / 2;
        //сдвиг карты по У = центр карты по У - высоту карты / 2
        this.offsetYMap = centerMapY - this.mapHeight / 2;
    },
    //ф-ция создает новый объект изображения и возвращает его
    //в параметр мы лишь передаем ссылку на изображение (его местоположение)
    loadImage: function(src) {
        var image = new Image();
        image.src = src;
        return image;
    },
    //ф-ция загружает все ресурсы карты
    //в данном случае загружает все спрайты
    loadResources: function() {
        this.environment.brick = this.loadImage(Core.Config.tileBrickSrc); //кирпич
        this.environment.forest = this.loadImage(Core.Config.tileForestSrc); //лес
        this.environment.steel = this.loadImage(Core.Config.tileSteelSrc); //сталь
        this.environment.water = this.loadImage(Core.Config.tileWaterSrc); //вода
    },
    //это объект с объектами окружения
    //здесь лежат сгенерированные и загруженные спрайты окружения
    environment: {
        brick: null,
        forest: null,
        steel: null,
        water: null
    },
    //ф-ция загружает маску карты
    //маску карты можно генерировать в редакторе карт
    //редактор карт можно включить перейдя по battlecity/editor
    loadMask: function(name) {
        if (localStorage.getItem(name) == undefined && name == 'default') {
            localStorage.setItem(name, Core.Config.defaultMapMask);
        }
//получаем значение маски и размеров карты с локального хранилища
//разбиваем его на массив
//в итоге получим вот такой массив:
//<ширина карты (количество тайлов)>, <высота карты (количество тайлов)>, <сама маска карты (значения от 0 до 3)>
        var maskArray = localStorage.getItem(name).split(',');
        this.countTilesHeight = maskArray[1]; //Второй элемент - это высота карты
        this.countTilesWidth = maskArray[0]; //Первый элемент - это ширина карты (количество блоков)

        //заполним маску карты "-1", то есть просто инициализируем массив маски
        this.fillMaskWithZero(this.countTilesWidth, this.countTilesHeight);
        //текущий индекс массива маски
        //т.к. в локальном хранилище можно хранить только строки, приходится изощряться
        //первые 2 элемента у нас размеры карты и лишь с 3 элемента идет сама маска
        var maskCurrentIndex = 2;
        for (var height = 0; height < this.countTilesHeight; height++) {
            for (var width = 0; width < this.countTilesWidth; width++) {
//в цикле перебираем всю строковую маску карты
//и присваиваем на маску текущего объекта значение данной клетки карты
                this.mask[height][width] = maskArray[maskCurrentIndex];
                //и конечно же увеличим текущий индекс маски
                maskCurrentIndex++;
            }
        }
//в итоге мы получим исходный вид массива, какой он был при сохранении в редакторе
//Core.Variables.Console.writeDebug('Map Mask: ' + this.mask);
    },
    loadAllMapsFromLocalStorage: function() {
        for (var map in localStorage) {
            if (map != 'default') {
                var option = document.createElement('option');
                option.text = map;
                option.value = map;
                Core.Variables.Events.changeMapSelect.appendChild(option);
            }
        }
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
//ф-ция проверяет, включен ли режим отладки
    checkDebugMode: function() {
        if (Core.Config.debugMode) {
            return true;
        } else {
            return false;
        }
    },
    //ф-ция просто записывает инфу в консоль
    writeInfo: function(text) {
        console.info(text);
    },
    //а эта ф-ция проверяет на дебаг-мод и если включен, выводит в консоль
    writeDebug: function(text) {
        if (this.checkDebugMode()) {
            console.debug(text);
        }
    }
};
function Events() {
    this.mapEditorButton = document.getElementById(Core.Config.mapEditorButtonId);
    this.changeMapSelect = document.getElementById(Core.Config.changeMapSelectId);
    return this;
}

Events.prototype = {
    mapEditorButtonOnClick: function() {
        window.location = '/editor';
    },
    changeMapSelectOnChange: function() {
        Core.Variables.Map.loadMask(this.changeMapSelect.value);
        Core.Variables.Map.calculateOffsetMap();
        Core.Variables.PlayerTank.setPosition(Core.Variables.Map.offsetXMap, Core.Variables.Map.offsetYMap);
    },
    bindAllEvents: function() {
        var self = this;
        this.mapEditorButton.onmousedown = function() {
            self.mapEditorButtonOnClick();
        };
        this.changeMapSelect.onchange = function() {
            self.changeMapSelectOnChange();
        };
    }
};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CORE OF MY GAME////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var Core = {
    Config: {
        debugMode: true, //включен ли "дебаг-мод"
        tileTankWidth: 48, //ширина спрайта танка
        tileTankHeight: 48, //высота спрайта танка
        //спрайты окружения сделаны чуть больше, потому что танком тяжелее будет управлять
        //из-за нехватки свободного места
        //TODO: сделать другие изображения спрайтов (более четкие)
        tileEnvironmentWidth: 50, //ширина спрайта окружения
        tileEnvironmentHeight: 50, //высота спрайта окружения
        tilesCount: 8, //количество тайлов по умолчанию (8 * 8 - размеры карты)
        tileTankSrc: './images/tank.png', //путь к спрайту с танком
        tankSpeed: 10, //скорость танка по умолчанию
        tankDirection: 'up', //направление танка по умолчанию
        tileBrickSrc: './images/brick.png', //путь спрайта с кирпичом
        tileForestSrc: './images/forest.png', //путь спрайта с лесом
        tileSteelSrc: './images/steel.png', //путь спрайта со сталью
        tileWaterSrc: './images/water.png', //путь спрайта с водой
        UpdateTimerInterval: 50, //интервал, при котором вызывается ф-ция перерисовки сцены
        mapEditorButtonId: 'mapEditor-Button',
        changeMapSelectId: 'changeMap-select',
        decrementSpeedOnForest: 3,
        decrementSpeedOnWater: 5,
        defaultMapMask: '15,7,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,3,3,1,1,1,1,1,3,3,1,1,2,2,1,3,3,3,3,1,1,1,3,3,3,3,1,2,2,3,3,3,3,3,3,1,3,3,3,3,3,3,2,2,1,3,3,3,3,1,1,1,3,3,3,3,1,2,2,1,1,3,3,1,1,1,1,1,3,3,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2'
    },
    Variables: {
//тут хранятся все объекты, созданные конструктором
        MainScene: null, //главная сцена, на которой все рисуем
        Game: null, //сама игра, в которой происходит отрисовка кадров
        GameTimer: null, //игровой таймер, в нем только старт и стоп
        PlayerTank: null, //непосредственно сам игровой танк
        Console: null, //объект консоли для дебага
        Map: null, //карта, которая вырисовывается на сцене
        Keyboard: null, //объект клавиатуры, который отвечает за события клавиатуры
        Events: null
    },
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////////ENTRY POINT OF GAME///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //ф-ция инициализирует игру
    //вызывает целую кучу ф-ция и конструкторов
    //заполняет Core.Variables объекты
    InitializeGame: function() {
        Core.Variables.Console = new Console(); //DONE
        Core.Variables.Keyboard = new Keyboard(); //DONE
        Core.Variables.Keyboard.hookEvent(); //DONE
        Core.Variables.Events = new Events(); //DONE
        Core.Variables.Events.bindAllEvents(); //DONE
        Core.Variables.MainScene = new Scene('scene'); //DONE
        Core.Variables.MainScene.recalcSize(); //DONE
        Core.Variables.Map = new Map(); //DONE
        Core.Variables.Map.loadMask('default'); //DONE
        Core.Variables.Map.calculateOffsetMap(); //DONE
        Core.Variables.Map.loadAllMapsFromLocalStorage(); //DONE
        Core.Variables.Map.loadResources(); //DONE
        Core.Variables.PlayerTank = new Tank(Core.Config.tileTankSrc, Core.Variables.Map.offsetXMap, Core.Variables.Map.offsetYMap, Core.Config.tileTankWidth, Core.Config.tileTankHeight, Core.Config.tankDirection, Core.Config.tankSpeed); //DONE
        Core.Variables.Game = new Game(); //DONE
        Core.Variables.GameTimer = new GameTimer(); //DONE
        Core.Variables.GameTimer.startGame(Core.Variables.Game); //DONE
        Core.Variables.Console.writeInfo('Entry Point triggered'); //DONE
    },
    //точка входа в скрипт
    EntryPoint: function() {
        Core.InitializeGame();
    }
};
//этой ф-цией дожидаюсь полной загрузки страницы
//и при полной загрузке вызываю точку входа
var documentReadyInterval = setInterval(function() {
//если документ загружен
    if (document.readyState === 'complete') {
        Core.EntryPoint(); //точка входа в игру
        //очистили интервал ожидания загрузки страницы
        clearInterval(documentReadyInterval);
        //еще и задам на изменение размеров окна
        window.onresize = function() {
//если игра уже инициализирована
            if (Core.Variables.MainScene != undefined) {
//пересчитать размеры сцены
                Core.Variables.MainScene.recalcSize();
                //и пересчитать размеры карты
                Core.Variables.Map.calculateOffsetMap();
            }
        };
    }
}, 10);