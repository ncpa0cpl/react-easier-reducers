export type ReducerMethod<T, P> = (currentState: T, payload: P) => T;

export type ReducerAction<T, K> = { type: T; payload: K };

export type ExtractPayloadType<M> = M extends (
  currentState: any,
  payload: infer P
) => any
  ? P
  : never;

export type Dispatcher<M extends Record<string, ReducerMethod<any, any>>> = {
  readonly [K in keyof M]: (payload: ExtractPayloadType<M[K]>) => void;
};
