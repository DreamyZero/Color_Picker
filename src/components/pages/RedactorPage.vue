<template>
    <div>
        <div class="header">
            <ul class="menu">
                <li class="menu-elem menu-button" v-on:click="showModal_AddFile">
                    <p class="add-image">Изменить изображение</p>
                </li>
                <li class="menu-elem menu-button" v-on:click="downLoadImg">
                    <p class="add-image">Скачать изображение</p>
                </li>
                <li class="menu-elem menu-button" v-on:click="openResiseFileModal">
                    <p class="add-image">Мастабировать изображение</p>
                </li>
                <li class="menu-elem menu-button" v-on:click="showModal_Pipetka">
                    <img width="35" height="35" src="https://cdn.icon-icons.com/icons2/788/PNG/512/pipette_icon-icons.com_65005.png" alt="alt" class="pipette">
                </li>
                <li id="dragger" class="menu-elem menu-button" v-on:click="setDrag" >
                    <img width="33" height="33" src="https://cdn-icons-png.flaticon.com/512/1612/1612618.png" alt="alt" class="hand">
                </li>
                <li class="menu-elem menu-button" v-on:click="showModal_Brightness">
                    <p class="add-image">Изменить яркость изображения.</p>
                </li>
                <li class="menu-elem menu-button" v-on:click="showModal_Blur">
                    <p class="add-image">Размытия</p>
                </li>
                <li class="menu">
                    <select v-model="scale" @change="changeScale">
                        <option v-for="(scaleOption, index) in scaleOptions" :value="scaleOption" :key="index">{{ scaleOption }}%</option>
                    </select>
                </li>
            </ul>
        </div>
        <resiseFileModal ref="resiseFileModal"></resiseFileModal>
        <pipetteModal ref="pipetteModal"></pipetteModal>
        <brightnessModal ref="brightnessModal"></brightnessModal>
        <blurModal ref="blurModal"></blurModal>
        <modalAddFile v-show="isModalVisible" @close="closeModal_AddFile"></modalAddFile>
        <div class="canvas-container" ref="canvas_container" v-click="drag">
            <canvas ref="canvas" id="mainCanvas" tabindex="0" class="canvas" @keydown="moveElement"  @mousedown="startDrag($event)" @mouseup="stopDrag" :width="canvasWidth" :height="canvasHeight" @mousemove="handleMouseMove($event)" @click="handleCanvasClick"></canvas>
        </div>
        <div class="bottom-elem"></div>
        <div class="info-panel">
            <div class="top-panel">
                <p class="top-panel-text">Информация о пикселе:</p>
                <p class="top-panel-text">Цвет: {{ pixelColor }}</p>
                <p class="top-panel-text">Координаты (x,y): {{ pixelCoordinates }}</p>
                <p class="top-panel-text">Изображение ширина : {{ imageWidth }} px</p>
                <p class="top-panel-text">высота : {{ imageHeight }} px</p>
            </div>
        </div>
    </div>
</template>

