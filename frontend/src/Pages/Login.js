import React from "react";
import { Container, Button, Form } from 'react-bootstrap';
import FormRow from "../Components/FormRow";
import { useRealmApp } from "../RealmApp";
import * as Realm from "realm-web";

const Login = () => {
    const app = useRealmApp();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        try {
            await app.logIn(Realm.Credentials.emailPassword(email, password));
        } catch (e) {
            console.error("error logging in");
        }
    };

    return (
        <Container>
            <h1>Please Login</h1>
            <FormRow>
                <Form.Control
                    type="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormRow>
            <FormRow>
                <Form.Control
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </FormRow>
            <Button variant="primary" onClick={handleLogin}>Login</Button>
        </Container>
    );
};

export default Login;
