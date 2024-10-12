import CommonGrid from './CommonGrid'

const typeOptions = ['string', 'boolean', 'number', 'array']

function QueryGrid({ onUpdate }: { onUpdate: (query: unknown) => void }) {
  return (
    <CommonGrid
      cols={[
        {
          headerName: '参数名',
          editable: true,
          type: 'input',
        },
        {
          headerName: '类型',
          editable: true,
          type: 'select',
          options: typeOptions,
        },
      ]}
      onUpdate={onUpdate}
    />
  )
}

export default QueryGrid
