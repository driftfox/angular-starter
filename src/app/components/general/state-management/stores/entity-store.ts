import { HttpClient } from '@angular/common/http';
import { tap, catchError, take } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { applyTransaction, EntityState, EntityStore, QueryEntity, StoreConfigOptions } from '@datorama/akita';

export interface EntityStoreConfig extends Partial<StoreConfigOptions> {
  /** The uniqueID or guid or the entity format */
  idKey: string;
  /** Full path to webapi. Assumes restful conventions for verbs */
  apiUrl: string;
  /** Overwrite the default webapi url. Optionally supports a url resolver */
  apiUrls?: {
    get?: string | UrlResolver;
    post?: string | UrlResolver;
    put?: string | UrlResolver;
    patch?: string | UrlResolver;
    delete?: string | UrlResolver;
  };
  /** Map the webapi response before it is passed to the store */
  map?: {
    get?: (x: any) => any;
    post?: (x: any) => any;
    put?: (x: any) => any;
    patch?: (x: any) => any;
    delete?: (x: any) => any;
  };
  /** Define the initial state of the store */
  initialState?: any;
  /** A name of the store, will be auto generated if not supplied */
  name?: string;
}

/** Received the entity passed to the store and should return a string of the web api url */
type UrlResolver = <t>(x?: t) => string;

export interface EntityStateExtended<t = any, IDType = any> extends EntityState<t, IDType> {
  modifying: boolean;
  modifyError: any;
}

/**
 * Dynamically created an Akita store for entities
 */
export class EntityStoreClass<t> {
  public store: EntityStore<EntityStateExtended<t>, t>;
  public query: QueryEntity<EntityStateExtended<t>, t>;
  public data$: Observable<EntityStateExtended<t, any>>;

  constructor(private http: HttpClient, private config: EntityStoreConfig) {
    // Generate initial state
    const initialState: EntityStateExtended = Object.assign({ modifying: false, loading: false, modifyError: false }, this.config.initialState);
    // Create store
    this.store = new EntityStore<EntityStateExtended<t>, t>(initialState, {
      name: this.config.name || String(Math.floor(Math.random() * 10000000)),
      resettable: this.config.resettable,
      cache: this.config.cache ? this.config.cache : undefined,
    });
    // Create query
    this.query = new QueryEntity<EntityStateExtended<t>, t>(this.store);
    this.data$ = this.query.select();
  }

