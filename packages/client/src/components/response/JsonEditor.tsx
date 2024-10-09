import React, { useEffect, useState, useMemo } from 'react';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { TextField, Select, MenuItem, Grid2, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FakerSelect from '../FakerSelect';

interface JsonNode {
  key: string;
  type: string;
  mock: string;
  children?: JsonNode[];
  options?: string[];
  length?: number;
}

const typeOptions = ['string', 'number', 'boolean', 'array', 'object', 'null', 'any'];

interface JsonEditorProps {
  onChange: (val: unknown) => void;
  initData?: unknown;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ onChange, initData }) => {
  const [data, setData] = useState<JsonNode[]>(initData as JsonNode[] || [
    { key: 'root', type: 'object', mock: '', children: [], options: ['object', 'array'], length: 1 }
  ]);

  // 生成所有节点的 ID 数组
  const allNodeIds = useMemo(() => {
    const ids: string[] = [];
    const generateIds = (nodes: JsonNode[], parentId = '') => {
      nodes.forEach((node, index) => {
        const currentId = parentId ? `${parentId}-${index}` : `${index}`;
        ids.push(currentId);
        if (node.children) {
          generateIds(node.children, currentId);
        }
      });
    };
    generateIds(data);
    return ids;
  }, [data]);

  useEffect(() => {
    onChange(data)
  }, [data])

  const renderTree = (nodes: JsonNode[], parentId = '') => (
    nodes.map((node, index) => {
      const currentId = parentId ? `${parentId}-${index}` : `${index}`;
      const isRoot = currentId === '0';
      const isArrayChild = parentId.split('-').length > 1 && nodes[0].key === 'item';
      const parentNode = parentId ? getNodeByPath(data, parentId.split('-').map(Number)) : null;
      const isParentArray = parentNode?.type === 'array';

      return (
        <TreeItem
          itemId={currentId}
          key={currentId}
          label={
            <Grid2 container spacing={2} alignItems="center">
              <Grid2>
                <TextField
                  size='small'
                  value={node.key}
                  onChange={(e) => handleChange(node, 'key', e.target.value)}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  disabled={isRoot}
                />
              </Grid2>
              <Grid2>
                <Select
                  value={node.type}
                  onChange={(e) => handleChange(node, 'type', e.target.value)}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  size='small'
                >
                  {
                    node.options ? node.options.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    )) : typeOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))
                  }
                </Select>
              </Grid2>
              {node.type && !['object', 'null', 'array'].includes(node.type) && (
                <Grid2 width={200}>
                  <FakerSelect
                    value={node.mock}
                    onChange={(value) => handleChange(node, 'mock', value)}
                  />
                </Grid2>
              )}
              {node.type === 'object' && (
                <Grid2>
                  <IconButton onClick={() => addChild(node)} size="small">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid2>
              )}
              {node.type === 'array' && (
                <Grid2>
                  <TextField
                    size="small"
                    type="number"
                    value={node.length || ''}
                    onChange={(e) => handleChange(node, 'length', e.target.value)}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    label="数组长度"
                  />
                </Grid2>
              )}
              {!isRoot && !isArrayChild && !isParentArray && (
                <Grid2>
                  <IconButton onClick={() => deleteNode(node, parentId)} size="small">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid2>
              )}
            </Grid2>
          }
        >
          {Array.isArray(node.children) ? renderTree(node.children, currentId) : null}
        </TreeItem>
      );
    })
  );

  const handleChange = (node: JsonNode, field: string, value: string) => {
    const updateNode = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map((n) => {
        if (n === node) {
          const updatedNode = { ...n, [field]: value };
          if (field === 'type') {
            switch (value) {
              case 'array':
                if (!n.children?.length) {
                  updatedNode.children = [{ key: 'item', type: 'string', mock: 'string.alphanumeric' }];
                }
                break;
              case 'string':
                updatedNode.mock = 'string.alphanumeric';
                break;
              case 'number':
                updatedNode.mock = 'number.int';
                break;
              case 'boolean':
                updatedNode.mock = 'boolean.true';
                break;
            }
          }
          return updatedNode;
        }
        if (n.children) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });
    };

    setData(updateNode(data));
  };

  const addChild = (parent: JsonNode) => {
    const newChild: JsonNode = { key: 'newKey', type: 'string', mock: 'string.alphanumeric' };
    const updateNode = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map((n) => {
        if (n === parent) {
          return { ...n, children: [...(n.children || []), newChild] };
        }
        if (n.children) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });
    };

    setData(updateNode(data));
  };

  const deleteNode = (nodeToDelete: JsonNode, parentId: string) => {
    const updateNode = (nodes: JsonNode[]): JsonNode[] => {
      if (parentId === '') {
        return nodes.filter(n => n !== nodeToDelete);
      }
      return nodes.map((n) => {
        if (n.children) {
          return { ...n, children: n.children.filter(child => child !== nodeToDelete) };
        }
        return n;
      });
    };

    setData(prevData => updateNode(prevData));
  };

  // 添加这个辅助函数来根据路径获取节点
  const getNodeByPath = (nodes: JsonNode[], path: number[]): JsonNode | null => {
    let currentNode: JsonNode | null = nodes[path[0]] || null;
    for (let i = 1; i < path.length; i++) {
      if (currentNode && currentNode.children) {
        currentNode = currentNode.children[path[i]] || null;
      } else {
        return null;
      }
    }
    return currentNode;
  };

  return (
    <SimpleTreeView expandedItems={allNodeIds}>
      {renderTree(data)}
    </SimpleTreeView>
  );
};

export default JsonEditor;
