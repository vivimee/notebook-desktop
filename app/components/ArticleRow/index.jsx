import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';

const ArticleRow = props => {
  const { article, onClick, active } = props;
  const { name } = article;
  return (
    <ListItem selected={active} button onClick={() => onClick(article.id)}>
      <ListItemText>{name}</ListItemText>
    </ListItem>
  );
};

export default ArticleRow;
