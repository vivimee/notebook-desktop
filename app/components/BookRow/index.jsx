import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';

const BookRow = props => {
  const { book, onClick, active } = props;
  const { name } = book;
  return (
    <ListItem selected={active} button onClick={() => onClick(book.id)}>
      <ListItemText>{name}</ListItemText>
    </ListItem>
  );
};

export default BookRow;
