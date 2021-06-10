## Introduction

A Web App based on Vanilla TS to query the mutual followers of a specified Github user through the Github official APIs.

## Q&A

### Why does it need my person access token?

You can use this app without your token, but the number of request would be very limited. Just like the below table shows:

|User Type|Rate Limit|
|---|---|
|Authorized| 5,000 requests per hour|
|Authorized (Enterprise)| 15,000 requests per hour|
|Unauthenticated| 60 requests per hour|

Visit the [official documentation](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) for more information.

### How to create a github personal access token?

Sign in Github account and visit [here](https://github.com/settings/tokens).

P.S. You needn't to select any scope.

### How many requests will it take when I search one user?

That depends on the number of following and followers of the user you specified. And they have such relationship:

![n_{requests}=\lceil%20\frac{n_{following}}{100}\rceil%20+%20\lceil%20\frac{n_{followers}}{100}\rceil](https://latex.codecogs.com/svg.latex?n_{requests}=\lceil%20\frac{n_{following}}{100}\rceil%20+%20\lceil%20\frac{n_{followers}}{100}\rceil)