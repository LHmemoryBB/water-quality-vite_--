<template>
  <div class="table-container">
    <el-container>
      <el-header>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="观测点名称：">
            <el-input
              v-model="formInline.observationName"
              placeholder="请输入观测点"
              clearable
            />
          </el-form-item>
          <el-form-item label="时间范围：">
            <el-date-picker
              v-model="formInline.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="height: calc(100vh - 200px)"
        ><el-table :data="tableData" border style="width: 100%; height: 100%">
          <el-table-column prop="observationPointName" label="站点名称" />
          <el-table-column prop="clarity" label="透明度" />
          <el-table-column prop="pH" label="酸碱度" />
          <el-table-column prop="bacteria" label="细菌含量" />
          <el-table-column prop="fluoride" label="氟含量" />
          <el-table-column prop="particleSize" label="颗粒大小" />
          <el-table-column prop="conductivity" label="导电率" />
          <el-table-column prop="temperature" label="温度" />
          <el-table-column prop="qualityLevel" label="水质等级" />
          <el-table-column prop="createdAt" label="记录时间" />
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button type="primary" @click="handleClick(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table></el-main
      >

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="50"
          :total="totalNum"
          @current-change="currentChange"
        />
      </div>
    </el-container>
  </div>
</template>

<script setup>
import { ref,onMounted, onUnmounted } from "vue";
import { getWaterQuality } from "@/api/route";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import dayjs from "dayjs";
const router = useRouter();
const tableData = ref([]);
const currentPage4 = ref(1);
const pageSize4 = ref(1);
const formInline = ref({
  observationName: "",
  timeRange: [],
});
const totalNum = ref(0);
const pageNum = ref(1);

const handleClick = (row) => {
  console.log(row);
  router.push({
    path: "/view/waterDetail",
    query: {
      id: row.id,
    },
  });
};

const getTableData = async (type) => {
  const newForm1 = {};
  if (formInline.value.timeRange?.length > 0) {
    formInline.value.startTime = dayjs(formInline.value.timeRange[0]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    formInline.value.endTime = dayjs(formInline.value.timeRange[1]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  }
  console.log(formInline.value);
  const { timeRange, ...newForm } = formInline.value;
  const param = {
    pageNum: pageNum.value,
    pageSize: 50,
    ...newForm,
  };
  const res = await getWaterQuality(param);
  totalNum.value = res.total;
  tableData.value = res.records.map((item) => ({
    ...item,
    clarity: parseFloat(item.clarity.toFixed(2)),
    particleSize: parseFloat(item.particleSize.toFixed(2)),
    conductivity: parseFloat(item.conductivity.toFixed(2)),
    temperature: parseFloat(item.temperature.toFixed(2)),
    bacteria: parseFloat(item.bacteria.toFixed(2)),
    fluoride: parseFloat(item.fluoride.toFixed(2)),
    pH: parseFloat(item.pH.toFixed(2)),
    createdAt: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
  }));
  if (!type) {
    ElMessage({
      type: "success",
      message: "查询成功",
    });
  }
};
const onSubmit = () => {
  getTableData();
};
getTableData(1);
function currentChange(params) {
  pageNum.value = params;
  getTableData();
}
const timerId = ref(null);
onMounted(() => {
  timerId.value = setInterval(() => {
    getTableData(1);
  }, 1000 * 20);
});
onUnmounted(() => {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    console.log("定时器已清除");
  }
});
</script>

<style lang="less" scoped>
.table-container {
  height: calc(100vh - 200px);
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
