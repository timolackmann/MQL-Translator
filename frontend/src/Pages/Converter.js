import {
    Container,
    Row,
    Col,
    Accordion,
    Button
  } from 'react-bootstrap';
  
  import '../App.scss';
  import React, {useState} from 'react';
  import { useRealmApp } from "../RealmApp";
  import AceEditor from "react-ace";
  import Grid from "./Grid";
  import "ace-builds/src-noconflict/mode-mysql";
  import "ace-builds/src-noconflict/mode-json";
  import "ace-builds/src-noconflict/theme-monokai";
  import "ace-builds/src-noconflict/ext-language_tools";  

  function Converter() {
    const [sql, setSQL] = useState('');
    const [documentModel, setDocumentModel] = useState('');
    const [mql, setMQL] = useState('');
    const [loading, setLoading] = useState("hidden");
    
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
                  <AceEditor
                    mode="mysql"
                    theme="monokai"
                    onChange={(text) => setSQL(text)}
                    value={sql}
                    name="SQL_EDITOR"
                    editorProps={{ $blockScrolling: true }}
                    style={{width: '100%', height: '100px'}}
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
                    style={{width: '100%', height: '250px'}}
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
            <div className='loading-banner' hidden={loading}>
              <div className='spinner'></div>
              <p className='loading-text'>Running Translation...</p>              
            </div>
            <AceEditor
              mode="json"
              theme="monokai"
              value={mql}
              name="MQL_EDITOR"
              editorProps={{ $blockScrolling: true }}
              style={{width: '100%', height: '400px'}}
              setOptions={{
                tabSize: 2,
                behavioursEnabled: true,
                autoScrollEditorIntoView: true,
              }}
              readOnly={true}
            />
          </Col>
        </Row>
        <Row style={{"paddingTop": "15px"}} >
            <Grid />
        </Row>
      </Container>


      //add css for the banner


    );
  }
  
  export default Converter;