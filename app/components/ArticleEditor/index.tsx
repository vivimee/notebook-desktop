import * as React from 'react';

export interface ArticleEditorProps {
  content: string;
  onChange: Function;
}
 
export interface ArticleEditorState {
  
}
 
class ArticleEditor extends React.Component<ArticleEditorProps, ArticleEditorState> {
  constructor(props: ArticleEditorProps) {
    super(props);
    this.state = { };
  }
  render() { 
    const { content, onChange } = this.props;
    return ( <textarea onChange={(e) => onChange(e.target.value)} value={content}></textarea> );
  }
}
 
export default ArticleEditor;