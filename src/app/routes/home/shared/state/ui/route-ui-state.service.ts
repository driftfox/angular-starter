import { StoreConfig, Store, Query } from '@datorama/akita';
import { storeName } from 'src/app/routes/home';

interface RouteUIState {
  someProp: string | null;
}

export function createInitialState(): RouteUIState {
  return <RouteUIState>{
    someProp: null,
  };
}

/**
 * Route only UI state
 * By default route ui state is not persistance. If persistance is needed, add the store prop to add.module in the akita section
 */
export class RouteUiStateService {
  
  public someProp$ = this.query.select(state => state.someProp);

  constructor(private store: RouteUiStateStore, private query: RouteUiStateQuery) {}

  /**
   * Example of how to update route UI state
   * @param val
   */
  public updateRouteUIState(val: any) {
    this.store.update({ someProp: val });
  }

  /**
   * Reset store state
   */
  public reset() {
    this.store.reset();
  }
}

/**
 * Ignore Below
 */

// tslint:disable-next-line:max-classes-per-file
@StoreConfig({ name: storeName, resettable: true })
export class RouteUiStateStore extends Store<RouteUIState> {
  constructor() {
    super(createInitialState());
  }
}

// tslint:disable-next-line:max-classes-per-file
export class RouteUiStateQuery extends Query<RouteUIState> {
  constructor(protected store: RouteUiStateStore) {
    super(store);
  }
}
