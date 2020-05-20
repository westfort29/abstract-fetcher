// It can be used outside of the angular ecosystem
import { AbstractDataService } from '../../src/abstract-data.service';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface CustomerInterface {
    id: string;
    firstName: string;
    lastName: string;
}

export class CustomerService extends AbstractDataService<CustomerInterface, string> {
    private customers$ =  new BehaviorSubject<Record<string, CustomerInterface>>({});

    protected fetchData$(id: string): Observable<CustomerInterface> {
        // you could use your abtraction to fetch data HttpClient, axious etc
        return from(
            fetch(`https://example.com/customer/${id}`)
                .then(res => res.json as unknown as Promise<CustomerInterface>)
        );
    }

    protected setToCacheById(id: string, payload: CustomerInterface): void {
        // you could use store, subject or any data storage you like
        this.customers$.next({ ...this.customers$.value, id: payload });
    }

    protected getFromCacheById$(id: string): Observable<CustomerInterface> {
        return this.customers$
            .pipe(
                map((customers: Record<string, CustomerInterface>) => customers[id]),
            );
    }
}
