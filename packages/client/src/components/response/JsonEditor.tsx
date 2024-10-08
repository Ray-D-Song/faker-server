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
}

const typeOptions = ['string', 'number', 'boolean', 'array', 'object', 'null', 'any'];

interface JsonEditorProps {
  onChange: (val: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ onChange }) => {
  const [data, setData] = useState<JsonNode[]>([
    { key: 'root', type: 'object', mock: '', children: [], options: ['object', 'array'] }
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
    const jsonString = JSON.stringify(data)
    onChange(jsonString)
  }, [data])

  const renderTree = (nodes: JsonNode[], parentId = '') => (
    nodes.map((node, index) => {
      const currentId = parentId ? `${parentId}-${index}` : `${index}`;
      const isRoot = currentId === '0';
      const isArrayChild = parentId.split('-').length > 1 && nodes[0].key === 'item';
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
                  <span style={{ color: 'gray', fontSize: '0.8em' }}>
                    （配置数组元素）
                  </span>
                </Grid2>
              )}
              {!isRoot && !isArrayChild && (
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
          if (field === 'type' && value === 'array' && !n.children?.length) {
            updatedNode.children = [{ key: 'item', type: 'string', mock: '' }];
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
    const newChild: JsonNode = { key: 'newKey', type: 'string', mock: '' };
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

  return (
    <SimpleTreeView expandedItems={allNodeIds}>
      {renderTree(data)}
    </SimpleTreeView>
  );
};

export default JsonEditor;
