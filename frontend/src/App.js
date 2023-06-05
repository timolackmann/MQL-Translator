import {
  Container,
  Row,
  Col,
  Accordion,
  Button
} from 'react-bootstrap';

import './App.scss';
import React, {useState} from 'react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from './config.json';

function App() {
  const [sql, setSQL] = useState('');
  const [documentModel, setDocumentModel] = useState('');
  const [mql, setMQL] = useState('');

  function uploadSQL() {
    let data = {
      'query': sql,
      'documentModel': documentModel
    };

    fetch(config['CONVERT_QUERY_URL'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((data) => data.json())
      .then(res => setMQL(res['content']))
      .catch((e) => console.log(e));
  }

  return (
    <Container className="App" style={{"paddingTop": "15px"}} fluid>
      <Row style={{marginBottom: '20px'}}>
        <Col align="center">
          <p className="title">SQL to MQL Translator</p>
          <Button variant="primary" onClick={uploadSQL} disabled={sql == ''}>
            <img src="/mongodb_logo.png" height="20px" style={{marginRight: '10px'}} />
            Translate
          </Button>
        </Col>
      </Row>
      <Row>
        <Col align='left' lg={6}>
          <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>SQL Query Definition</Accordion.Header>
              <Accordion.Body>
                <AceEditor
                  mode="mysql"
                  theme="monokai"
                  onChange={(text) => setSQL(text)}
                  value={sql}
                  name="SQL_EDITOR"
                  editorProps={{ $blockScrolling: true }}
                  style={{width: '100%'}}
                  setOptions={{
                    tabSize: 2,
                    behavioursEnabled: true,
                    autoScrollEditorIntoView: true,
                  }}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Document Model (optional)</Accordion.Header>
              <Accordion.Body>
                <AceEditor
                  mode="json"
                  theme="monokai"
                  onChange={(text) => setDocumentModel(text)}
                  value={documentModel}
                  name="DOCUMENT_MODEL_EDITOR"
                  editorProps={{ $blockScrolling: true }}
                  style={{width: '100%'}}
                  setOptions={{
                    tabSize: 2,
                    behavioursEnabled: true,
                    autoScrollEditorIntoView: true,
                  }}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col align='left'>
          <p>MQL Output</p>
          <AceEditor
            mode="json"
            theme="monokai"
            value={mql}
            name="MQL_EDITOR"
            editorProps={{ $blockScrolling: true }}
            style={{width: '100%'}}
            setOptions={{
              tabSize: 2,
              behavioursEnabled: true,
              autoScrollEditorIntoView: true,
            }}
            readOnly={true}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
