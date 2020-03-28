import * as React from 'react';
import styles from './index.css';
import { Article } from '../../models/types';

export interface ArticleRowProps {
  article: Article;
  active: boolean;
  onClick: Function;
}

const ArticleRow: React.SFC<ArticleRowProps> = props => {
  const { article, active, onClick } = props;
  const { title } = article;
  return (
    <div
      className={`${styles['article-row']} ${active ? styles.active : ''}`}
      onClick={() => onClick(article.id)}
    >
      <span>{title}</span>
    </div>
  );
};

export default ArticleRow;
