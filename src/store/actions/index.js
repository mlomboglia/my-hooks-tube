export const REQUEST = "REQUEST";
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";

export function createRequestTypes(action) {
  if (!action) {
    throw new Error("cannot create request type with base = '' or base = null");
  }

  return [REQUEST, SUCCESS, FAILURE].reduce(
    (result, type) =>
      Object.assign({}, result, { [type]: `${action}_${type}` }),
    {}
  );
}

export function createAction(type, payload = {}) {
  return {
    type,
    ...payload,
  };
}

export function ignoreErrors(fn, ...args) {
  return () => {
    const ignoreErrorCallback = (response) => response;
    return fn(...args).then(ignoreErrorCallback, ignoreErrorCallback);
  };
}
