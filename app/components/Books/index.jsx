import * as React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './index.css';
import BookRow from '../BookRow';
import ArticleRow from '../ArticleRow';
import ArticleEditor from '../ArticleEditor';
import {
  setActiveArticle,
  setActiveBook,
  updateArticleContent,
  createNewBook,
  createNewArticle
} from '../../actions/notebook';
import { Button } from '@material-ui/core';

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDialog: {
        open: false
      },
      articleDialog: {
        open: false
      }
    };
  }
  componentDidMount() {}
  onNewBookClick = () => {
    this.setState({
      bookDialog: {
        open: true
      }
    });
  };
  onNewArticleNameChange = (e) => {
    const { articleDialog } = this.state;
    this.setState({
      articleDialog: {
        ...articleDialog,
        text: e.target.value.trim()
      }
    })
  }
  onNewBookNameChange = e => {
    const { bookDialog } = this.state;
    this.setState({
      bookDialog: {
        ...bookDialog,
        text: e.target.value.trim()
      }
    });
  };
  onNewArticleClick = () => {
    this.setState({
      articleDialog: {
        open: true,
      }
    });
  }
  onNewArticleDialogConfirm = () => {
    this.closeNewArticleDialog();
    this.props.createNewArticle(this.state.articleDialog.text);
  }
  closeNewArticleDialog = () => {
    this.setState({
      articleDialog: {
        open: false
      }
    })
  }
  closeNewBookDialog = () => {
    this.setState({
      bookDialog: {
        open: false
      }
    });
  };
  onNewBookDialogConfirm = () => {
    this.closeNewBookDialog();
    this.props.createNewBook(this.state.articleDialog.text);
  };
  onBookClick = bookId => {
    const { bookList } = this.props;
    const book = bookList.filter(item => item.id === bookId)[0];
    this.props.setActiveBook(book);
  };
  onArticleClick = articleId => {
    const { activeBookId, bookList } = this.props;
    const activeBook = bookList.filter((item) => item.id === activeBookId)[0];
    const article = activeBook.articles.filter(
      item => item.id === articleId
    )[0];
    this.props.setActiveArticle(article);
  };
  onArticleChange = content => {
    const { activeArticle, updateArticleContent, activeBook } = this.props;
    updateArticleContent(activeArticle, content, activeBook);
  };
  render() {
    const { bookList = [], activeBookId, activeArticleId } = this.props;
    const { bookDialog, articleDialog } = this.state;
    const activeBook = bookList.filter((item) => item.id === activeBookId)[0] || {};

    return (
      <div className={styles.booksPanelsBox}>
        <div className={styles.bookList}>
          <List component="nav" aria-label="secondary mailbox folders">
            {bookList.map(book => (
              <BookRow
                key={book.id}
                book={book}
                onClick={this.onBookClick}
                active={activeBookId === book.id}
              />
            ))}
          </List>
          <Button onClick={this.onNewBookClick}>新建笔记本</Button>
        </div>
        <div className={styles.articleList}>
          <List component="nav" aria-label="secondary mailbox folders">
          {((activeBook || {}).articles || []).map((article, idx) => (
            <ArticleRow
              key={article.id || idx}
              article={article}
              onClick={this.onArticleClick}
              active={activeArticleId === article.id}
            />
          ))}
          </List>
          <Button onClick={this.onNewArticleClick}>新建笔记</Button>
        </div>
        <div className={styles.articleBlock}>
          <ArticleEditor articleId={activeArticleId}/>
        </div>
        <Dialog
          open={bookDialog.open}
          onClose={this.closeNewBookDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">新建笔记本</DialogTitle>
          <DialogContent>
            <DialogContentText>
              请输入笔记本名称
              <span style={{ paddingRight: '200px' }} />
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="名称"
              fullWidth
              value={bookDialog.text || ''}
              onChange={this.onNewBookNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeNewBookDialog} color="primary">
              取消
            </Button>
            <Button onClick={this.onNewBookDialogConfirm} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={articleDialog.open}
          onClose={this.closeNewArticleDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">新建笔记</DialogTitle>
          <DialogContent>
            <DialogContentText>
              请输入笔记名称
              <span style={{ paddingRight: '200px' }} />
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="名称"
              fullWidth
              value={articleDialog.text || ''}
              onChange={this.onNewArticleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeNewArticleDialog} color="primary">
              取消
            </Button>
            <Button onClick={this.onNewArticleDialogConfirm} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  state => ({
    bookList: state.notebook.books,
    activeBookId: state.notebook.activeBookId,
    activeArticleId: state.notebook.activeArticleId,
  }),
  {
    setActiveBook,
    setActiveArticle,
    updateArticleContent,
    createNewBook,
    createNewArticle
  }
)(Books);
