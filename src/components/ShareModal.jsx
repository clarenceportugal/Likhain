import React from 'react';

const ShareModal = ({ isOpen, onClose, content, type = 'poem' }) => {
  const [shareMethod, setShareMethod] = React.useState('link');
  const [customMessage, setCustomMessage] = React.useState('');

  // Reset custom message when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCustomMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/${type}s/${content?.id || 'example'}`;
  console.log('ShareModal - Type:', type, 'Content ID:', content?.id, 'Generated URL:', shareUrl);
  // Get content preview based on type
  const getContentPreview = () => {
    if (type === 'story') {
      // For stories, use the first chapter's content or description
      const firstChapter = content?.chapters?.[0];
      return firstChapter?.content || content?.description || content?.excerpt || 'A wonderful story';
    } else {
      // For poems, use the content directly
      return content?.content || 'A wonderful piece of literature';
    }
  };

  const defaultShareText = `📚 Check out this beautiful ${type} "${content?.title || 'Untitled'}" by ${content?.author || 'Unknown Author'} on Likhain! 

${getContentPreview().substring(0, 100)}...

Read more and discover amazing poetry and stories at Likhain! ✨`;
  const shareText = customMessage || defaultShareText;

  const handleShare = async (method) => {
    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
        break;
      case 'copy-text':
        try {
          const fullText = `${shareText}\n\n${shareUrl}`;
          await navigator.clipboard.writeText(fullText);
          alert('Text and link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'email':
        const emailSubject = `Beautiful ${type} "${content?.title || 'Untitled'}" by ${content?.author || 'Unknown Author'} - Likhain`;
        const emailBody = `${shareText}\n\n🔗 Read the full ${type}: ${shareUrl}\n\n---\nShared from Likhain - Discover amazing poetry and stories!`;
        window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
        break;
      default:
        break;
    }
  };

  const shareMethods = [
    { id: 'copy', name: 'Copy Link', icon: '🔗', description: 'Copy link to clipboard' },
    { id: 'copy-text', name: 'Copy Text & Link', icon: '📋', description: 'Copy text and link together' },
    { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Share on Facebook' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', description: 'Share on Twitter' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', description: 'Share on WhatsApp' },
    { id: 'email', name: 'Email', icon: '📧', description: 'Send via email' }
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {content && (
            <div className="share-preview">
              <h3>{content.title || 'Untitled'}</h3>
              <p className="share-author">by {content.author || 'Unknown Author'}</p>
              <div className="share-excerpt">
                {getContentPreview().substring(0, 150) || 'No content available'}...
              </div>
              <div className="share-meta">
                <span className="share-likes">❤️ {content.likes || 0} likes</span>
                {content.tags && content.tags.length > 0 && (
                  <span className="share-tags">
                    {content.tags.slice(0, 3).map(tag => `#${tag}`).join(' ')}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="share-message">
            <label htmlFor="custom-message">Custom message (optional):</label>
            <textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={`Add a personal message about this ${type}...`}
              rows="3"
            />
          </div>

          <div className="share-methods">
            <h4>Choose how to share:</h4>
            <div className="share-options">
              {shareMethods.map(method => (
                <button
                  key={method.id}
                  className="share-option"
                  onClick={() => handleShare(method.id)}
                >
                  <span className="share-icon">{method.icon}</span>
                  <div className="share-details">
                    <span className="share-name">{method.name}</span>
                    <span className="share-description">{method.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="share-url">
            <label>Share URL:</label>
            <div className="url-input">
              <input type="text" value={shareUrl} readOnly />
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleShare('copy')}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
