<template>
  <div class="modal" id="modal" v-show="isVisible">
      <span class="close" @click="closeModal">&times;</span>
      Пипетка
      <div class="modal-elem">
          <div class="content">
              <div class="left_part info-block">
                  <div class="bottom-panel">
                      <p class="top-panel-text">Выбранный пиксель:</p>
                      <p class="top-panel-text">Цвет: {{ lastClickedColor }}</p>
                      <div class="color" ref="color"></div>
                      <p class="top-panel-text">Координаты(x,y): {{ lastClickedCoordinates }}</p>
                      <p class="top-panel-text">RGB: {{ lastClickedColor }}</p>
                      <p class="top-panel-text">XYZ: {{ XYZ }}</p>
                      <p class="top-panel-text">Lab: {{ Lab }}</p>
                  </div>
              </div>
              <div class="right_part info-block">
                  <div class="bottom-panel">
                      <p class="top-panel-text">Выбранный пиксель:</p>
                      <p class="top-panel-text">Цвет: {{ lastClickedColor2 }}</p>
                      <div class="color" ref="color2"></div>
                      <p class="top-panel-text">Координаты(x,y): {{ lastClickedCoordinates2 }}</p>
                      <p class="top-panel-text">RGB: {{ lastClickedColor2 }}</p>
                      <p class="top-panel-text">XYZ: {{ XYZ2 }}</p>
                      <p class="top-panel-text">Lab: {{ Lab2 }}</p>
                  </div>
              </div>
          </div>
      </div>
      <div>
          <p id="contrast">Контраст:{{ contrastRatio }}</p> 
      </div>
      <div class="tooltip-text" v-show="tooltipVisible">Алгоритм ближайшего соседа выбирает значение из ближайшего пикселя к исходным координатам.</div>
      <div class="buttons-wrapper">
          <button class="apply" @click="closeModal">Закрыть окно.</button>
          <button class="apply" @click="moveModal">Переместить окно.</button>
      </div>
  </div>
</template>

<script>
const convert = require('color-convert');
export default {
name: 'pipetteModal',
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
  };
},
mounted() {
  this.saveParamsFor(2)
  this.saveParamsFor(1)
},
// computed: {
//     contrastRatio() {
//         if ((this.lastClickedColor != "") && (this.lastClickedColor2 != "")){
//             return this.calculateContrast(this.lastClickedColor, this.lastClickedColor2);
//         }
//         return "F"
//     },
// },
methods: {
  openModal() {
      this.isVisible = true;
  },
  saveParamsFor(type_to_get) {
      if (this.isVisible == true) {
          if (type_to_get == 2) {
              const color = this.$refs.color2;
              this.lastClickedCoordinates2 = localStorage.getItem("lastClickedCoordinates2");
              this.lastClickedColor2 = localStorage.getItem("lastClickedColor2");
              color.style.backgroundColor = this.lastClickedColor2;
              this.RBG2 = [Number(localStorage.getItem("XClicked2")), Number(localStorage.getItem("YClicked2")), Number(localStorage.getItem("ZClicked2"))]
              this.XYZ2 = this.rgbToLab(this.RBG2)
              this.Lab2 = this.rgbToLab(this.XYZ2)
              this.XYZ2 = `xys(${this.XYZ2[0]}, ${this.XYZ2[1]}, ${this.XYZ2[2]})`
              this.Lab2 = `lab(${this.Lab2[0]}, ${this.Lab2[1]}, ${this.Lab2[2]})`
              if ((this.lastClickedColor != "") && (this.lastClickedColor2 != "")){
                  this.contrastRatio = this.calculateContrast(this.RBG, this.RBG2);
                  let element = document.getElementById("contrast");
                  if (this.contrastRatio < 4.5) {
                      console.log("red")
                      element.style.color = "red";
                  } else {
                      element.style.color = "black"
                  }
                  
              }
          } else {
              const color = this.$refs.color;
              this.lastClickedCoordinates = localStorage.getItem("lastClickedCoordinates");
              this.lastClickedColor = localStorage.getItem("lastClickedColor");
              color.style.backgroundColor = this.lastClickedColor;
              this.RBG = [Number(localStorage.getItem("XClicked")), Number(localStorage.getItem("YClicked")), Number(localStorage.getItem("ZClicked"))]
              console.log("localStorage.getItem()",localStorage.getItem("XClicked"))
              console.log("this.RBG",this.RBG)
              console.log("AAAAAAAAAAAAAa")
              this.XYZ = this.rgbToLab(this.RBG)
              this.Lab = this.rgbToLab(this.XYZ)
              this.XYZ = `xys(${this.XYZ[0]}, ${this.XYZ[1]}, ${this.XYZ[2]})`
              this.Lab = `lab(${this.Lab[0]}, ${this.Lab[1]}, ${this.Lab[2]})`
              if ((this.lastClickedColor != "") && (this.lastClickedColor2 != "")){
                  this.contrastRatio = this.calculateContrast(this.RBG, this.RBG2);
                  let element = document.getElementById("contrast");
                  if (this.contrastRatio < 4.5) {
                      console.log("red")
                      element.style.color = "red";
                  } else {
                      element.style.color = "black"
                  }
              }
          }   
      }
  },
  calculateContrast(color1, color2) {
      const luminance1 = this.calculateLuminance(color1);
      const luminance2 =  this.calculateLuminance(color2);
      const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
      return contrast;
  },
  calculateLuminance(color) {
      const [r, g, b] = color;
      const linearR = r <= 10 ? r / 3294 : Math.pow((r / 255 + 0.055) / 1.055, 2.4);
      const linearG = g <= 10 ? g / 3294 : Math.pow((g / 255 + 0.055) / 1.055, 2.4);
      const linearB = b <= 10 ? b / 3294 : Math.pow((b / 255 + 0.055) / 1.055, 2.4);
      return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  },
  closeModal() {
      this.isVisible = false;
      this.$emit('close');
  },
  moveModal() {
      if (this.move == 1) {
          document.getElementById("modal").style.removeProperty("right")
          this.move = 0;
      }
      else{
          document.getElementById("modal").style.right = 0;
          this.move = 1;
      }
  },
  showTooltip() {
      this.tooltipVisible = true;
  },
  hideTooltip() {
      this.tooltipVisible = false;
  },
  rgbToLab(xyz) {
      const lab = convert.xyz.lab(xyz);
      return lab;
  },
  rgbToXyz(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
      const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

      return [x, y, z];
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


