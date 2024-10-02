<template>
  <div class="modal" id="modal" v-show="isVisible">
      <span class="close" @click="closeModal">&times;</span>
      Размытия
      <p class="selects">Пользовательское размытие <input class="check_blur"  value="a" v-model="user" type="checkbox"></p>
      <div class="modal-elem">
          <div class="content">
              
              <div class="matrix"  v-show="user == true">
                  <div v-for="(row, y) in matrix" :key="y">
                      <input v-for="(value, x) in row" v-model="matrix[y][x]" type="text" :key="x">
                      <br>
                  </div>
              </div>
              <div class="leftpart" v-show="user == false">
                  <p class="selects">Гаусс <input class="check_blur"  value="test" v-model="gauss" type="checkbox"></p>
                  <p class="selects">Осмурфирование <input class="check_blur"  value="test" v-model="contrast" type="checkbox"></p>
              </div>
              <div class="canvas_wrapper" v-show="showCanvas == 'DA'">
                  <canvas id="prewCanvas2"></canvas>
                  <canvas id="cn" v-show="showCanvas == 'A'"></canvas>
              </div>
          </div>
      </div>
      <div class="buttons-wrapper">
          Предпросмотр:<input type="checkbox" @click="calcCanvass"> <br/>
          <button class="apply" @click="handleSubmittt">Отправить</button>
          <button class="apply" @click="closeModal">Закрыть окно.</button>
      </div>
  </div>
</template>

<script>
// const convert = require('color-convert');
export default {
name: 'pipetteModal',
data() {
  return {
      isVisible: false,
      move: 0,
      showCanvas: 0,
      gauss: 0,
      user: false,
      matrix: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0]
      ],
      contrast: false,
  };
},
watch: {
  matrix: {
      deep: true,
          handler() {
              this.updateCanvas();
          }
      }
},
methods: {
  updateCanvas() {
      if (this.showCanvas == true) {
          this.dispCanvas()
      }

  },
  increaseContrast(imageData) {
      const data = imageData.data;
      const length = data.length;
      let totalBrightness = 0;

      // Вычисляем суммарную яркость всех пикселей
      for (let i = 0; i < length; i += 4) {
          totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }

      // Вычисляем среднюю яркость
      const averageBrightness = totalBrightness / (length / 4);

      // Повышаем контрастность каждого пикселя
      for (let i = 0; i < length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

          if (brightness < averageBrightness) {
              // Увеличиваем яркость, если она ниже средней
              data[i] = Math.min(data[i] * 1.5, 255);
              data[i + 1] = Math.min(data[i + 1] * 1.5, 255);
              data[i + 2] = Math.min(data[i + 2] * 1.5, 255);
          } else {
              // Уменьшаем яркость, если она выше средней
              data[i] = 0.8;
              data[i + 1]= 0.8;
              data[i + 2] *= 0.8;
          }
      }

      return imageData;
  },
  applyMatrix(matrix, imageData) {
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;
      const newData = new Uint8ClampedArray(data.length);

      for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
              let r = 0, g = 0, b = 0, a = 0;

              for (let i = 0; i < matrix.length; i++) {
                  for (let j = 0; j < matrix[i].length; j++) {
                      const pixelX = x + j - Math.floor(matrix[i].length / 2);
                      const pixelY = y + i - Math.floor(matrix.length / 2);

                      if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
                          const neighborIndex = (pixelY * width + pixelX) * 4;
                          const coefficient = matrix[i][j];

                          r += data[neighborIndex] * coefficient;
                          g += data[neighborIndex + 1] * coefficient;
                          b += data[neighborIndex + 2] * coefficient;
                          a += data[neighborIndex + 3] * coefficient;
                      }
                  }
              }

              const index = (y * width + x) * 4;
              newData[index] = r;
              newData[index + 1] = g;
              newData[index + 2] = b;
              newData[index + 3] = a;
          }
      }

      for (let i = 0; i < data.length; i++) {
          data[i] = newData[i];
      }

      return imageData;
  },
  handleSubmittt(){
      const canvas = document.getElementById('prewCanvas2');

      const ctx = canvas.getContext('2d');
      const img = new Image();
      const imageData = localStorage.getItem("start_image");
      img.onload = function () {
          const canvasWidth = img.width;
          const canvasHeight = img.height;
          canvas.width = img.width
          canvas.height = img.height
          console.log("canvasWidth", canvasWidth, "canvasHeight", canvasHeight)
          const imageWidth = img.width;
          const imageHeight = img.height;
          const scale = Math.min(canvasWidth , canvasHeight);
          console.log("scale", scale)
          ctx.drawImage(img, 0, 0, imageWidth , imageHeight);
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (this.user == true) {
              const newImageData = this.applyMatrix(this.matrix, imageData2);
              ctx.putImageData(newImageData, 0, 0);
              let start_image = canvas.toDataURL('image/jpeg');
              localStorage.setItem("start_image", start_image);
          }
          if (this.contrast == true) {
              const newImageData = this.increaseContrast(imageData2);
              ctx.putImageData(newImageData, 0, 0);
              let start_image = canvas.toDataURL('image/jpeg');
              localStorage.setItem("start_image", start_image);
          }
          // Применяем размытие Гаусса
          if (this.gauss == true){
              console.log("imageData",imageData)
              const blurredData = this.gaussianBlur(imageData2, 2); // Радиус размытия - 2

              // Обновляем canvas обработанными данными
              ctx.putImageData(blurredData, 0, 0);
              let start_image = canvas.toDataURL('image/jpeg');
              localStorage.setItem("start_image", start_image);
          }
      }.bind(this);

      img.src = imageData;
      // this.changePixelColors();
      location.reload();
  },
  calcCanvass(){
      if (this.showCanvas == "DA"){
          this.showCanvas = ""
      } else {
          console.log("ОТОБРАЖЕНИЕ КАНВАСА!")
          this.showCanvas = "DA"
          this.dispCanvas()
      }
  },
  dispCanvas() {
      console.log("ДИСПЛЕЙ КАНВАСА!")
      const canvas = document.getElementById('prewCanvas2');

      const ctx = canvas.getContext('2d');
      const img = new Image();
      const imageData = localStorage.getItem("start_image");
      img.onload = function () {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          console.log("canvasWidth", canvasWidth, "canvasHeight", canvasHeight)
          const imageWidth = img.width;
          const imageHeight = img.height;
          const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
          console.log("scale", scale)
          ctx.drawImage(img, 0, 0, imageWidth * scale, imageHeight * scale);
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (this.user == true) {
              const newImageData = this.applyMatrix(this.matrix, imageData2);
              ctx.putImageData(newImageData, 0, 0);
          }
          if (this.contrast == true) {
              const newImageData = this.increaseContrast(imageData2);
              ctx.putImageData(newImageData, 0, 0);
          }
          if (this.gauss == true){
              const blurredData = this.gaussianBlur(imageData2, 2); // Радиус размытия - 2

              ctx.putImageData(blurredData, 0, 0);
          }
      }.bind(this);

      img.src = imageData;
      // this.changePixelColors();
      },
  gaussianBlur(imageData, radius) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data.length);

  const tempData = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      tempData[index] = data[index];
      tempData[index + 1] = data[index + 1];
      tempData[index + 2] = data[index + 2];
      tempData[index + 3] = data[index + 3];
      }
  }

  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      let count = 0;
      const index = (y * width + x) * 4;

      for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
          const neighborY = Math.max(0, Math.min(height - 1, y + dy));
          const neighborX = Math.max(0, Math.min(width - 1, x + dx));
          const neighborIndex = (neighborY * width + neighborX) * 4;

          sumR += tempData[neighborIndex];
          sumG += tempData[neighborIndex + 1];
          sumB += tempData[neighborIndex + 2];
          sumA += tempData[neighborIndex + 3];
          count++;
          }
      }

      newData[index] = Math.round(sumR / count);
      newData[index + 1] = Math.round(sumG / count);
      newData[index + 2] = Math.round(sumB / count);
      newData[index + 3] = Math.round(sumA / count);
      }
  }

  for (let i = 0; i < data.length; i++) {
      data[i] = newData[i];
  }

  return imageData;
  },
  openModal() {
      this.isVisible = true;
  },
  closeModal() {
      this.isVisible = false;
      this.$emit('close');
  },
}
};
</script>

