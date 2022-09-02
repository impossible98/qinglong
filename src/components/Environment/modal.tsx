// import third-party modules
import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { CloseOne } from '@icon-park/react';
// import local modules
import { request } from '@/utils/http';
import config from '@/utils/config';
import notify from "@/utils/notification";

interface Props {
  env?: any;
  visible: boolean;
  handleCancel: (cks?: any[]) => void;
}

function EnvModal({ env, handleCancel: handleCancel, visible }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function handleOk(values: any) {
    setLoading(true);
    const { value, split, name, remarks } = values;
    const method = env ? 'put' : 'post';
    let payload;
    if (!env) {
      if (split === '1') {
        const symbol = value.includes('&') ? '&' : '\n';
        payload = value.split(symbol).map((x: any) => {
          return {
            name: name,
            value: x,
            remarks: remarks,
          };
        });
      } else {
        payload = [{ value, name, remarks }];
      }
    } else {
      payload = { ...values, id: env.id };
    }
    try {
      const { code, data } = await request[method](`${config.apiPrefix}envs`, {
        data: payload,
      });
      if (code === 200) {
        notify(env
          ? '更新变量成功'
          : '新建变量成功');
      } else {
        notify(data);
      }
      setLoading(false);
      handleCancel(data);
    } catch (error: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.resetFields();
  }, [env, visible]);

  return (
    <Modal
      centered
      closeIcon=<CloseOne theme="outline" size="16" fill="#333" />
      confirmLoading={loading}
      forceRender
      maskClosable={false}
      title={env ? '编辑变量' : '新建变量'}
      visible={visible}
      onCancel={() => handleCancel()}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        initialValues={env}
        layout="vertical"
        name="env_modal"
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入环境变量名称',
              whitespace: true
            },
            {
              message: '只能输入字母数字下划线，且不能以数字开头',
              pattern: /^[a-zA-Z_][0-9a-zA-Z_]*$/,
            },
          ]}
        >
          <Input placeholder="请输入环境变量名称" />
        </Form.Item>
        <Form.Item
          name="value"
          label="值"
          rules={[
            {
              required: true,
              message: '请输入环境变量值',
              whitespace: true
            },
          ]}
        >
          <Input.TextArea
            autoSize={{
              minRows: 4,
              maxRows: 4
            }}
            rows={4}
            placeholder="请输入环境变量值"
          />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
        >
          <Input placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnvModal;
