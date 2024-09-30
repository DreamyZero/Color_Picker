<template>
  <div class="modal" id="modal" v-show="isVisible">
      <span class="close" @click="closeModal">&times;</span>
      Изменение яркости
      <div class="modal-elem">
          <div class="content">
              <div class="buttons-w">
                  <div class="can-w">
                      <canvas id="myCanvas" width="255" height="255"></canvas>
                  </div>
                  <div class="colors-w">
                      <div id="redCube" @click="setGraf('redCube')"></div>
                      <div id="greenCube" @click="setGraf('greenCube')"></div>
                      <div id="blueCube" @click="setGraf('blueCube')"></div>
                  </div>
                  <div id="red">
                      Коорд1 (x1, y1): <input type="text" id="x1" value="20" max="255"> <input type="text" id="y1" value="50"  max="255"> <br/>
                      Коорд2 (x2, y2): <input type="text" id="x2" value="40"  max="255"> <input type="text" id="y2" value="80"  max="255">
                  </div>
                  Предпросмотр:<input type="checkbox" @click="calcCanvas"> <br/>
                  <button @click="drawGraphs" >Отрисовать графики</button>
              </div>
              
          </div>
          <div class="canvas_wrapper" v-show="showCanvas == 'DA'">
              <canvas id="prewCanvas"></canvas>
              <canvas id="cn" v-show="showCanvas == 'A'"></canvas>
          </div>
      </div>
      <div class="buttons-wrapper">
          <button class="btn-green" @click="handleSubmitt">Отправить</button>
          <button class="apply" @click="closeModal">Закрыть окно.</button>
      </div>
  </div>
</template>

