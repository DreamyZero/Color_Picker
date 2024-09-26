<template>
   <div>
        <canvas ref="canvas" width="500" height="500" @mousemove="handleMouseMove" @click="handleCanvasClick"></canvas>
        <div class="info-panel">
            <div class="top-panel">
                <p>Информация о пикселе:</p>
                <p>Цвет: {{ pixelColor }}</p>
                <p>Координаты: {{ pixelCoordinates }}</p>
                <p>Ширина изображения: {{ imageWidth }}px</p>
                <p>Высота изображения: {{ imageHeight }}px</p>
            </div>
            <div class="bottom-panel">
                <p>Выбранный пиксель:</p>
                <p>Цвет: {{ lastClickedColor }}</p>
                <div class="color" ref="color"></div>
                <p>Координаты: {{ lastClickedCoordinates }}</p>
            </div>
        </div>
      </div>
  </template>
  
  <script>
  export default {
    data() {
        return {
            pixelColor: "",
            pixelCoordinates: "",
            imageWidth: 0,
            imageHeight: 0,
            lastClickedColor: "",
            lastClickedCoordinates: ""
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
        handleMouseMove(event) {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            this.pixelColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            this.pixelCoordinates = `(${x}, ${y})`;
        },
        handleCanvasClick(event) {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            this.lastClickedColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            this.lastClickedCoordinates = `(${x}, ${y})`;
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
  .info-panel {
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
    margin-bottom: 20px;
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
p {
    margin-left: 10px;
}
  </style>
  