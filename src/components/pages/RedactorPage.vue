<template>
   <div>
        <div class="header">
            <ul class="menu">
                <li class="menu-elem menu-button"  v-on:click="showModal_AddFile">
                    <p class="add-image">Добавить изображение</p>
                </li>
                <li class="menu-elem">
                    <div class="bottom-panel">
                        <p class="top-panel-text">Выбранный пиксель:</p>
                        <p class="top-panel-text">Цвет: {{ lastClickedColor }}</p>
                        <div class="color" ref="color"></div>
                        <p class="top-panel-text">Координаты: {{ lastClickedCoordinates }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <modalAddFile v-show="isModalVisible" @close="closeModal_AddFile"></modalAddFile>
        <canvas ref="canvas" width="500" height="500" @mousemove="handleMouseMove" @click="handleCanvasClick"></canvas>
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
  export default {
    components: {
        modalAddFile,
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
        };
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            this.imageWidth = image.width;
            this.imageHeight = image.height;
        };
        const imageData = localStorage.getItem("start_image");
        if (imageData) {
            image.src = imageData;
        } else {
            alert('Изображение не найдено');
            this.$router.push('/');
        }
    },
    methods: {
        showModal_AddFile() {
            this.isModalVisible = true;
        },
        closeModal_AddFile() {
            this.isModalVisible = false;
        },
        handleMouseMove(event) {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            this.pixelColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            this.pixelCoordinates = `(${Math.round(x)}, ${Math.round(y)})`;
        },
        handleCanvasClick(event) {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            this.lastClickedColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            this.lastClickedCoordinates = `(${Math.round(x)}, ${Math.round(y)})`;
            const color = this.$refs.color; 
            color.style.backgroundColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
        }
    },
    methods: {
      handleMouseMove(event) {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        this.pixelColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
        this.pixelCoordinates = `(${x}, ${y})`;
      }
    }
  };
  </script>
  
  <style>
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
    background-color: #f0f0f0;
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
    margin-bottom: 150px;
}

  </style>
  