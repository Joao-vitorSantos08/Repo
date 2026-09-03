import styled, { keyframes, css } from "styled-components";

export const Container = styled.div`
    max-width: 700px;
    background-color: #FFF;
    border-radius: 4px;
    padding: 30px;
    margin: 80px auto;
    box-shadow: 0 0 20px rgba(0,0,0, 0.2);

    h1 {
        font-size: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        
        svg {
            margin-right: 10px;
        }
    }
`;

export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;

    input {
        flex: 1;
        border: 1px solid ${props => (props.error ? "#FF0000" : "#EEE")};
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 16px;
        transition: border 0.25s ease;
    }
`;

const animate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

export const SubmitButton = styled.button.attrs(props => ({
    type: "submit",
    disabled: props.loading === 1
}))`
    background-color: #0d2636;
    border: 0;
    border-radius: 4px;
    margin-left: 10px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    &[disabled] {
        cursor: not-allowed;
        opacity: 0.5;
    }

    ${props => props.loading === 1 &&
        css`
            svg {
                animation: ${animate} 2s linear infinite;
            }
        `
    }
`;

export const List = styled.ul`
    list-style: none;
    margin-top: 20px;

    li {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        
        & + li {
            border-top: 2px solid #EEE;
        }

        a {
            color: #0D2636;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
    }
`;

export const DeleteButton = styled.button.attrs({
    type: "button"
})`
    background-color: transparent;
    color: #0d2636;
    border: 0;
    padding: 8px;
    outline: 0;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;
