import React from 'react'
import Grid from '@material-ui/core/Grid'

export default function SidePanel (props) {
    const children = props.children
    return (
        <Grid
            container item
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            style={{
                maxHeight: '100vh',
                overflow: 'scroll',
                flexWrap: 'nowrap',
                paddingLeft: '24px'
            }}
        >
            {props.children.map(child => {
                return (
                    <Grid item style={{
                        width: '100%'
                    }}> 
                        {child}
                    </Grid>
                )
            })}
        </Grid>
    )
}