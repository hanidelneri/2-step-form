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
