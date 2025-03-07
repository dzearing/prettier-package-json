import sortObject from 'sort-object-keys';
import orderBy from 'sort-order';
import { PackageJson } from './types';

const PRE_OR_POST_PREFIX = /^(pre|post)/;

// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(...args: [string, string]): 1 | 0 | -1 {
  const [a, b] = args.map((arg) => arg.replace(PRE_OR_POST_PREFIX, ''));
  if (a !== b) {
    return a < b ? -1 : 1;
  } else {
    return 0;
  }
}

// Sort by pre, script, post
function prePostHooks(a: string, b: string): 1 | 0 | -1 {
  if (a.startsWith('pre') || b.startsWith('post')) {
    return -1;
  } else if (a.startsWith('post') || b.startsWith('pre')) {
    return 1;
  } else {
    return 0;
  }
}

const order = orderBy(scriptName, prePostHooks);

export default function sortScripts(scripts: PackageJson['scripts']): { scripts?: PackageJson['scripts'] } {
  const keys = Object.keys(scripts || {}) as Array<keyof PackageJson['scripts']>;
  return keys.length === 0 ? {} : { scripts: sortObject(scripts, keys.sort(order)) };
}
