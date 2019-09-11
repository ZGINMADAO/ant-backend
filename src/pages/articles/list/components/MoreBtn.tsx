import { TableListItem } from '../data.d';
import React from 'react';
import { Dropdown, Menu, Icon } from 'antd';

const MoreBtn: React.FC<{ item: TableListItem }> = ({ item }) => (
  <Dropdown
    overlay={
      <Menu onClick={key => {}}>
        <Menu.Item key="edit">禁用</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    }
  >
    <a>
      更多 <Icon type="down" />
    </a>
  </Dropdown>
);
export default MoreBtn;
