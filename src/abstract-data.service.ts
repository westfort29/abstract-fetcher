import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMapTo, takeWhile, tap } from 'rxjs/operators';
import { onceRunOrCatch } from './once-run-or-catch';

export abstract class AbstractDataService<Entity, EntityDto, Params> {
    public idsInLoading: string[] = [];

    public get$(id: string, params?: Params): Observable<Entity> {
        return this.getFromCacheById$(id).pipe(onceRunOrCatch(this.fetchAndSave$(id, params)));
    }

    public fetchAndSave$(id: string, params?: Params): Observable<EntityDto> {
        return of(null).pipe(
            takeWhile(() => !this.idsInLoading.includes(id)),
            tap(() => this.idsInLoading.push(id)),
            switchMapTo(this.fetch$(id, params)),
            tap((data: EntityDto) => {
                this.setToCacheById(id, data);
                this.removeIdFromLoading(id);
            }),
        );
    }

    protected abstract getFromCacheById$(id: string): Observable<Entity>;
    protected abstract setToCacheById(id: string, payload: EntityDto): void;
    protected abstract fetchData$(params?: Params): Observable<EntityDto>;

    private fetch$(id: string, params?: Params): Observable<EntityDto> {
        return this.fetchData$(params).pipe(
            catchError((error) => {
                this.removeIdFromLoading(id);

                return throwError(new Error(JSON.stringify(error)));
            }),
        );
    }

    private removeIdFromLoading(id: string): void {
        this.idsInLoading = this.idsInLoading.filter((item: string) => item !== id);
    }
}
