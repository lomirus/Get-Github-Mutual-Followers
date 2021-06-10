import SearchView from "./components/SearchView";
import AuthView from "./components/AuthView";

const searchView = document.querySelector<SearchView>('search-view')!;
const authView = document.querySelector<AuthView>('token-auth')!;

const results = document.querySelector<HTMLDivElement>('#results')!;

export {
    searchView, authView, results
}