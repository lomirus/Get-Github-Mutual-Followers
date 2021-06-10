import SearchView from "./components/SearchView";
import TokenAuth from "./components/TokenAuth";

const search = document.querySelector<SearchView>('#search')!;
const tokenAuth = document.querySelector<TokenAuth>('token-auth')!;

const switchAuthButton = document.querySelector<HTMLInputElement>('#token>#switch')!;

const results = document.querySelector<HTMLDivElement>('#results')!;

export {
    search, tokenAuth, switchAuthButton, results
}