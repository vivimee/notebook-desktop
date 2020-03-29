import * as React from 'react';
 
class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() { 
    const { content, onChange } = this.props;
    return ( <textarea onChange={(e) => onChange(e.target.value)} value={content}></textarea> );
  }
}
 
export default ArticleEditor;