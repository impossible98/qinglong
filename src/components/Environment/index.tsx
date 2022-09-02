// import third-party modules
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Button,
  Col,
  Input,
  Modal,
  PageHeader,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { CheckOne, Delete, Edit, Forbid } from '@icon-park/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import local modules
import { exportJson, getTableScroll } from '@/utils/index';
import config from '@/utils/config';
import { request } from '@/utils/http';
import notify from "@/utils/notification";
import EnvModal from './modal';
import './content.less';

const { Text, Paragraph } = Typography;
const { Search } = Input;

enum Status {
  '已启用',
  '已禁用',
}

enum StatusColor {
  'success',
  'error',
}

enum OperationName {
  '启用',
  '禁用',
}

enum OperationPath {
  'enable',
  'disable',
}

const type = 'DragableBodyRow';

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = (monitor.getItem() as any) || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const Content = ({ isPhone, theme }: any) => {
  const columns: any = [
    {
      align: 'center',
      title: '序号',
      render: (_text: string, _record: any, index: number) => {
        return <span style={{ cursor: 'text' }}>{index + 1} </span>;
      },
    },
    {
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      align: 'center',
      dataIndex: 'value',
      key: 'value',
      title: '值',
      render: (text: string, _record: any) => {
        return (
          <Paragraph
            style={{
              wordBreak: 'break-all',
              marginBottom: 0,
              textAlign: 'left',
            }}
            ellipsis={{ tooltip: text, rows: 2 }}
          >
            {text}
          </Paragraph>
        );
      },
    },
    {
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',

    },
    {
      align: 'center',
      dataIndex: 'timestamp',
      key: 'timestamp',
      title: '更新时间',
      ellipsis: {
        showTitle: false,
      },
      sorter: {
        compare: (a: any, b: any) => {
          const updatedAtA = new Date(a.updatedAt || a.timestamp).getTime();
          const updatedAtB = new Date(b.updatedAt || b.timestamp).getTime();
          return updatedAtA - updatedAtB;
        },
      },
      render: (_text: string, record: any) => {
        const language = navigator.language || navigator.languages[0];
        const time = record.updatedAt || record.timestamp;
        const date = new Date(time)
          .toLocaleString(language, {
            hour12: false,
          })
          .replace(' 24:', ' 00:');
        return (
          <Tooltip
            placement="topLeft"
            title={date}
            trigger={['hover', 'click']}
          >
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
    {
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      title: '状态',
      filters: [
        {
          text: '已启用',
          value: 0,
        },
        {
          text: '已禁用',
          value: 1,
        },
      ],
      onFilter: (value: number, record: any) => record.status === value,
      render: (_text: string, record: any, _index: number) => {
        return (
          <Space size="middle" style={{ cursor: 'text' }}>
            <Tag color={StatusColor[record.status]} style={{ marginRight: 0 }}>
              {Status[record.status]}
            </Tag>
          </Space>
        );
      },
    },
    {
      align: 'center',
      key: 'action',
      title: '操作',
      render: (_text: string, record: any, index: number) => {
        const isPc = !isPhone;
        return (
          <Space size="middle">
            <Tooltip title={isPc ? '编辑' : ''}>
              <a onClick={() => editEnv(record, index)}>
                <Edit theme="outline" size="16" fill="#333" />
              </a>
            </Tooltip>
            <Tooltip
              title={
                isPc ? (record.status === Status.已禁用 ? '启用' : '禁用') : ''
              }
            >
              <a onClick={() => enabledOrDisabledEnv(record, index)}>
                {record.status === Status.已禁用 ? (
                  <CheckOne theme="outline" size="16" fill="#333" />
                ) : (
                  <Forbid theme="outline" size="16" fill="#333" />
                )}
              </a>
            </Tooltip>
            <Tooltip title={isPc ? '删除' : ''}>
              <a onClick={() => deleteEnv(record, index)}>
                <Delete theme="outline" size="16" fill="#333" />
              </a>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const [value, setValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [editedEnv, setEditedEnv] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [tableScrollHeight, setTableScrollHeight] = useState<number>();

  const getEnvs = () => {
    setLoading(true);
    request
      .get(`${config.apiPrefix}envs?searchValue=${searchText}`)
      .then((data: any) => {
        setValue(data.data);
      })
      .finally(() => setLoading(false));
  };

  function enabledOrDisabledEnv(record: any, index: number) {
    Modal.confirm({
      title: `确认${record.status === Status.已禁用
        ? '启用' :
        '禁用'}`,
      content: (
        <>
          确认{record.status === Status.已禁用
            ? '启用'
            : '禁用'}
          Env{' '}
          <Text style={{ wordBreak: 'break-all' }} type="warning">
            {record.value}
          </Text>{' '}
          吗
        </>
      ),
      onOk() {
        request
          .put(
            `${config.apiPrefix}envs/${record.status === Status.已禁用
              ? 'enable' :
              'disable'
            }`,
            {
              data: [record.id],
            },
          )
          .then((data: any) => {
            if (data.code === 200) {
              notify(
                `${record.status === Status.已禁用 ? '启用' : '禁用'}成功`,
              );
              const newStatus =
                record.status === Status.已禁用 ? Status.已启用 : Status.已禁用;
              const result = [...value];
              result.splice(index, 1, {
                ...record,
                status: newStatus,
              });
              setValue(result);
            } else {
              notify(data);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleClick = () => {
    setEditedEnv(null as any);
    setIsModalVisible(true);
  };

  const editEnv = (record: any, _index: number) => {
    setEditedEnv(record);
    setIsModalVisible(true);
  };

  const deleteEnv = (record: any, index: number) => {
    Modal.confirm({
      title: '确认删除',
      content: (
        <>
          确认删除变量{' '}
          <Text style={{ wordBreak: 'break-all' }} type="warning">
            {record.name}: {record.value}
          </Text>{' '}
          吗
        </>
      ),
      onOk() {
        request
          .delete(`${config.apiPrefix}envs`, { data: [record.id] })
          .then((data: any) => {
            if (data.code === 200) {
              notify('删除成功');
              const result = [...value];
              result.splice(index, 1);
              setValue(result);
            } else {
              notify(data);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleCancel = (env?: any[]) => {
    setIsModalVisible(false);
    env && handleEnv(env);
  };

  const handleEditNameCancel = (_env?: any[]) => {
    setIsEditNameModalVisible(false);
    getEnvs();
  };

  const handleEnv = (env: any) => {
    const result = [...value];
    const index = value.findIndex((x) => x.id === env.id);
    if (index === -1) {
      env = Array.isArray(env) ? env : [env];
      result.push(...env);
    } else {
      result.splice(index, 1, {
        ...env,
      });
    }
    setValue(result);
  };

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      if (dragIndex === hoverIndex) {
        return;
      }
      const dragRow = value[dragIndex];
      request
        .put(`${config.apiPrefix}envs/${dragRow.id}/move`, {
          data: { fromIndex: dragIndex, toIndex: hoverIndex },
        })
        .then((data: any) => {
          if (data.code === 200) {
            const newData = [...value];
            newData.splice(dragIndex, 1);
            newData.splice(hoverIndex, 0, { ...dragRow, ...data.data });
            setValue([...newData]);
          } else {
            notify(data);
          }
        });
    },
    [value],
  );

  const onSelectChange = (selectedIds: any[]) => {
    setSelectedRowIds(selectedIds);

    setTimeout(() => {
      if (selectedRowIds.length === 0 || selectedIds.length === 0) {
        setTableScrollHeight(getTableScroll({ extraHeight: 87 }));
      }
    });
  };

  const rowSelection = {
    selectedRowIds,
    onChange: onSelectChange,
  };

  const deleteEnvs = () => {
    Modal.confirm({
      title: '确认删除',
      content: <>确认删除选中的变量吗</>,
      onOk() {
        request
          .delete(`${config.apiPrefix}envs`, { data: selectedRowIds })
          .then((data: any) => {
            if (data.code === 200) {
              notify('批量删除成功');
              setSelectedRowIds([]);
              getEnvs();
            } else {
              notify(data);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const operateEnvs = (operationStatus: number) => {
    Modal.confirm({
      title: `确认${OperationName[operationStatus]}`,
      content: <>确认{OperationName[operationStatus]}选中的变量吗</>,
      onOk() {
        request
          .put(`${config.apiPrefix}envs/${OperationPath[operationStatus]}`, {
            data: selectedRowIds,
          })
          .then((data: any) => {
            if (data.code === 200) {
              getEnvs();
            } else {
              notify(data);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const exportEnvs = () => {
    const envs = value
      .filter((x) => selectedRowIds.includes(x.id))
      .map((x) => ({ value: x.value, name: x.name, remarks: x.remarks }));
    exportJson('env.json', JSON.stringify(envs));
  };

  const onSearch = (value: string) => {
    setSearchText(value.trim());
  };

  useEffect(() => {
    getEnvs();
  }, [searchText]);

  useEffect(() => {
    setTimeout(() => {
      setTableScrollHeight(getTableScroll({ extraHeight: 87 }));
    });
  }, []);

  return (
    <PageHeader
      title="环境变量"
      extra={[
        <Search
          placeholder="请输入名称/值/备注"
          style={{ width: 'auto' }}
          enterButton
          loading={loading}
          onSearch={onSearch}
        />,
        <Button
          type="primary"
          onClick={handleClick}
        >
          新建变量
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {selectedRowIds.length > 0
            && (
              <Space>
                <Button
                  type="primary"
                  onClick={() => deleteEnvs()}
                >
                  批量删除
                </Button>
                <Button
                  type="primary"
                  onClick={() => exportEnvs()}
                >
                  批量导出
                </Button>
                <Button
                  type="primary"
                  onClick={() => operateEnvs(0)}
                >
                  批量启用
                </Button>
                <Button
                  type="primary"
                  onClick={() => operateEnvs(1)}
                >
                  批量禁用
                </Button>
                <Typography.Text>
                  已选择
                  {selectedRowIds?.length}
                  项
                </Typography.Text>
              </Space>
            )}
        </Col>
        <Col span={24}>
          <DndProvider
            backend={HTML5Backend}>
            <Table
              columns={columns}
              components={components}
              dataSource={value}
              loading={loading}
              rowKey="id"
              rowSelection={rowSelection}
              scroll={{
                scrollToFirstRowOnChange: true,
                x: 1000,
                y: tableScrollHeight
              }}
              onRow={(index: number) => {
                return {
                  index,
                  moveRow,
                };
              }}
            />
          </DndProvider>
          <EnvModal
            visible={isModalVisible}
            handleCancel={handleCancel}
            env={editedEnv}
          />
        </Col>
      </Row>
    </PageHeader >
  );
};

export default Content;
