import { search, tokenAuth } from './elements'

export type User = {
    "login": string,
    "id": number,
    "node_id": string,
    "avatar_url": string,
    "gravatar_id": string,
    "url": string,
    "html_url": string,
    "followers_url": string,
    "following_url": string,
    "gists_url": string,
    "starred_url": string,
    "subscriptions_url": string,
    "organizations_url": string,
    "repos_url": string,
    "events_url": string,
    "received_events_url": string,
    "type": string,
    "site_admin": boolean
}

function jsonToQueryString(json: Record<string, any>): string {
    return Object.entries(json).map(entry => `${entry[0]}=${entry[1]}`).join('&')
}

export async function getPeople(group: string): Promise<User[]> {
    let people = new Array<User>();
    const authenticated = localStorage.getItem('authenticated') === 'true';
    const fetchData = (() => {
        if (authenticated) {
            const headers = new Headers();
            headers.append('Authorization', `token ${tokenAuth.getInputValue()}`);
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                console.log(headers.get('Authorization'))
                const url = `https://api.github.com/users/${search.getInputValue()}/${group}?${query}`
                return await fetch(url, { headers })
            }
        } else {
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                const url = `https://api.github.com/users/${search.getInputValue()}/${group}?${query}`
                return await fetch(url)
            }
        }
    })();
    for (let page = 1; ; page++) {
        console.log(`Getting ${search.getInputValue()}'s ${group} of page:`, page)
        const data = await fetchData(page) as Response;
        const json = await data.json()
        if (data.status === 403) {
            alert(`Failed to get the ${group}: ${json.message.split(' (')[0]}`);
            return people;
        } else if (data.status !== 200) {
            alert(`Error: ${json.message}`);
            return people;
        }
        if (json.length > 0) {
            people = people.concat(json)
        }
        if (json.length < 100) {
            return people
        }
    }
}