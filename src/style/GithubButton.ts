export default `
    button {
        border: rgba(27, 31, 35, 0.15) solid 1px;
        background-color: rgb(250, 251, 252);
        cursor: pointer;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        transition-delay: 0s;
        transition-duration: 0.1s;
        transition-property: color, background-color, border-color;
        transition-timing-function: cubic-bezier(0.3, 0, 0.5, 1);
    }
    button[disabled] {
        cursor: not-allowed;
    }
    
    button:not([disabled]):hover {
        background-color: rgb(243, 244, 246);
    }
    
    button:not([disabled]):active {
        background-color: rgb(235, 236, 240);
        border-color: rgba(27, 31, 35, 0.1);
    }
`;