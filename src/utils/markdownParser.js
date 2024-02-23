import {marked} from 'marked';
import DOMPurify from 'dompurify';

const mdParse = (text) => { 
    return DOMPurify.sanitize(marked(text))
}

export default mdParse;