<style scoped>
.leftpart{
width: 200px;
display: flex;
flex-direction: column;
}
.modal-elem{
align-items: center;
justify-content: center;
display: flex;
margin-bottom: 10px;
}
.content {
display: flex;
flex-direction: row;

}
.check_blur{
width: 15px;
height: 15px;
}
.matrix input {
width: 50px;
}
input[type="text"] {
width: 30px;
}

input[type="range"] {
vertical-align: middle;
}
.modal {
width: 500px;
position: fixed;
/* right: 0; */
/* height: 400px; */
background: #FFFFFF;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
}
.tooltip {
position: relative;
display: inline-block;
cursor: pointer;
}
.info-block {
width: 250px;
min-height: 50px;
display: flex;
flex-direction: column;
}
/* #resizePercentageTitle{
width: 300px;
}
#resizePercentage{
width: 40px;
} */
.selects{
display: inline;
}
.buttons-wrapper {
display: flex;
flex-direction: row;
width: 250px;
}
.bottom-panel {
display: flex;
flex-direction: column;
}
.tooltip .tooltip-text {
visibility: hidden;
width: 120px;
background-color: #555;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px;
position: absolute;
z-index: 1;
bottom: 125%;
left: 50%;
margin-left: -60px;
opacity: 0;
transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
visibility: visible;
opacity: 1;
}
.close{
text-align: right;
margin-right: 5px;
}
.apply{
margin-bottom: 10px;
margin-left: 10px;
}
</style>
