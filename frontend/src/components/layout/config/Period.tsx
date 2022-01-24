import React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import { Box, Button, Divider, Typography } from '@mui/material';

const PREFIX = 'Period';

const classes = {
    formControl: `${PREFIX}-formControl`,
    selectEmpty: `${PREFIX}-selectEmpty`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.formControl}`]: {
        margin: theme.spacing(1),
        minWidth: 120,
    },

    [`& .${classes.selectEmpty}`]: {
        marginTop: theme.spacing(2),
    },
}));

const Period: React.FC<{
    title: string;
    description?: string;
    selected: number | undefined;
    setSelected: (period: number | undefined) => void;
    options: number[];
    onClose: () => void;
    onSave: () => void;
}> = ({
    title,
    description,
    selected,
    setSelected,
    options,
    onClose,
    onSave,
}) => {
    const formatPeriod = (period: number) => {
        return `${Math.floor(period / 100)}年${period % 100}月`;
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelected(event.target.value as number);
    };

    return (
        <Root>
            <AccordionDetails>
                <Box display="block">
                    <Typography>{description ?? ''}</Typography>
                    <FormControl
                        className={classes.formControl}
                        disabled={selected === undefined}
                    >
                        <InputLabel id="period-input-label">{title}</InputLabel>
                        <Select
                            labelId="period-select-label"
                            id="period-select-label"
                            value={
                                selected && options.length !== 0 ? selected : ''
                            }
                            onChange={(event) => handleChange}
                        >
                            {options.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {formatPeriod(p)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
                <Button size="small" onClick={onClose}>
                    Cancel
                </Button>
                <Button size="small" color="primary" onClick={onSave}>
                    Save
                </Button>
            </AccordionActions>
        </Root>
    );
};

export default Period;
