import CommonGrid from './CommonGrid';

// 常见的 HTTP Headers
const commonHeaders = [
  'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language',
  'Authorization', 'Cache-Control', 'Content-Type', 'Cookie',
  'User-Agent', 'X-Requested-With'
];

function HeadersGrid({ onUpdate }: { onUpdate: (headers: string) => void }) {
  return (
    <CommonGrid
      cols={[{
        headerName: 'Header',
        editable: true,
        type: 'select',
        options: commonHeaders
      }, {
        headerName: '值',
        editable: true,
        type: 'input',
      }]}
      onUpdate={onUpdate}
    />
  );
};

export default HeadersGrid;