<script>
import modalAddFile from '../modules/AddFileModal.vue';
import resiseFileModal from '../modules/ResiseFileModal.vue';
import pipetteModal from '../modules/PipetteModal.vue';
import brightnessModal from '../modules/BrightnessModal.vue'
import blurModal from '../modules/BlurModal.vue'
export default {
    components: {
        modalAddFile,
        resiseFileModal,
        pipetteModal,
        brightnessModal,
        blurModal,
    },
    data() {
        return {
            pixelColor: "",
            pixelCoordinates: "",
            imageWidth: 0,
            imageHeight: 0,
            lastClickedColor: "",
            lastClickedCoordinates: "",
            isModalVisible: false,
            isModalPipetteVisible: false,
            scale: 100,
            scaleOptions: [12, 25, 50, 75, 100, 150, 200, 300],
            isDragging: false,
            dragging:false,
            wasDragget: false,
            startX: 60,
            startY: 0,
            startPosition:"",
            clw:"",
            wn:"",
            clh:"",
            hn:"",
            isFormatted:"",
            isFormatedHeight:"",
            isFormatedWidth:"",
            step: 10,
        };
    },
    computed: {
        canvasWidth() {
            return window.innerWidth;
        },
        canvasHeight() {
            return window.innerHeight - 100;
        },
    },
    mounted() {
        if (localStorage.getItem("isResisedCanWr") == "false"){
            console.log("yes!")
            let cont =  this.$refs.canvas_container;
            console.log("window.innerHeight",window.innerHeight)
            console.log(`${document.getElementById("app").offsetHeight - 100}px`)
            cont.style.height = `${document.getElementById("app").offsetHeight - 160}px`
            cont.style.width = `${document.getElementById("app").offsetWidth-100}px`
        }
        this.loadImage();
        console.log("NU DA",localStorage.getItem("isResisedCanWr"))

    },
    methods: {
    moveElement(event) {
        console.log("It not works")
        if (this.isDragging == true){
            let canvas = this.$refs.canvas;
            let canvas_wrapper = this.$refs.canvas_container;
            let clw = canvas.clientWidth;
            let sw = canvas_wrapper.clientWidth;
            this.startY = (sw - clw)/2;
            if (this.wasDragget == false){
                canvas.style.marginTop = "50px"
                canvas.style.marginLeft = `${this.startY}px`;
                this.wasDragget = true
            }
            
            console.log("it wroks")
            switch (event.key) {
                case "ArrowUp":
                    console.log("UP")
                    this.moveUp();
                    break;
                case "ArrowDown":
                    this.moveDown();
                    break;
                case "ArrowLeft":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                    this.moveRight();
                    break;
            }
        }
        },
        moveUp() {
            let canvas = this.$refs.canvas;
            if (canvas.style.marginTop == "10px"){
                return
            }
            canvas.style.marginTop = `${Number(canvas.style.marginTop.slice(0, -2))-this.step}px`;
        },
        moveDown() {
            let canvas = this.$refs.canvas;
            canvas.style.marginTop = `${Number(canvas.style.marginTop.slice(0, -2))+this.step}px`;
        },
        moveLeft() {
            let canvas = this.$refs.canvas;
            if (canvas.style.marginLeft == "3px"){
                return
            }
            console.log("Number(canvas.style.marginLeft.slice(0, -2))",Number(canvas.style.marginLeft.slice(0, -2)),Number(canvas.style.marginLeft.slice(0, -2))-this.step)
            canvas.style.marginLeft = `${Number(canvas.style.marginLeft.slice(0, -2))-this.step}px`;
        },
        moveRight() {
            let canvas = this.$refs.canvas;
            canvas.style.marginLeft = `${Number(canvas.style.marginLeft.slice(0, -2))+this.step}px`;
        },
        setDrag() {
            if (this.isDragging == false) {
                this.$refs.canvas.focus();
                let canvas = this.$refs.canvas;
                let canvas_wrapper = this.$refs.canvas_container;
                this.clw = canvas.clientWidth;
                this.wn = window.innerWidth;
                this.clh = canvas.clientHeight;
                this.hn = window.innerHeight;
                let clw = canvas.clientWidth;
                let sw = canvas_wrapper.clientWidth;
                this.isFormatedHeight = false
                this.isFormatedWidth = false 
                if (canvas_wrapper.scrollHeight > canvas_wrapper.clientHeight) {
                    console.log("Height!")
                    this.isFormatedHeight = true 
                }
                if (canvas_wrapper.scrollWidth > canvas_wrapper.clientWidth) {
                    console.log("Width!")
                    this.isFormatedWidth = true 
                }
                document.getElementById("dragger").style = "border-color: red";
                this.isDragging = true;
                if ((this.isFormatedWidth == false) && (this.isFormatedHeight == true)) {
                    if (this.wasDragget == false) {
                        console.log("ez");
                        canvas_wrapper.style.textAlign = "left";
                        this.startY = (sw - clw)/2;
                        canvas.style.marginLeft = `${this.startY}px`;
                        this.startPosition = { x: this.startY, y: 0 };
                    }
                    return
                }
                if ((this.isFormatedWidth == true) || (this.isFormatedHeight == true)) {
                    if (this.wasDragget == false) {
                        this.startY = (sw - clw)/2;
                        this.startPosition = { x: 0, y: 0 };
                        console.log("Провалился в дичь1");
                    }
                    return
                }

                console.log("DWDW",clw,sw,(sw - clw)/2)
                this.startY = (sw - clw)/2;
                if (this.wasDragget == false) {
                    canvas_wrapper.style.textAlign = "left";
                    this.startPosition = { x: this.startY, y: this.startX };
                    canvas.style.marginLeft = `${this.startY}px`;
                }
            } else {
                document.getElementById("dragger").style = "border-color: black"
                this.isDragging = false;
                this.isFormatted = false;
            }
        },
    startDrag(event) {
        if (this.isDragging) {
            let canvas = this.$refs.canvas;
            let canvas_container = this.$refs.canvas_container
            this.dragging = true;
            console.log("Дрфг начался!")
            if ((this.wasDragget == true) && !((this.isFormatedHeight == true) && (this.isFormatedWidth == false))) {
                console.log("this.$refs.canvas.style.marginLeft",Number(canvas.style.marginLeft.slice(0, -2)));
                this.startY = event.clientY
                this.startPosition = { x: Number(canvas.style.marginLeft.slice(0, -2)), y: canvas_container.scrollTop};
            }
            if ((this.wasDragget == true) && !((this.isFormatedHeight == false) && (this.isFormatedWidth == true))) {
                console.log("this.$refs.canvas.style.marginLeft",Number(canvas.style.marginLeft.slice(0, -2)))
                this.startX = event.clientX
                this.startPosition = { x: canvas_container.scrollLeft , y:  Number(canvas.style.marginTop.slice(0, -2))};
            }
            if ((this.wasDragget == true) && ((this.isFormatedHeight == true) && (this.isFormatedWidth == true))) {
                if (canvas_container.scrollLeft > canvas_container.scrollWidth){
                        canvas_container.scrollLeft = canvas_container.scrollWidth;
                    }
                if (canvas_container.scrollTop > canvas_container.scrollHeight){
                    canvas_container.scrollTop = canvas_container.scrollHeight;
                }
                this.startX = event.clientX
                this.startY = event.clientY
                this.startPosition = { x: canvas_container.scrollLeft , y: canvas_container.scrollTop};
            }
        }
    },
    stopDrag() {
        if (this.isDragging && this.dragging) {
            this.dragging = false;
            this.wasDragget = true;
        }
    },
    onDrag(event) {
        if (this.isDragging && this.dragging) {
                const canvas = this.$refs.canvas;
                const canvas_container = this.$refs.canvas_container
                if ((this.isFormatedHeight == true) && (this.isFormatedWidth == false)) {
                    let newX = event.clientX - this.startPosition.x - 600;
                    let deltaY = this.startY - event.clientY;
                    console.log("event.clientY",event.clientY)
                    let x = this.startPosition.x + newX;
                    canvas_container.scrollTop = this.startPosition.y - deltaY;
                    if (x <= 0) {
                        x = 0
                    }
                    if (x >= (this.wn-120-this.clw)) {
                        x = this.wn-120-this.clw;
                    }
                    canvas.style.marginLeft = `${x}px`
                    return
                }
                if ((this.isFormatedHeight == false) && (this.isFormatedWidth == true)) {
                    let newY = event.clientY - this.startPosition.y - 150;
                    let deltaX = this.startX - event.clientX;
                    let y = this.startPosition.y + newY;
                    canvas_container.scrollLeft = this.startPosition.x - deltaX;
                    if (y <= 13) {
                        y = 13
                    }
                    if  (y >= (this.hn-170-this.clh)) {
                        y = this.hn-170-this.clh;
                    }
                    canvas.style.marginTop = `${y}px`
                    return
                }
                if ((this.isFormatedHeight == true) && (this.isFormatedWidth == true)) {
                    let deltaX = this.startX - event.clientX;
                    let deltaY = this.startY - event.clientY;
                    canvas_container.scrollTop = this.startPosition.y - deltaY;
                    canvas_container.scrollLeft = this.startPosition.x - deltaX;
                    return
                }
                console.log("onDrag")
                console.log("event.clientX",event.clientX)
                console.log("event.clientY",event.clientY)
                let newX = event.clientX - this.startPosition.x - 300;
                let newY = event.clientY - this.startPosition.y - 150;
                console.log(newX,"newX")
                console.log(newY,"newY")
                let x = this.startPosition.x + newX;
                let y = this.startPosition.y + newY;

                if (x <= 0) {
                    x = 0
                }
                if (y <= 13) {
                    y = 13
                }
                if (x >= (this.wn-200-this.clw)) {
                    x = this.wn-200-this.clw;
                }
                if  (y >= (this.hn-200-this.clh)) {
                    y = this.hn-200-this.clh;
                }
                canvas.style.marginLeft = `${x}px`
                canvas.style.marginTop = `${y}px`
            }
        },
        downLoadImg() {

            const canvas = this.$refs.canvas;
            const dataURL = canvas.toDataURL("image/jpeg");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas_image.jpeg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        openResiseFileModal() {
            console.log("openResiseFileModal called")
            this.$refs.resiseFileModal.openModal();
        },
        showModal_AddFile() {
            this.isModalVisible = true;
        },
        closeModal_AddFile() {
            this.isModalVisible = false;
        },
        showModal_Blur(){
            this.$refs.blurModal.openModal();
            this.isModalBlurVisible = true
        },
        showModal_Brightness(){
            console.log("FHFHFHFH")
            this.$refs.brightnessModal.openModal();
            this.isModalBrightnessVisible = true
        },
        showModal_Pipetka() {
            
            this.$refs.pipetteModal.openModal();
            this.isModalPipetteVisible = true
        },
        loadImage() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.onload = () => {
                this.imageWidth = image.width ;
                this.imageHeight = image.height;

                let hw = document.getElementsByClassName('canvas-container')[0].offsetHeight;
                let hc = document.getElementsByClassName('canvas')[0].offsetWidth;
                let ww = document.getElementsByClassName('canvas-container')[0].offsetHeight;
                let wc = document.getElementsByClassName('canvas')[0].offsetWidth;
                console.log("yepe","conwrapH-",hw,"canH-",hc,"conwrapW-",ww,"canW-",wc)
                if (hc < hw){
                    const ratio = hw / hc
                    for (let i = 0; i < 9; i++) {
                        if (this.scaleOptions[i] / 100 * ratio > 1) {
                            this.scale = this.scaleOptions[i-1];
                            this.changeScale();
                            break
                        }
                    }
                }
                if (ww < wc){
                    console.log("FEFEFGHR",wc,ww)
                    const ratioW = wc / ww
                    console.log("width",ratioW)
                    for (let i = 0; i < 9; i++) {
                        if (this.scaleOptions[i] / 100 * ratioW > 1) {
                            if (this.scale <= this.scaleOptions[i-1]){
                                break
                            }
                            this.scale = this.scaleOptions[i-1];
                            console.log("this.scale",this.scale)
                            this.changeScale();
                            break
                        }
                    }
                }
                this.renderImage(canvas, ctx, image);
            };
            const imageData = localStorage.getItem("start_image");
            if (imageData) {
                image.src = imageData;
            } else {
                alert('Изображение не найдено');
                this.$router.push('/');
            }
        },
        renderImage(canvas, ctx, image) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scaleRatio = this.scale / 100;
            const scaledWidth = this.imageWidth * scaleRatio;
            const scaledHeight = this.imageHeight * scaleRatio;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;
            ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
        },
        handleMouseMove(event) {
            this.onDrag(event);
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const x = Math.round((event.clientX - rect.left) / this.scale * 100);
            const y = Math.round((event.clientY - rect.top) / this.scale * 100);
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            this.pixelColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            this.pixelCoordinates = `(${x}, ${y})`; 
        },
        handleCanvasClick(event) {
            if (this.isModalPipetteVisible == true) {
                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext("2d");
                const rect = canvas.getBoundingClientRect();
                const k = (event.clientY - rect.top)
                const x = (event.clientX - rect.left) / this.scale * 100;
                const y = k / this.scale * 100;
                const pixelDataColor = ctx.getImageData(x* this.scale / 100, y* this.scale / 100, 1, 1).data;
                this.lastClickedColor = `rgb(${pixelDataColor[0]}, ${pixelDataColor[1]}, ${pixelDataColor[2]})`;
                this.lastClickedCoordinates = `(${Math.round(x)}, ${Math.round(y)})`;
                if (event.altKey) {
                    localStorage.setItem("lastClickedCoordinates2", this.lastClickedCoordinates);
                    localStorage.setItem("lastClickedColor2", this.lastClickedColor);
                    localStorage.setItem("XClicked2",`${pixelDataColor[0]}`);
                    localStorage.setItem("YClicked2",`${pixelDataColor[1]}`);
                    localStorage.setItem("ZClicked2",`${pixelDataColor[2]}`);
                    this.$refs.pipetteModal.saveParamsFor(2);
                } else {
                    localStorage.setItem("lastClickedCoordinates", this.lastClickedCoordinates);
                    localStorage.setItem("lastClickedColor", this.lastClickedColor);
                    localStorage.setItem("XClicked",`${pixelDataColor[0]}`);
                    localStorage.setItem("YClicked",`${pixelDataColor[1]}`);
                    localStorage.setItem("ZClicked",`${pixelDataColor[2]}`);
                    this.$refs.pipetteModal.saveParamsFor(1);
                }
            }
        },
        changeScale() {
            let canvas_wrapper = this.$refs.canvas_container;
            if (this.wasDragget == true) {
                let canvas = this.$refs.canvas;
                
                console.log("Должен примениться text-align: center");
                canvas_wrapper.style.textAlign = "center";
                canvas.style.marginLeft = `${0}px`;
                canvas.style.marginTop = `${0}px`;
                this.wasDragget = false;
            }
            const canvas = this.$refs.canvas;
            canvas.style.marginLeft = `${0}px`;
            canvas_wrapper.style.textAlign = "center";
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.onload = () => {
                const originalWidth = image.width;
                const originalHeight = image.height;
                const scaleRatio = this.scale / 100;

                canvas.width = originalWidth * scaleRatio;
                canvas.height = originalHeight * scaleRatio;
                console.log(' canvas.width', canvas.width,"canvas.height", canvas.height)

                this.renderImage(canvas, ctx, image);
                canvas.addEventListener("mousemove", this.handleMouseMove);
                canvas.addEventListener("click", this.handleCanvasClick);
                if (localStorage.getItem("isResisedCanWr") == "false"){
                    console.log("yep")
                    let cont =  this.$refs.canvas_container;
                    console.log("window.innerHeight",window.innerHeight)
                    console.log("no",`${document.getElementById("app").offsetHeight - 100}px`)
                    console.log("appH",document.getElementById("app").offsetHeight)
                    cont.style.height = `${document.getElementById("app").offsetHeight - 160 + 100}px`
                    cont.style.width = `${document.getElementById("app").offsetWidth-100}px`
                }
            };

            const imageData = localStorage.getItem("start_image");
            if (imageData) {
                image.src = imageData;
            }
        },
        }
    };
</script>

<style>
.canvas-container {
    text-align: center;
    margin-left: 50px;
    margin-right: 50px;
    overflow-x: auto;
}
body {
    margin: 0 !important;
}
.header {
    width: 100%;
    position: fixed;
    background-color:#f0f0f0 ;
    top: 0;
}
ol, ul {
    list-style: none;
}
.add-image {
    margin: 0;
}
.menu {
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
}
.menu-button {
    height: 25px;
    border: 2px solid black;
    padding: 3px;
    border-radius: 3px;
    margin-right: 10px;
}
.menu-elem {
    display: flex;
    justify-content: center;
    align-items: center;
}
.bottom-elem {
    height: 50px;
}
.hand {
    margin: 1px;
}
.info-panel {
    tab-size: 5px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
}
.top-panel {
    display: flex;
    margin-bottom: 5px;
    justify-content: center;
    align-items: center;
}
.bottom-panel {
    display: flex;
    justify-content: center;
    align-items: center;
}
.color {
    width: 20px;
    height: 20px;
    border: 3px solid black;
}
.top-panel-text {
    margin: 0;
    margin-left: 10px;
}
.canvas{
    margin-top: 50px;
    margin-bottom: 10px;
}
</style>