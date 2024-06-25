<template>
  <div class="table-container">
    <div>
      <el-descriptions title="水质信息" border :span="2" v-if="showInfo">
        <el-descriptions-item label="站点名称">{{
          waterInfo.observationPointName
        }}</el-descriptions-item>
        <el-descriptions-item label="水质等级">{{
          waterInfo.qualityLevel
        }}</el-descriptions-item>
        <el-descriptions-item label="透明度">{{
          waterInfo.clarity.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="电导率">{{
          waterInfo.conductivity.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="氟含量">{{
          waterInfo.fluoride.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="ph值">{{
          waterInfo.pH.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="颗粒大小">{{
          waterInfo.particleSize.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="温度">{{
          waterInfo.temperature.toFixed(2)
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="report-div">
      <el-card style="width: 680px">
        <div v-html="reportInfo" class="card-report"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getWaterDetail } from "@/api/route";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
const route = useRoute();
const waterInfo = ref({});
const showInfo = ref(false);
const reportInfo = ref([]);
const getWaterDetailData = (id) => {
  getWaterDetail(id).then((res) => {
    console.log(res);
    waterInfo.value = res[0];
    console.log(waterInfo.value, "waterinfgo");
    showInfo.value = true;
    reportInfo.value = generateWaterQualityReport(waterInfo.value);
  });
};
if (route.query.id) {
  getWaterDetailData(route.query.id);
}

function generateWaterQualityReport(data) {
  const report = [];

  report.push(`<p><strong>站点名称:</strong> ${data.observationPointName}</p>`);
  report.push(
    `<p><strong>水质等级:</strong> <span class="${getQualityClass(
      data.qualityLevel
    )}">${data.qualityLevel}</span></p>`
  );

  // 解析透明度
  report.push(
    `<p><strong>透明度:</strong> <span class="${getTransparencyClass(
      data.clarity
    )}">${data.clarity.toFixed(2)} cm</span></p>`
  );
  if (data.clarity < 10) {
    report.push(`<p>透明度较低，可能存在悬浮物或污染物。</p>`);
  } else {
    report.push(`<p>透明度较高，水质较为清澈。</p>`);
  }

  // 解析电导率
  report.push(
    `<p><strong>电导率:</strong> <span class="${getConductivityClass(
      data.conductivity
    )}">${data.conductivity.toFixed(2)} µS/cm</span></p>`
  );
  if (data.conductivity > 1000) {
    report.push(`<p>电导率较高，可能存在较多溶解性物质。</p>`);
  } else {
    report.push(`<p>电导率正常。</p>`);
  }

  // 解析氟含量
  report.push(
    `<p><strong>氟含量:</strong> <span class="${getFluorideClass(
      data.fluoride
    )}">${data.fluoride.toFixed(2)} mg/L</span></p>`
  );
  if (data.fluoride > 1.5) {
    report.push(`<p>氟含量偏高，可能对健康有害。</p>`);
  } else {
    report.push(`<p>氟含量在安全范围内。</p>`);
  }

  // 解析pH值
  report.push(
    `<p><strong>pH值:</strong> <span class="${getPhClass(
      data.pH
    )}">${data.pH.toFixed(2)}</span></p>`
  );
  if (data.pH < 6.5) {
    report.push(`<p>pH值偏低，水体偏酸性。</p>`);
  } else if (data.pH > 8.5) {
    report.push(`<p>pH值偏高，水体偏碱性。</p>`);
  } else {
    report.push(`<p>pH值正常。</p>`);
  }

  // 解析颗粒大小
  report.push(
    `<p><strong>颗粒大小:</strong> <span class="${getParticleSizeClass(
      data.particleSize
    )}">${data.particleSize.toFixed(2)} µm</span></p>`
  );
  if (data.particleSize > 100) {
    report.push(`<p>颗粒较大，可能影响水质。</p>`);
  } else {
    report.push(`<p>颗粒大小正常。</p>`);
  }

  // 解析温度
  report.push(
    `<p><strong>温度:</strong> <span class="${getTemperatureClass(
      data.temperature
    )}">${data.temperature.toFixed(2)} °C</span></p>`
  );
  if (data.temperature < 10) {
    report.push(`<p>水温较低。</p>`);
  } else if (data.temperature > 30) {
    report.push(`<p>水温较高。</p>`);
  } else {
    report.push(`<p>水温正常。</p>`);
  }

  // 生成评语
  const overallEvaluation = [];
  if (data.quality === "差" || data.quality === "劣") {
    overallEvaluation.push("水质较差，需要采取改善措施。");
  } else {
    overallEvaluation.push("水质良好，无需特别处理。");
  }
  report.push(`<p><strong>评语:</strong> ${overallEvaluation.join(" ")}</p>`);

  return report.join("");
}
function getQualityClass(quality) {
  switch (quality) {
    case "优":
      return "quality-excellent";
    case "良":
      return "quality-good";
    case "中":
      return "quality-average";
    case "差":
      return "quality-poor";
    case "劣":
      return "quality-bad";
    default:
      return "";
  }
}
function getTransparencyClass(clarity) {
  return clarity < 10 ? "value-low" : "value-normal";
}
function getConductivityClass(conductivity) {
  return conductivity > 1000 ? "value-high" : "value-normal";
}
function getFluorideClass(fluoride) {
  return fluoride > 1.5 ? "value-high" : "value-normal";
}
function getPhClass(pH) {
  return pH < 6.5 || pH > 8.5 ? "value-abnormal" : "value-normal";
}
function getParticleSizeClass(particleSize) {
  return particleSize > 100 ? "value-high" : "value-normal";
}
function getTemperatureClass(temperature) {
  return temperature < 10 || temperature > 30
    ? "value-abnormal"
    : "value-normal";
}
</script>

<style lang="less">
.table-container {
  height: calc(100vh - 200px);
}
.pagination {
  display: flex;
  justify-content: center;
}
h1 {
  margin-bottom: 20px;
}
p {
  margin: 5px 0;
}
.quality-excellent {
  color: green;
}
.quality-good {
  color: limegreen;
}
.quality-average {
  color: orange;
}
.quality-poor {
  color: red;
}
.quality-bad {
  color: darkred;
}
.value-low {
  color: red;
}
.value-normal {
  color: green;
}
.value-high {
  color: orange;
}
.value-abnormal {
  color: red;
}
.report-div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
