import * as React from 'react';
import { connect } from 'react-redux';
import E from 'wangeditor';
import throttle from 'lodash/throttle';
import { updateArticleContent, loadArticleFromFS } from '../../actions/notebook'
 
class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  componentDidMount() {
    const { loadArticleFromFS, articleId, articleMap } = this.props;
    loadArticleFromFS(articleId);

    const elem = this.ele;
    const editor = new E(elem);
    editor.customConfig.onchange = html => {
      const { updateArticleContent, articleId: id } = this.props;
      updateArticleContent(id, html);
    }
    editor.customConfig.menus = [
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'image',  // 插入图片
    'table',  // 表格
    'code',  // 插入代码
    ]
    editor.create();
    editor.txt.html(articleMap[articleId]);
    this.editor = editor;
  }
  componentDidUpdate(preProps) {
    const { loadArticleFromFS, articleId, articleMap } = this.props;
    if (preProps.articleId !== articleId) {
      loadArticleFromFS(articleId);
    }
    if (preProps.articleMap[preProps.articleId] !== articleMap[articleId]) {
      this.editor.txt.html(articleMap[articleId]);
    }
  }
  // setContentFromReduxToEditor = throttle(function() {}, 5)
  bindEditorWrap = (dom) => {
    this.ele = dom;
  }
  render() { 
    const { articleId, articleMap, updateArticleContent } = this.props;
    const content = articleMap[articleId] || '';

    return (
      <div>
        {/* <textarea onChange={(e) => updateArticleContent(articleId, e.target.value)} value={content}></textarea> */}
        <div ref={this.bindEditorWrap} />
      </div>
    );
  }
}
 
export default connect((state) => ({ 
  articleId: state.notebook.activeArticleId,
  articleMap: state.notebook.articleMap,
 }), {
  updateArticleContent,
  loadArticleFromFS
 })(ArticleEditor);