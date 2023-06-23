import React from "react";
import { css } from "@emotion/react";

const Container = ({ children }) => {
    return (
        <div css={css`
            height: 100vh;
            justify-content: center;
            align-items: center;
            display: flex;
            flex-direction: column;
        `}
        >
            {children}
        </div>
    );
}

export default Container;