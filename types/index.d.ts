declare module 'nemo-observable-util' {
  function observable<Observable extends object>(obj?: Observable): Observable;
  function isObservable(obj: object): boolean;
  function raw<Observable extends object>(obj: Observable): Observable;

  interface Scheduler {
    add: Function;
    delete: Function;
  }

  interface ObservableConfig {
    /**
     * whether to ignore something like `this.a = this.a`;
     */
    skipSameValueChange?: boolean;
    /**
     * whether to disable modify outside `@action`
     */
    onlyAllowChangeInAction?: boolean;
  }

  interface ObserveOptions {
    scheduler?: Scheduler | Function;
    debugger?: Function;
    lazy?: boolean;
  }

  function observe<Reaction extends Function>(
    func: Reaction,
    options?: ObserveOptions
  ): Reaction;
  function unobserve(func: Function): void;
  function startTransaction(identity: any): void;
  function endTransaction(identity: any): void;
  function withTransaction<F extends Function>(fn: F): F;
  function withTransaction(
    target: any,
    key: any,
    d: TypedPropertyDescriptor<any>
  ): void;
  function flush(actionName?: string, uuid?: string): void;
  const transactionManager: any;
  function config(arg?: ObservableConfig): ObservableConfig;
  export interface IActionFactory {
    // PropertyDecorator
    (target: Object, propertyKey: string | symbol): void;
    // MethodDecorator
    <T>(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void;
    // Function Wrapper
    <T extends Function>(fn: T): T;

    // Function Wrapper With Custom Name
    (name: string): IActionFactory;
  }
  interface IBoundActionFactory extends PropertyDecorator {
    (name: string): PropertyDecorator;
  }
  const action: IActionFactory;
  const asyncAction: IActionFactory;
  function runInAction<T extends (...args: any) => any>(f: T): ReturnType<T>;
  const actionManager: any;
  function decoratorFactory<T extends Function>(
    wrapperFn: (f: T, i: Function) => T
  ): MethodDecorator | PropertyDecorator;
}
