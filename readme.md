# Abstract data fetcher

This is a typescript abstract class that helps you to fetch data from the server. It frees you from some copy/paste*ing code.

## Stack
- typescript
- rxjs

## Why
You may find yourself copy/pasting your code while you implementing just another data fetch angular service. This typescript abstract class will make the job done for you. It would do for you
    - fetch data if it is undefined
    - joins request. If 2 or more get$ was called with simmilar id at the time, only first would trigger network request, others would get data from the first request
    - you could force updating of your storage
    - it's flexible. It's up to you to chose what abstraction to use to fetch data or where to store it.

## For who
    - if you widely use rxjs in your project
    - tired of copy/pasting your data-fetcher services 

## How to use
1. extend
`export class CustomerService extends AbstractDataService<CustomerInterface, FetchParamsInterface> {}`

2. implement methods
    - `getFromCacheById$(id: string): Observable<CustomerInterface>`
    This method would be called to decided to make call to the server. If the result of the call would === `undefined` it would fetch a otherwise you would just get this result.
    - `setToCacheById(id: string, payload: CustomerInterface): void`
    This one would be called when fetch would be successfull
    - `fetchData$(params?: FetchParamsInterface): Observable<CustomerInterface>`
    Finally you just need to implement a backend call

3. Use its methods
    - `get$(id: string, params?: FetchParamsInterface): Observable<CustomerInterface>` if data exist (see `getFromCacheById`) it would return this data otherwise it would fetch and return this data
    - `fetchAndSave$(id: string, params?: FetchParamsInterface): Observable<CustomerInterface>` would force to make request and no matter if the data already exist

# Tips
- `FetchParamsInterface` from the previous example could be any type you need to. For instace,  `sting`.
- since `FetchParamsInterface` could be any interface you need to you may put there not only get parameters but some headers and so one. It's up to you.

Please use and enjoy.
