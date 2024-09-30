<template>
    <div>
        <form @submit.prevent="handleSubmit">
        <label for="imageInput">Добавить файл:</label>
        <input type="file" id="imageInput" ref="fileInput" @change="handleFileInputChange">
        <label for="urlInput">Или укажите URL:</label>
        <input type="text" id="urlInput" v-model="imageUrl">
        <button type="submit">Отправить</button>
        </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
        return {
            imageUrl: '',
            file: null
      };
    },
    methods: {
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
            localStorage.setItem("isResisedCanWr", false);
            this.$router.push('/redactor');
        }
    }
};
  </script>
  
  <style>
  form {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 4px solid black;
        border-radius: 5px;
        color: black;
    }
    label {
        margin-bottom: 10px;
    }
    input {
        width: 150px;
        height: 30px;
        margin-bottom: 10px;
    }
    button {
        margin-top: 50px;
        width: 150px;
        height: 50px;
        border-radius: 10px;
        border-width: 3px;
        border-color: black;
        background-color: red;
    }
  </style>
  