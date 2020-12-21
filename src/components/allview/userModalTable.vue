<template>
  <a-modal v-model="show" wrapClassName="table-modal-list-box" width="75%">
    <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ y: 300 }" :rowKey="(record) => (record.xh ? record.xh : record.idxName)">
      <i slot="redtext" slot-scope="text">
        <i v-if="Number(text) > 0" class="red-text"> {{ text }}</i>
        <i v-else>{{ text }}</i>
      </i>
    </a-table>
    <a-pagination v-model="current" :page-size-options="pageSizeOptions" show-size-changer :page-size.sync="pageSize" :total="total" @change="onChange" @showSizeChange="onShowSizeChange">
      <template v-slot:buildOptionText="props">
        <span v-if="props.value !== '10000'">{{ props.value }}条/页</span>
        <span v-if="props.value === '10000'">全部</span>
      </template>
    </a-pagination>
  </a-modal>
</template>

<script>
const columns1 = [
  {
    title: '序号',
    dataIndex: 'xh',
    width: 50
  },
  {
    title: '供应商编码',
    dataIndex: 'gysbm',
    width: 120
  },
  {
    title: '供应商名称',
    dataIndex: 'gysmc'
  },
  {
    title: '失信信息',
    dataIndex: 'sxxx',
    scopedSlots: { customRender: 'redtext' }
  },
  {
    title: '被执行人',
    dataIndex: 'bzxr',
    scopedSlots: { customRender: 'redtext' }
  }
]
const columns2 = [
  {
    title: '序号',
    dataIndex: 'xh',
    width: 50
  },
  {
    title: '供应商编码',
    dataIndex: 'gysbm',
    width: 120
  },
  {
    title: '供应商名称',
    dataIndex: 'gysmc'
  },
  {
    title: '合同编号',
    dataIndex: 'contractCode'
  },
  {
    title: '合同名称',
    dataIndex: 'contractName'
  },
  {
    title: '合同签约金额',
    dataIndex: 'tradeSum'
  },
  {
    title: '合同累计列账金额',
    dataIndex: 'lzSum'
  },
  {
    title: '合同累计付款金额',
    dataIndex: 'fkSum'
  }
]
const columns3 = [
  {
    title: '序号',
    dataIndex: 'xh',
    width: 70
  },
  {
    title: '供应商编码',
    dataIndex: 'gysbm',
    width: 120
  },
  {
    title: '供应商名称',
    dataIndex: 'gysmc'
  },
  {
    title: '上年列账金额',
    dataIndex: 'snlzSum'
  },
  {
    title: '本年列账金额',
    dataIndex: 'bnlzSum',
    scopedSlots: { customRender: 'redtext' }
  },
  {
    title: '本年已付款金额',
    dataIndex: 'bnfkSum'
  },
  {
    title: '未清偿挂账首笔（最早）时间',
    dataIndex: 'wqcFirst'
  }
]
const columns4 = [
  {
    title: '指标名称',
    dataIndex: 'idxName'
  },

  {
    title: '分值',
    dataIndex: 'score'
  },
  {
    title: '实际得分',
    dataIndex: 'actualScore',
    scopedSlots: { customRender: 'redtext' }
  }
]
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [],
      data: [],
      resdata: [],
      show: false,
      pageSizeOptions: ['5', '10', '20', '50', '10000'],
      current: 1,
      pageSize: 5,
      total: 0
    }
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    showModal() {
      this.show = true
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize)
      if (this.data.length > 0) {
        // const st = (current - 1) * pageSize
        const st = 0
        const en = pageSize

        this.data = this.resdata.slice(st, en)
      }
      this.current = 1
    },
    onChange(current) {
      const pageSize = this.pageSize
      if (this.data.length > 0) {
        const st = (current - 1) * pageSize
        const en = current * pageSize
        this.data = this.resdata.slice(st, en)
      }
    },
    updateTableData(type) {
      const date = window.sessionStorage.getItem('selectDate')
      const citycode = window.sessionStorage.getItem('cityCode')
      this.current = 1
      this.pageSize = 5
      this.total = 0
      this.data = []
      if (type === 'provider_num') {
        this.columns = columns1
        this.$http
          .post('/bigScreen/guiz/popup/supplierList', { accountCode: citycode, monthId: date })
          .then((res) => {
            this.resdata = res.data
            this.total = res.data.length
            this.data = res.data.slice(0, this.pageSize)
          })
          .catch((e) => {
            this.$message.error('需要关注供应商数据加载失败！')
          })
      }
      if (type === 'contract_num') {
        this.columns = columns2
        this.$http
          .post('/bigScreen/guiz/popup/contractList', { accountCode: citycode, monthId: date })
          .then((res) => {
            this.data = res.data.slice(0, this.pageSize)
            this.resdata = res.data
            this.total = res.data.length
          })
          .catch((e) => {
            this.$message.error('需要关注合同数据加载失败！')
          })
      }
      if (type === 'bill_num') {
        this.columns = columns3
        this.$http
          .post('/bigScreen/guiz/popup/billList', { accountCode: citycode, monthId: date })
          .then((res) => {
            this.data = res.data.slice(0, this.pageSize)
            this.resdata = res.data
            this.total = res.data.length
          })
          .catch((e) => {
            this.$message.error('需要列账数据加载失败！')
          })
      }
      if (type === 'score_num') {
        this.columns = columns4
        this.$http
          .post('/bigScreen/guiz/popup/scoreList', { accountCode: citycode, monthId: date, gysbm: window.JSON.parse(window.sessionStorage.getItem('keypointProvider')).gysbm })
          .then((res) => {
            this.data = res.data.slice(0, this.pageSize)
            this.resdata = res.data
            this.total = res.data.length
          })
          .catch((e) => {
            this.$message.error('分数加载失败！')
          })
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
//元素在body下的最外层，没有被createApp实例成vue对象里的元素，所以不需要/deep/ ::v-deep之类的穿透，也不生效
.table-modal-list-box {
  .ant-modal .ant-modal-content {
    background-color: #0e154c;
    .ant-modal-close-icon {
      color: #fff;
    }
    .ant-modal-close-x {
      height: 40px;
      width: 50px;
      line-height: 40px;
    }
    .ant-modal-body {
      padding-top: 35px;
    }
  }
  .ant-modal-footer {
    display: none;
  }
  .ant-table-content {
    .ant-table-header {
      background-color: #243082;
      overflow: hidden;
      .ant-table-thead {
        overflow: hidden;
      }
    }
    ant-table-body .ant-table-body {
      background-color: #243082;
    }
    .ant-table-thead > tr > th {
      background-color: #243082;
      color: #fff;
      border-bottom-color: rgba(0, 0, 0, 0);
    }
    .ant-table-tbody > tr > td {
      background-color: #0e154c;
      border-bottom-color: rgba(0, 0, 0, 0);
      color: #17d5d3;
    }
    .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
    .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
    .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background-color: #323f8e;
    }
  }
  .ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body {
    background-color: #0e154c;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 10px 10px;
    text-align: center;
  }
  .ant-table-tbody {
    .red-text {
      color: #ff4b72;
    }
  }
  .ant-table-placeholder {
    background-color: #177fd5;
    border: none;
  }
  .ant-select-dropdown {
    //   background-color: #3a5697;
    span {
      color: rgb(75, 75, 75);
    }
  }
}
.ant-pagination-item,
.ant-select-selection {
  background-color: #3a5697;
  border: none;
}
.ant-pagination-prev .ant-pagination-item-link,
.ant-pagination-next .ant-pagination-item-link {
  background-color: #3a5697;
  border: none;
}
.ant-pagination {
  a {
    color: #fff;
  }
  .ant-pagination-item-active {
    a {
      color: rgb(0, 110, 255);
    }
  }
  span {
    color: #fff;
  }
  .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
    color: #fff;
  }
}
</style>
