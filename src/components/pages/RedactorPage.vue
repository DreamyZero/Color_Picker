<template>
   <div>
        <div class="header">
            <ul class="menu">
                <li class="menu-elem menu-button" v-on:click="showModal_AddFile">
                    <p class="add-image">Изменить изображение</p>
                </li>
                <li class="menu-elem">
                    <div class="bottom-panel">
                        <p class="top-panel-text">Выбранный пиксель:</p>
                        <p class="top-panel-text">Цвет: {{ lastClickedColor }}</p>
                        <div class="color" ref="color"></div>
                        <p class="top-panel-text">Координаты: {{ lastClickedCoordinates }}</p>
                    </div>
                </li>
                <li class="menu">
                    <select v-model="scale" @change="changeScale">
                        <option v-for="(scaleOption, index) in scaleOptions" :value="scaleOption" :key="index">{{ scaleOption }}%</option>
                    </select>
                </li>
            </ul>
        </div>
        <resiseFileModal ref="resiseFileModal"></resiseFileModal>
        <modalAddFile v-show="isModalVisible" @close="closeModal_AddFile"></modalAddFile>
        <div class="canvas-container">
            <canvas ref="canvas" class="canvas" :width="canvasWidth" :height="canvasHeight" @mousemove="handleMouseMove" @click="handleCanvasClick"></canvas>
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
  export default {
    components: {
        modalAddFile,
        resiseFileModal,
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
                scale: 100,
                scaleOptions: [12, 25, 50, 75, 100, 150, 200, 300],

        };
    },
    computed: {
        canvasWidth() {
            return window.innerWidth;
        },
        canvasHeight() {
            return window.innerHeight - 100; // Adjust as needed
        },
    },
    mounted() {
        this.loadImage();
    },
    methods: {
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
        loadImage() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.onload = () => {
                this.imageWidth = image.width ;
                this.imageHeight = image.height;
                canvas.width = this.imageWidth;
                canvas.height = this.imageHeight;
                console.log("hhh",this.imageWidth,this.imageHeight)

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
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            console.log("???",rect.left)
            const k = (event.clientY - rect.top)
            const x = (event.clientX - rect.left) / this.scale * 100;
            const y = k / this.scale * 100;
            console.log("not",event.clientX - rect.left,k)
            console.log("ok",x,y)
            const pixelDataColor = ctx.getImageData(x* this.scale / 100, y* this.scale / 100, 1, 1).data;
            this.lastClickedColor = `rgb(${pixelDataColor[0]}, ${pixelDataColor[1]}, ${pixelDataColor[2]})`;
            this.lastClickedCoordinates = `(${Math.round(x)}, ${Math.round(y)})`;
            const color = this.$refs.color; 
            color.style.backgroundColor = `rgb(${pixelDataColor[0]}, ${pixelDataColor[1]}, ${pixelDataColor[2]})`;
        },
        changeScale() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.onload = () => {
                const originalWidth = image.width;
                const originalHeight = image.height;
                const scaleRatio = this.scale / 100;

                canvas.width = originalWidth * scaleRatio;
                canvas.height = originalHeight * scaleRatio;
                console.log(' canvas.width', canvas.width,"canvas.height",canvas.height)

                this.renderImage(canvas, ctx, image);
                canvas.addEventListener("mousemove", this.handleMouseMove);
                canvas.addEventListener("click", this.handleCanvasClick);
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
    background-color:#c6c2c2 ;
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
  .info-panel {
    tab-size: 5px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #c6c2c2;
    padding: 10px;
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
.top-panel-text{
    margin: 0;
    margin-left: 10px;
}
.canvas{
    margin-top: 50px;
    margin-bottom: 10px;
}

  </style>
  