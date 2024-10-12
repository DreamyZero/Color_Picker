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
        <input type="number" id="resizePercentage" v-model="resizePercentage" min="1" />
      </div>
      <div class="modal-elem" v-else-if="resizeMethod === 'pixels'">
        <div>
          <p>Укажите новую ширину и высоту:</p>
          Ширина:<input type="number" v-model.number="newWidth" @input="updateImageHeight()" min="1" />
          Высота:<input type="number" v-model.number="newHeight" @input="updateImageWidth()" min="1" />
          <div>
            <input type="checkbox" v-model="maintainAspectRatio" />Сохранить пропорции
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
      <div class="tooltip-text" v-show="tooltipVisible">
        Алгоритм ближайшего соседа выбирает значение из ближайшего пикселя к исходным координатам.
      </div>
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
    image: null,
    tooltipVisible: false,
    ratio: 1,
    sharedCanvasCtx: null, // общий контекст для работы с изображениями
  };
},
mounted() {
  this.loadImage();
},
methods: {
  loadImage() {
    const imageData = localStorage.getItem("start_image");
    if (imageData) {
      this.image = new Image();
      this.image.src = imageData;
      this.image.onload = () => {
        this.newWidth = this.image.width;
        this.newHeight = this.image.height;
        this.ratio = this.newHeight / this.newWidth;
        console.log(`Image loaded: width=${this.newWidth}, height=${this.newHeight}`);
      };
      this.image.onerror = () => {
        console.error("Ошибка загрузки изображения.");
      };
    } else {
      console.error("Изображение не найдено в localStorage.");
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
    if (!this.image) {
      console.error("Изображение не загружено.");
      return;
    }

    const scaleFactor = this.resizeMethod === 'percentage' ? this.resizePercentage / 100 : 1;
    const targetWidth = Math.round(this.newWidth * scaleFactor);
    const targetHeight = Math.round(this.newHeight * scaleFactor);

    console.log(`Applying changes: targetWidth=${targetWidth}, targetHeight=${targetHeight}`);
    this.nearestNeighborScaling(targetWidth, targetHeight);
  },
  nearestNeighborScaling(newWidth, newHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const processRow = (y) => {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.round(x * (this.image.width / newWidth));
        const srcY = Math.round(y * (this.image.height / newHeight));
        const pixel = this.getPixel(srcX, srcY);
        ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // После завершения текущей строки продолжаем обработку следующей строки
      if (y < newHeight - 1) {
        requestAnimationFrame(() => processRow(y + 1)); // Асинхронная обработка для следующих строк
      } else {
        const startImage = canvas.toDataURL('image/jpeg');
        localStorage.setItem("start_image", startImage);
        console.log("Image resized and saved to localStorage.");
      }
    };

    processRow(0); // Начинаем обработку с первой строки
  },
  getPixel(x, y) {
    if (!this.sharedCanvasCtx) {
    const canvas = document.createElement('canvas');
   canvas.width = this.image.width;
    canvas.height = this.image.height;
    this.sharedCanvasCtx = canvas.getContext('2d', { willReadFrequently: true });
    this.sharedCanvasCtx.drawImage(this.image, 0, 0);
}

// Чтение пикселя
  const data = this.sharedCanvasCtx.getImageData(x, y, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2] };
},
  showTooltip() {
    this.tooltipVisible = true;
  },
  hideTooltip() {
    this.tooltipVisible = false;
  },
  updateImageWidth() {
    if (this.maintainAspectRatio) {
      this.newHeight = Math.round(this.newWidth * this.ratio);
    }
  },
  updateImageHeight() {
    if (this.maintainAspectRatio) {
      this.newWidth = Math.round(this.newHeight / this.ratio);
    }
  },
},
};
</script>

<style scoped>
.modal-elem {
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
.close {
  text-align: right;
  margin-right: 5px;
}
.apply {
  margin-bottom: 10px;
  margin-left: 10px;
}
</style>

