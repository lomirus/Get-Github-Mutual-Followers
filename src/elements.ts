import SearchView from "./components/SearchView";
import AuthView from "./components/AuthView";
import UserList from "./components/UserList"

const searchView = document.querySelector<SearchView>('search-view')!;
const authView = document.querySelector<AuthView>('token-auth')!;
const userList = document.querySelector<UserList>('user-list')!;

export {
    searchView, authView, userList
}