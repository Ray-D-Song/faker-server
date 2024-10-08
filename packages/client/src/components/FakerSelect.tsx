import React from 'react';
import { Select, MenuItem, ListSubheader, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import fakerData from '../assets/faker.json'

interface FakerSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const FakerSelect: React.FC<FakerSelectProps> = ({ value, onChange, label = '选择 Faker 方法' }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel 
        sx={{ 
          transform: 'translate(14px, 9px) scale(1)',
          '&.Mui-focused, &.MuiFormLabel-filled': {
            transform: 'translate(14px, -6px) scale(0.75)',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        size='small'
        fullWidth
        sx={{
          '& .MuiSelect-select': {
            padding: '8.5px 14px',
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300, // 设置下拉菜单的最大高度
            },
          },
        }}
      >
        {Object.entries(fakerData).map(([group, items]) => [
          <ListSubheader key={group} sx={{ fontSize: '14px', lineHeight: '30px' }}>{group}</ListSubheader>,
          ...items.map((item: { key: string, zhCN: string }, index: number) => (
            <MenuItem
              key={`${group}.${index}`}
              value={`${group}.${item.key}`}
              sx={{
                fontSize: '14px',
                height: '30px', // 设置每个选项的高度
                minHeight: '30px', // 确保最小高度也是30px
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)', // 可选：自定义悬停效果
                },
              }}
            >
              {item.zhCN}
            </MenuItem>
          ))
        ])}
      </Select>
    </FormControl>
  );
};

export default FakerSelect;
