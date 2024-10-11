import { faker } from '@faker-js/faker'

interface JsonNode {
  key: string;
  type: string;
  mock: string;
  children?: JsonNode[];
  length?: number;
  value?: string;
}

function processResBody(body: JsonNode[]): any {
  function processNode(node: JsonNode): any {
    if (node.value !== undefined && node.value.trim() !== '') {
      // 如果设置了非空的特定值,根据类型进行转换
      switch (node.type) {
        case 'number':
          return Number(node.value);
        case 'boolean':
          return node.value.toLowerCase() === 'true';
        case 'null':
          return null;
        case 'object':
        case 'array':
          try {
            return JSON.parse(node.value);
          } catch {
            console.warn(`无法解析 ${node.key} 的值为 ${node.type}，使用原始字符串`);
            return node.value;
          }
        default:
          return node.value;
      }
    }

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
      const result = currentObject[part]()
      // 检查结果是否为 BigInt,如果是则转换为字符串
      return typeof result === 'bigint' ? result.toString() : result
    } else if (currentObject[part] !== undefined) {
      currentObject = currentObject[part]
    } else {
      throw new Error(`生成模拟数据失败: ${key}`)
    }
  }

  throw new Error(`生成模拟数据失败: ${key}`)
}

export {
  processResBody,
  fake
}