<template>
    <div class="modal-backdrop">
        <div class="modal">
        <section class="modal-body">
            <slot name="body">
                <label for="imageInput">Изменить файл:</label>
                <input type="file" id="imageInput" ref="fileInput" @change="handleFileInputChange">
                <label for="urlInput">Или укажите URL:</label>
                <input type="text" id="urlInput" v-model="imageUrl">
            </slot>
        </section>
        <footer class="modal-footer">
            <slot name="footer">
                <button class="btn-green" @click="handleSubmit">Отправить</button>
                <button
                type="button"
                class="btn-green"
                @click="close"
                >
                Закрыть
            </button>
            </slot>
        </footer>
        </div>
    </div>
  </template>
  
  <script>
    export default {
        name: 'modalAddFile',
        data() {
            return {
                imageUrl: '',
                file: null
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            handleFileInputChange(event) {
                this.file = event.target.files[0];
            },
            handleSubmit() {
                if (this.imageUrl.trim() !== '') {
                    localStorage.setItem("start_image", this.imageUrl);
                    this.navigateToRedactorPage();
                } else if (this.file !== null) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                    localStorage.setItem("start_image", e.target.result);
                        this.navigateToRedactorPage();
                    };
                    reader.readAsDataURL(this.file);
                } else {
                    alert('Пожалуйста, выберите изображение или укажите URL');
                }
            },
            navigateToRedactorPage() {
                console.log("ГДЕ ПУШ?")
                location.reload();
                // this.$router.push('/redactor');
            }
        },
    };
  </script>
  
  <style>
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
        background: #FFFFFF;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }
  
    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }
  
    .modal-header {
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }
  
    .modal-footer {
        border-top: 1px solid #eeeeee;
        justify-content: flex-end;
    }
  
    .modal-body {
        position: relative;
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
  
    .btn-close {
        border: none;
        font-size: 20px;
        padding: 20px;
        cursor: pointer;
        font-weight: bold;
        color: #4AAE9B;
        background: transparent;
    }
  
    .btn-green {
        color: white;
        background: #4AAE9B;
        border: 1px solid #4AAE9B;
        border-radius: 2px;
        margin-right: 10px;
    }
  </style>
  
  