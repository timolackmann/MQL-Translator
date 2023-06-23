import React, { useState, Component } from "react";
import { Form } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRealmApp } from "../RealmApp";
import FormRow from "../Components/FormRow";

import {
    Container,
    Row,
    Col,
    Accordion,
    Button
  } from 'react-bootstrap';

const Grid = ({ client }) => {

    const app = useRealmApp();

    const [Data, setData] = useState([]);
    const [searchArgs, setSearchArgs] = useState('');
    
    const [columnDefs] = useState([
        { header: "Query", field: 'query',resizable:true },
        { header: "MQL", field: 'result', resizable:true },
        { header: "Document Model", field: 'documentModel', resizable:true }
    ]);

    function getResults() {
        app.currentUser.callFunction("getConversions", searchArgs).then((result) => {
            setData(result);
        });
      }

    return (
        <div className="ag-theme-alpine" style={{height: 400, width: 1200}}>
            <Col>
            <Button variant="primary" onClick={getResults} >
              <img src="/mongodb_logo.png" height="20px" style={{marginRight: '10px'}} />
              Search
            </Button>
            <FormRow>
                <Form.Control
                    type="text"
                    label="Search"
                    onChange={(e) => setSearchArgs(e.target.value)}
                    value={searchArgs}
                    placeholder="Search for a SQL statement"
                />
            </FormRow>
            </Col>
            <AgGridReact
                rowData={Data}
                columnDefs={columnDefs}>
            </AgGridReact>
        </div>
    );
};

export default Grid;