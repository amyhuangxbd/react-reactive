import { useState } from 'react';
import isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';

type Path = (string | number | symbol)[];

const useReactive = <T extends object>(state: T): T => {
  const [variable, setVariable] = useState<T>(state);

  const updateState = (path: Path, value: any) => {

    setVariable(prevState => {
        const newState = cloneDeep(prevState);
        let current: any = newState;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        return newState;
    });
  };

  const createHandler = <K extends Record<string, any>>(
    _target: K,
    path: Path = []
  ): ProxyHandler<K> => ({
    get(target: K, key: string | number | symbol, receiver) {
      const typedKey = key as keyof K;
      const res = Reflect.get(target, key, receiver);

      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      if (!descriptor?.configurable && !descriptor?.writable) {
        return res;
      }

      return isPlainObject(res) || Array.isArray(res) ? new Proxy(res, createHandler(target[typedKey], [...path, key])) : res;
    },
    set(_target: K, key: string | number | symbol, value: any) {
        const ret = Reflect.set(_target, key, value);
        updateState([...path, key], value);

        return true;
    },
  });

  return new Proxy<T>(variable, createHandler(variable));
};

export default useReactive;
