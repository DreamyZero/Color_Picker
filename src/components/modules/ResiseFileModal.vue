<template>
  <div class="modal-backdrop" v-if="isVisible">
      <div class="modal">
          <span class="close" @click="closeModal">&times;</span>
          <div class="modal-elem">
              <p>Выберите способ изменения размера:</p>
              <select v-model="resizeMethod">
                  <option value="percentage">В процентах</option>
                  <option value="pixels">В пикселях</option>
              </select>
          </div>
          <div class="modal-elem" v-if="resizeMethod === 'percentage'">
              <p id="resizePercentageTitle">Укажите процентное изменение размера:</p>
              <input type="number" id="resizePercentage" v-model="resizePercentage" min="1">
          </div>
          <div class="modal-elem"  v-else-if="resizeMethod === 'pixels'">
              <div>
                  <p>Укажите новую ширину и высоту:</p>
                  Ширина:<input type="number" :value="newWidth" id="width"  @input="updateImageHeight()" min="1">
                  Высота:<input type="number" :value="newHeight" id="height"  @input="updateImageWidth()" min="1">
                  <div>
                      <input type="checkbox" v-model="maintainAspectRatio">Сохранить пропорции
                  </div>
              </div>
          </div>
          <div class="modal-elem">
              <p>Выберите алгоритм интерполяции:</p>
              <select v-model="interpolationAlgorithm">
                  <option value="nearestNeighbor">Ближайший сосед</option>
              </select>
              <span class="tooltip" @mouseenter="showTooltip" @mouseleave="hideTooltip">?</span>
          </div>
          <div class="tooltip-text" v-show="tooltipVisible">Алгоритм ближайшего соседа выбирает значение из ближайшего пикселя к исходным координатам.</div>
          <button class="apply" @click="applyChanges">Применить изменения</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'resiseFileModal',
  data() {
      return {
          isVisible: false,
          resizeMethod: 'percentage',
          resizePercentage: 100,
          newWidth: 0,
          newHeight: 0,
          maintainAspectRatio: true,
          interpolationAlgorithm: 'nearestNeighbor',
          imageData: 0,
          imageWidth: 1,
          imageHeight: 1,
          image:0,
          tooltipVisible: false,
          ratio:1,
      };
  },
  mounted() {
      this.loadImage();
  },
  computed: {
      resizingHeight() {
          return this.newWidth;
      },
      resizingWidth() {
          return this.newHeight;
      },
  },
  // this.ratio = this.imageHeight/this.imageWidth;
  // watch: {
  //     resizingWidth() {
  //         if (this.resizingHeight) {
  //             clearTimeout(this.widthTimeout);
  //             this.widthTimeout = setTimeout(() => {
  //                 this.updateImageWidth();
  //             }, 300);
  //         }
  //     },
  //     resizingHeight() {
  //         if (this.resizingHeight) {
  //             clearTimeout(this.widthTimeout);
  //             this.widthTimeout = setTimeout(() => {
  //                 this.updateImageHeight();
  //             }, 300);
  //         }
  //     },
  // },
  methods: {
      getValueFromInputById(id) {
          const inputElement = document.getElementById(id);
          if (inputElement) {
              return inputElement.value;
          } else {
              console.error("Input element with id " + id + " not found");
              return null;
          }
      },
      updateImageWidth() {
          // this.imageHeight = this.getValueFromInputById("height");
          this.newHeight = this.getValueFromInputById("height");
          if (!/^\d+$/.test(this.newHeight)) {
              return
          }
          if (this.maintainAspectRatio == false){
              // this.newWidth
              // this.newHeight
              console.log("new",this.imageHeight)
              return
          }
          this.imageHeight = this.getValueFromInputById("height");
          console.log("updateImageWidth",this.ratio,"this.imageWidth",this.imageHeight)
          // this.imageWidth = this.imageHeight / this.ratio;
          this.newWidth = this.newHeight / this.ratio;
          this.newHeight = this.getValueFromInputById("height");
          const widthInput = document.getElementById("width");
          if (widthInput) {
              widthInput.value = this.newWidth;
          }
          console.log(this.ratio,"this.imageWidth",this.imageWidth)
      },
      updateImageHeight() {
          
          // this.imageWidth = this.getValueFromInputById("width");
          this.newWidth = this.getValueFromInputById("width");
          if (!/^\d+$/.test(this.newHeight)) {
              return
          }
          if (this.maintainAspectRatio == false){
              
              console.log("new",this.imageWidth)
              return
          }
          console.log(this.ratio,"this.imageHeight",this.imageHeight)
          // this.imageWidth = this.getValueFromInputById("width");
          // this.imageHeight = Math.round(this.imageWidth * this.ratio);
          this.newHeight =  Math.round(this.newWidth * this.ratio);
          const heightInput = document.getElementById("height");
          if (heightInput) {
              console.log("НАйден",heightInput);
              document.getElementById("height").value = this.newHeight;
          }
          console.log(this.ratio,"this.imageHeight",this.imageHeight)
      },
      loadImage() {
          console.log("метод выполнинлся")
          this.imageData = localStorage.getItem("start_image");
          const image = new Image();
          image.onload = () => {
              this.newWidth = image.width;
              this.newHeight = image.height;
              this.imageWidth = image.width;
              this.imageHeight = image.height;
              this.ratio = this.imageHeight/this.imageWidth;
          };
          const imageData = localStorage.getItem("start_image");
          if (imageData) {
              image.src = imageData;
              this.image = image
          }
      },
      openModal() {
          this.isVisible = true;
      },
      closeModal() {
          this.isVisible = false;
          this.$emit('close');
      },
      applyChanges() {
          this.newWidth = this.newWidth * this.resizePercentage / 100;
          this.newHeight = this.newHeight * this.resizePercentage / 100;
          this.nearestNeighborScaling(this.newWidth, this.newHeight);
          // location.replace(document.URL);
          location.reload();
      },
      nearestNeighborScaling(newWidth, newHeight) {
          console.log("he1");
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          console.log("ha1");
          console.log("newWidth",newWidth,"newHeight",newHeight);
          canvas.width = newWidth;
          canvas.height = newHeight;
          for (let y = 0; y < newHeight; y++) {
              for (let x = 0; x < newWidth; x++) {
                  const srcX = Math.round(x * (this.imageWidth / newWidth));
                  const srcY = Math.round(y * (this.imageHeight / newHeight));
                  const pixel = this.getPixel(srcX, srcY);
                  ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
                  ctx.fillRect(x, y, 1, 1);
              }
          }
          var start_image = canvas.toDataURL('image/jpeg');
          localStorage.setItem("start_image", start_image);
          console.log("start_image",start_image);
      },
      getPixel(x, y) {
          console.log("he2");
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          console.log("ha2");
          canvas.width = 1;
          canvas.height = 1;
          ctx.drawImage(this.image, x, y, 1, 1, 0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          return { r: data[0], g: data[1], b: data[2] };
      },
      showTooltip() {
          this.tooltipVisible = true;
      },
      hideTooltip() {
          this.tooltipVisible = false;
      }
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
.modal-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
  }
.modal {
  width: 500px;
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
/* #resizePercentageTitle{
  width: 300px;
}
#resizePercentage{
  width: 40px;
} */
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
