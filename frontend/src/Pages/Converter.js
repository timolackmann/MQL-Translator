import {
    Container,
    Row,
    Col,
    Accordion,
    Button
  } from 'react-bootstrap';
  import '../App.scss';
  import React, {useState} from 'react';
  import { useRealmApp } from '../RealmApp';
  import Grid from './Grid';
  import Editor from '@uiw/react-textarea-code-editor';


  function Converter() {
    const [sql, setSQL] = useState('');
    const [documentModel, setDocumentModel] = useState('');
    const [mql, setMQL] = useState('');
    const [loading, setLoading] = useState('hidden');
    
    const app = useRealmApp();

    function convertSQL() {
      setLoading("");
      app.currentUser.callFunction("ConvertQuery", sql, documentModel).then((result) => {
        setMQL(result);
        setLoading("hidden");
      });
    }

    function handleLogOut(){
        app.logOut();
    }
    return (
      <Container className="App" style={{"paddingTop": "15px"}} fluid>
        <Row style={{marginBottom: '20px'}}>
            <Col align="left">
            <Button variant="primary" onClick={handleLogOut}>
              <img src="/mongodb_logo.png" height="20px" style={{marginRight: '10px'}} />
              Log Out
            </Button>
            </Col>
          <Col align="center">
            <p className="title">SQL to MQL Translator</p>
            <Button id='convert' variant="primary" onClick={convertSQL} disabled={sql === ''}>
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
                <Editor
                  value={sql}
                  language='sql'
                  onChange={(text) => setSQL(text.target.value)}
                  padding={10}
                  style={{
                    fontSize: 12,
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  }}
                />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Document Model (optional)</Accordion.Header>
                <Accordion.Body>
                <Editor
                  value={documentModel}
                  language='json'
                  onChange={(text) => setDocumentModel(text.target.value)}
                  padding={10}
                  style={{
                    fontSize: 12,
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  }}
                />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col align='left'>
            <p>MQL Output</p>
            <div className='loading-banner' hidden={loading}>
              <div className='spinner'></div>
              <p className='loading-text'>Running Translation...</p>              
            </div>
            <Editor
              value={mql}
              language='json'
              padding={10}
              style={{
                fontSize: 12,
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </Col>
        </Row>
        <Row style={{"paddingTop": "15px"}} >
            <Grid />
        </Row>
      </Container>
    );
  }
  
  export default Converter;