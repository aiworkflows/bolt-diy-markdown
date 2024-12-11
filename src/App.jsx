import { useState, useCallback, useRef, useEffect } from 'preact/hooks';
    import { marked } from 'marked';

    function App() {
      const [markdown, setMarkdown] = useState('');
      const [html, setHtml] = useState('');
      const [copyStatus, setCopyStatus] = useState('');
      const textareaRef = useRef(null);

      const convertMarkdown = useCallback(
        (md) => {
          try {
            const convertedHtml = marked.parse(md, { gfm: true });
            setHtml(convertedHtml);
          } catch (error) {
            setHtml(
              '<p style="color:red;">Error parsing Markdown. Please check your syntax.</p>',
            );
          }
        },
        [],
      );

      const debouncedConvert = useCallback(
        (md) => {
          let timer;
          return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              convertMarkdown(md);
            }, 100);
          };
        },
        [convertMarkdown],
      );

      const handleInputChange = (e) => {
        const newMarkdown = e.target.value;
        setMarkdown(newMarkdown);
        debouncedConvert(newMarkdown)();
      };

      const handleClear = () => {
        setMarkdown('');
        setHtml('');
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };

      const handleCopy = () => {
        if (!document.queryCommandSupported('copy')) {
          setCopyStatus('Copy not supported in this browser');
          setTimeout(() => setCopyStatus(''), 2000);
          return;
        }

        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempElement);
        selection.removeAllRanges();
        selection.addRange(range);

        try {
          document.execCommand('copy');
          setCopyStatus('Copied!');
        } catch (err) {
          setCopyStatus('Copy failed!');
        } finally {
          selection.removeAllRanges();
          document.body.removeChild(tempElement);
          setTimeout(() => setCopyStatus(''), 2000);
        }
      };

      useEffect(() => {
        convertMarkdown(markdown);
      }, [markdown, convertMarkdown]);

      return (
        <div>
          <header className="header">
            <h1>Markdown Converter</h1>
            <div className="header-buttons">
              <button onClick={handleClear} aria-label="Clear Markdown">
                Clear
              </button>
              <button onClick={handleCopy} aria-label="Copy HTML">
                Copy
              </button>
              {copyStatus && <span>{copyStatus}</span>}
            </div>
          </header>
          <div className="container">
            <div className="panel">
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleInputChange}
                placeholder="Enter Markdown here..."
                aria-label="Markdown Input"
              />
            </div>
            <div className="panel">
              <div
                className="preview"
                dangerouslySetInnerHTML={{ __html: html }}
                aria-live="polite"
              />
            </div>
          </div>
        </div>
      );
    }

    export default App;
