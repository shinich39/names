'use strict';

const QUERY_OPERATORS = {
  and: ["$and"],
  notAnd: ["$notAnd", "$nand"],
  or: ["$or"],
  notOr: ["$notOr", "$nor"],
  not: ["$not"],
  include: ["$include", "$in"],
  exclude: ["$exclude", "$nin"],
  greaterThan: ["$greaterThan", "$gt"],
  greaterThanOrEqual: ["$greaterThanOrEqual", "$gte"],
  lessThan: ["$lessThan", "$lt"],
  lessThanOrEqual: ["$lessThanOrEqual", "$lte"],
  equal: ["$equal", "$eq"],
  notEqual: ["$notEqual", "$neq", "$ne"],
  function: ["$function", "$func", "$fn"],
}

function isArray(e) {
  return Array.isArray(e);
}

function isObject(e) {
  return typeof(e) === "object" && !isArray(e) && e !== null;
}

function clone(obj) {
  const result = Object.prototype.toString.call(obj)
    .match(/\s([a-zA-Z]+)/)[1].toLowerCase() === "array" ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof(value) === "object" && value !== null ? clone(value) : value;
  }
  return result;
}

function spread(obj, seperator) {
  if (!seperator) {
    seperator = "/";
  }

  function A(value) {
    const result = {};
    for (const [_key, _value] of Object.entries(value)) {
      for (const [__key, __value] of B(_key, _value)) {
        result[__key] = __value;
      }
    }
    return result;
  }

  function B(key, value) {
    let result = [];
    if (typeof(value) === "object" && value !== null) {
      for (const [_key, _value] of Object.entries(value)) {
        result = result.concat(B(key+seperator+_key, _value));
      }
    } else {
      result.push([key, value]);
    }
    return result;
  }

  return A(obj);
}


function query(data, query) {

  function A(d, q) {
    for (const [key, value] of Object.entries(q)) {
      if (!B(d, value, key.split("\."))) {
        return false;
      }
    }
    return true;
  }

  function B(d, q, k) {
    const o = k.shift();

    if (k.length > 0) {
      if (isObject(d)) {
        return B(d[o], q, k);
      } else {
        return false;
      }
    }

    return C(d, q, o);
  }

  function C(d, q, o) {
    if (QUERY_OPERATORS.and.indexOf(o) > -1) {
      for (const v of q) {
        if (!A(d, v)) {
          return false;
        }
      }
      return true;
    } else if (QUERY_OPERATORS.notAnd.indexOf(o) > -1) {
      return !C(d, q, "$and");
    } else if (QUERY_OPERATORS.or.indexOf(o) > -1) {
      for (const v of q) {
        if (A(d, v)) {
          return true;
        }
      }
      return false;
    } else if (QUERY_OPERATORS.notOr.indexOf(o) > -1) {
      return !C(d, q, "$or");
    } else if (QUERY_OPERATORS.not.indexOf(o) > -1) {
      return !A(d, q);
    } else if (QUERY_OPERATORS.include.indexOf(o) > -1) {
      if (isArray(d)) {
        for (const v of d) {
          if (!C(v, q, "$include")) {
            return false;
          }
        }
        return true;
      } else {
        for (const v  of q) {
          if (C(d, v, "$equal")) {
            return true;
          }
        }
        return false;
      }
    } else if (QUERY_OPERATORS.exclude.indexOf(o) > -1) {
      return !C(d, q, "$include");
    } else if (QUERY_OPERATORS.greaterThan.indexOf(o) > -1) {
      return d > q;
    } else if (QUERY_OPERATORS.greaterThanOrEqual.indexOf(o) > -1) {
      return d >= q;
    } else if (QUERY_OPERATORS.lessThan.indexOf(o) > -1) {
      return d < q;
    } else if (QUERY_OPERATORS.lessThanOrEqual.indexOf(o) > -1) {
      return d <= q;
    } else if (QUERY_OPERATORS.equal.indexOf(o) > -1) {
      if (isArray(d) && isArray(q)) {
        if (d.length !== q.length) {
          return false;
        }
        for (let i = 0; i < q.length; i++) {
          if (d[i] !== q[i]) {
            return false;
          }
        }
        return true;
      } else {
        return d === q;
      }
    } else if (QUERY_OPERATORS.notEqual.indexOf(o) > -1) {
      return !C(d, q, "$equal");
    } else if (QUERY_OPERATORS.function.indexOf(o) > -1) {
      return q(d);
    } else if (!isObject(d)) {
      return false;
    } else if (isObject(q)) {
      return A(d[o], q);
    } else {
      return C(d[o], q, "$equal");
    }
  }

  return A(data, query);
}

window.objJs = {
  clone: clone,
  spread: spread,
  query: query,
}