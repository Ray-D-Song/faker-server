import React, { useState, memo, useImperativeHandle, forwardRef } from 'react'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import {
  TextField,
  Select,
  MenuItem,
  Grid2,
  IconButton,
  InputAdornment,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FakerSelect from '../FakerSelect'
import { useTranslation } from 'react-i18next'

export interface JsonNode {
  key: string
  type: string
  mock: string
  children?: JsonNode[]
  options?: string[]
  length?: number
  value?: string
  min?: number
  max?: number
}

const typeOptions = [
  'string',
  'number',
  'boolean',
  'array',
  'object',
  'null',
  'any',
]

interface JsonEditorProps {
  initData: JsonNode[]
}

export interface JsonEditorRef {
  getData: () => JsonNode[]
  clearData: () => void
}

const JsonEditor = forwardRef<JsonEditorRef, JsonEditorProps>(
  ({ initData }, ref) => {
    const { t } = useTranslation()
    const [data, setData] = useState<JsonNode[]>(
      initData?.length !== 0
        ? initData
        : [
            {
              key: 'root',
              type: 'object',
              mock: '',
              children: [],
              options: ['object', 'array'],
              length: 1,
              value: '',
            },
          ],
    )

    const clearData = () => {
      setData([
        {
          key: 'root',
          type: 'object',
          mock: '',
          children: [],
          options: ['object', 'array'],
          length: 1,
          value: '',
        },
      ])
    }
    const getData = () => {
      return data
    }
    useImperativeHandle(ref, () => ({
      clearData,
      getData,
    }))

    const renderTree = (nodes: JsonNode[], parentId = '') => {
      return nodes.map((node, index) => {
        const currentId = parentId ? `${parentId}-${index}` : `${index}`
        const isRoot = currentId === '0'
        const isArrayChild =
          parentId.split('-').length > 1 && nodes[0].key === 'item'
        const parentNode = parentId
          ? getNodeByPath(data, parentId.split('-').map(Number))
          : null
        const isParentArray = parentNode?.type === 'array'

        return (
          <TreeItem
            itemId={currentId}
            key={currentId}
            label={
              <Grid2 container spacing={2} alignItems="center">
                <Grid2>
                  <TextField
                    size="small"
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
                    size="small"
                  >
                    {node.options
                      ? node.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))
                      : typeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                  </Select>
                </Grid2>
                {node.type &&
                  !['object', 'null', 'array'].includes(node.type) && (
                    <>
                      <Grid2 width={200}>
                        <FakerSelect
                          value={node.mock}
                          onChange={(value) =>
                            handleChange(node, 'mock', value)
                          }
                        />
                      </Grid2>
                      <Grid2 width={280}>
                        <TextField
                          fullWidth
                          size="small"
                          value={node.value || ''}
                          onChange={(e) =>
                            handleChange(node, 'value', e.target.value)
                          }
                          onFocus={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          label={t('json-editor.optional-value')}
                        />
                      </Grid2>
                      {node.type === 'number' && (
                        <>
                          <Grid2 width={120}>
                            <TextField
                              size="small"
                              type="number"
                              value={node.min || ''}
                              onChange={(e) =>
                                handleChange(node, 'min', e.target.value)
                              }
                              onFocus={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      min
                                    </InputAdornment>
                                  ),
                                },
                              }}
                            />
                          </Grid2>
                          <Grid2 width={120}>
                            <TextField
                              size="small"
                              type="number"
                              value={node.max || ''}
                              onChange={(e) =>
                                handleChange(node, 'max', e.target.value)
                              }
                              onFocus={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      max
                                    </InputAdornment>
                                  ),
                                },
                              }}
                            />
                          </Grid2>
                        </>
                      )}
                    </>
                  )}
                {node.type === 'object' && (
                  <Grid2>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        addChild(node)
                      }}
                      size="small"
                    >
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
                      onChange={(e) =>
                        handleChange(node, 'length', e.target.value)
                      }
                      onFocus={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      label={t('json-editor.array-length')}
                    />
                  </Grid2>
                )}
                {!isRoot && !isArrayChild && !isParentArray && (
                  <Grid2>
                    <IconButton
                      onClick={() => deleteNode(node, parentId)}
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid2>
                )}
              </Grid2>
            }
          >
            {Array.isArray(node.children)
              ? renderTree(node.children, currentId)
              : null}
          </TreeItem>
        )
      })
    }

    const handleChange = (node: JsonNode, field: string, value: string) => {
      const updateNode = (nodes: JsonNode[]): JsonNode[] => {
        return nodes.map((n) => {
          if (n === node) {
            const updatedNode = { ...n, [field]: value }
            if (field === 'type') {
              switch (value) {
                case 'array':
                  if (!n.children?.length) {
                    updatedNode.children = [
                      {
                        key: 'item',
                        type: 'string',
                        mock: 'string.alphanumeric',
                      },
                    ]
                  }
                  break
                case 'string':
                  updatedNode.mock = 'string.alphanumeric'
                  updatedNode.value = ''
                  break
                case 'number':
                  updatedNode.mock = 'number.int'
                  updatedNode.value = ''
                  break
                case 'boolean':
                  updatedNode.mock = 'boolean.true'
                  updatedNode.value = ''
                  break
              }
            }
            return updatedNode
          }
          if (n.children) {
            return { ...n, children: updateNode(n.children) }
          }
          return n
        })
      }

      setData(updateNode(data))
    }

    const addChild = (parent: JsonNode) => {
      const newChild: JsonNode = {
        key: 'newKey',
        type: 'string',
        mock: 'string.alphanumeric',
      }
      const updateNode = (nodes: JsonNode[]): JsonNode[] => {
        return nodes.map((n) => {
          if (n === parent) {
            return { ...n, children: [...(n.children || []), newChild] }
          }
          if (n.children) {
            return { ...n, children: updateNode(n.children) }
          }
          return n
        })
      }

      setData(updateNode(data))
    }

    const deleteNode = (nodeToDelete: JsonNode, parentId: string) => {
      const updateNode = (nodes: JsonNode[], path: number[]): JsonNode[] => {
        if (path.length === 0) {
          return nodes.filter((n) => n !== nodeToDelete)
        }
        const [currentIndex, ...restPath] = path
        return nodes.map((n, index) => {
          if (index === currentIndex) {
            if (n.children) {
              return { ...n, children: updateNode(n.children, restPath) }
            }
          }
          return n
        })
      }

      const path = parentId.split('-').map(Number)
      setData(updateNode(data, path))
    }

    // add this helper function to get node by path
    const getNodeByPath = (
      nodes: JsonNode[],
      path: number[],
    ): JsonNode | null => {
      let currentNode: JsonNode | null = nodes[path[0]] || null
      for (let i = 1; i < path.length; i++) {
        if (currentNode && currentNode.children) {
          currentNode = currentNode.children[path[i]] || null
        } else {
          return null
        }
      }
      return currentNode
    }

    return (
      <SimpleTreeView defaultExpandedItems={['0']}>
        {renderTree(data)}
      </SimpleTreeView>
    )
  },
)

export default memo(JsonEditor)
