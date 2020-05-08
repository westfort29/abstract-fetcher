import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMapTo, takeWhile, tap } from 'rxjs/operators';
import { onceRunOrCatch } from './once-run-or-catch';

export abstract class AbstractService<Entity, UrlParts> {
    public idsInLoading: string[] = [];

    public get$(id: string, urlParts: UrlParts, params?: Record<string, string>): Observable<Entity> {
        return this.getFromCacheById$(id).pipe(onceRunOrCatch(this.fetchAndSave$(id, urlParts, params)));
    }

    public fetchAndSave$(id: string, urlParts: UrlParts, params?: Record<string, string>): Observable<Entity> {
        return of(null).pipe(
            takeWhile(() => !this.idsInLoading.includes(id)),
            tap(() => this.idsInLoading.push(id)),
            switchMapTo(this.fetch$(id, urlParts, params)),
            tap((data: Entity) => {
                this.setToCacheById(id, data);
                this.removeIdFromLoading(id);
            }),
        );
    }

    protected abstract getUrl(urlParts: UrlParts): string;
    protected abstract getFromCacheById$(id: string): Observable<Entity>;
    protected abstract setToCacheById(id: string, payload: Entity): void;
    protected abstract fetchData$(urlParts: UrlParts, params?: Record<string, string>): Observable<Entity>;

    private fetch$(id: string, urlParts: UrlParts, params?: Record<string, string>): Observable<Entity> {
        return this.fetchData$(urlParts, params).pipe(
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
