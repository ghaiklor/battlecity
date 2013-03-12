////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////CLASS: Blocks//////////////////////////////////
/////////This is a class of blocks (brick, steel, water, forest)////////////////
/////////////All this saved here (in this class) with other/////////////////////
////////////////////////////////////////////////////////////////////////////////
function Blocks() {
    this.x = 0; //позиция текущего блока по Х
    this.y = 0; //позиция текущего блока по У
    this.width = Core.Config.tileWidth; //ширина спрайта блока
    this.height = Core.Config.tileHeight; //высота спрайта блока
    this.centerX = this.width / 2; //центр блока по Х = ширина блока \ 2
    this.centerY = this.height / 2; //центр блока по У = высота блока \ 2
    this.brick = null; //спрайт с кирпичем
    this.forest = null; //спрайт с лесом
    this.steel = null; //спрайт со сталью
    this.water = null; //спрайт с водой
    return this;
}

Blocks.prototype = {
    //ф-ция создает объект с изображения и возвращает его
    loadOneImage: function(src) {
        var image = new Image();
        image.src = src;
        return image;
    },
    //ф-ция загружает все изображения в объект
    loadAllImages: function() {
        //кирпич
        this.brick = this.loadOneImage(Core.Config.tileBrickSrc);
        //лес
        this.forest = this.loadOneImage(Core.Config.tileForestSrc);
        //сталь
        this.steel = this.loadOneImage(Core.Config.tileSteelSrc);
        //вода
        this.water = this.loadOneImage(Core.Config.tileWaterSrc);
        return true;
    }
};
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////CLASS: Editor////////////////////////////////
/////////////It's a main class of editor. Here situated most of all/////////////
/////////////////////////////properties and functions///////////////////////////
function Editor(id) {
    this.width = 800; //ширина активной области редактора
    this.height = 600; //высота активной области редактора
    this.offsetXEditor = 0; //смещение области редактора по Х
    this.offsetYEditor = 0; //смещение области редактора по У
    this.widthCountCells = Core.Config.widthTilesCount; //количество спрайтов по ширине
    this.heightCountCells = Core.Config.heightTilesCount; //количество спрайтов по высоте
    this.canvas = document.getElementById(id); //канва, на которой рисуется редактор
    this.context = this.canvas.getContext('2d'); //контекст рендера, в котором рисуем
    this.currentBlock = -1; //текущий активный блок пустой
    this.timer = null; //главный таймер отрисовки редактора
    this.mapMask = []; //маска карты
    //заполним маску карты значениями "-1"
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
    //ф-ция отрисовки сетки редактора
    drawGrid: function() {
        //сначала рисуем сетку по высоте
        for (var i = 0; i <= this.widthCountCells; i++) {
            //х = итератор * ширину спрайта + смещение по Х
            var x = i * Core.Config.tileWidth + this.offsetXEditor;
            //начало по У = смещение редактора по У
            var y_start = this.offsetYEditor;
            //конец по У = высота редактора + смещение редактора по У
            var y_finish = this.editorHeight + this.offsetYEditor;
            this.context.beginPath();
            this.context.strokeStyle = Core.Config.editorLineGridStyle;
            this.context.moveTo(x, y_start);
            this.context.lineTo(x, y_finish);
            this.context.stroke();
            this.context.closePath();
        }
        //теперь отрисуем сетку по ширине
        for (var i = 0; i <= this.heightCountCells; i++) {
            //начало х = смещение редактора по Х
            var x_start = this.offsetXEditor;
            //конец х = смещение редактора по х + ширина редактора
            var x_finish = this.offsetXEditor + this.editorWidth;
            //а у = итератор * высоту спрайта + смешение редактора по у
            var y = i * Core.Config.tileHeight + this.offsetYEditor;
            this.context.beginPath();
            this.context.strokeStyle = Core.Config.editorLineGridStyle;
            this.context.moveTo(x_start, y);
            this.context.lineTo(x_finish, y);
            this.context.stroke();
            this.context.closePath();
        }
        //сетка полностью нарисована
    },
    //ф-ция отрисовывает текущий (выбранный) блок
    //в параметр передаем объект блоков
    drawBlocks: function(blocks) {
        //и в зависимости от текущего выбранного блока рисуем нужный
        //он следит за курсором мышки (то есть это тот самый редактируемый блок)
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
    //а эта ф-ция уже рисуем саму маску карты
    //в параметрах передаем индекс блока, который нужно отрисовать и координаты
    //индекс блока применяет 4 значения
    //0 - кирпич, 1 - лес, 2 - сталь, 3 - вода
    drawMapMaskBlock: function(blockIndex, x, y) {
        //указываем объект, с которого будем брать спрайты
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
    //эта ф-ция также отрисовывает маску карты
    //она в цикле вызывает ф-цию выше
    drawMapMask: function() {
        for (var i = 0; i < Core.Variables.Editor.heightCountCells; i++) {
            for (var j = 0; j < Core.Variables.Editor.widthCountCells; j++) {
                //перебираем весь размер карты, указанный в объекте редактора
                //текущий х для отрисовки = итератор по ширине * ширина спрайта + смещение редактора по х
                var x = j * Core.Config.tileWidth + Core.Variables.Editor.offsetXEditor;
                //текущий у для отрисовки = итератор по высоте * высота спрайта + смещение редактора по у
                var y = i * Core.Config.tileHeight + Core.Variables.Editor.offsetYEditor;
                //вызываем ф-ция для отрисовки блока
                //в которую передаем текущее значение этой клетки (0, 1, 2, 3)
                //и сами координаты отрисовки, которые мы расчитали выше
                this.drawMapMaskBlock(this.mapMask[i][j], x, y);
            }
        }
    },
    //ф-ция очищает контекст редактор
    clearEditor: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    //главная ф-ция отрисовки редактора
    //на нее вешается таймер
    drawEditor: function() {
        this.clearEditor();
        this.drawGrid();
        this.drawBlocks(Core.Variables.Blocks);
        this.drawMapMask();
    },
    //ф-ция расчитывает размеры редактора и все его смещения
    calculateSize: function() {
        //ширина редактора = размеры окна - 200 пикселей (боковая панель 200 пикселей)
        this.width = window.innerWidth - 200;
        //высота редактора = высоте браузера
        this.height = window.innerHeight;
        //ширина и высота канвы = ширине и высоты редактора
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        //ширина активной области редактора = количество спрайтов по ширине * ширина спрайта
        this.editorWidth = this.widthCountCells * Core.Config.tileWidth;
        //высота активной области редактора = количество спрайтов по высоте * высота спрайта
        this.editorHeight = this.heightCountCells * Core.Config.tileHeight;
        //смещение активной области редактора по Х = ширина редактора \ 2 - ширина активной области редатора \ 2
        this.offsetXEditor = this.width / 2 - this.editorWidth / 2;
        //смещение активной области редактора по У = высота редактора \ 2 - высота активной области редатора \ 2
        this.offsetYEditor = this.height / 2 - this.editorHeight / 2;
        Core.Variables.Console.writeDebug('Editor offsetX = ' + this.offsetXEditor + ', Editor offsetY = ' + this.offsetYEditor);
        return true;
    },
    //ф-ция запускает таймер на отрисовку редактора
    startTimer: function() {
        var self = this;
        this.timer = setInterval(function() {
            self.drawEditor();
        }, Core.Config.timerInterval);
    },
    //ф-ция останавливает таймер отрисовки редактора
    stopTimer: function() {
        var self = this;
        clearInterval(self.timer);
        self.timer = null;
    },
    //ф-ция конвертирует массив маски карты в строчное представление
    convertMapMaskToString: function(mask) {
        //количество спрайтов по ширине
        var widthCountTiles = this.widthCountCells;
        //количество спрайтов по высоте
        var heightCountTiles = this.heightCountCells;
        //в этой переменной храним строчное представление маски карты
        //формат представления
        //<количество спрайтов по ширине>, <количество спрайтов по высоте>, <строка маски>
        var maskInString = widthCountTiles + ',' + heightCountTiles + ',' + mask.join(',');
        Core.Variables.Console.writeDebug(maskInString);
        return maskInString;
    },
    //ф-ция сохраняет нарисованную карту в локальное хранилище
    //в параметрах передаем лишь имя, под которым нужно сохранить
    saveMapMaskToLocalStorage: function(name) {
        var mapName = name;
        //конвертируем маску карты в строку и сохраняем все в локальное хранилище
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
    //это все элементы DOM
    //кнопки с изображениями окружения (кирпич)
    this.brickButton = document.getElementById(Core.Config.brickButtonId);
    //лес
    this.forestButton = document.getElementById(Core.Config.forestButtonId);
    //сталь
    this.steelButton = document.getElementById(Core.Config.steelButtonId);
    //вода
    this.waterButton = document.getElementById(Core.Config.waterButtonId);
    //указатель на канву редактора
    this.editorCanvas = Core.Variables.Editor.canvas;
    //элемент ввода размеров карты (количество спрайтов по ширине)
    this.widthCountTilesInput = document.getElementById(Core.Config.widthCountTilesInputId);
    //количество спрайтов по высоте
    this.heightCountTilesInput = document.getElementById(Core.Config.heightCountTilesInputId);
    //кнопка создания новой карты
    this.createNewMapButton = document.getElementById(Core.Config.createNewMapButtonId);
    //ввод имени карты, под которым нужно сохранить
    this.saveMapNameInput = document.getElementById(Core.Config.saveMapNameInputId);
    //сама кнопка сохранения карты
    this.saveMapButton = document.getElementById(Core.Config.saveMapButtonId);
    //нажата ли кнопка мыши в редактора
    this.returnToGameButton = document.getElementById(Core.Config.returnToGameButtonId);
    this.editorMousePressed = false;
    return this;
}

Events.prototype = {
    //ф-ция проверяет, входит ли мышь в активную область редактора
    checkMouseInEditor: function(x, y) {
        //определяем границы активной области редактора
        //максимум по Х = смещение активной области редактора по Х + ширина активной области редактора
        var maxX = Core.Variables.Editor.offsetXEditor + Core.Variables.Editor.editorWidth;
        //минимум по Х = просто смещение активной области редактора по Х
        var minX = Core.Variables.Editor.offsetXEditor;
        //максимум по У = смещение активной области редактора по У + ширина активной области редактора
        var maxY = Core.Variables.Editor.offsetYEditor + Core.Variables.Editor.editorHeight;
        //минимум по У = просто смещение активной области редактора по У
        var minY = Core.Variables.Editor.offsetYEditor;
        //и соответственно сама проверка условия на вхождение курсора в область
        if (x < maxX && x > minX && y < maxY && y > minY) {
            return true;
        } else {
            return false;
        }
    },
    //ф-ция вычисления индекса ячейки по координатами мыши (Х)
    //возвращает индекс в массиве маски (от 0 до ...)
    calculateIndexOfCellX: function(x) {
        //округляем(координату мышки Х - смещение активной области редактора по Х / ширина спрайта)
        var widthIndexBlock = Math.floor((x - Core.Variables.Editor.offsetXEditor) / Core.Config.tileWidth);
        return widthIndexBlock;
    },
    //ф-ция вычисляет индекс ячейки по координатам мыши (У)
    //возвращает индекс в массиве маски по У (от 0 до ...)
    calculateIndexOfCellY: function(y) {
        //округляем(координату мышки У - смещение активной области редактора по У / высота спрайта)
        var heightIndexBlock = Math.floor((y - Core.Variables.Editor.offsetYEditor) / Core.Config.tileHeight);
        return heightIndexBlock;
    },
    //ф-ция срабатывает по нажатию кнопок с элементами карты и изменяет им классы
    imagesButtonOnChange: function(domElement) {
        this.brickButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.forestButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.steelButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        this.waterButton.className = this.brickButton.className.replace(/(?:^|\s)one-image-active(?!\S)/g, '');
        domElement.className += ' one-image-active';
    },
    //ф-ция срабатывает при нажатии на элемент "Кирпич"
    brickButtonOnMouseDown: function() {
        //значение элемента в маске
        Core.Variables.Editor.currentBlock = 0;
        this.imagesButtonOnChange(this.brickButton);
        return true;
    },
    //ф-ция срабатывает при нажатии на элемент "Лес"
    forestButtonOnMouseDown: function() {
        //значение элемента в маске
        Core.Variables.Editor.currentBlock = 1;
        this.imagesButtonOnChange(this.forestButton);
        return true;
    },
    //ф-ция срабатывает при нажатии на элемент "Сталь"
    steelButtonOnMouseDown: function() {
        //значение элемента в маске
        Core.Variables.Editor.currentBlock = 2;
        this.imagesButtonOnChange(this.steelButton);
        return true;
    },
    //ф-ция срабатывает при нажатии на элемент "Вода"
    waterButtonOnMouseDown: function() {
        //значение элемента в маске
        Core.Variables.Editor.currentBlock = 3;
        this.imagesButtonOnChange(this.waterButton);
        return true;
    },
    //ф-ция срабатывает при перемещении курсора по канве редактора
    editorCanvasOnMouseMove: function(e) {
        //проверяем, входит ли курсор мыши в активную область редактора
        if (this.checkMouseInEditor(e.clientX, e.clientY)) {
            //и если входит
            //вычисляем индекс блока по Х
            var widthIndexBlock = this.calculateIndexOfCellX(e.clientX);
            //и вычисляем индекс блока по У
            var heightIndexBlock = this.calculateIndexOfCellY(e.clientY);
            //центр блока по Х = индекс блока по Х * ширина спрайта + смещение редактора по Х
            Core.Variables.Blocks.centerX = widthIndexBlock * Core.Config.tileWidth + Core.Variables.Editor.offsetXEditor;
            //центр блока по У = индекс блока по У * высота спрайта + смещение редактора по У
            Core.Variables.Blocks.centerY = heightIndexBlock * Core.Config.tileHeight + Core.Variables.Editor.offsetYEditor;
            //и если все еще нажата кнопка мыши
            if (this.editorMousePressed) {
                //то продолжаем зарисовывать маску карты
                //в массив маски, по вычисленному индексу, заносим значение текущего блока
                Core.Variables.Editor.mapMask[this.calculateIndexOfCellY(e.clientY)][this.calculateIndexOfCellX(e.clientX)] = Core.Variables.Editor.currentBlock;
            }
            Core.Variables.Console.writeDebug('Index X = ' + widthIndexBlock + ', Index Y = ' + heightIndexBlock);
        }
        return true;
    },
    //при нажатии кнопки мыши в редакторе
    editorCanvasOnMouseDown: function(e) {
        //если нажато внутри активной области редактора
        if (this.checkMouseInEditor(e.clientX, e.clientY)) {
            //то заполним массив маски значение текущего блока
            Core.Variables.Editor.mapMask[this.calculateIndexOfCellY(e.clientY)][this.calculateIndexOfCellX(e.clientX)] = Core.Variables.Editor.currentBlock;
            //поставим флаг, что кнопка все еще не отпущена
            this.editorMousePressed = true;
        }
        return true;
    },
    //при отпускании кнопки мыши с редактора
    editorCanvasOnMouseUp: function(e) {
        //просто запишем во флаг, что кнопка мыши отпущена
        this.editorMousePressed = false;
        return true;
    },
    //ф-ция срабатывает при нажатии на кнопку "Создать карту"
    createNewMapButtonDown: function(e) {
        //берем значения с инпутов по размерам карты
        //количество спрайтов по ширине карты
        var widthCountTiles = this.widthCountTilesInput.value;
        //количество спрайтов по высоте карты
        var heightCountTiles = this.heightCountTilesInput.value;
        //запишем в конфиг размеры карты
        Core.Config.widthTilesCount = widthCountTiles;
        Core.Config.heightTilesCount = heightCountTiles;
        Core.Variables.Console.writeDebug('Map size: ' + widthCountTiles + ' x ' + heightCountTiles);
        //и вызвем по новой точку входа для изначальной инициализации всех объектов и пересчета размеров
        Core.EntryPoint();
        return true;
    },
    //ф-ция срабатывает при нажатии на "Сохранить"
    saveMapButtonDown: function(e) {
        //вызываем ф-цию сохранения маски карты в локальное хранилище
        //и передаем в параметре имя карты, под которым нужно сохранить
        if (localStorage.getItem(this.saveMapNameInput.value) != undefined) {
            alert('Такая карта уже сохранена!');
        } else {
            Core.Variables.Editor.saveMapMaskToLocalStorage(this.saveMapNameInput.value);
        }
        return true;
    },
    //ф-ция возвращает в игру
    returnToGameButtonOnClick: function() {
        window.location = '../';
    },
    //ф-ция вешает все обработчики на все элементы
    //комментирование считаю лишним, и так все ясно
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
        this.returnToGameButton.onmousedown = function(e) {
            self.returnToGameButtonOnClick();
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
    //проверяем на активный "дебаг-мод"
    checkDebugMode: function() {
        if (Core.Config.debugMode) {
            return true;
        } else {
            return false;
        }
    },
    //ф-ция выводит в консоль инфу
    writeInfo: function(text) {
        if (console) {
            console.info(text);
            return true;
        } else {
            return false;
        }
    },
    //а эта ф-ция выводит в консоль дебаг-инфу
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
        debugMode: true, //флаг "дебаг-мода"
        //ID элементов в DOM
        brickButtonId: 'brick-button', //кнопка с кирпичем
        forestButtonId: 'forest-button', //кнопка с лесом
        steelButtonId: 'steel-button', //кнопка со сталью
        waterButtonId: 'water-button', //кнопка с водой
        widthCountTilesInputId: 'widthCountTiles-input', //размеры карты (ширина)
        heightCountTilesInputId: 'heightCountTiles-input', //размеры карты (высота)
        createNewMapButtonId: 'createMap-button', //кнопка создания новой карты
        saveMapNameInputId: 'nameMap-input', //ввод имени сохраняемой карты
        saveMapButtonId: 'saveMap-button', //кнопка сохранения карты
        returnToGameButtonId: 'returnToGame-button', //кнопка возврата в игру
        tileWidth: 48, //ширина спрайта
        tileHeight: 48, //высота спрайта
        tileBrickSrc: '../images/brick.png', //картинка с кирпичем
        tileForestSrc: '../images/forest.png', //картинка с лесом
        tileSteelSrc: '../images/steel.png', //картинка со сталью
        tileWaterSrc: '../images/water.png', //картинка с водой
        timerInterval: 50, //интервал таймера для отрисовки редактора
        editorLineGridStyle: 'red', //цвет сетки в редакторе
        widthTilesCount: 15, //количество спрайтов по ширине
        heightTilesCount: 7 //количество спрайтов по высоте
    },
    Variables: {
        Console: null, //объект консоли
        Events: null, //объект событий
        Editor: null, //объект редактора
        Blocks: null //объект блоков
    },
    //ф-ция инициализирует редактор
    InitializeEditor: function() {
        //если карта уже была создана и объекты не пустые
        if (Core.Variables.Editor != null && Core.Variables.Editor.timer != null) {
            //то останавливаем таймер
            Core.Variables.Editor.stopTimer();
            //и очищаем все объекты
            Core.Variables.Console = null;
            Core.Variables.Events = null;
            Core.Variables.Editor = null;
            Core.Variables.Blocks = null;
        }
        //инициализируем редактор со всеми объектами
        Core.Variables.Console = new Console(); //DONE
        Core.Variables.Console.writeInfo('Entry point was triggered'); //DONE
        Core.Variables.Editor = new Editor('scene'); //DONE
        Core.Variables.Editor.calculateSize(); //DONE
        Core.Variables.Events = new Events(); //DONE
        Core.Variables.Events.bindAllEvents(); //DONE
        Core.Variables.Blocks = new Blocks(); //DONE
        Core.Variables.Blocks.loadAllImages(); //DONE
        Core.Variables.Editor.startTimer(); //DONE
    },
    //точка входа в скрипт
    EntryPoint: function() {
        Core.InitializeEditor();
    }
};
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Waiting for document loaded////////////////////////
////////////////////////////////////////////////////////////////////////////////
var documentReadyInterval = setInterval(function() {
    if (document.readyState == 'complete') {
        //если страница уже полностью загружена
        //то очищаем таймер и вызывает точку входа в скрипт
        clearInterval(documentReadyInterval);
        Core.EntryPoint();
    }
}, 10);
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////COPYRIGHT by ghaiklor//////////////////////////////
////////////////////////////////////////////////////////////////////////////////