  /**
   * Get entities and load into store
   * By default requests are cached
   * @param refreshCache Refresh entity data in cache, if false returns data currently in store
   */
  public get(refreshCache = false) {
    // If not cached or refresh cache is specified, make http call and load store
    if (refreshCache || !this.query.getHasCache()) {
      this.store.setLoading(true);
      // Check if this is the default apiUrl or a custom get url
      const apiUrl = this.config.apiUrls && this.config.apiUrls.get ? this.config.apiUrls.get : this.config.apiUrl;
      // Check if this is a function or a string, if function resolve the method to return a string
      const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
      // Make get request
      return this.http.get<t[]>(apiUrlResolved).pipe(
        tap(entities => {
          const result: t[] = this.config.map && this.config.map.get ? this.config.map.get(entities) : entities;
          this.store.set(result);
        }), // On success, add response to store
        catchError(err => {
          applyTransaction(() => {
            this.store.setError(err);
            this.store.setLoading(false);
          });
          return throwError(err);
        }),
      );
    }
    // Always return original api response but only once
    return this.query.selectAll().pipe(take(1));
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public post(entity: Partial<t> | Partial<t>[]) {
    // Check if this is the default apiUrl or a custom get url
    const apiUrl = this.config.apiUrls && this.config.apiUrls.post ? this.config.apiUrls.post : this.config.apiUrl;
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
    // If a map from the api response is needed
    const map = this.config.map && this.config.map.post ? this.config.map.post : null;
    return this.upsert(this.http.post<t>(apiUrlResolved, entity), entity, map);
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public put(entity: Partial<t> | Partial<t>[]) {
    const key: keyof Partial<t> = <any>this.config.idKey; // @Todo: Type without any
    // Check if this is the default apiUrl or a custom get url
    let apiUrl = this.config.apiUrls && this.config.apiUrls.put ? this.config.apiUrls.put : this.config.apiUrl;
    // If not an array, attach the id to the url, otherwise bulk uploads require a standalone endpoint
    if (!Array.isArray(entity)) {
      apiUrl += '/' + entity[key];
    }
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
    // If a map from the api response is needed
    const map = this.config.map && this.config.map.put ? this.config.map.put : null;
    return this.upsert(this.http.put<t>(apiUrlResolved, entity), entity, map);
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public patch(entity: Partial<t> | Partial<t>[]) {
    const key: keyof Partial<t> = <any>this.config.idKey; // @Todo: Type without any
    // Check if this is the default apiUrl or a custom get url
    let apiUrl = this.config.apiUrls && this.config.apiUrls.patch ? this.config.apiUrls.patch : this.config.apiUrl;
    // If not an array, attach the id to the url, otherwise bulk uploads require a standalone endpoint
    if (!Array.isArray(entity)) {
      apiUrl += '/' + entity[key];
    }
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
    // If a map from the api response is needed
    const map = this.config.map && this.config.map.post ? this.config.map.post : null;
    return this.upsert(this.http.patch<t>(apiUrlResolved, entity), entity, map);
  }

  /**
   * Perform an upsert. Takes an http post/put/patch type and performs an upsert on the result
   * @param request
   * @param entity
   */
  public upsert(request: Observable<t>, entity: Partial<t> | Partial<t>[], map: ((x: any) => any) | null) {
    this.store.update({ modifying: true, modifyError: false });
    return request.pipe(
      tap(res => {
        // If web api response is nill, default to supplied entity
        let result = res === null || res === undefined ? <t | t[]>entity : res;
        // If map function pass result through that
        result = map ? map(result) : result;

        // If string returned, it is the unique ID and replace the entity property for that
        if (typeof res === 'string') {
          (<any>result)[this.config.idKey] = res; // TODO: Fix any
          // Object is returned, merge response with entity supplied. Response takes priority
        } else if (typeof res === 'object' && !Array.isArray(res)) {
          result = Object.assign(entity, res);
        }
        // Convert to array
        const resultArray = !Array.isArray(result) ? [result] : result;
        // Extract unique Ids
        // const ids: string[] = result.map(x => (<any>x)[this.config.idKey]); // TODO: Fix any
        applyTransaction(() => {
          this.store.upsertMany(resultArray);
          this.store.update({ modifying: false, modifyError: false });
        });
      }),
      catchError(err => {
        this.store.update({ modifying: false, modifyError: err });
        return throwError(err);
      }),
    );
  }

  /**
   * Delete entity
   * @param entity
   */
  public delete(entity: string | number | Partial<t>) {
    const id: keyof Partial<t> = <any>this.config.idKey; // @Todo: Type without any
    const key = typeof entity === 'string' || typeof entity === 'number' ? entity : entity[id];

    this.store.update({ modifying: true, modifyError: false });
    // Check if this is the default apiUrl or a custom get url
    const apiUrl = this.config.apiUrls && this.config.apiUrls.delete ? this.config.apiUrls.delete : this.config.apiUrl;
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl + '/' + key;
    return this.http.delete<t>(apiUrlResolved).pipe(
      tap(() => {
        applyTransaction(() => {
          console.log(key);
          this.store.remove(key);
          this.store.update({ modifying: false, modifyError: false });
        });
      }),
      catchError(err => {
        applyTransaction(() => {
          this.store.setError(err);
          this.store.update({ modifying: false, modifyError: err });
        });
        return throwError(err);
      }),
    );
  }

  /**
   * Reset store
   */
  public reset() {
    this.store.reset();
  }
}

/**
 * Generate a new entity store
 * @param http
 * @param config
 */
export const generateEntityStore = <t>(http: HttpClient, config: EntityStoreConfig) => new EntityStoreClass<t>(http, config);
