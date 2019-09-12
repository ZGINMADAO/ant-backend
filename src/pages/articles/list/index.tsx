import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  Modal
} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import moment from 'moment';
import {StateType} from './model';
import StandardTable, {StandardTableColumnProps} from './components/StandardTable';
import {TableListItem, TableListPagination, TableListParams} from './data.d';
import MoreBtn from './components/MoreBtn';

import styles from './style.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'error' | 'success';
const statusMap = ['error', 'success'];
const status = ['禁用', '启用'];

//组件props
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  articleTableList: StateType;
}

//当前组件内部state
interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

@connect(
  ({
     articleTableList,
     loading,
   }: {
    articleTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    articleTableList,
    loading: loading.models.articleTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [], //选中的checkbox
    formValues: {},
    stepFormValues: {}, //操作中的这行记录
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author_name',
    },
    {
      title: '分类',
      dataIndex: 'category_name',
    },
    {
      title: '标签',
      dataIndex: 'labels',
    },
    {
      title: '已读次数',
      dataIndex: 'read_count',
      sorter: true,
      align: 'center',
      render: (val: string) => `${val} 次`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '评论数量',
      dataIndex: 'comment_count',
      sorter: true,
      align: 'center',
      render: (val: string) => `${val} 个`,
      // mark to display a total number
      needTotal: true,
    },

    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0], //禁用
          value: '0',
        },
        {
          text: status[1], //启用
          value: '1',
        },
      ],
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href="">编辑</a>
          <Divider type="vertical"/>
          <MoreBtn key="more" item={record}/>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'articleTableList/fetch',
    });
  }

  //分页、排序、筛选变化时触发
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'articleTableList/fetch',
      payload: params,
    });
  };
  //表单重置
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'articleTableList/fetch',
      payload: {},
    });
  };
  //展开 收起搜索表单
  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  //点击checkbox 出现的更多操作 中的操作
  handleMenuClick = (e: { key: string }) => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'articleTableList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };
  //点击列表checkbox事件
  handleSelectRows = (rows: TableListItem[]) => {
    console.log('handleSelectRows');
    this.setState({
      selectedRows: rows,
    });
  };
  //点击表单查询事件
  handleSearch = (e: React.FormEvent) => {
    console.log('handleSearch');
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'articleTableList/fetch',
        payload: values,
      });
    });
  };
  //批量删除
  batchDelete = () => {
    const {selectedRows} = this.state;
    const {dispatch} = this.props;
    // console.log(selectedRows);
    Modal.confirm({
      title: '批量删除文章',
      content: '确定批量删除所选文章吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const ids = selectedRows.map(row => row.id);
        dispatch({
          type: 'articleTableList/batchDelete',
          payload: {ids}
        });
      }
    });
    console.log('Modal');
  };

  // 查询表单收起时的样子
  renderSimpleForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 查询表单展开时的样子
  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  //查询表单渲染 看是否折叠渲染不同的 表单
  renderForm() {
    const {expandForm} = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      articleTableList: {data}, //从articleTableList解构data
      loading,
    } = this.props;

    const {selectedRows} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove"><Button type="dashed" block>批量禁用</Button></Menu.Item>
        <Menu.Item key="approval"><Button type="dashed" block>批量启用</Button></Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>

              {selectedRows.length > 0 && (
                <span>
                  <Button type="primary" onClick={this.batchDelete}>批量删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
