// import third-party modules
import React from 'react';
import { Col, Row, Image, PageHeader, Typography } from 'antd';

function Content() {
  return (
    <PageHeader
      title="About"
    >
      <Row
        gutter={[16, 16]}
        justify="center"
      >
        <Col span={24}>
          <Image
            preview={false}
            src="http://qn.whyour.cn/logo.png"
            width={128}
          />
        </Col>
        <Col span={24}>
          <Typography.Title>青龙</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text>
            支持python3、javaScript、shell、typescript 的定时任务管理面板（A timed
            task management panel that supports typescript, javaScript, python3,
            and shell.）
          </Typography.Text>
        </Col>
      </Row>
    </PageHeader>
  );
};

export default Content;
