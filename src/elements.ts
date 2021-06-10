import SearchView from "./components/SearchView";

const search = document.querySelector<SearchView>('#search')!;

const tokenInput = document.querySelector<HTMLInputElement>('#token>input')!;
const switchAuthButton = document.querySelector<HTMLInputElement>('#token>#switch')!;

const results = document.querySelector<HTMLDivElement>('#results')!;

export {
    search, tokenInput, switchAuthButton, results
}