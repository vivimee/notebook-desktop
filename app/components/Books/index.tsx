import * as React from 'react';
import { connect } from 'react-redux';
import styles from './index.css';
import BookRow from '../BookRow';
import ArticleRow from '../ArticleRow';
import ArticleEditor from '../ArticleEditor';
import { Book, Article } from '../../models/types';
import { setActiveArticle, setActiveBook, updateArticleContent } from '../../actions/notebook'

export interface BooksProps {
  bookList: Array<Book>;
  activeBook: Book;
  activeArticle: Article;
  setActiveBook: Function;
  setActiveArticle: Function;
  updateArticleContent: Function;
}

export interface BooksState {

}

class Books extends React.Component<BooksProps, BooksState> {
  constructor(props: BooksProps) {
    super(props);
  }
  componentDidMount() {

  }
  onBookClick = (bookId: number) => {
    const { bookList } = this.props;
    const book = bookList.filter((item) => item.id === bookId)[0];
    this.props.setActiveBook(book);
  };
  onArticleClick = (articleId: number) => {
    const { activeBook } = this.props;
    const article = activeBook.articles.filter((item) => item.id === articleId)[0];
    this.props.setActiveArticle(article);
  };
  onArticleChange = (content: string) => {
    const { activeArticle, updateArticleContent, activeBook } = this.props;
    updateArticleContent(activeArticle, content, activeBook);
  }
  render() {
    const { bookList = [], activeBook, activeArticle } = this.props;


    return (
      <div className={styles.booksPanelsBox}>
        <div className={styles.bookList}>
          
          {bookList.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onClick={this.onBookClick}
              active={(activeBook || {}).id === book.id}
            />
          ))}
        </div>
        <div className={styles.articleList}>
          {((activeBook || {}).articles || []).map((article: Article) => (
            <ArticleRow
              key={article.id}
              article={article}
              onClick={this.onArticleClick}
              active={(activeArticle || {}).id === article.id}
            />
          ))}
        </div>
          <div className={styles.articleBlock}>
            <ArticleEditor onChange={this.onArticleChange} content={(activeArticle || {}).content || ''}/>
          </div>
      </div>
    );
  }
}

export default connect((state) => ({
  bookList: state.notebook.books,
  activeBook: state.notebook.activeBook,
  activeArticle: state.notebook.activeArticle
}), {
  setActiveBook,
  setActiveArticle,
  updateArticleContent, 
})(Books);
