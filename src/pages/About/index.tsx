import React from 'react';
import { Col, Row, Image, PageHeader, Typography } from 'antd';

const { Text, Title } = Typography;

function About() {
  return (
    <PageHeader
      title="About"
    >
      <Row justify="center">
        <Col>
          <Image
            preview={false}
            src="http://qn.whyour.cn/logo.png"
            width={200}
          />
          <Title>青龙</Title>
          <Text>
            支持python3、javaScript、shell、typescript 的定时任务管理面板（A timed
            task management panel that supports typescript, javaScript, python3,
            and shell.）
          </Text>
        </Col>
      </Row>
    </PageHeader>
  );
};

export default About;