<script>
export default {
name: 'brightnessModal',
data() {
  return {
      isVisible: false,
      move: 0,
      lastClickedColor: "",
      lastClickedCoordinates: "",
      lastClickedColor2: "",
      lastClickedCoordinates2: "",
      RBG:"",
      RBG2:"",
      XYZ:"",
      XYZ2:"",
      Lab:"",
      Lab2:"",
      contrastRatio:"",
      graf:"red",
      x1R:"",
      y1R:"",
      x2R:"",
      y2R:"",
      x1G:"",
      y1G:"",
      x2G:"",
      y2G:"",
      x1B:"",
      y1B:"",
      x2B:"",
      y2B:"",
      aR:"",
      bR:"",
      aG:"",
      bG:"",
      aB:"",
      bB:"",
      showCanvas:"",
  };
},
methods: {
  handleSubmitt(){
      console.log("SHTO?")
      const imageData = localStorage.getItem("start_image");
      // console.log("imageData2",imageData2)
      const canvas = document.getElementById('prewCanvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      console.log("А сюда?",canvas.width)
      img.onload = function() {
          console.log("img.width",img.width)
          canvas.width = img.width
          canvas.height = img.height
          const imageWidth = img.width;
          const imageHeight = img.height;

          // Масштабируем и рисуем изображение
          ctx.drawImage(img, 0, 0, imageWidth, imageHeight );
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Я сюда попал?",canvas.width)
          console.log("canvas.width",canvas.width)
          const data = imageData2.data;
          let mass
          function calcAB(x1,x2,y1,y2){
              let a = (y1-y2)/(x1-x2)
              let b = y2 - a*x2
              return [a, b]
          }
          console.log("this.x1R",this.x1R)
          mass = calcAB(this.x1R,this.x2R,this.y1R,this.y2R)
          console.log("mass",mass)
          this.aR = mass[0]
          this.bR = mass[1]
          mass = calcAB(this.x1G,this.x2G,this.y1G,this.y2G)
          console.log("mass",mass)
          this.aG = mass[0]
          this.bG = mass[1]
          mass = calcAB(this.x1B,this.x2B,this.y1B,this.y2B)
          console.log("mass",mass)
          this.aB = mass[0]
          this.bB = mass[1]
          for (let i = 0; i < data.length; i += 4) {
              let red = data[i];
              if (red <= this.x1R) {
                  red = this.y1R
              }
              if ((red > this.x1R) && (red < this.x2R)){
                  red = this.aR*red - this.bR
              }
              if (red >= this.x2R) {
                  red = this.y2R
              }
              let green = data[i + 1];
              if (green <= this.x1R) {
                  green = this.y1R
              }
              if ((green > this.x1G) && (green < this.x2G)){
                  green = this.aG*green - this.bG
              }
              if (green >= this.x2G) {
                  green = this.y2G
              }
              let blue = data[i + 2];
              if (blue <= this.x1R) {
                  blue = this.y1R
              }
              if ((blue > this.x1B) && (blue < this.x2B)){
                  blue = this.aB*blue - this.bB
              }
              if (blue >= this.x2B) {
                  blue = this.y2B
              }
              // Изменяем значения RGB (в этом примере инвертируем цвета)
              data[i] = red;
              data[i + 1] = green;
              data[i + 2] = blue;
          }
          ctx.putImageData(imageData2, 0, 0);
          let start_image = canvas.toDataURL('image/jpeg');
          localStorage.setItem("start_image", start_image);
          
      }.bind(this, this.x1R, this.x2R, this.y1R, this.y2R, this.x1G, this.x2G, this.y1G, this.y2G, this.x1B, this.x2B, this.y1B, this.y2B);

          // Загружаем изображение
      
      img.src = imageData;
      // this.changePixelColors();
      location.reload();
  },
  calcCanvas(){
      if (this.showCanvas == "DA"){
          this.showCanvas = ""
      } else {
          this.showCanvas = "DA"
          this.dispCanvas()
      }
  },
  dispCanvas(){
      const canvas = document.getElementById('prewCanvas');

      const ctx = canvas.getContext('2d');
      const img = new Image();
      const imageData = localStorage.getItem("start_image");
      img.onload = function() {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const imageWidth = img.width;
          const imageHeight = img.height;
          const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
          
          // Масштабируем и рисуем изображение
          ctx.drawImage(img, 0, 0, imageWidth * scale, imageHeight * scale);
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData2.data;
          let mass
          function calcAB(x1,x2,y1,y2){
              let a = (y1-y2)/(x1-x2)
              let b = y2 - a*x2
              return [a, b]
          }
          console.log("this.x1R",this.x1R)
          mass = calcAB(this.x1R,this.x2R,this.y1R,this.y2R)
          console.log("mass",mass)
          this.aR = mass[0]
          this.bR = mass[1]
          mass = calcAB(this.x1G,this.x2G,this.y1G,this.y2G)
          console.log("mass",mass)
          this.aG = mass[0]
          this.bG = mass[1]
          mass = calcAB(this.x1B,this.x2B,this.y1B,this.y2B)
          console.log("mass",mass)
          this.aB = mass[0]
          this.bB = mass[1]
          for (let i = 0; i < data.length; i += 4) {
              let red = data[i];
              if (red <= this.x1R) {
                  red = this.y1R
              }
              if ((red > this.x1R) && (red < this.x2R)){
                  red = this.aR*red - this.bR
              }
              if (red >= this.x2R) {
                  red = this.y2R
              }
              let green = data[i + 1];
              if (green <= this.x1R) {
                  green = this.y1R
              }
              if ((green > this.x1G) && (green < this.x2G)){
                  green = this.aG*green - this.bG
              }
              if (green >= this.x2G) {
                  green = this.y2G
              }
              let blue = data[i + 2];
              if (blue <= this.x1R) {
                  blue = this.y1R
              }
              if ((blue > this.x1B) && (blue < this.x2B)){
                  blue = this.aB*blue - this.bB
              }
              if (blue >= this.x2B) {
                  blue = this.y2B
              }
              // Изменяем значения RGB (в этом примере инвертируем цвета)
              data[i] = red;
              data[i + 1] = green;
              data[i + 2] = blue;
          }
          ctx.putImageData(imageData2, 0, 0);
}.bind(this, this.x1R, this.x2R, this.y1R, this.y2R, this.x1G, this.x2G, this.y1G, this.y2G, this.x1B, this.x2B, this.y1B, this.y2B);

      // Загружаем изображение
  
  img.src = imageData;
  // this.changePixelColors();
  },
  setGraf(color){
      if (color == "blueCube") {
          this.graf = "blue"
      }
      if (color == "redCube") {
          this.graf = "red"
      }
      if (color == "greenCube") {
          this.graf = "green"
      }
      document.getElementById("blueCube").classList.remove('selected')
      document.getElementById("redCube").classList.remove('selected')
      document.getElementById("greenCube").classList.remove('selected')
      console.log("color",color)
      document.getElementById(color).classList.add('selected')
  },
  drawGraphs() {
      const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext("2d");
      const x1 = parseInt(document.getElementById("x1").value);
      console.log("x1",x1)
      const y1 = canvas.height - parseInt(document.getElementById("y1").value);
      const x2 = parseInt(document.getElementById("x2").value);
      const y2 = canvas.height - parseInt(document.getElementById("y2").value);
      if (this.graf == "red") {
          console.log("x1R",x1)
          this.x1R = x1;
          console.log("this.x1R",this.x1R)
          this.y1R = y1;
          this.x2R = x2;
          this.y2R = y2;
          ctx.strokeStyle = "red";
      }
      if (this.graf == "green") {
          this.x1G = x1;
          this.y1G = y1;
          this.x2G = x2;
          this.y2G = y2;
          ctx.strokeStyle = "green";
      }
      if (this.graf == "blue") {
          this.x1B = x1;
          this.y1B = y1;
          this.x2B = x2;
          this.y2B = y2;
          ctx.strokeStyle = "blue";
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Красная прямая линия под углом 45° из точки (0, 0)
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width, 0);
      
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Рисуем отрезки
      ctx.beginPath();
      ctx.moveTo(0, y1);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(canvas.width, y2);
      ctx.stroke();
  },
  openModal() {
      this.isVisible = true;
  },
  closeModal() {
      this.isVisible = false;
      this.$emit('close');
  },
  moveModal() {
      console.log("МУВАЙ!")
      if (this.move == 1) {
          document.getElementById("modal").style.removeProperty("right")
          this.move = 0;
      }
      else{
          document.getElementById("modal").style.right = 0;
          this.move = 1;
      }
  },
}
};
</script>

<style scoped>
.modal-elem{
align-items: center;
justify-content: center;
display: flex;
margin-bottom: 10px;
}
/* .modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
} */
.content {
display: flex;
flex-direction: row;
}
.modal {
overflow: scroll;
max-height: 90%;
/* width: 500px; */
position: fixed;
/* right: 0; */
/* height: 400px; */
background: #FFFFFF;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
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
.buttons-wrapper {
display: flex;
flex-direction: row;
width: 250px;
}
.bottom-panel {
display: flex;
flex-direction: column;
}
.close{
text-align: right;
margin-right: 5px;
}
.apply{
margin-bottom: 10px;
margin-left: 10px;
}
#myCanvas{
width: 255px;
height: 255px;
border: 2px black solid;
margin: 0 auto;
}
.can-w{
text-align: center;
}
#redCube{
color: red;
background: red;
width: 10px;
height: 10px;
}
#greenCube{
color: green;
background: green;
width: 10px;
height: 10px;
}
#blueCube{
color: blue;
background: blue;
width: 10px;
height: 10px;
}
.colors-w{
display: flex;
flex-direction: row;
grid-gap:20px;
justify-content: center;
margin-bottom: 10px;
}
.selected{
width: 20px !important; 
height: 20px !important;
border: 2px black !important;
}
#prewCanvas{
margin-left: 10px;
}
</style>

