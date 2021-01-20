export const isObject = obj => obj !== null && typeof obj === 'object';

export const isInteger = obj => String(Math.floor(Number(obj))) === obj;

export const clone = obj => {
    if (Array.isArray(obj)) {
        return [...obj];
    } else if (isObject(obj)) {
        return { ...obj };
    } else {
        return obj;
    }
};

export const hasNonEmptyValue = obj => {
    if (isObject(obj)) {
        if (Array.isArray(obj)) {
            for (const v of obj) {
                if (hasNonEmptyValue(v)) return true;
            }
        } else {
            for (const key of Object.keys(obj)) {
                if (hasNonEmptyValue(obj[key])) return true;
            }
        }
    } else {
        if (obj) {
            return true;
        }
    }
    return false;
};

export const toPath = key => {
    const path = [];
    const parts = key.split('.');
    parts.forEach(part => {
        const i1 = part.indexOf('[');
        if (i1 >= 0) {
            path.push(part.substring(0, i1));
            const i2 = part.indexOf(']');
            if (i2 >= 0) {
                path.push(part.substring(i1 + 1, i2));
            } else {
                // error but ignore
            }
        } else {
            path.push(part);
        }
    });
    return path;
    /*
_.toPath('a.b.c');
// => ['a', 'b', 'c']

_.toPath('a[0].b.c');
// => ['a', '0', 'b', 'c']
   */
};

export function setNestedObjectValues(object, value, visited = new WeakMap(), response = {}) {
    for (const k of Object.keys(object)) {
        const val = object[k];
        if (isObject(val)) {
            if (!visited.get(val)) {
                visited.set(val, true);
                // In order to keep array values consistent for both dot path  and
                // bracket syntax, we need to check if this is an array so that
                // this will output  { friends: [true] } and not { friends: { "0": true } }
                response[k] = Array.isArray(val) ? [] : {};
                setNestedObjectValues(val, value, visited, response[k]);
            }
        } else {
            response[k] = value;
        }
    }

    return response;
}

export function getIn(obj, key, def, p = 0) {
    const path = Array.isArray(key) ? key : toPath(key);
    while (obj && p < path.length) {
        obj = obj[path[p++]];
    }
    return obj === undefined ? def : obj;
}

export function setIn(obj, path, value) {
    const res = clone(obj); // this keeps inheritance when obj is a class
    let resVal = res;
    let i = 0;
    const pathArray = toPath(path);

    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        const currentObj = getIn(obj, pathArray.slice(0, i + 1));

        if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
            resVal = resVal[currentPath] = clone(currentObj);
        } else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }

    // Return original object if new value is the same as current
    if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
        return obj;
    }

    if (value === undefined) {
        delete resVal[pathArray[i]];
    } else {
        resVal[pathArray[i]] = value;
    }

    // If the path array has a single element, the loop did not run.
    // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
    if (i === 0 && value === undefined) {
        delete res[pathArray[i]];
    }

    return res;
}
