import { faker } from '@faker-js/faker'

interface JsonNode {
  key: string;
  type: string;
  mock: string;
  children?: JsonNode[];
  length?: number;
}

function processResBody(body: JsonNode[]): any {
  function processNode(node: JsonNode): any {
    switch (node.type) {
      case 'object':
        const obj: { [key: string]: any } = {};
        node.children?.forEach(child => {
          obj[child.key] = processNode(child);
        });
        return obj;
      case 'array':
        const arr: any[] = [];
        const length = node.length || 1;
        for (let i = 0; i < length; i++) {
          arr.push(processNode(node.children?.[0] || { key: 'item', type: 'string', mock: 'string.alphanumeric' }));
        }
        return arr;
      case 'string':
      case 'number':
      case 'boolean':
        return fake(node.mock);
      case 'null':
        return null;
      case 'any':
        return fake('datatype.json');
      default:
        return undefined;
    }
  }

  return processNode(body[0]);
}

function fake(key: string) {
  const parts = key.split('.')
  let currentObject: any = faker

  for (const part of parts) {
    if (typeof currentObject[part] === 'function') {
      return currentObject[part]()
    } else if (currentObject[part] !== undefined) {
      currentObject = currentObject[part]
    } else {
      throw new Error(`Generate mock data failed: ${key}`)
    }
  }

  throw new Error(`Generate mock data failed: ${key}`)
}

export {
  processResBody,
  fake
}