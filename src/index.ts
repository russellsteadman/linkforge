// Node is a doubly linked list node
type Node<T> = {data: T; next?: number; prev?: number};

// An implementation of a doubly linked list
class LinkForge<T> implements Iterable<T> {
  // __state is the internal state of the doubly linked list
  protected __state = {
    dict: new Map<number, Node<T>>(),
    iter: 0,
    first: undefined as number | undefined,
    last: undefined as number | undefined,
  };

  constructor(data?: T[]) {
    if (data) {
      for (const item of data) {
        this.push(item);
      }
    }
  }

  /**
   * Returns the length of the doubly linked list
   */
  get length() {
    return this.__state.dict.size;
  }

  static from<R>(data: Iterable<R>) {
    const result = new LinkForge<R>();
    for (const item of data) {
      result.push(item);
    }

    return result;
  }

  static async fromAsync<R>(data: AsyncIterable<R>) {
    const result = new LinkForge<R>();
    for await (const item of data) {
      result.push(item);
    }

    return result;
  }

  /**
   * Returns the n-th node from the doubly linked list, starting at 0
   */
  at(index: number): T | undefined {
    const {dict} = this.__state;
    let node = dict.get(this.__state.first!);
    let i = 0;
    while (node !== undefined) {
      if (i === index) {
        return node.data;
      }

      if (index >= 0) {
        node = node.next === undefined ? undefined : dict.get(node.next);
        i++;
      } else {
        node = node.prev === undefined ? undefined : dict.get(node.prev);
        i--;
      }
    }

    return undefined;
  }

  /**
   * Concatenates two doubly linked lists and returns a new doubly linked list
   */
  concat(list: LinkForge<T>): LinkForge<T> {
    const {dict} = this.__state;
    const result = new LinkForge<T>();
    let node = dict.get(this.__state.first!);
    while (node !== undefined) {
      result.push(node.data);
      node = node.next === undefined ? undefined : dict.get(node.next);
    }

    node = list.__state.dict.get(list.__state.first!);
    while (node !== undefined) {
      result.push(node.data);
      node =
        node.next === undefined ? undefined : list.__state.dict.get(node.next);
    }

    return result;
  }

  /**
   * Filters the doubly linked list and returns a new doubly linked list
   */
  filter(callback: (value: T, index: number) => boolean): LinkForge<T> {
    const {dict} = this.__state;
    const result = new LinkForge<T>();
    let node = dict.get(this.__state.first!);
    let index = 0;
    while (node !== undefined) {
      if (callback(node.data, index)) {
        result.push(node.data);
      }

      node = node.next === undefined ? undefined : dict.get(node.next);
      index++;
    }

    return result;
  }

  /**
   * Iterates over the doubly linked list and calls the callback function
   */
  forEach(callback: (value: T, index: number) => void) {
    const {dict} = this.__state;
    let node = dict.get(this.__state.first!);
    let index = 0;
    while (node !== undefined) {
      callback(node.data, index);
      node = node.next === undefined ? undefined : dict.get(node.next);
      index++;
    }
  }

  /**
   * Maps over the doubly linked list and returns a new doubly linked list
   */
  map<R>(callback: (value: T, index: number) => R): LinkForge<R> {
    const {dict} = this.__state;
    const result = new LinkForge<R>();
    let node = dict.get(this.__state.first!);
    let index = 0;
    while (node !== undefined) {
      result.push(callback(node.data, index));
      node = node.next === undefined ? undefined : dict.get(node.next);
      index++;
    }

    return result;
  }

  /**
   * Removes the last node from the doubly linked list and returns its data
   */
  pop(): T | undefined {
    const {dict, last} = this.__state;
    if (last === undefined) {
      return undefined;
    }

    const node = dict.get(last)!;
    if (node.prev !== undefined) {
      dict.get(node.prev)!.next = undefined;
    }

    this.__state.last = node.prev;
    dict.delete(last);
    return node.data;
  }

  /**
   * Adds a new node to the end of the doubly linked list
   */
  push(point: T): this {
    const {dict, last, iter} = this.__state;
    const node: Node<T> = {data: point, prev: last};
    dict.set(iter, node);
    if (last !== undefined) {
      dict.get(last)!.next = iter;
    }

    this.__state.last = iter;
    if (this.__state.first === undefined) {
      this.__state.first = iter;
    }

    this.__state.iter++;
    return this;
  }

  /**
   * Reduces the doubly linked list and returns a single value
   */
  reduce<R>(
    callback: (
      accumulator: R,
      value: T,
      index: number,
      original: LinkForge<T>,
    ) => R,
    initialValue: R,
  ): R {
    const {dict} = this.__state;
    let node = dict.get(this.__state.first!);
    let index = 0;
    let result = initialValue;
    while (node !== undefined) {
      result = callback(result, node.data, index, this);
      node = node.next === undefined ? undefined : dict.get(node.next);
      index++;
    }

    return result;
  }

  /**
   * Reverses the doubly linked list
   */
  reverse(): this {
    const {dict, first, last} = this.__state;
    if (first === undefined || last === undefined) {
      return this;
    }

    let node = dict.get(first)!;
    while (node.next !== undefined) {
      const nextNode = dict.get(node.next)!;
      node.next = node.prev;
      node.prev = nextNode.next;
      node = nextNode;
    }

    node.next = node.prev;
    node.prev = undefined;
    this.__state.first = last;
    this.__state.last = first;
    return this;
  }

  /**
   * Removes the first node from the doubly linked list and returns its data
   */
  shift(): T | undefined {
    const {dict, first} = this.__state;
    if (first === undefined) {
      return undefined;
    }

    const node = dict.get(first)!;
    if (node.next !== undefined) {
      dict.get(node.next)!.prev = undefined;
    }

    this.__state.first = node.next;
    dict.delete(first);
    return node.data;
  }

  // [Symbol.iterator] allows the doubly linked list to be iterable
  [Symbol.iterator]() {
    const {dict} = this.__state;
    let node = dict.get(this.__state.first!);
    return {
      next() {
        if (node === undefined) {
          return {done: true as const, value: undefined};
        }

        const result = {done: false, value: node.data};
        node = node.next === undefined ? undefined : dict.get(node.next);
        return result;
      },
    };
  }

  /**
   * Returns the doubly linked list as an array
   */
  toArray(): T[] {
    const {dict} = this.__state;
    const result: T[] = [];
    let node = dict.get(this.__state.first!);
    while (node !== undefined) {
      result.push(node.data);
      node = node.next === undefined ? undefined : dict.get(node.next);
    }

    return result;
  }

  /**
   * Returns the doubly linked list as a set, removing duplicate values
   */
  toSet(): Set<T> {
    const {dict} = this.__state;
    const result = new Set<T>();
    let node = dict.get(this.__state.first!);
    while (node !== undefined) {
      result.add(node.data);
      node = node.next === undefined ? undefined : dict.get(node.next);
    }

    return result;
  }

  /**
   * Adds a new node to the beginning of the doubly linked list
   */
  unshift(point: T): this {
    const {dict, first, iter} = this.__state;
    const node: Node<T> = {data: point, next: first};
    dict.set(iter, node);
    if (first !== undefined) {
      dict.get(first)!.prev = iter;
    }

    this.__state.first = iter;
    if (this.__state.last === undefined) {
      this.__state.last = iter;
    }

    this.__state.iter++;
    return this;
  }
}

export const forge = <T>(data?: T[]) => new LinkForge<T>(data);

export default LinkForge;
