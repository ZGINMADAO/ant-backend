import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Card, Tabs } from 'antd';

const { TabPane } = Tabs;

const dataList: Array<any> = [
  {
    key: 'key1',
    name: 'one',
  },
  {
    key: 'key2',
    name: 'two',
  },
];

const TabComponent = () => {
  return <Row gutter={8} style={{ width: 138, margin: '8px 0' }} type="flex"></Row>;
};
const data = [
  { month: 'Jan.', count: 69, city: 'tokyo' },
  { month: 'Jul.', count: 59, city: 'beijing' },
  { month: 'Sem.', count: 49, city: 'hangzhou' },
];
const scale = {
  month: { alias: 'Month' },
  count: { alias: 'Sales' },
};

class DemoChart extends Component {
  tabClick = (key: string) => {
    console.log(key);
  };
  render() {
    return (
      <>
        <Card>
          <GridContent>
            <Chart height={400} data={data} scale={scale} forceFit>
              <Axis title name="month" />
              <Axis title name="count" />
              <Legend />
              <Tooltip crosshairs={{ type: 'rect' }} />
              <Geom type="interval" position="month*count" color="month" />
            </Chart>
          </GridContent>
        </Card>
        <Card>
          <Tabs onChange={this.tabClick} defaultActiveKey="key2">
            {dataList.map(data => (
              <TabPane key={data.key} tab={<TabComponent />}>
                <h1>{data.name}</h1>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </>
    );
  }
}

export default DemoChart;
