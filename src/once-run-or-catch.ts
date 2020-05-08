import { catchError, take } from 'rxjs/operators';
import { Observer, throwError, Observable } from 'rxjs';

export const onceRunOrCatch = <T, S>(children$: Observable<S>) => (source$: Observable<T>) =>
    new Observable((observer: Observer<T>) => {
        let isFirstRun = true;

        return source$
            .subscribe({
                next(item: T): void {
                    observer.next(item);

                    if (isFirstRun && item === undefined) {
                        children$
                            .pipe(
                                take(1),
                                catchError((error) => {
                                    observer.error(error);

                                    return error instanceof Error ? throwError(error) : throwError(new Error(JSON.stringify(error)));
                                }),
                            )
                            .subscribe();
                    }

                    isFirstRun = false;
                },
                error(error): void {
                    observer.error(error);
                },
                complete(): void {
                    observer.complete();
                },
            });
    });
