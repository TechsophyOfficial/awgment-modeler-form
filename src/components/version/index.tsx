import React, { useState } from 'react';
import { Typography, Grid, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { slice, concat } from 'lodash';
import { KeyboardArrowDown } from '@mui/icons-material';

const LENGTH = 50;
const DATA = [...Array(LENGTH).keys()];
const LIMIT = 6;

interface VersionPopupProps {
    id: string;
    onVersionClicked?: (e) => void;
}

const VersionPopup = ({ id, onVersionClicked }: VersionPopupProps) => {
    const [showMore, setShowMore] = useState(true);
    const [list, setList] = useState(slice(DATA, 0, LIMIT));
    const [index, setIndex] = useState(LIMIT);

    const useStyles = makeStyles((theme) => ({
        versionSecondayText: {
            fontSize: '12px',
            color: '#353535',
            marginBottom: 16,
        },
        versionSection: {
            width: '80%',
            alignSelf: 'center',
            borderRadius: '27px',
            border: '1px solid #B5B5B5',
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'center',
            padding: 6,
            color: '#767676',
            margin: 6,
            cursor: 'pointer',
        },
        loadMore: {
            textAlign: 'right',
            marginTop: 26,
            '& .MuiButton-text': {
                color: theme.palette.primary.main,
                fontWeight: 400,
                fontSize: 12,
                '& .MuiButton-label': {
                    textTransform: 'capitalize',
                },
                '& .MuiButton-endIcon': {
                    marginLeft: 6,
                },
            },
        },
    }));

    const classes = useStyles();

    const loadMore = () => {
        const newIndex = index + LIMIT;
        const newShowMore = newIndex < LENGTH - 1;
        const newList = concat(list, slice(DATA, index, newIndex));
        setIndex(newIndex);
        setList(newList);
        setShowMore(newShowMore);
    };

    return (
        <div>
            <Typography className={classes.versionSecondayText}>
                Find the recommended versions available on this project name, select one or multiple
            </Typography>
            <div className="d">
                <Grid container>
                    {list.map((item, index) => (
                        <Grid item md={4} key={index}>
                            <div className={classes.versionSection} onClick={onVersionClicked}>
                                Version 1.0
                            </div>
                        </Grid>
                    ))}
                </Grid>
                {showMore && (
                    <div className={classes.loadMore}>
                        <Button variant={'text'} onClick={loadMore} endIcon={<KeyboardArrowDown />}>
                            More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VersionPopup;
