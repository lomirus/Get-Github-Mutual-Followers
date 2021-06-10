const searchInput = document.querySelector<HTMLInputElement>('#search>input')!;
const searchButton = document.querySelector<HTMLInputElement>('#search>button')!;

const tokenInput = document.querySelector<HTMLInputElement>('#token>input')!;
const switchAuthButton = document.querySelector<HTMLInputElement>('#token>#switch')!;

const results = document.querySelector<HTMLDivElement>('#results')!;

export {
    searchInput, searchButton, tokenInput, switchAuthButton, results
}