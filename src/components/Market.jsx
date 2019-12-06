import React from 'react'
import '../styles/Market.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
  }
}
  
class Market extends React.Component {

  render() {
    const items = this.props.items
    // items should look like:
    /*
    item {
      name: foo
      leftQuantity: 12
      rightQuantity: 17
      leftValue: 55
      rightValue: 81
    }
    */
   
    return (
      <div className="market-container">
      <Toolbar>
      {numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle">
          {items}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
      <Paper className="market-paper">
        <Table aria-label="Market Inventory Table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Weight&nbsp;(kg)</TableCell>
            <TableCell align="right">Volume&nbsp;(m3)</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(items => (
            <TableRow key={items.name}>
              <TableCell component="th" scope="row">
                {items.name}
              </TableCell>
              <TableCell align="right">{items.name}</TableCell>
              <TableCell align="right">{items.weight}</TableCell>
              <TableCell align="right">{items.volume}</TableCell>
              <TableCell align="right">{items.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Paper>
    </div>
    )
  }
}

export default Market