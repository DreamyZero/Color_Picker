<template>
    <div>
         <div class="header">
             <ul class="menu">
                 <!-- Кнопка "Изменить изображение" -->
                 <li class="menu-elem menu-button" v-on:click="showModal_AddFile">
                     <p class="add-image">Изменить изображение</p>
                 </li>
 
                 <!-- Новая кнопка для изменения размера изображения -->
                 <li class="menu-elem menu-button" v-on:click="openResiseFileModal">
                     <p class="add-image">Изменить размер изображения</p>
                 </li>
 
                 <li class="menu-elem">
                     <div class="bottom-panel">
                         <p class="top-panel-text">Выбранный пиксель:</p>
                         <p class="top-panel-text">Цвет: {{ lastClickedColor }}</p>
                         <div class="color" ref="color"></div>
                         <p class="top-panel-text">Координаты: {{ lastClickedCoordinates }}</p>
                     </div>
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
 
         <!-- Модальные окна -->
         <resiseFileModal ref="resiseFileModal"></resiseFileModal>
         <modalAddFile v-show="isModalVisible" @close="closeModal_AddFile"></modalAddFile>
         <brightnessModal ref="brightnessModal"></brightnessModal>
         <blurModal ref="blurModal"></blurModal>
 
         <!-- Контейнер для холста -->
         <div class="canvas-container">
             <canvas ref="canvas" class="canvas" :width="canvasWidth" :height="canvasHeight" @mousemove="handleMouseMove" @click="handleCanvasClick"></canvas>
         </div>
         <div class="bottom-elem"></div>
         
         <!-- Информационная панель -->
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
 import brightnessModal from '../modules/BrightnessModal.vue';
 import blurModal from '../modules/BlurModal.vue'
 
 export default {
     components: {
         modalAddFile,
         resiseFileModal,
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
             scale: 100,
             scaleOptions: [12, 25, 50, 75, 100, 150, 200, 300],
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
 
         // Метод для открытия модального окна изменения размера файла
         openResiseFileModal() {
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
                 this.imageWidth = image.width;
                 this.imageHeight = image.height;
                 canvas.width = this.imageWidth;
                 canvas.height = this.imageHeight;
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
             const x = (event.clientX - rect.left) / this.scale * 100;
             const y = (event.clientY - rect.top) / this.scale * 100;
             const pixelDataColor = ctx.getImageData(x * this.scale / 100, y * this.scale / 100, 1, 1).data;
             this.lastClickedColor = `rgb(${pixelDataColor[0]}, ${pixelDataColor[1]}, ${pixelDataColor[2]})`;
             this.lastClickedCoordinates = `(${Math.round(x)}, ${Math.round(y)})`;
             const color = this.$refs.color;
             color.style.backgroundColor = `rgb(${pixelDataColor[0]}, ${pixelDataColor[1]}, ${pixelDataColor[2]})`;
         },
         changeScale() {
    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    
    const imageData = localStorage.getItem("start_image");
    if (imageData) {
        image.src = imageData;
    } else {
        console.error("Изображение не найдено");
        return;
    }

    // Удаляем предыдущие обработчики событий
    canvas.removeEventListener("mousemove", this.handleMouseMove);
    canvas.removeEventListener("click", this.handleCanvasClick);

    image.onload = () => {
        const originalWidth = image.width;
        const originalHeight = image.height;
        const scaleRatio = this.scale / 100;

        // Обновите размеры холста
        canvas.width = originalWidth * scaleRatio;
        canvas.height = originalHeight * scaleRatio;

        // Отрисовка изображения
        this.renderImage(canvas, ctx, image);
        console.log("Изображение перерисовано с масштабом:", this.scale);

        // Добавьте обработчики событий после отрисовки
        canvas.addEventListener("mousemove", this.handleMouseMove);
        canvas.addEventListener("click", this.handleCanvasClick);
    };

    // Устанавливаем src после определения onload
    image.src = imageData;
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
     background-color: #c6c2c2;
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
 .top-panel-text {
     margin: 0;
     margin-left: 10px;
 }
 .canvas {
     margin-top: 50px;
     margin-bottom: 10px;
 }
 </style>
 