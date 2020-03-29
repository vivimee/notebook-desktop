import * as React from 'react';
import styles from './index.css';

 
const BookRow = (props) => {
  const { book, onClick, active } = props;
  const { name } = book;
  return ( <div className={`${styles.bookRow} ${active ? styles.active : ''}`} onClick={() => onClick(book.id)}>
    <span>{name}</span>
  </div> );
}
 
export default BookRow;