import React from 'react';
import { Select, MenuItem, ListSubheader, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import fakerData from '../assets/faker.json'
import { useTranslation } from 'react-i18next'
interface FakerSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const FakerSelect: React.FC<FakerSelectProps> = ({ value, onChange }) => {
  const { t, i18n } = useTranslation()
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
        {t('faker-select.label')}
      </InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={t('faker-select.label')}
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
              maxHeight: 300,
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
                height: '30px',
                minHeight: '30px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {i18n.language === 'en' ? item.key : item.zhCN}
            </MenuItem>
          ))
        ])}
      </Select>
    </FormControl>
  );
};

export default FakerSelect;
