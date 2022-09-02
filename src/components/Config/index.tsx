// import third-party modules
import React, { useState, useEffect, useRef } from 'react';
import { Button, message, PageHeader } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
// import local modules
import config from '@/utils/config';
import { request } from '@/utils/http';
import Editor from '@monaco-editor/react';

function Content({ isPhone, theme }: any) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('config.sh');
  const [select, setSelect] = useState('config.sh');
  const [data, setData] = useState<any[]>([]);
  const editorRef = useRef<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getConfig = (name: string) => {
    request.get(`${config.apiPrefix}configs/${name}`).then((data: any) => {
      setValue(data.data);
    });
  };

  const getFiles = () => {
    setLoading(true);
    request
      .get(`${config.apiPrefix}configs/files`)
      .then((data: any) => {
        setData(data.data);
      })
      .finally(() => setLoading(false));
  };

  const handleClick = () => {
    setConfirmLoading(true);
    const content = editorRef.current
      ? editorRef.current.getValue().replace(/\r\n/g, '\n')
      : value;

    request
      .post(`${config.apiPrefix}configs/save`, {
        data: { content, name: select },
      })
      .then((data: any) => {
        message.success(data.message);
        setConfirmLoading(false);
      });
  };

  useEffect(() => {
    getFiles();
    getConfig('config.sh');
  }, []);

  return (
    <PageHeader
      title={title}
      extra={[
        <Button
          type="primary"
          onClick={handleClick}
        >
          保存
        </Button>,
      ]}
    >
      {isPhone
        ? (
          <CodeMirror
            value={value}
            options={{
              lineNumbers: true,
              styleActiveLine: true,
              matchBrackets: true,
              mode: 'shell',
            }}
            onBeforeChange={(_editor, _data, value) => {
              setValue(value);
            }}
            onChange={(_editor, _data, _value) => { }}
          />
        )
        : (
          <Editor
            defaultLanguage="shell"
            value={value}
            theme={theme}
            options={{
              fontSize: 12,
              lineNumbersMinChars: 3,
              folding: false,
              glyphMargin: false,
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        )}
    </PageHeader>
  );
};

export default Content;
