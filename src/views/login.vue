<template>
  <div class="body">
    <div class="shell">
      <div class="container a-container" id="a-container">
        <form action method class="form" id="a-form">
          <h2 class="form_title title">创建账号</h2>
          <span class="form_span"></span>
          <input
            type="text"
            class="form_input"
            placeholder="用户名"
            v-model.trim="regsionForm.username"
          />
          <input
            type="text"
            class="form_input"
            placeholder="密码"
            v-model.trim="regsionForm.password"
          />
          <input
            type="text"
            class="form_input"
            placeholder="手机号"
            v-model.trim="regsionForm.phone"
          />
          <button
            class="form_button button submit"
            @click.prevent="handlerRegsion"
          >
            注册
          </button>
        </form>
      </div>

      <div class="container b-container" id="b-container">
        <form class="form" id="b-form">
          <h2 class="form_title title">登入账号</h2>
          <input
            type="text"
            class="form_input"
            placeholder="用户名"
            v-model.trim="loginFormData.username"
          />
          <input
            type="text"
            class="form_input"
            placeholder="密码"
            v-model.trim="loginFormData.password"
          />
          <button
            class="form_button button submit"
            @click.prevent="handleLogin"
          >
            登录
          </button>
        </form>
      </div>

      <div class="switch" id="switch-cnt">
        <div class="switch_circle"></div>
        <div class="switch_circle switch_circle-t"></div>
        <div class="switch_container" id="switch-c1">
          <h2 class="switch_title title" style="letter-spacing: 0">
            Welcome Back！
          </h2>
          <p class="switch_description description">
            已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
          </p>
          <button class="switch_button button switch-btn">登录</button>
        </div>

        <div class="switch_container is-hidden" id="switch-c2">
          <h2 class="switch_title title" style="letter-spacing: 0">
            Hello Friend！
          </h2>
          <p class="switch_description description">
            去注册一个账号，让我们踏入奇妙的旅途！
          </p>
          <button class="switch_button button switch-btn">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userLogin, RegisterApi } from "@/api/route";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const switchCtn = ref(null);
const switchC1 = ref(null);
const switchC2 = ref(null);
const switchCircle = ref([]);
const switchBtn = ref([]);
const aContainer = ref(null);
const bContainer = ref(null);
const allButtons = ref([]);

const getButtons = (e) => e.preventDefault();
const changeForm = (e) => {
  switchCtn.value.classList.add("is-gx");
  setTimeout(function () {
    switchCtn.value.classList.remove("is-gx");
  }, 1500);
  switchCtn.value.classList.toggle("is-txr");
  switchCircle.value[0].classList.toggle("is-txr");
  switchCircle.value[1].classList.toggle("is-txr");

  switchC1.value.classList.toggle("is-hidden");
  switchC2.value.classList.toggle("is-hidden");
  aContainer.value.classList.toggle("is-txl");
  bContainer.value.classList.toggle("is-txl");
  bContainer.value.classList.toggle("is-z");
};

const shell = () => {
  for (var i = 0; i < allButtons.value.length; i++)
    allButtons.value[i].addEventListener("click", getButtons);
  for (var i = 0; i < switchBtn.value.length; i++)
    switchBtn.value[i].addEventListener("click", changeForm);
};

onMounted(() => {
  console.log("走这里");
  switchCtn.value = document.querySelector("#switch-cnt");
  switchC1.value = document.querySelector("#switch-c1");
  switchC2.value = document.querySelector("#switch-c2");
  switchCircle.value = document.querySelectorAll(".switch_circle");
  switchBtn.value = document.querySelectorAll(".switch-btn");
  aContainer.value = document.querySelector("#a-container");
  bContainer.value = document.querySelector("#b-container");
  allButtons.value = document.querySelectorAll(".submit");

  shell();
  if (localStorage.getItem("refreshOnLogin") === "true") {
    // 移除标志，防止重复刷新
    localStorage.setItem("refreshOnLogin", "false");
    // 刷新页面
    window.location.reload();
  }
});
const regsionForm = ref({
  username: "",
  password: "",
  phone: "",
  confirmPass: "",
});
const loginFormData = ref({
  username: "user",
  password: "123456",
});
const handleLogin = async () => {
  const res = await userLogin(loginFormData.value);
  localStorage.setItem("userInfo", JSON.stringify(loginFormData.value));
  localStorage.setItem("id", JSON.stringify(res.id));
  ElMessage({
    message: "登录成功",
    type: "success",
  });
  router.push({
    path: "/view/waterTable",
  });
};
const handlerRegsion = async () => {
  if (
    !regsionForm.value.username ||
    !regsionForm.value.password ||
    !regsionForm.value.phone
  ) {
    ElMessage({
      message: "请完善信息",
      type: "warning",
    });
    return false;
  }
  const res = await RegisterApi(regsionForm.value);
  console.log(res);
  ElMessage({
    message: "注册成功",
    type: "success",
  });
};
</script>

<style lang="less" scoped>
.shell {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .shell {
    transform: scale(0.7);
  }
}

@media (max-width: 1000px) {
  .shell {
    transform: scale(0.6);
  }
}

@media (max-width: 800px) {
  .shell {
    transform: scale(0.5);
  }
}

@media (max-width: 600px) {
  .shell {
    transform: scale(0.4);
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;
  background-color: #ecf0f3;
  transition: 1.25s;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.iconfont {
  margin: 0 5px;
  border: rgba(0, 0, 0, 0.5) 2px solid;
  border-radius: 50%;
  font-size: 25px;
  padding: 3px;
  opacity: 0.5;
  transition: 0.1s;
}

.iconfont:hover {
  opacity: 1;
  transition: 0.15s;
  cursor: pointer;
}

.form_input {
  width: 350px;
  height: 40px;
  margin: 4px 0;
  padding-left: 25px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.form_input:focus {
  box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
}

.form_span {
  margin-top: 30px;
  margin-bottom: 12px;
}

.form_link {
  color: #181818;
  font-size: 15px;
  margin-top: 25px;
  border-bottom: 1px solid #a0a5a8;
  line-height: 2;
}

.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: #181818;
  letter-spacing: 10px;
}

.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}

.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
  border: none;
  outline: none;
}

.a-container {
  z-index: 100;
  left: calc(100% - 600px);
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}

.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;
  padding: 50px;
  z-index: 200;
  transition: 1.25s;
  background-color: #ecf0f3;
  overflow: hidden;
  box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #d1d9e6;
}

.switch_circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
  bottom: -60%;
  left: -60%;
  transition: 1.25s;
}

.switch_circle-t {
  top: -30%;
  left: 60%;
  width: 300px;
  height: 300px;
}

.switch_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 400px;
  padding: 50px 55px;
  transition: 1.25s;
}

.switch_button {
  cursor: pointer;
}

.switch_button:hover,
.submit:hover {
  box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
  transform: scale(0.985);
  transition: 0.25s;
}

.switch_button:active,
.switch_button:focus {
  box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
  transform: scale(0.97);
  transition: 0.25s;
}

.is-txr {
  left: calc(100% - 500px);
  transition: 1.25s;
  transform-origin: left;
}

.is-txl {
  left: 0;
  transition: 1.25s;
  transform-origin: right;
}

.is-z {
  z-index: 200;
  transition: 1.25s;
}

.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: 1.25s;
}

.is-gx {
  animation: is-gx 1.25s;
}

@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 400px;
  }

  30%,
  50% {
    width: 500px;
  }
}
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
}
</style>
