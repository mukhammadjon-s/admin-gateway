export const jsonToStructProto = (json) => {
  const fields = {};
  for (const k in json) {
    fields[k] = jsonValueToProto(json[k]);
  }

  return { fields };
};

const JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP = {
  [typeof 0]: 'numberValue',
  [typeof '']: 'stringValue',
  [typeof false]: 'boolValue',
};

const JSON_SIMPLE_VALUE_KINDS = new Set([
  'numberValue',
  'stringValue',
  'boolValue',
]);

export const jsonValueToProto = (value) => {
  const valueProto: any = {};

  if (value === null) {
    // valueProto.kind = 'nullValue';
    valueProto.nullValue = 'NULL_VALUE';
  } else if (value instanceof Array) {
    // valueProto.kind = 'listValue';
    valueProto.listValue = { values: value.map(jsonValueToProto) };
  } else if (typeof value === 'object') {
    // valueProto.kind = 'structValue';
    valueProto.structValue = jsonToStructProto(value);
  } else if (typeof value in JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP) {
    const kind = JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof value];
    // valueProto.kind = kind;
    valueProto[kind] = value;
  }
  // else {
  //   console.warn('Unsupported value type ', typeof value);
  // }
  return valueProto;
};

export const structProtoToJson = (proto) => {
  if (!proto || !proto.fields) {
    return {};
  }
  const json = {};
  for (const k in proto.fields) {
    json[k] = valueProtoToJson(proto.fields[k]);
  }
  return json;
};

export const valueProtoToJson = (proto) => {
  const kind = Object.keys(proto)[0];
  // if (!proto || !proto.kind) {
  if (!proto || !kind) {
    return null;
  }

  if (JSON_SIMPLE_VALUE_KINDS.has(kind)) {
    return proto[kind];
  } else if (kind === 'nullValue') {
    return null;
  } else if (kind === 'listValue') {
    // if (!proto.listValue || !proto.listValue.values) {
    //   console.warn('Invalid JSON list value proto: ', JSON.stringify(proto));
    // }
    return proto.listValue.values?.map(valueProtoToJson);
  } else if (kind === 'structValue') {
    return structProtoToJson(proto.structValue);
  } else {
    // console.warn('Unsupported JSON value proto kind: ', kind);
    return null;
  }
};

export function getField(data, fliedName) {
  let a = null;
  try {
    a = data[fliedName];
  } catch (e) {}
  return a;
}

export function translationMapper(data) {
  let t = {};
  if (data?.translation && Object.keys(data?.translation).length > 0) {
    t = { translation: jsonToStructProto(data?.translation) };
  }
  return {
    ...t,
  };
}

export function getQuery(data = {}, fields: Array<string> = []) {
  const result = {};
  console.log(data, fields);
  fields
    .filter((r) => {
      const a = String(r);
      // console.log(a !== 'undefined' && a.length !== 0, a);
      // console.log(String(typeof r) !== 'undefined', r);
      return data[a] !== undefined && data[a] !== '';
    })
    .map((r) => {
      result[r] = data[r];
      delete data[r];
    });
  console.log({
    ...data,
    where: result,
  });
  return {
    ...data,
    where: result,
  };
}
