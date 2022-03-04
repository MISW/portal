const toCamelCaseKey = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

const toSnakeCaseKey = (key: string) => key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());

const convertKey = (mapToKey: (key: string) => string) => {
  const convert = (json: unknown): unknown => {
    if (typeof json !== 'object' || json == null) return json;
    if (Array.isArray(json)) return json.map(convert);
    return Object.fromEntries(Object.entries(json).map(([k, v]) => [mapToKey(k), convert(v)]));
  };
  return convert;
};

export const toCamelCase = convertKey(toCamelCaseKey);
export const toSnakeCase = convertKey(toSnakeCaseKey);
