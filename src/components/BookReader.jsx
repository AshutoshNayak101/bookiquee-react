import React from 'react';
import '../styles/components.css';
import { formatBookContent } from '../utilities/bookUtils';

export const BookReader = ({ book, pages, chapters, currentPage, onClose, onNextPage, onPrevPage, onGoToChapter, onGetSummary, isSummaryLoading }) => {
  const [showTOC, setShowTOC] = React.useState(false);

  if (!book || pages.length === 0) return null;

  const content = pages[currentPage - 1];
  const totalPages = pages.length;

  return (
    <div
      style={{
        display: 'block',
        padding: '20px',
        background: 'linear-gradient(135deg, #f0eeff 0%, #dcd6f7 100%)',
        minHeight: '100vh'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#e9136e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            ⬅ Back to Books
          </button>
          <h2
            style={{
              flex: 1,
              textAlign: 'center',
              margin: 0,
              color: '#444',
              fontSize: '24px'
            }}
          >
            {book.title}
          </h2>
          <div style={{ width: '140px' }}>
            {chapters.length > 0 && (
              <button
                onClick={() => setShowTOC(!showTOC)}
                style={{
                  padding: '10px 15px',
                  background: '#444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ☰ Chapters
              </button>
            )}
          </div>
        </div>

        {/* Chapter Summary Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={onGetSummary}
            disabled={isSummaryLoading}
            style={{
              padding: '10px 20px',
              background: isSummaryLoading ? '#ccc' : 'linear-gradient(90deg, #f5457e, #c0105a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isSummaryLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: "'Poppins', sans-serif",
              opacity: isSummaryLoading ? 0.7 : 1
            }}
          >
            {isSummaryLoading ? '⏳ Generating...' : `✨ ${chapters.length > 0 ? 'Get Chapter Summary' : 'Get Book Summary'} (Powered by Gemini)`}
          </button>
        </div>

        {chapters.length > 0 && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: showTOC ? '0px' : '-350px',
              width: '320px',
              height: '100vh',
              background: 'white',
              boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
              transition: 'right 0.3s ease',
              zIndex: 1000,
              padding: '20px',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ marginBottom: '15px' }}>📚 Chapters</h3>

            {chapters.map(ch => (
              <div
                key={ch.page}
                onClick={() => {
                  onGoToChapter(ch.page);
                  setShowTOC(false);
                }}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {ch.title}
              </div>
            ))}
          </div>
        )}

        <div
          id="bookContent"
          style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            minHeight: '500px',
            maxHeight: '70vh',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            lineHeight: '1.9'
          }}
        >
          <div id="bookText">
            {formatBookContent(content).map(item => (
              item.type === 'chapter' ? (
                <h2 key={item.key} className="chapter" style={{ marginTop: '40px', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold', color: '#e9136e' }}>
                  {item.content}
                </h2>
              ) : (
                <p key={item.key} className="para" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '1.9', fontSize: '18px' }}>
                  {item.content}
                </p>
              )
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div className="book-pagination-controls">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              style={{
                padding: '12px 28px',
                background: currentPage === 1 ? '#ccc' : 'linear-gradient(90deg, #f5457e, #c0105a)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              ← Previous
            </button>
            <span className="book-page-info" style={{ color: '#e9136e', fontSize: '15px', fontWeight: '600', minWidth: '140px', textAlign: 'center' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '12px 28px',
                background: currentPage === totalPages ? '#ccc' : 'linear-gradient(90deg, #f5457e, #c0105a)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
